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
import { useIsMobile } from "@/components/ui/use-mobile";

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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const result = await login(email, password);

      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
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
          <TabsList className="grid w-full grid-cols-1">
            <TabsTrigger value="public" className="text-sm xs:text-base tap-target h-10 xs:h-12">Public User</TabsTrigger>
          </TabsList>

          <TabsContent value="public">
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg xs:text-xl">Sign In</CardTitle>
                <CardDescription className="text-xs xs:text-sm">
                  Sign in to access verified information and analysis
                </CardDescription>
              </CardHeader>
              
              {/* Login info */}
              <CardContent className="pb-0">
                <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <AlertDescription className="text-xs xs:text-sm text-blue-800 dark:text-blue-200">
                    <strong>Welcome to Veritas!</strong>
                    <br />
                    Sign in with your registered account or create a new account to get started.
                  </AlertDescription>
                </Alert>
              </CardContent>
              
              <form onSubmit={handleLogin}>
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
