"use client";

import { DashboardLayout } from "@/components/dashboard-layout";
import Trends from "@/components/trends";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, Search } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Trending Topics</h1>
            <p className="text-muted-foreground mt-2">
              Current trends in information verification and fact-checking
            </p>
          </div>
        </div>

        {/* Trend Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Trending Now</p>
                  <p className="text-2xl font-bold">+31</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 18.7% from yesterday
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Rising Claims</p>
                  <p className="text-2xl font-bold">+23</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 11.4% from yesterday
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Declining Topics</p>
                  <p className="text-2xl font-bold">-5</p>
                  <p className="text-xs text-red-500 flex items-center mt-1">
                    <TrendingDown className="h-3 w-3 mr-1" /> 2.1% from yesterday
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Verified Trends</p>
                  <p className="text-2xl font-bold">+38</p>
                  <p className="text-xs text-green-500 flex items-center mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" /> 25.3% from yesterday
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Current Trends
              </CardTitle>
              <CardDescription>
                Most discussed topics in the verification community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Trends />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trending Categories</CardTitle>
              <CardDescription>
                Categories with highest engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: "Health & Wellness", value: 84, color: "bg-blue-500" },
                  { name: "Political Claims", value: 79, color: "bg-purple-500" },
                  { name: "Technology Updates", value: 68, color: "bg-green-500" },
                  { name: "Environmental Claims", value: 57, color: "bg-yellow-500" },
                  { name: "Economic Information", value: 45, color: "bg-pink-500" },
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
              <CardTitle>Top Trending Categories</CardTitle>
              <CardDescription>
                Categories with the highest engagement
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { category: "Health & Wellness", change: "↑ 45%", volume: "12.4K" },
                  { category: "Political Claims", change: "↑ 41%", volume: "9.7K" },
                  { category: "Technology Updates", change: "↑ 34%", volume: "8.1K" },
                  { category: "Environmental Claims", change: "↑ 30%", volume: "6.8K" },
                  { category: "Economic Information", change: "↑ 25%", volume: "5.2K" },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-blue-500">{item.change}</span>
                      <span className="text-xs text-muted-foreground">{item.volume}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Verification Insights</CardTitle>
              <CardDescription>
                Trending verification metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {[
                  { metric: "Most Verified Claim", value: "Health Myth", trend: "↑" },
                  { metric: "Fastest Verified", value: "1.7 min", trend: "↓" },
                  { metric: "Most Controversial", value: "Political Claim", trend: "↑" },
                  { metric: "Top Source", value: "Research Institute", trend: "→" },
                  { metric: "Most Debunked", value: "Urban Legend", trend: "↑" },
                ].map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.metric}</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{item.value}</span>
                      <Badge variant="secondary" className="text-xs px-1.5 py-0.5">
                        {item.trend}
                      </Badge>
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
