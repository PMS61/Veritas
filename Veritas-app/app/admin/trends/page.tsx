"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const trendData = [
  { time: "00:00", mentions: 45, sentiment: 0.2 },
  { time: "04:00", mentions: 32, sentiment: -0.1 },
  { time: "08:00", mentions: 78, sentiment: -0.4 },
  { time: "12:00", mentions: 156, sentiment: -0.6 },
  { time: "16:00", mentions: 234, sentiment: -0.3 },
  { time: "20:00", mentions: 189, sentiment: 0.1 },
];

const keywordTrends = [
  {
    keyword: "earthquake",
    mentions: 1247,
    change: 23.5,
    sentiment: "negative",
    risk: "high",
  },
  {
    keyword: "evacuation",
    mentions: 892,
    change: 45.2,
    sentiment: "neutral",
    risk: "medium",
  },
  {
    keyword: "relief efforts",
    mentions: 634,
    change: -12.3,
    sentiment: "positive",
    risk: "low",
  },
  {
    keyword: "infrastructure",
    mentions: 523,
    change: 18.7,
    sentiment: "negative",
    risk: "medium",
  },
  {
    keyword: "emergency response",
    mentions: 445,
    change: 8.9,
    sentiment: "neutral",
    risk: "low",
  },
];

const narrativeTrends = [
  {
    id: 1,
    title: "Government Response Criticism",
    description: "Growing criticism of emergency response coordination",
    mentions: 2341,
    growth: 34.2,
    sentiment: -0.7,
    sources: ["Twitter", "News", "Forums"],
    risk: "high",
  },
  {
    id: 2,
    title: "Community Support Networks",
    description: "Positive stories about local community assistance",
    mentions: 1876,
    growth: 12.8,
    sentiment: 0.6,
    sources: ["Facebook", "WhatsApp", "News"],
    risk: "low",
  },
  {
    id: 3,
    title: "Infrastructure Damage Reports",
    description: "Ongoing reports of infrastructure assessment",
    mentions: 1543,
    growth: -8.4,
    sentiment: -0.3,
    sources: ["News", "Government", "Twitter"],
    risk: "medium",
  },
];

const geographicData = [
  { region: "North District", mentions: 456, sentiment: -0.4 },
  { region: "Central City", mentions: 789, sentiment: -0.2 },
  { region: "South Coast", mentions: 234, sentiment: 0.1 },
  { region: "East Valley", mentions: 567, sentiment: -0.6 },
];

export default function TrendsPage() {
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
          <h1 className="text-xl xs:text-2xl font-bold truncate">
            Trend Analysis
          </h1>
          <p className="text-xs xs:text-sm text-muted-foreground">
            Monitor emerging patterns and narrative trends
          </p>
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
                <p className="text-xs xs:text-sm text-muted-foreground truncate">
                  Active Trends
                </p>
                <p className="text-lg xs:text-2xl font-bold">24</p>
              </div>
              <TrendingUp className="w-5 h-5 xs:w-6 xs:h-6 text-primary shrink-0" />
            </div>
            <div className="flex items-center mt-1 xs:mt-2 text-xs">
              <ArrowUpRight className="w-3 h-3 text-green-600 mr-1 shrink-0" />
              <span className="text-green-600">+12%</span>
              <span className="text-muted-foreground ml-1 truncate">
                vs yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  High Risk
                </p>
                <p className="text-xl sm:text-2xl font-bold">7</p>
              </div>
              <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mr-1 shrink-0" />
              <span className="text-red-600">+3</span>
              <span className="text-muted-foreground ml-1 truncate">
                new alerts
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Total Mentions
                </p>
                <p className="text-xl sm:text-2xl font-bold">15.2K</p>
              </div>
              <MessageSquare className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 mr-1 shrink-0" />
              <span className="text-green-600">+23%</span>
              <span className="text-muted-foreground ml-1 truncate">
                last 24h
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Avg Sentiment
                </p>
                <p className="text-xl sm:text-2xl font-bold">-0.3</p>
              </div>
              <TrendingDown className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <ArrowDownRight className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 mr-1 shrink-0" />
              <span className="text-red-600">-0.1</span>
              <span className="text-muted-foreground ml-1 truncate">
                more negative
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="keywords" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="keywords" className="text-xs sm:text-sm">
            Keyword Trends
          </TabsTrigger>
          <TabsTrigger value="narratives" className="text-xs sm:text-sm">
            Narrative Analysis
          </TabsTrigger>
          <TabsTrigger value="geographic" className="text-xs sm:text-sm">
            Geographic Trends
          </TabsTrigger>
          <TabsTrigger value="temporal" className="text-xs sm:text-sm">
            Temporal Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="keywords" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Trending Keywords</CardTitle>
              <CardDescription>
                Most mentioned keywords and their sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {keywordTrends.map((trend, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                        <h3 className="font-semibold text-sm sm:text-base truncate">
                          {trend.keyword}
                        </h3>
                        <Badge
                          className={`${getRiskBadge(trend.risk)} text-xs shrink-0`}
                        >
                          {trend.risk} risk
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <span className="shrink-0">
                          {trend.mentions.toLocaleString()} mentions
                        </span>
                        <span
                          className={`shrink-0 ${trend.change > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {trend.change > 0 ? "+" : ""}
                          {trend.change}%
                        </span>
                        <span
                          className={`shrink-0 ${getSentimentColor(
                            trend.sentiment === "positive"
                              ? 0.5
                              : trend.sentiment === "negative"
                                ? -0.5
                                : 0,
                          )}`}
                        >
                          {trend.sentiment}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Search className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                      Analyze
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="narratives" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Emerging Narratives</CardTitle>
              <CardDescription>
                Key storylines and their development patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 sm:space-y-6">
                {narrativeTrends.map((narrative) => (
                  <div key={narrative.id} className="border rounded-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base sm:text-lg mb-1">
                          {narrative.title}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {narrative.description}
                        </p>
                      </div>
                      <Badge
                        className={`${getRiskBadge(narrative.risk)} text-xs shrink-0`}
                      >
                        {narrative.risk}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Mentions
                        </p>
                        <p className="text-lg sm:text-xl font-bold">
                          {narrative.mentions.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Growth
                        </p>
                        <p
                          className={`text-lg sm:text-xl font-bold ${narrative.growth > 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {narrative.growth > 0 ? "+" : ""}
                          {narrative.growth}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Sentiment
                        </p>
                        <p
                          className={`text-lg sm:text-xl font-bold ${getSentimentColor(narrative.sentiment)}`}
                        >
                          {narrative.sentiment > 0 ? "+" : ""}
                          {narrative.sentiment.toFixed(1)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs sm:text-sm text-muted-foreground shrink-0">
                          Sources:
                        </span>
                        {narrative.sources.map((source, idx) => (
                          <Badge
                            key={idx}
                            variant="outline"
                            className="text-xs"
                          >
                            {source}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Share2 className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                        Deep Dive
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>
                Regional mention patterns and sentiment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={geographicData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="region"
                      tick={{ fontSize: 10 }}
                      angle={-45}
                      textAnchor="end"
                      height={50}
                      interval={0}
                    />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="mentions" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
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
              <div className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[350px] overflow-hidden">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 10, right: 15, left: 10, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" tick={{ fontSize: 10 }} />
                    <YAxis yAxisId="left" tick={{ fontSize: 10 }} />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tick={{ fontSize: 10 }}
                    />
                    <Tooltip />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="mentions"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="sentiment"
                      stroke="hsl(var(--destructive))"
                      strokeWidth={2}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
