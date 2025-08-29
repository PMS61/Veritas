"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Home,
  Search,
  FileText,
  User,
  Bell,
  Menu,
  Plus,
  TrendingUp,
  Settings,
  HelpCircle,
  Share2,
  Download,
  Shield,
  Eye,
  BarChart3
} from 'lucide-react';
import { useMobile } from '@/components/mobile-provider';
import { 
  triggerHapticFeedback, 
  showToast,
  getPreference,
  setPreference 
} from '@/lib/mobile-services';
import { ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  color?: string;
}

interface MobileNavigationProps {
  className?: string;
}

const mainNavItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    href: '/',
    icon: Home,
  },
  {
    id: 'verify',
    label: 'Verify',
    href: '/verify',
    icon: Search,
  },
  {
    id: 'report',
    label: 'Report',
    href: '/report',
    icon: Plus,
    color: 'text-primary'
  },
  {
    id: 'updates',
    label: 'Updates',
    href: '/updates',
    icon: FileText,
    badge: 3
  },
  {
    id: 'dashboard',
    label: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  }
];

const menuItems = [
  {
    id: 'trends',
    label: 'Trending',
    href: '/routemap',
    icon: TrendingUp,
    description: 'See what\'s being verified'
  },
  {
    id: 'help',
    label: 'Help & Support',
    href: '/help',
    icon: HelpCircle,
    description: 'Get help using Veritas'
  },
  {
    id: 'about',
    label: 'About Veritas',
    href: '/about',
    icon: Shield,
    description: 'Learn about our mission'
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    href: '/privacy',
    icon: Eye,
    description: 'How we protect your data'
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/settings',
    icon: Settings,
    description: 'Customize your experience'
  }
];

export function MobileNavigation({ className }: MobileNavigationProps) {
  const pathname = usePathname();
  const { isMobile } = useMobile();
  const [notifications, setNotifications] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Load saved notification count
    const loadNotifications = async () => {
      const saved = await getPreference('notification_count');
      if (saved) {
        setNotifications(parseInt(saved, 10) || 0);
      }
    };
    loadNotifications();
  }, []);

  const handleNavigation = async (item: NavItem) => {
    await triggerHapticFeedback(ImpactStyle.Light);
    
    // Mark notifications as read when visiting updates
    if (item.id === 'updates' && notifications > 0) {
      setNotifications(0);
      await setPreference('notification_count', '0');
    }
  };

  const isActiveRoute = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  if (!isMobile) {
    return null; // Don't show mobile navigation on desktop
  }

  return (
    <>
      {/* Bottom Navigation */}
      <nav className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t safe-area-bottom",
        className
      )}>
        <div className="flex items-center justify-around py-2 px-1">
          {mainNavItems.map((item) => {
            const isActive = isActiveRoute(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={() => handleNavigation(item)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors tap-target min-w-[60px]",
                  isActive 
                    ? "text-primary bg-primary/10" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "w-5 h-5",
                    item.color && !isActive ? item.color : ""
                  )} />
                  {item.badge && item.badge > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center"
                    >
                      {item.badge > 99 ? '99+' : item.badge}
                    </Badge>
                  )}
                  {item.id === 'updates' && notifications > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs flex items-center justify-center animate-pulse"
                    >
                      {notifications > 99 ? '99+' : notifications}
                    </Badge>
                  )}
                </div>
                <span className="text-xs font-medium truncate w-full text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
          
          {/* Menu Button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex flex-col items-center gap-1 p-2 rounded-lg h-auto min-w-[60px] tap-target"
                onClick={() => triggerHapticFeedback(ImpactStyle.Light)}
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs font-medium">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="mobile-sheet-bottom">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              
              <div className="grid gap-3 mt-6">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      onClick={async () => {
                        setIsMenuOpen(false);
                        await triggerHapticFeedback(ImpactStyle.Light);
                      }}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors tap-target"
                    >
                      <Icon className="w-5 h-5 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
                
                {/* Quick Actions */}
                <div className="border-t pt-3 mt-3">
                  <p className="text-sm font-medium text-muted-foreground mb-3">
                    Quick Actions
                  </p>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-2 tap-target"
                      onClick={async () => {
                        await triggerHapticFeedback(ImpactStyle.Light);
                        await showToast('Share feature coming soon');
                        setIsMenuOpen(false);
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                      <span className="text-xs">Share App</span>
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-center gap-2 tap-target"
                      onClick={async () => {
                        await triggerHapticFeedback(ImpactStyle.Light);
                        await showToast('Download feature coming soon');
                        setIsMenuOpen(false);
                      }}
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-xs">Download</span>
                    </Button>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="h-20" />
    </>
  );
}

// Utility hook to manage notification count
export function useNotifications() {
  const [count, setCount] = useState(0);

  const updateCount = async (newCount: number) => {
    setCount(newCount);
    await setPreference('notification_count', newCount.toString());
  };

  const increment = async () => {
    const newCount = count + 1;
    await updateCount(newCount);
  };

  const reset = async () => {
    await updateCount(0);
  };

  useEffect(() => {
    const loadCount = async () => {
      const saved = await getPreference('notification_count');
      if (saved) {
        setCount(parseInt(saved, 10) || 0);
      }
    };
    loadCount();
  }, []);

  return { count, increment, reset, updateCount };
}
