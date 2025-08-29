"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Eye,
  Globe,
  Home,
  Menu,
  Moon,
  Search,
  Settings,
  Shield,
  Sun,
  TrendingUp,
  Users,
  X,
  Zap,
  LogOut,
  User,
  Server,
} from "lucide-react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();

  // Set sidebar to expanded state by default on mobile for better navigation
  useEffect(() => {
    if (isMobile) {
      setSidebarCollapsed(false);
    }
  }, [isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, isMobile]);

  // Add swipe gesture support for mobile menu
  useEffect(() => {
    if (!isMobile) return;

    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      touchEndX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = () => {
      // Swipe from left to right to open menu
      if (!mobileMenuOpen && touchStartX < 50 && touchEndX > touchStartX + 100) {
        setMobileMenuOpen(true);
      }
      
      // Swipe from right to left to close menu
      if (mobileMenuOpen && touchEndX < touchStartX - 100) {
        setMobileMenuOpen(false);
      }
    };
    
    document.addEventListener("touchstart", handleTouchStart);
    document.addEventListener("touchmove", handleTouchMove);
    document.addEventListener("touchend", handleTouchEnd);
    
    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isMobile, mobileMenuOpen]);

  const navigationItems = [
    {
      icon: Home,
      label: "Overview",
      href: "/admin",
      active: pathname === "/admin",
    },
    {
      icon: Activity,
      label: "Live Monitoring",
      href: "/admin/monitoring",
      badge: "24",
      active: pathname === "/admin/monitoring",
    },
    {
      icon: AlertTriangle,
      label: "Misinformation",
      href: "/admin/misinformation",
      badge: "7",
      active: pathname === "/admin/misinformation",
    },
    {
      icon: Shield,
      label: "Verification",
      href: "/admin/verification",
      active: pathname === "/admin/verification",
    },
    {
      icon: BarChart3,
      label: "Analytics",
      href: "/admin/analytics",
      active: pathname === "/admin/analytics",
    },
    {
      icon: TrendingUp,
      label: "Trends",
      href: "/admin/trends",
      active: pathname === "/admin/trends",
    },
    {
      icon: Users,
      label: "Sources",
      href: "/admin/sources",
      active: pathname === "/admin/sources",
    },
    {
      icon: User,
      label: "Users",
      href: "/admin/users",
      active: pathname === "/admin/users",
    },
    {
      icon: Bell,
      label: "Alerts",
      href: "/admin/alerts",
      badge: "12",
      active: pathname === "/admin/alerts",
    },
    {
      icon: Server,
      label: "System",
      href: "/admin/system",
      active: pathname === "/admin/system",
    },
    {
      icon: Settings,
      label: "Settings",
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <div className="flex h-screen bg-background">
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed && !mobileMenuOpen ? "w-16" : "w-64"
        } transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 fixed lg:relative z-50 h-full shadow-xl backdrop-blur-sm safe-area-left safe-area-top safe-area-bottom overflow-hidden
        ${isMobile ? 'w-[85%] max-w-[320px]' : ''}`}
      >
        {/* Header */}
        <div className="p-3 sm:p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {!sidebarCollapsed && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 sm:w-8 sm:h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                </div>
                <div className="min-w-0">
                  <h1 className="font-bold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                    Veritas
                  </h1>
                  <p className="text-xs text-muted-foreground truncate">
                    Admin Panel
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden tap-target"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:flex tap-target"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  <span className="text-xs">Collapse</span>
                </Button>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-10 h-10 p-0 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                onClick={() => setSidebarCollapsed(false)}
              >
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary-foreground" />
                </div>
              </Button>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden tap-target"
                >
                  <X className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hidden lg:flex tap-target"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 overflow-y-auto">
          <div className="space-y-1">
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button
                  variant={item.active ? "secondary" : "ghost"}
                  className={`w-full ${sidebarCollapsed && !mobileMenuOpen ? 'justify-center' : 'justify-start'} gap-2 sm:gap-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                    sidebarCollapsed && !mobileMenuOpen ? "px-2" : "px-2 sm:px-3"
                  } h-10 sm:h-10 text-sm tap-target`}
                  size="sm"
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {(!sidebarCollapsed || mobileMenuOpen) && (
                    <span className="flex-1 text-left text-sm truncate">
                      {item.label}
                    </span>
                  )}
                  {(!sidebarCollapsed || mobileMenuOpen) && item.badge && (
                    <Badge
                      variant="secondary"
                      className="bg-red-100 text-red-800 text-xs px-1.5 shrink-0"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              </Link>
            ))}
          </div>
        </nav>

        {/* Status Indicator */}
        <div className="p-3 sm:p-4 border-t border-border">
          {!sidebarCollapsed && (
            <Card className="p-2 sm:p-3 bg-green-50 dark:bg-green-900/20">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-xs font-medium text-gray-900 dark:text-white">
                    System Status
                  </p>
                  <p className="text-xs text-muted-foreground">
                    All systems operational
                  </p>
                </div>
              </div>
            </Card>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          )}
        </div>

        {/* User Info and Logout Section */}
        <div className="p-3 sm:p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {!sidebarCollapsed && user && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-700 dark:text-gray-300" />
                <span className="text-gray-700 dark:text-gray-300 truncate">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="flex-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target"
                >
                  <Link href="/">← Public Portal</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
          {sidebarCollapsed && user && (
            <div className="flex flex-col items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target p-2"
                title="Public Portal"
              >
                <Link href="/">
                  <Home className="w-4 h-4" />
                </Link>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 tap-target p-2"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

              {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-14 sm:h-16 bg-card border-b border-border flex items-center justify-between px-3 sm:px-4 lg:px-6 safe-area-top">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden tap-target p-2"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <h2 className="font-semibold text-foreground text-sm sm:text-base hidden xs:block">
                Crisis Monitoring Dashboard
              </h2>
              <h2 className="font-semibold text-foreground text-sm xs:hidden">
                Veritas
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-2 lg:gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span>Live</span>
            </div>
            <ThemeToggle />
            <Button variant="ghost" size="sm" className="hidden sm:flex tap-target p-2">
              <Search className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" className="relative tap-target p-2">
              <Bell className="w-4 h-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
                3
              </div>
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 min-h-0 overflow-auto p-2 sm:p-3 lg:p-6 safe-area-bottom">{children}</main>
      </div>
    </div>
  );
}
