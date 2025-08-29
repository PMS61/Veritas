"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { useIsMobile } from "@/hooks/use-mobile";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const { login } = useAuth();
  const isMobile = useIsMobile();

  // Clear error message when switching tabs
  const handleTabChange = () => {
    setError("");
  };

  const handlePublicLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Simulate authentication with demo credentials
    setTimeout(() => {
      if (email === "user@demo.com" && password === "demo123") {
        const userData = { email, role: "public" as const };
        console.log("Logging in user:", userData);
        login(userData);
        console.log("User logged in, redirecting to dashboard");
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push("/dashboard");
        }, 100);
      } else if (email && password) {
        setError("Invalid credentials. Please use the demo credentials provided above.");
      } else {
        setError("Please enter valid credentials");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("admin-email") as string;
    const password = formData.get("admin-password") as string;
    const accessCode = formData.get("access-code") as string;

    // Simulate admin authentication with demo credentials
    setTimeout(() => {
      if (email === "admin@demo.com" && password === "admin123" && accessCode === "VERITAS2025") {
        const userData = { email, role: "admin" as const };
        console.log("Logging in admin:", userData);
        login(userData);
        console.log("Admin logged in, redirecting to admin dashboard");
        // Small delay to ensure state is updated
        setTimeout(() => {
          router.push("/admin");
        }, 100);
      } else if (email && password && accessCode) {
        setError("Invalid admin credentials. Please use the demo credentials provided above.");
      } else {
        setError("Invalid admin credentials or access code");
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 safe-area-top safe-area-bottom">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-6 xs:mb-8">
          <Shield className="h-10 w-10 xs:h-12 xs:w-12 text-primary mr-3" />
          <div>
            <h1 className="text-xl xs:text-2xl font-bold">Veritas</h1>
            <p className="text-xs xs:text-sm text-muted-foreground">
              Eye that discerns the truth
            </p>
          </div>
        </div>

        <Tabs defaultValue="public" className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="public" className="text-sm xs:text-base tap-target h-10 xs:h-12">Public User</TabsTrigger>
            <TabsTrigger value="admin" className="text-sm xs:text-base tap-target h-10 xs:h-12">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg xs:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs xs:text-sm">
                  Sign in to access verified information and analysis
                </CardDescription>
              </CardHeader>
              
              {/* Demo credentials info */}
              <CardContent className="pb-0">
                <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-xs xs:text-sm text-blue-800 dark:text-blue-200">
                    <strong>Demo Credentials:</strong>
                    <br />
                    Email: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">user@demo.com</code>
                    <br />
                    Password: <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">demo123</code>
                  </AlertDescription>
                </Alert>
              </CardContent>
              
              <form onSubmit={handlePublicLogin}>
                <CardContent className="space-y-3 xs:space-y-4 pt-0">
                  {error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs xs:text-sm">{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="email" className="text-sm xs:text-base">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      required
                      className="h-10 xs:h-12 text-sm xs:text-base tap-target"
                    />
                  </div>
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="password" className="text-sm xs:text-base">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="h-10 xs:h-12 text-sm xs:text-base pr-10 tap-target"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-10 xs:h-12 text-sm xs:text-base tap-target"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Sign In"}
                  </Button>
                  <div className="text-center text-xs xs:text-sm text-muted-foreground">
                    Don't have an account?{" "}
                    <Link
                      href="/register"
                      className="underline underline-offset-4 hover:text-primary text-xs xs:text-sm"
                    >
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="admin">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg xs:text-xl">Admin Access</CardTitle>
                <CardDescription className="text-xs xs:text-sm">
                  Sign in to the admin dashboard
                </CardDescription>
              </CardHeader>
              
              {/* Demo admin credentials info */}
              <CardContent className="pb-0">
                <Alert className="mb-4 bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800">
                  <AlertCircle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                  <AlertDescription className="text-xs xs:text-sm text-orange-800 dark:text-orange-200">
                    <strong>Demo Admin Credentials:</strong>
                    <br />
                    Email: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">admin@demo.com</code>
                    <br />
                    Password: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">admin123</code>
                    <br />
                    Access Code: <code className="bg-orange-100 dark:bg-orange-900 px-1 rounded">VERITAS2025</code>
                  </AlertDescription>
                </Alert>
              </CardContent>
              
              <form onSubmit={handleAdminLogin}>
                <CardContent className="space-y-3 xs:space-y-4 pt-0">
                  {error && (
                    <Alert variant="destructive" className="py-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription className="text-xs xs:text-sm">{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="admin-email" className="text-sm xs:text-base">Admin Email</Label>
                    <Input
                      id="admin-email"
                      name="admin-email"
                      type="email"
                      placeholder="admin@veritas.com"
                      autoComplete="email"
                      required
                      className="h-10 xs:h-12 text-sm xs:text-base tap-target"
                    />
                  </div>
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="admin-password" className="text-sm xs:text-base">Password</Label>
                    <div className="relative">
                      <Input
                        id="admin-password"
                        name="admin-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                        className="h-10 xs:h-12 text-sm xs:text-base pr-10 tap-target"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Eye className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide password" : "Show password"}
                        </span>
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="access-code" className="text-sm xs:text-base">Access Code</Label>
                    <Input
                      id="access-code"
                      name="access-code"
                      type="password"
                      placeholder="Admin security code"
                      required
                      className="h-10 xs:h-12 text-sm xs:text-base tap-target"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex flex-col space-y-3 pt-2">
                  <Button
                    type="submit"
                    className="w-full h-10 xs:h-12 text-sm xs:text-base tap-target"
                    disabled={isLoading}
                  >
                    {isLoading ? "Signing in..." : "Admin Sign In"}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs xs:text-sm text-muted-foreground hover:text-foreground"
          >
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
