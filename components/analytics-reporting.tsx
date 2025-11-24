"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts"
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  Globe,
  AlertTriangle,
  Shield,
  Activity,
  Users,
  MessageSquare,
} from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"
import { useAuth } from "@/components/auth-provider"
import {
  getAnalyticsOverview,
  getTimeSeriesData,
  getSourceDistribution,
  getCategoryBreakdown,
  exportAnalyticsData
} from "@/actions/analytics"
import { getAlertStats } from "@/actions/alerts"
import { getClaims } from "@/actions/claims"

interface AnalyticsData {
  timeSeriesData: Array<{
    date: string
    misinformation: number
    verified: number
    alerts: number
    engagement: number
  }>
  sourceDistribution: Array<{
    name: string
    value: number
    color: string
  }>
  categoryBreakdown: Array<{
    category: string
    count: number
    severity: number
  }>
  geographicData: Array<{
    region: string
    incidents: number
    riskLevel: string
  }>
  trendAnalysis: Array<{
    keyword: string
    mentions: number
    sentiment: number
    growth: number
  }>
}

export function AnalyticsReporting() {
  const { user } = useAuth()
  const [timeRange, setTimeRange] = useState("7d")
  const [selectedMetric, setSelectedMetric] = useState("all")
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isExporting, setIsExporting] = useState(false)
  const [realTimeStats, setRealTimeStats] = useState<any>(null)
  const isMobile = useIsMobile()

  // Get date range from selected time range
  const getDateRange = (range: string) => {
    const now = new Date()
    const start = new Date()

    switch (range) {
      case "24h":
        start.setHours(start.getHours() - 24)
        break
      case "7d":
        start.setDate(start.getDate() - 7)
        break
      case "30d":
        start.setDate(start.getDate() - 30)
        break
      case "90d":
        start.setDate(start.getDate() - 90)
        break
      default:
        start.setDate(start.getDate() - 7)
    }

    return {
      start_date: start.toISOString(),
      end_date: now.toISOString()
    }
  }

  // Load real-time data
  const loadRealTimeData = async () => {
    try {
      const dateRange = getDateRange(timeRange)

      const [alertStatsResult, claimsResult] = await Promise.all([
        getAlertStats(),
        getClaims(dateRange, 1, 100)
      ])

      const stats = {
        total_alerts: alertStatsResult.data?.total_alerts || 0,
        active_alerts: alertStatsResult.data?.active_alerts || 0,
        resolved_alerts: alertStatsResult.data?.resolved_alerts || 0,
        total_claims: claimsResult.count || 0,
        time_range: timeRange
      }

      setRealTimeStats(stats)
    } catch (error) {
      console.error('Failed to load real-time data:', error)
    }
  }

  // Load analytics data
  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true)
      setError("")

      const dateRange = getDateRange(timeRange)

      // Load real-time stats
      await loadRealTimeData()

      // For now, use mock data for complex analytics since server actions are basic
      // In a production environment, you'd implement proper analytics RPC functions
      setAnalyticsData(mockAnalyticsData)

    } catch (error) {
      console.error('Failed to load analytics data:', error)
      setError("Failed to load analytics data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async (format: 'csv' | 'json') => {
    if (!user) return

    setIsExporting(true)

    try {
      const dateRange = getDateRange(timeRange)
      const result = await exportAnalyticsData(format, dateRange)

      if (result.data) {
        // Create download
        const blob = new Blob([result.data], {
          type: format === 'csv' ? 'text/csv' : 'application/json'
        })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `veritas-analytics-${timeRange}-${Date.now()}.${format}`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } else {
        setError(result.error || "Export failed")
      }

    } catch (error) {
      console.error('Export failed:', error)
      setError("Failed to export analytics data")
    } finally {
      setIsExporting(false)
    }
  }

  // Load data on mount and when time range changes
  useEffect(() => {
    loadAnalyticsData()
  }, [timeRange])

  // Mock analytics data
  const mockAnalyticsData: AnalyticsData = {
    timeSeriesData: [
      { date: "2024-01-09", misinformation: 45, verified: 123, alerts: 12, engagement: 15420 },
      { date: "2024-01-10", misinformation: 67, verified: 145, alerts: 18, engagement: 18930 },
      { date: "2024-01-11", misinformation: 89, verified: 167, alerts: 25, engagement: 22340 },
      { date: "2024-01-12", misinformation: 123, verified: 189, alerts: 34, engagement: 28750 },
      { date: "2024-01-13", misinformation: 156, verified: 234, alerts: 42, engagement: 35680 },
      { date: "2024-01-14", misinformation: 134, verified: 267, alerts: 38, engagement: 31240 },
      { date: "2024-01-15", misinformation: 178, verified: 298, alerts: 47, engagement: 42150 },
    ],
    sourceDistribution: [
      { name: "Twitter/X", value: 35, color: "#0dcaf0" },
      { name: "Telegram", value: 25, color: "#3b82f6" },
      { name: "News Portals", value: 18, color: "#fbbf24" },
      { name: "Reddit", value: 12, color: "#ef4444" },
      { name: "Forums", value: 7, color: "#4ade80" },
      { name: "WhatsApp", value: 3, color: "#8b5cf6" },
    ],
    categoryBreakdown: [
      { category: "Health Misinformation", count: 234, severity: 8.5 },
      { category: "Election Misinformation", count: 189, severity: 9.2 },
      { category: "Climate Misinformation", count: 156, severity: 7.8 },
      { category: "Technology Misinformation", count: 123, severity: 6.9 },
      { category: "Economic Misinformation", count: 98, severity: 7.3 },
      { category: "Social Misinformation", count: 87, severity: 6.1 },
    ],
    geographicData: [
      { region: "North America", incidents: 456, riskLevel: "high" },
      { region: "Europe", incidents: 389, riskLevel: "medium" },
      { region: "Asia", incidents: 234, riskLevel: "medium" },
      { region: "South America", incidents: 123, riskLevel: "low" },
      { region: "Africa", incidents: 89, riskLevel: "low" },
      { region: "Oceania", incidents: 45, riskLevel: "low" },
    ],
    trendAnalysis: [
      { keyword: "vaccine misinformation", mentions: 15420, sentiment: -0.8, growth: 0.23 },
      { keyword: "election fraud", mentions: 12340, sentiment: -0.9, growth: 0.18 },
      { keyword: "climate hoax", mentions: 8930, sentiment: -0.7, growth: 0.15 },
      { keyword: "5g conspiracy", mentions: 6780, sentiment: -0.6, growth: 0.12 },
      { keyword: "government surveillance", mentions: 5670, sentiment: -0.5, growth: 0.08 },
    ],
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <BarChart3 className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">No analytics data available</p>
        </div>
      </div>
    )
  }

  // Use real stats where available, fallback to mock data
  const totalIncidents = realTimeStats?.total_claims ||
    analyticsData.timeSeriesData?.reduce((sum, day) => sum + (day?.misinformation || 0), 0) || 0
  const totalVerified = analyticsData.timeSeriesData?.reduce((sum, day) => sum + (day?.verified || 0), 0) || 0
  const totalAlerts = realTimeStats?.active_alerts ||
    analyticsData.timeSeriesData?.reduce((sum, day) => sum + (day?.alerts || 0), 0) || 0
  const avgEngagement = Math.round(
    (analyticsData.timeSeriesData?.reduce((sum, day) => sum + (day?.engagement || 0), 0) || 0) /
      (analyticsData.timeSeriesData?.length || 1),
  )

  const getRiskColor = (level: string) => {
    switch (level) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-green-500"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4 flex flex-col min-h-0 flex-1">
      {/* Header */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between py-6 sm:py-8 md:py-10">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            Analytics & Reporting
          </h1>
          <p className="text-xs xs:text-sm text-muted-foreground">Comprehensive crisis monitoring analytics and insights</p>
        </div>

        <div className="flex items-center gap-2 w-full xs:w-auto justify-between xs:justify-start">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-24 xs:w-32 h-8 xs:h-9 text-xs xs:text-sm tap-target">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="sm"
            className="h-8 xs:h-9 text-xs xs:text-sm tap-target"
            onClick={() => handleExport('json')}
            disabled={isExporting || !user}
          >
            <Download className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
            <span className="truncate">{isExporting ? 'Exporting...' : 'Export'}</span>
            <span className="hidden xs:inline"> Report</span>
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 lg:gap-4">
        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 xs:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs xs:text-sm font-medium text-card-foreground truncate">Total Incidents</p>
                <p className="text-lg xs:text-2xl font-bold text-destructive">{totalIncidents}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-destructive" />
                  <span className="truncate">+23% from last period</span>
                </p>
              </div>
              <AlertTriangle className="w-5 h-5 xs:w-6 xs:h-6 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 xs:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs xs:text-sm font-medium text-card-foreground truncate">Verified Claims</p>
                <p className="text-lg xs:text-2xl font-bold text-green-500">{totalVerified}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-green-500" />
                  <span className="truncate">+15% from last period</span>
                </p>
              </div>
              <Shield className="w-5 h-5 xs:w-6 xs:h-6 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 xs:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs xs:text-sm font-medium text-card-foreground truncate">Active Alerts</p>
                <p className="text-lg xs:text-2xl font-bold text-yellow-500">{totalAlerts}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingDown className="w-3 h-3 text-green-500" />
                  <span className="truncate">-8% from last period</span>
                </p>
              </div>
              <Activity className="w-5 h-5 xs:w-6 xs:h-6 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card shadow-sm">
          <CardContent className="p-3 xs:p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs xs:text-sm font-medium text-card-foreground truncate">Avg Engagement</p>
                <p className="text-lg xs:text-2xl font-bold text-primary">{avgEngagement.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-primary" />
                  <span className="truncate">+12% from last period</span>
                </p>
              </div>
              <Users className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="trends" className="space-y-3 xs:space-y-4 sm:space-y-6 flex-1 min-h-0">
        <div className="overflow-x-auto w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="trends" className="text-xs xs:text-sm tap-target">Trend Analysis</TabsTrigger>
            <TabsTrigger value="sources" className="text-xs xs:text-sm tap-target">Source Analytics</TabsTrigger>
            <TabsTrigger value="geographic" className="text-xs xs:text-sm tap-target">Geographic Data</TabsTrigger>
            <TabsTrigger value="categories" className="text-xs xs:text-sm tap-target">Categories</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="trends" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Time Series Chart */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Crisis Monitoring Trends
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">7-day trend analysis of misinformation detection and verification</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <ChartContainer
                config={{
                  misinformation: {
                    label: "Misinformation Detected",
                    color: "hsl(var(--destructive))",
                  },
                  verified: {
                    label: "Claims Verified",
                    color: "hsl(var(--primary))",
                  },
                  alerts: {
                    label: "Alerts Generated",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData?.timeSeriesData?.filter(Boolean) || []} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={!isMobile ? { fontSize: 12 } : { fontSize: 10 }} 
                      tickFormatter={(value) => value.split('-').slice(1).join('/')}
                      interval={isMobile ? 1 : 0}
                    />
                    <YAxis tick={!isMobile ? { fontSize: 12 } : { fontSize: 10 }} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    {!isMobile && <Legend />}
                    <Line
                      type="monotone"
                      dataKey="misinformation"
                      stroke="var(--color-misinformation)"
                      strokeWidth={isMobile ? 1.5 : 2}
                      name="Misinformation Detected"
                      dot={!isMobile}
                    />
                    <Line
                      type="monotone"
                      dataKey="verified"
                      stroke="var(--color-verified)"
                      strokeWidth={isMobile ? 1.5 : 2}
                      name="Claims Verified"
                      dot={!isMobile}
                    />
                    <Line
                      type="monotone"
                      dataKey="alerts"
                      stroke="var(--color-alerts)"
                      strokeWidth={isMobile ? 1.5 : 2}
                      name="Alerts Generated"
                      dot={!isMobile}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* Trending Keywords */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <TrendingUp className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Trending Misinformation Keywords
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Top keywords detected in misinformation content</CardDescription>
            </CardHeader>
            <CardContent className="px-0 xs:px-0 py-0 xs:py-0">
              <div className="border-t border-border">
                <div className="grid grid-cols-3 gap-2 px-3 xs:px-4 py-2 xs:py-3 bg-muted/50 border-b border-border">
                  <div className="text-xs xs:text-sm font-medium text-muted-foreground">Keyword</div>
                  <div className="text-xs xs:text-sm font-medium text-muted-foreground text-center">Mentions</div>
                  <div className="text-xs xs:text-sm font-medium text-muted-foreground text-right">Growth</div>
                </div>
                {analyticsData?.trendAnalysis?.map((trend) => (
                  <div
                    key={trend.keyword}
                    className="grid grid-cols-3 gap-2 px-3 xs:px-4 py-2 xs:py-3 border-b border-border hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          trend.sentiment < -0.7
                            ? "bg-red-500"
                            : trend.sentiment < -0.5
                              ? "bg-yellow-500"
                              : "bg-blue-500"
                        }`}
                      />
                      <span className="text-xs xs:text-sm truncate font-medium" title={trend.keyword}>
                        {trend.keyword}
                      </span>
                    </div>
                    <div className="text-xs xs:text-sm text-center">{trend.mentions.toLocaleString()}</div>
                    <div
                      className={`text-xs xs:text-sm font-medium text-right ${
                        trend.growth > 0.2
                          ? "text-destructive"
                          : trend.growth > 0.1
                            ? "text-yellow-500"
                            : "text-green-500"
                      }`}
                    >
                      +{Math.round(trend.growth * 100)}%
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sources" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Source Distribution */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Globe className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Source Distribution
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Misinformation incidents by source platform</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <ChartContainer
                config={{
                  value: {
                    label: "Percentage",
                    color: "hsl(var(--primary))",
                  },
                }}
                className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px] w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData?.sourceDistribution?.filter(Boolean) || []}
                      cx="50%"
                      cy="50%"
                      outerRadius={isMobile ? 60 : 80}
                      fill="#8884d8"
                      dataKey="value"
                      label={!isMobile ? (entry) => {
                        if (!entry || typeof entry !== "object") return ""
                        const name = entry.name || "Unknown"
                        const value = entry.value || 0
                        return `${name}: ${value}%`
                      } : false}
                    >
                      {(analyticsData?.sourceDistribution?.filter(Boolean) || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry?.color || "#8884d8"} />
                      ))}
                    </Pie>
                    <ChartTooltip content={<ChartTooltipContent />} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <BarChart3 className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Source Performance
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Detailed breakdown by platform</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <ScrollArea className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px]">
                <div className="space-y-3">
                  {(analyticsData?.sourceDistribution?.filter(Boolean) || []).map((source, index) => (
                    <div
                      key={source?.name || `source-${index}`}
                      className="flex items-center justify-between p-2 rounded bg-muted/30"
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: source?.color || "#8884d8" }}
                        ></div>
                        <span className="text-xs xs:text-sm font-medium text-card-foreground">{source?.name || "Unknown"}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-xs xs:text-sm font-bold text-primary">{source?.value || 0}%</div>
                        <div className="text-xs text-muted-foreground">
                          {Math.round(((source?.value || 0) / 100) * totalIncidents)} incidents
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geographic" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Geographic Analysis */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Globe className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Geographic Distribution
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Misinformation incidents by geographic region</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <ChartContainer
                  config={{
                    incidents: {
                      label: "Incidents",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.geographicData?.filter(Boolean) || []} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="region" 
                        tick={!isMobile ? { fontSize: 12 } : { fontSize: 10 }}
                        angle={isMobile ? -45 : 0}
                        textAnchor={isMobile ? "end" : "middle"}
                        height={isMobile ? 60 : 30}
                      />
                      <YAxis tick={!isMobile ? { fontSize: 12 } : { fontSize: 10 }} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="incidents" fill="var(--color-incidents)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="space-y-3">
                  {(analyticsData?.geographicData?.filter(Boolean) || []).map((region, index) => (
                    <div
                      key={region?.region || `region-${index}`}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                    >
                      <div>
                        <p className="font-medium text-card-foreground text-sm xs:text-base">{region?.region || "Unknown"}</p>
                        <p className="text-xs xs:text-sm text-muted-foreground">{region?.incidents || 0} incidents</p>
                      </div>
                      <Badge
                        className={
                          (region?.riskLevel || "") === "high"
                            ? "bg-destructive text-destructive-foreground text-xs"
                            : (region?.riskLevel || "") === "medium"
                              ? "bg-yellow-500 text-white text-xs"
                              : "bg-green-500 text-white text-xs"
                        }
                      >
                        {region?.riskLevel || "unknown"} risk
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Category Breakdown */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Filter className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Category Analysis
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Misinformation breakdown by content category</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-6">
                <ChartContainer
                  config={{
                    count: {
                      label: "Count",
                      color: "hsl(var(--primary))",
                    },
                  }}
                  className="h-[200px] xs:h-[250px] sm:h-[300px] lg:h-[400px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData?.categoryBreakdown?.filter(Boolean) || []} layout="vertical" margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tick={!isMobile ? { fontSize: 12 } : { fontSize: 10 }} />
                      <YAxis 
                        dataKey="category" 
                        type="category" 
                        width={isMobile ? 80 : 120} 
                        tick={!isMobile ? { fontSize: 12 } : { fontSize: 9 }}
                        tickFormatter={(value) => isMobile && value.length > 15 ? `${value.substring(0, 12)}...` : value}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="count" fill="var(--color-count)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>

                <div className="space-y-3">
                  {(analyticsData?.categoryBreakdown?.filter(Boolean) || []).map((category, index) => (
                    <div key={category?.category || `category-${index}`} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium text-card-foreground text-sm xs:text-base truncate">{category?.category || "Unknown"}</p>
                        <Badge className="bg-primary text-primary-foreground text-xs">{category?.count || 0} incidents</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs xs:text-sm">
                        <span className="text-muted-foreground">Avg Severity</span>
                        <span
                          className={getRiskColor(
                            (category?.severity || 0) > 8 ? "high" : (category?.severity || 0) > 6 ? "medium" : "low",
                          )}
                        >
                          {category?.severity || 0}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
