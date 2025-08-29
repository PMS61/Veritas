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
import { useIsMobile } from "@/hooks/use-mobile";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();
  const isMobile = useIsMobile();

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, isMobile]);

  // Add touch gesture support for mobile menu
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
      // Swipe from right to left to open menu (when near the right edge)
      if (!isOpen && touchStartX > window.innerWidth - 50 && touchEndX < touchStartX - 50) {
        setIsOpen(true);
      }
      
      // Swipe from left to right to close menu
      if (isOpen && touchEndX > touchStartX + 50) {
        setIsOpen(false);
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
  }, [isMobile, isOpen]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
        <div className="px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 md:h-18 items-center justify-between max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 tap-target">
            <Eye className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
            <span className="text-lg md:text-2xl font-bold truncate">
              Veritas
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-2">
              <ThemeToggle />

              {user ? (
                <>
                  {user.role === "admin" && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="tap-target"
                    >
                      <Link href="/admin">Admin Portal</Link>
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 tap-target"
                  >
                    <User className="h-4 w-4" />
                    <span className="hidden lg:inline truncate max-w-32">
                      {user.firstName || user.email}
                    </span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="tap-target"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="tap-target"
                  >
                    <Link href="/login">Sign In</Link>
                  </Button>
                  <Button size="sm" asChild className="tap-target">
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden tap-target p-2 hover:bg-accent/10"
                  aria-label="Open menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85%] max-w-[320px] px-0 flex flex-col h-full safe-area-top safe-area-bottom overflow-hidden"
              >
                {/* Mobile menu header */}
                <div className="flex items-center justify-between p-4 border-b bg-background">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                      <Eye className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <SheetTitle className="font-bold text-foreground">Veritas</SheetTitle>
                      <p className="text-xs text-muted-foreground">Public Portal</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsOpen(false)}
                    className="tap-target p-2 hover:bg-accent"
                    aria-label="Close menu"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                {/* Navigation Content */}
                <div className="flex-1 overflow-y-auto">
                  {/* Theme toggle section */}
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Appearance</span>
                      <ThemeToggle />
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-4 space-y-1">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      Navigation
                    </h4>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start tap-target h-10 text-sm font-medium"
                    >
                      <Link href="/verify" onClick={() => setIsOpen(false)}>
                        Verify Claims
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start tap-target h-10 text-sm font-medium"
                    >
                      <Link href="/updates" onClick={() => setIsOpen(false)}>
                        Truth Updates
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      asChild
                      className="w-full justify-start tap-target h-10 text-sm font-medium"
                    >
                      <Link href="/about" onClick={() => setIsOpen(false)}>
                        About Veritas
                      </Link>
                    </Button>
                  </div>
                </div>

                {/* User Account Section */}
                <div className="p-4 border-t bg-muted/30">
                  {user ? (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Account
                      </h4>
                      <div className="flex items-center gap-3 p-3 bg-background rounded-lg border">
                        <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium truncate">
                          {user.firstName || user.email}
                        </span>
                      </div>
                      {user.role === "admin" && (
                        <Button
                          asChild
                          className="w-full tap-target h-10 text-sm"
                        >
                          <Link href="/admin" onClick={() => setIsOpen(false)}>
                            Admin Portal
                          </Link>
                        </Button>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          asChild
                          className="flex-1 tap-target h-10 text-sm"
                        >
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="tap-target h-10 px-3"
                          onClick={() => {
                            handleLogout();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Get Started
                      </h4>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          asChild
                          className="flex-1 tap-target h-10 text-sm"
                        >
                          <Link href="/login" onClick={() => setIsOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="flex-1 tap-target h-10 text-sm"
                        >
                          <Link href="/register" onClick={() => setIsOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

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
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-10 px-3 justify-start text-sm tap-target"
                >
                  <Link href="/verify">Verify Claims</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-10 px-3 justify-start text-sm tap-target"
                >
                  <Link href="/updates">Updates</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-10 px-3 justify-start text-sm tap-target"
                >
                  <Link href="/about">About</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="h-10 px-3 justify-start text-sm tap-target"
                >
                  <Link href="/contact">Contact</Link>
                </Button>
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
