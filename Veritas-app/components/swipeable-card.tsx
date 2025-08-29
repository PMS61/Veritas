"use client";

import React, { useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  Share2, 
  Heart, 
  Bookmark, 
  Eye, 
  MoreHorizontal,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import { triggerHapticFeedback } from '@/lib/mobile-services';
import { ImpactStyle } from '@capacitor/haptics';

interface SwipeAction {
  id: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: string;
  bgColor: string;
  action: () => void;
}

interface SwipeableCardProps {
  children: React.ReactNode;
  leftActions?: SwipeAction[];
  rightActions?: SwipeAction[];
  onSwipe?: (direction: 'left' | 'right', actionId?: string) => void;
  disabled?: boolean;
  threshold?: number;
  className?: string;
}

export function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
  disabled = false,
  threshold = 100,
  className
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [actionTriggered, setActionTriggered] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const maxSwipeDistance = 150;

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
    setActionTriggered(null);
  }, [disabled]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (disabled || !isDragging) return;

    const currentX = e.touches[0].clientX;
    const distance = currentX - startX;
    
    // Apply resistance for smoother feel
    const resistance = 0.7;
    const adjustedDistance = distance * resistance;
    
    // Limit swipe distance
    const clampedDistance = Math.max(
      -maxSwipeDistance, 
      Math.min(maxSwipeDistance, adjustedDistance)
    );
    
    setTranslateX(clampedDistance);

    // Check if we've crossed the threshold
    const absDistance = Math.abs(clampedDistance);
    if (absDistance >= threshold) {
      const direction = clampedDistance > 0 ? 'right' : 'left';
      const actions = direction === 'right' ? leftActions : rightActions;
      
      if (actions.length > 0 && !actionTriggered) {
        setActionTriggered(actions[0].id);
        triggerHapticFeedback(ImpactStyle.Medium);
      }
    } else if (actionTriggered) {
      setActionTriggered(null);
    }
  }, [disabled, isDragging, startX, threshold, leftActions, rightActions, actionTriggered]);

  const handleTouchEnd = useCallback(async () => {
    if (disabled || !isDragging) return;

    setIsDragging(false);
    
    const absDistance = Math.abs(translateX);
    
    if (absDistance >= threshold && actionTriggered) {
      const direction = translateX > 0 ? 'right' : 'left';
      const actions = direction === 'right' ? leftActions : rightActions;
      const action = actions.find(a => a.id === actionTriggered);
      
      if (action) {
        await triggerHapticFeedback(ImpactStyle.Heavy);
        action.action();
        
        if (onSwipe) {
          onSwipe(direction, action.id);
        }
      }
    }

    // Reset position
    setTranslateX(0);
    setActionTriggered(null);
  }, [disabled, isDragging, translateX, threshold, actionTriggered, leftActions, rightActions, onSwipe]);

  const getActionOpacity = (actions: SwipeAction[], direction: 'left' | 'right') => {
    const distance = direction === 'right' ? translateX : -translateX;
    return Math.min(distance / threshold, 1);
  };

  const getActionScale = (actions: SwipeAction[], direction: 'left' | 'right') => {
    const distance = direction === 'right' ? translateX : -translateX;
    const progress = Math.min(distance / threshold, 1);
    return 0.8 + (0.2 * progress);
  };

  return (
    <div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Left Actions (shown when swiping right) */}
      {leftActions.length > 0 && (
        <div
          className="absolute left-0 top-0 bottom-0 flex items-center justify-start pl-4"
          style={{
            opacity: getActionOpacity(leftActions, 'right'),
            transform: `scale(${getActionScale(leftActions, 'right')})`
          }}
        >
          {leftActions.map((action) => {
            const Icon = action.icon;
            const isTriggered = actionTriggered === action.id;
            
            return (
              <div
                key={action.id}
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200",
                  action.bgColor,
                  isTriggered ? "scale-110" : ""
                )}
              >
                <Icon className={cn("w-5 h-5", action.color)} />
              </div>
            );
          })}
        </div>
      )}

      {/* Right Actions (shown when swiping left) */}
      {rightActions.length > 0 && (
        <div
          className="absolute right-0 top-0 bottom-0 flex items-center justify-end pr-4"
          style={{
            opacity: getActionOpacity(rightActions, 'left'),
            transform: `scale(${getActionScale(rightActions, 'left')})`
          }}
        >
          {rightActions.map((action) => {
            const Icon = action.icon;
            const isTriggered = actionTriggered === action.id;
            
            return (
              <div
                key={action.id}
                className={cn(
                  "flex items-center justify-center w-12 h-12 rounded-full transition-all duration-200",
                  action.bgColor,
                  isTriggered ? "scale-110" : ""
                )}
              >
                <Icon className={cn("w-5 h-5", action.color)} />
              </div>
            );
          })}
        </div>
      )}

      {/* Card Content */}
      <div
        className="relative z-10 bg-background transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease-out'
        }}
      >
        {children}
      </div>
    </div>
  );
}

// Predefined common swipe actions
export const swipeActions = {
  like: {
    id: 'like',
    icon: Heart,
    label: 'Like',
    color: 'text-white',
    bgColor: 'bg-red-500',
    action: () => console.log('Liked')
  },
  bookmark: {
    id: 'bookmark',
    icon: Bookmark,
    label: 'Bookmark',
    color: 'text-white',
    bgColor: 'bg-blue-500',
    action: () => console.log('Bookmarked')
  },
  share: {
    id: 'share',
    icon: Share2,
    label: 'Share',
    color: 'text-white',
    bgColor: 'bg-green-500',
    action: () => console.log('Shared')
  },
  view: {
    id: 'view',
    icon: Eye,
    label: 'View Details',
    color: 'text-white',
    bgColor: 'bg-purple-500',
    action: () => console.log('View details')
  },
  verify: {
    id: 'verify',
    icon: CheckCircle,
    label: 'Verify',
    color: 'text-white',
    bgColor: 'bg-green-600',
    action: () => console.log('Verify')
  },
  dispute: {
    id: 'dispute',
    icon: XCircle,
    label: 'Dispute',
    color: 'text-white',
    bgColor: 'bg-red-600',
    action: () => console.log('Dispute')
  },
  report: {
    id: 'report',
    icon: AlertTriangle,
    label: 'Report',
    color: 'text-white',
    bgColor: 'bg-orange-500',
    action: () => console.log('Report')
  },
  more: {
    id: 'more',
    icon: MoreHorizontal,
    label: 'More Options',
    color: 'text-white',
    bgColor: 'bg-gray-500',
    action: () => console.log('More options')
  }
};

// Hook for managing swipe state
export function useSwipeActions() {
  const [swipeHistory, setSwipeHistory] = useState<Array<{
    id: string;
    direction: 'left' | 'right';
    actionId: string;
    timestamp: Date;
  }>>([]);

  const addSwipeAction = useCallback((
    id: string, 
    direction: 'left' | 'right', 
    actionId: string
  ) => {
    setSwipeHistory(prev => [...prev, {
      id,
      direction,
      actionId,
      timestamp: new Date()
    }]);
  }, []);

  const getRecentSwipes = useCallback((limit = 10) => {
    return swipeHistory
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }, [swipeHistory]);

  const clearHistory = useCallback(() => {
    setSwipeHistory([]);
  }, []);

  return {
    swipeHistory,
    addSwipeAction,
    getRecentSwipes,
    clearHistory
  };
}
