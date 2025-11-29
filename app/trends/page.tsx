"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Trends from "@/components/trends";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function TrendsPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3 min-w-0">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="mr-2">
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              </Link>
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl font-bold truncate">Veritas</h1>
                <p className="text-sm text-muted-foreground truncate">
                  Trends
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <Badge
                variant="outline"
                className="text-green-600 border-green-600 hidden sm:flex"
              >
                <div className="w-2 h-2 bg-green-600 rounded-full mr-2"></div>
                Connected
              </Badge>
              <ThemeToggle size="icon" />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  logout();
                  router.push("/");
                }}
                className="text-xs sm:text-sm px-2 sm:px-3"
              >
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Trends />
      </div>
    </div>
  );
}
