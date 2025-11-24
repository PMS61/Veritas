"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MessageSquare,
  Share2,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const trendData: Array<{time: string, mentions: number, sentiment: number}> = []
const keywordTrends: Array<{keyword: string, mentions: number, change: number, sentiment: string, risk: string}> = []
const narrativeTrends: Array<{id: number, title: string, description: string, mentions: number, growth: number, sentiment: number, sources: string[], risk: string}> = []
const geographicData: Array<{region: string, mentions: number, sentiment: number}> = []

export default function Trends() {
  const getSentimentColor = (sentiment: number) => {
    if (sentiment > 0.2) return "text-green-600";
    if (sentiment < -0.2) return "text-red-600";
    return "text-yellow-600";
  };

  const getRiskBadge = (risk: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[risk as keyof typeof colors] || colors.medium;
  };

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4">
      {/* Header */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between">
        <div className="min-w-0">
          <h1 className="text-xl xs:text-2xl font-bold truncate">Trend Analysis</h1>
          <p className="text-xs xs:text-sm text-muted-foreground">Monitor emerging patterns and narrative trends</p>
        </div>
        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 w-full xs:w-auto">
          <Select defaultValue="24h">
            <SelectTrigger className="w-full xs:w-28 h-8 xs:h-9 text-xs xs:text-sm tap-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">Last Hour</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="w-full xs:w-auto h-8 xs:h-9 text-xs xs:text-sm tap-target">
            <Filter className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 lg:gap-4">
        <Card className="shadow-sm">
          <CardContent className="p-3 xs:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs xs:text-sm text-muted-foreground truncate">Active Trends</p>
                <p className="text-lg xs:text-2xl font-bold">0</p>
              </div>
              <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 text-primary shrink-0" />
            </div>
            <div className="flex items-center mt-1 xs:mt-2 text-xs">
              <span className="text-muted-foreground">No active trends</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">High Risk</p>
                <p className="text-xl sm:text-2xl font-bold">0</p>
              </div>
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">No high-risk alerts</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Total Mentions</p>
                <p className="text-xl sm:text-2xl font-bold">0</p>
              </div>
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">No mentions found</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">Avg Sentiment</p>
                <p className="text-xl sm:text-2xl font-bold">0.0</p>
              </div>
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <span className="text-muted-foreground">No sentiment data</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="keywords" className="text-xs sm:text-sm">Keyword Trends</TabsTrigger>
          <TabsTrigger value="narratives" className="text-xs sm:text-sm">Narrative Analysis</TabsTrigger>
          <TabsTrigger value="geographic" className="text-xs sm:text-sm">Geographic Trends</TabsTrigger>
          <TabsTrigger value="temporal" className="text-xs sm:text-sm">Temporal Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Keywords</CardTitle>
              <CardDescription>Most mentioned keywords and their sentiment analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {keywordTrends.length > 0 ? (
                <div className="space-y-4">
                  {keywordTrends.map((trend, index) => (
                    <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <h3 className="font-semibold text-sm sm:text-base truncate">{trend.keyword}</h3>
                          <Badge className={`${getRiskBadge(trend.risk)} text-xs shrink-0`}>{trend.risk} risk</Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                          <span className="shrink-0">{trend.mentions.toLocaleString()} mentions</span>
                          <span className={`shrink-0 ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}>
                            {trend.change > 0 ? "+" : ""}
                            {trend.change}%
                          </span>
                          <span className={`shrink-0 ${getSentimentColor(trend.sentiment === "positive" ? 0.5 : trend.sentiment === "negative" ? -0.5 : 0)}`}>
                            {trend.sentiment}
                          </span>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                        <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Analyze
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Trending Keywords</h3>
                  <p className="text-muted-foreground">No trending keywords detected. Trend analysis will appear here as data becomes available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narratives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emerging Narratives</CardTitle>
              <CardDescription>Key storylines and their development patterns</CardDescription>
            </CardHeader>
            <CardContent>
              {narrativeTrends.length > 0 ? (
                <div className="space-y-4 sm:space-y-6">
                  {narrativeTrends.map((narrative) => (
                    <div key={narrative.id} className="border rounded-lg p-4">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-base sm:text-lg mb-1">{narrative.title}</h3>
                          <p className="text-muted-foreground text-sm sm:text-base">{narrative.description}</p>
                        </div>
                        <Badge className={`${getRiskBadge(narrative.risk)} text-xs shrink-0`}>{narrative.risk}</Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-xs sm:text-sm text-muted-foreground shrink-0">Sources:</span>
                          {narrative.sources.map((source, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">{source}</Badge>
                          ))}
                        </div>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs sm:text-sm">
                          <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                          Deep Dive
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Share2 className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Emerging Narratives</h3>
                  <p className="text-muted-foreground">No narrative patterns detected. Storyline analysis will appear here as data becomes available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Regional mention patterns and sentiment</CardDescription>
            </CardHeader>
            <CardContent>
              {geographicData.length > 0 ? (
                <div className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={geographicData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="region" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={50} interval={0} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Bar dataKey="mentions" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Filter className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Geographic Data</h3>
                  <p className="text-muted-foreground">No regional data available. Geographic trends will appear here as data becomes available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="temporal" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Temporal Analysis</CardTitle>
              <CardDescription>Trend evolution over time</CardDescription>
            </CardHeader>
            <CardContent>
              {trendData.length > 0 ? (
                <div className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={trendData} margin={{ top: 10, right: 15, left: 10, bottom: 10 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                      <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10 }} />
                      <Tooltip />
                      <Line yAxisId="left" type="monotone" dataKey="mentions" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                      <Line yAxisId="right" type="monotone" dataKey="sentiment" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Temporal Data</h3>
                  <p className="text-muted-foreground">No time-series data available. Trend evolution will appear here as data becomes available.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}