"use client";

import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard-layout";
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
      title: "New Health Misinformation Trend",
      description: "Multiple sources reporting false claims about vaccine ingredients",
      severity: "high",
      time: "5 minutes ago",
      verified: true,
    },
    {
      id: 2,
      title: "Political Claim Verification",
      description: "Statement made in recent press conference fact-checked",
      severity: "medium",
      time: "22 minutes ago",
      verified: true,
    },
    {
      id: 3,
      title: "Scientific Claim Assessment",
      description: "New research paper referenced in social media posts",
      severity: "low",
      time: "1 hour ago",
      verified: true,
    },
    {
      id: 4,
      title: "Breaking News Verification",
      description: "Early reports on weather event being verified",
      severity: "high",
      time: "3 hours ago",
      verified: false,
    },
  ];

  const quickStats = [
    {
      label: "Active Verifications",
      value: "34",
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      label: "Verified Sources",
      value: "1,247",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "Community Reports",
      value: "289",
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "Accuracy Rate",
      value: "97.8%",
      icon: Shield,
      color: "text-green-500",
    },
  ];

  const verificationProgress = [
    { name: "Health Claims", value: 78, color: "bg-blue-500" },
    { name: "Political Claims", value: 65, color: "bg-purple-500" },
    { name: "Scientific Claims", value: 82, color: "bg-green-500" },
    { name: "Breaking News", value: 54, color: "bg-yellow-500" },
  ];

  return (
    <DashboardLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">
            Welcome back,{" "}
            {user.full_name || user.email}
          </h2>
          <p className="text-muted-foreground">
            Access comprehensive fact-checking and verified information
            analysis.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
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

        {/* Trends and Analytics Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-8">
          <Link href="/dashboard/trends" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-500" />
                  Trending Topics
                </CardTitle>
                <CardDescription>
                  Latest trends in verified information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <Search className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground flex-1">
                      Explore trending information and fact-checking topics
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Top Trending:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Health Misinformation</span>
                        <span className="font-medium">+24.3%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Political Claims</span>
                        <span className="font-medium">+18.7%</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Breaking News</span>
                        <span className="font-medium">+15.2%</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/dashboard/analytics" className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-purple-500" />
                  Analytics Dashboard
                </CardTitle>
                <CardDescription>
                  Detailed analysis and metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="bg-primary/10 p-3 rounded-lg mr-4">
                      <Eye className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground flex-1">
                      View comprehensive analytics and reporting
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Verification Overview:</h4>
                    <ul className="space-y-1 text-sm">
                      <li className="flex justify-between">
                        <span>Health Claims</span>
                        <span className="font-medium">78% verified</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Political Claims</span>
                        <span className="font-medium">65% verified</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Scientific Claims</span>
                        <span className="font-medium">82% verified</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
                  <Link href="/dashboard/updates">
                    <Button variant="outline" className="w-full bg-transparent">
                      View All Updates
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions and Verification Progress */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Access key features and tools</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/dashboard/verify" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Verify Information
                  </Button>
                </Link>
                <Link href="/dashboard/updates" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Browse Updates
                  </Button>
                </Link>
                <Link href="/dashboard/trends" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    View Trends
                  </Button>
                </Link>
                <Link href="/dashboard/analytics" className="block">
                  <Button
                    variant="outline"
                    className="w-full justify-start bg-transparent"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </Link>
                <Link href="/dashboard/report" className="block">
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

            <Card>
              <CardHeader>
                <CardTitle>Verification Progress</CardTitle>
                <CardDescription>
                  Categories verification completion rate
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {verificationProgress.map((item, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">{item.name}</span>
                        <span className="text-sm text-muted-foreground">{item.value}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className={`${item.color} h-2 rounded-full`} 
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
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
                  <span className="text-muted-foreground">5 min ago</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
