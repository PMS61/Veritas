"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Eye, LogOut, User, X } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/components/ui/use-mobile";
import { getPublicNavItems } from "@/lib/navigation";
import { PublicHeader } from "@/components/public-header";
import { getFooterNavItems } from "@/lib/navigation";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <PublicHeader />

      {/* Main Content */}
      <main className="flex-1 min-h-[calc(100vh-var(--safe-area-top)-var(--safe-area-bottom))]">{children}</main>

      {/* Footer */}
      <footer className="border-t bg-muted/50 safe-area-bottom">
        <div className="mobile-container py-6 sm:py-8 md:py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
            <div className="space-y-3 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2">
                <Eye className="h-6 w-6 text-primary" />
                <span className="font-bold text-base md:text-lg">Veritas</span>
              </div>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                Eye that discerns the truth - empowering users with verified
                information analysis and misinformation detection.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base md:text-lg">
                Platform Features
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1 sm:gap-2 text-sm md:text-base text-muted-foreground">
                <p className="py-1">Truth Analysis</p>
                <p className="py-1">Misinformation Detection</p>
                <p className="py-1">Source Verification</p>
                <p className="py-1">Instant Fact-Checks</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base md:text-lg">
                Quick Links
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-1 gap-1">
                {getFooterNavItems().slice(0, 6).map((item) => (
                  <Button
                    key={item.href}
                    variant="ghost"
                    size="sm"
                    asChild
                    className="h-10 px-3 justify-start text-sm tap-target"
                  >
                    <Link href={item.href}>{item.title}</Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t mt-6 sm:mt-8 md:mt-10 pt-6 sm:pt-8 md:pt-10 text-center text-xs sm:text-sm md:text-base text-muted-foreground">
            <p>&copy; 2025 Veritas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
