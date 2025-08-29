"use client";

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { RefreshCw } from 'lucide-react';
import { triggerHapticFeedback, showToast } from '@/lib/mobile-services';
import { ImpactStyle } from '@capacitor/haptics';

interface PullToRefreshProps {
  children: React.ReactNode;
  onRefresh: () => Promise<void>;
  disabled?: boolean;
  threshold?: number;
  className?: string;
}

export function PullToRefresh({
  children,
  onRefresh,
  disabled = false,
  threshold = 80,
  className
}: PullToRefreshProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkScrollPosition = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop } = containerRef.current;
      setIsAtTop(scrollTop <= 0);
    }
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isAtTop) return;
    
    setStartY(e.touches[0].clientY);
  }, [disabled, isRefreshing, isAtTop]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || isRefreshing || !isAtTop || startY === 0) return;

    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    // Apply resistance to make it feel natural
    const resistance = 0.5;
    const adjustedDistance = distance * resistance;
    
    setPullDistance(Math.min(adjustedDistance, threshold * 1.5));

    // Prevent default scrolling when pulling down
    if (distance > 10) {
      e.preventDefault();
    }

    // Trigger haptic feedback when reaching threshold
    if (adjustedDistance >= threshold && pullDistance < threshold) {
      triggerHapticFeedback(ImpactStyle.Medium);
    }
  }, [disabled, isRefreshing, isAtTop, startY, threshold, pullDistance]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || isRefreshing || !isAtTop) {
      setPullDistance(0);
      setStartY(0);
      return;
    }

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      await triggerHapticFeedback(ImpactStyle.Heavy);
      
      try {
        await onRefresh();
        await showToast('Refreshed successfully');
      } catch (error) {
        console.error('Refresh failed:', error);
        await showToast('Refresh failed');
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
    setStartY(0);
  }, [disabled, isRefreshing, isAtTop, pullDistance, threshold, onRefresh]);

  const refreshProgress = Math.min(pullDistance / threshold, 1);
  const shouldShowRefresh = pullDistance > 10 || isRefreshing;

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-auto", className)}
      onScroll={checkScrollPosition}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        transform: isRefreshing ? `translateY(60px)` : `translateY(${Math.min(pullDistance, 60)}px)`,
        transition: isRefreshing || pullDistance === 0 ? 'transform 0.3s ease-out' : 'none'
      }}
    >
      {/* Pull to Refresh Indicator */}
      {shouldShowRefresh && (
        <div
          className="absolute top-0 left-0 right-0 flex items-center justify-center z-10"
          style={{
            height: '60px',
            transform: 'translateY(-60px)',
            opacity: refreshProgress
          }}
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <RefreshCw
              className={cn(
                "w-5 h-5 transition-transform",
                isRefreshing ? "animate-spin" : "",
                pullDistance >= threshold ? "text-primary" : ""
              )}
              style={{
                transform: `rotate(${refreshProgress * 180}deg)`
              }}
            />
            <span className="text-sm font-medium">
              {isRefreshing
                ? "Refreshing..."
                : pullDistance >= threshold
                ? "Release to refresh"
                : "Pull to refresh"
              }
            </span>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="min-h-full">
        {children}
      </div>
    </div>
  );
}

// Hook for managing refresh state
export function useRefresh(refreshFn: () => Promise<void>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await refreshFn();
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Refresh failed:', error);
      throw error;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshFn, isRefreshing]);

  const canRefresh = !isRefreshing;

  return {
    isRefreshing,
    lastRefresh,
    refresh,
    canRefresh
  };
}
