"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { getPublicNavItems } from "@/lib/navigation";
import {
  LogOut,
  User,
  Menu,
  Eye,
  Search,
  Bell,
  Home,
  LayoutDashboard,
  X,
} from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/components/ui/use-mobile";

interface PublicHeaderProps {
  showNavigation?: boolean;
}

export function PublicHeader({ showNavigation = true }: PublicHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    router.push("/");
    setMobileMenuOpen(false);
  };

  const navItems = getPublicNavItems(!!user);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 safe-area-top">
      <div className="px-4 sm:px-6 lg:px-8 flex h-14 sm:h-16 md:h-18 items-center justify-between max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-2 tap-target">
          <Eye className="h-6 w-6 md:h-8 md:w-8 text-primary flex-shrink-0" />
          <span className="text-lg md:text-2xl font-bold truncate">
            Veritas
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Desktop Navigation */}
          {showNavigation && (
            <div className="hidden md:flex items-center gap-2">
              {navItems.map((item) => (
                <Button
                  key={item.href}
                  variant="ghost"
                  size="sm"
                  asChild
                  className="tap-target"
                >
                  <Link href={item.href}>{item.title}</Link>
                </Button>
              ))}
            </div>
          )}

          {/* Desktop User Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />

            {user ? (
              <>
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

          {/* Mobile Menu Button */}
          {showNavigation && (
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
                    onClick={() => setMobileMenuOpen(false)}
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
                    {navItems.map((item) => (
                      <Button
                        key={item.href}
                        variant="ghost"
                        asChild
                        className="w-full justify-start tap-target h-10 text-sm font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Link href={item.href}>
                          {item.title}
                        </Link>
                      </Button>
                    ))}
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

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          asChild
                          className="flex-1 tap-target h-10 text-sm"
                        >
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            Dashboard
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          className="tap-target h-10 px-3"
                          onClick={() => {
                            handleLogout();
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
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            Sign In
                          </Link>
                        </Button>
                        <Button
                          asChild
                          className="flex-1 tap-target h-10 text-sm"
                        >
                          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                            Sign Up
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
}