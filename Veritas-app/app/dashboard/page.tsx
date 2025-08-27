"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Eye,
  Search,
  Bell,
  ExternalLink,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Link from "next/link";

export default function PublicDashboard() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Dashboard: user state changed", { user, isLoading });
    if (!isLoading && !user) {
      console.log("No user found, redirecting to login");
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

  const recentAlerts = [
    {
      id: 1,
      title: "Severe Weather Warning",
      description: "Heavy rainfall expected in coastal regions",
      severity: "high",
      time: "2 minutes ago",
      verified: true,
    },
    {
      id: 2,
      title: "Traffic Disruption",
      description: "Major highway closure due to accident",
      severity: "medium",
      time: "15 minutes ago",
      verified: true,
    },
    {
      id: 3,
      title: "Public Health Notice",
      description: "Vaccination drive scheduled for community centers",
      severity: "low",
      time: "1 hour ago",
      verified: true,
    },
  ];

  const quickStats = [
    {
      label: "Active Alerts",
      value: "12",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      label: "Verified Sources",
      value: "847",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Community Reports",
      value: "156",
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "System Status",
      value: "Online",
      icon: Shield,
      color: "text-green-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center space-x-3 min-w-0">
              <Shield className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-xl font-bold truncate">Veritas</h1>
                <p className="text-sm text-muted-foreground truncate">
                  Verification Dashboard
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back,{" "}
            {user.firstName
              ? `${user.firstName} ${user.lastName || ""}`
              : user.email}
          </h2>
          <p className="text-muted-foreground">
            Access comprehensive fact-checking and verified information
            analysis.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {quickStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Alerts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Recent Verifications
                </CardTitle>
                <CardDescription>
                  Latest fact-checks and truth verification results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAlerts.map((alert) => (
                  <Alert
                    key={alert.id}
                    className={`border-l-4 ${
                      alert.severity === "high"
                        ? "border-l-red-500"
                        : alert.severity === "medium"
                          ? "border-l-orange-500"
                          : "border-l-blue-500"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{alert.title}</h4>
                          {alert.verified && (
                            <Badge variant="secondary" className="text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                        <AlertDescription className="mb-2">
                          {alert.description}
                        </AlertDescription>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Clock className="h-3 w-3 mr-1" />
                          {alert.time}
                        </div>
                      </div>
                    </div>
                  </Alert>
                ))}
                <div className="pt-4">
                  <Link href="/updates">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Updates
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key features and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/verify" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Verify Information
                  </Button>
                </Link>
                <Link href="/updates" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Updates
                  </Button>
                </Link>
                <Link href="/report" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    Report Issue
                  </Button>
                </Link>
                <Link href="/about" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    About Veritas
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-sm">System Health</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Data Sources</span>
                  <Badge variant="secondary" className="text-green-600">
                    Active
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Verification Engine</span>
                  <Badge variant="secondary" className="text-green-600">
                    Online
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Last Update</span>
                  <span className="text-muted-foreground">2 min ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
