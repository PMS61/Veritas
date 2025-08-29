"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface MobileLoadingProps {
  type?: 'spinner' | 'skeleton' | 'pulse' | 'dots';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  showMessage?: boolean;
  isOnline?: boolean;
  className?: string;
}

export function MobileLoading({
  type = 'spinner',
  message = 'Loading...',
  size = 'md',
  fullScreen = false,
  showMessage = true,
  isOnline = true,
  className
}: MobileLoadingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  const containerClasses = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-50'
    : 'flex items-center justify-center py-8';

  const renderSpinner = () => (
    <div className="flex flex-col items-center gap-3">
      <Loader2 className={cn(sizeClasses[size], "animate-spin text-primary")} />
      {showMessage && (
        <div className="text-center">
          <p className="text-sm font-medium">{message}</p>
          {!isOnline && (
            <div className="flex items-center justify-center gap-1 mt-1">
              <WifiOff className="w-3 h-3 text-orange-500" />
              <span className="text-xs text-orange-600">Offline mode</span>
            </div>
          )}
        </div>
      )}
    </div>
  );

  const renderSkeleton = () => (
    <div className="space-y-3 w-full max-w-sm">
      <div className="animate-pulse">
        <div className="flex items-center space-x-3">
          <div className="rounded-full bg-muted h-10 w-10"></div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-muted rounded w-3/4"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-3 space-y-2">
          <div className="h-3 bg-muted rounded"></div>
          <div className="h-3 bg-muted rounded w-5/6"></div>
          <div className="h-3 bg-muted rounded w-4/6"></div>
        </div>
      </div>
    </div>
  );

  const renderPulse = () => (
    <div className="flex flex-col items-center gap-3">
      <div className={cn(
        sizeClasses[size],
        "bg-primary rounded-full animate-pulse"
      )} />
      {showMessage && (
        <p className="text-sm font-medium animate-pulse">{message}</p>
      )}
    </div>
  );

  const renderDots = () => (
    <div className="flex flex-col items-center gap-3">
      <div className="flex space-x-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={cn(
              "bg-primary rounded-full",
              size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
            )}
            style={{
              animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite both`
            }}
          />
        ))}
      </div>
      {showMessage && (
        <p className="text-sm font-medium">{message}</p>
      )}
    </div>
  );

  const renderContent = () => {
    switch (type) {
      case 'skeleton':
        return renderSkeleton();
      case 'pulse':
        return renderPulse();
      case 'dots':
        return renderDots();
      default:
        return renderSpinner();
    }
  };

  return (
    <div className={cn(containerClasses, className)}>
      {renderContent()}
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

// Specific loading components for common use cases
export function MobileCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="bg-muted rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <div className="rounded-full bg-muted-foreground/20 h-8 w-8"></div>
              <div className="flex-1 space-y-1">
                <div className="h-3 bg-muted-foreground/20 rounded w-1/4"></div>
                <div className="h-2 bg-muted-foreground/20 rounded w-1/6"></div>
              </div>
              <div className="h-4 w-4 bg-muted-foreground/20 rounded"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-muted-foreground/20 rounded w-3/4"></div>
              <div className="h-3 bg-muted-foreground/20 rounded"></div>
              <div className="h-3 bg-muted-foreground/20 rounded w-5/6"></div>
            </div>
            <div className="flex space-x-2">
              <div className="h-5 bg-muted-foreground/20 rounded w-16"></div>
              <div className="h-5 bg-muted-foreground/20 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MobileListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
            <div className="rounded-full bg-muted-foreground/20 h-6 w-6"></div>
            <div className="flex-1 space-y-1">
              <div className="h-3 bg-muted-foreground/20 rounded w-2/3"></div>
              <div className="h-2 bg-muted-foreground/20 rounded w-1/3"></div>
            </div>
            <div className="h-3 w-8 bg-muted-foreground/20 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function MobileFormSkeleton() {
  return (
    <div className="space-y-4 p-4 animate-pulse">
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-1/4"></div>
        <div className="h-10 bg-muted rounded"></div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-1/3"></div>
        <div className="h-24 bg-muted rounded"></div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-1/2"></div>
          <div className="h-10 bg-muted rounded"></div>
        </div>
      </div>
      <div className="h-10 bg-primary/20 rounded"></div>
    </div>
  );
}
