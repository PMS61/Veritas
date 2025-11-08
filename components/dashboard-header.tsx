"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/components/ui/use-mobile";
import { getDashboardNavItems } from "@/lib/navigation";
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
  Search,
  Settings,
  Shield,
  TrendingUp,
  Users,
  X,
  Zap,
  LogOut,
  User,
  Server,
} from "lucide-react";

interface DashboardHeaderProps {
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export function DashboardHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const navItems = getDashboardNavItems(!!user);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
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
        <ThemeToggle />
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="tap-target p-2"
            asChild
          >
            <Link href="/" title="Public Portal">
              <Globe className="w-4 h-4" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="tap-target p-2"
            onClick={handleLogout}
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}