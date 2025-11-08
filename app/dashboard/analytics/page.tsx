"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import { AnalyticsReporting } from "@/components/analytics-reporting";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, TrendingUp, Activity, Users } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Comprehensive insights and metrics for verified information
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Verifications</p>
                  <p className="text-2xl font-bold">3,247</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 14.2% from last month
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Reports</p>
                  <p className="text-2xl font-bold">56</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 5.7% from last week
                  </p>
                </div>
                <Activity className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Sources</p>
                  <p className="text-2xl font-bold">1,423</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 11.3% from last month
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Accuracy Rate</p>
                  <p className="text-2xl font-bold">98.9%</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 0.7% from last week
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Verification Analytics
              </CardTitle>
              <CardDescription>
                Detailed analysis of verification activities and metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnalyticsReporting />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Verification Progress</CardTitle>
              <CardDescription>
                Completion by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Health Claims", value: 82, color: "bg-blue-500" },
                  { name: "Political Claims", value: 68, color: "bg-purple-500" },
                  { name: "Scientific Claims", value: 87, color: "bg-green-500" },
                  { name: "Breaking News", value: 71, color: "bg-yellow-500" },
                  { name: "Urban Legends", value: 93, color: "bg-pink-500" },
                ].map((item, index) => (
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Verified Topics</CardTitle>
              <CardDescription>
                Most commonly fact-checked information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { topic: "Health Information", percentage: "26.1%", change: "+2.3%" },
                  { topic: "Political Claims", percentage: "19.8%", change: "+1.1%" },
                  { topic: "Breaking News", percentage: "17.5%", change: "-0.7%" },
                  { topic: "Scientific Claims", percentage: "15.2%", change: "+0.9%" },
                  { topic: "Urban Legends", percentage: "13.4%", change: "+0.4%" },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.topic}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.percentage}</span>
                      <Badge variant="secondary" className="text-xs">{item.change}</Badge>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Verification Performance</CardTitle>
              <CardDescription>
                Time and accuracy metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { metric: "Average Response Time", value: "2.8 min", status: "faster" },
                  { metric: "Source Verification Rate", value: "95.8%", status: "better" },
                  { metric: "Claim Verification Rate", value: "88.7%", status: "better" },
                  { metric: "False Claim Detection", value: "97.3%", status: "better" },
                  { metric: "User Satisfaction", value: "94.1%", status: "better" },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      {item.status === "faster" && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          ↑ Faster
                        </Badge>
                      )}
                      {item.status === "better" && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                          ↑ Better
                        </Badge>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </DashboardLayout>
  );
}
