"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  Brain,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  Globe,
  MessageSquare,
  Search,
  Shield,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

interface MisinformationItem {
  id: string
  content: string
  source: string
  platform: string
  detectedAt: string
  confidenceScore: number
  severity: "critical" | "high" | "medium" | "low"
  category: string
  claimType: string
  factCheckStatus: "verified-false" | "misleading" | "unverified" | "verified-true"
  engagement: number
  reach: number
  author: string
  location: string
  relatedClaims: number
  aiAnalysis: {
    sentiment: number
    toxicity: number
    manipulation: number
    credibility: number
  }
  tags: string[]
  actions: string[]
}

export function MisinformationDetection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [misinformationItems, setMisinformationItems] = useState<MisinformationItem[]>([])
  const isMobile = useIsMobile()

  const mockMisinformationItems: MisinformationItem[] = [
    {
      id: "1",
      content:
        "BREAKING: New vaccine contains microchips for government tracking. Doctors confirm this is being hidden from the public. Share before this gets deleted!",
      source: "Twitter/X",
      platform: "twitter",
      detectedAt: "2024-01-15T10:45:00Z",
      confidenceScore: 94,
      severity: "critical",
      category: "Health Misinformation",
      claimType: "Conspiracy Theory",
      factCheckStatus: "verified-false",
      engagement: 15420,
      reach: 89000,
      author: "@healthtruth_2024",
      location: "Global",
      relatedClaims: 47,
      aiAnalysis: {
        sentiment: -0.8,
        toxicity: 0.7,
        manipulation: 0.9,
        credibility: 0.1,
      },
      tags: ["vaccine", "conspiracy", "microchip", "government"],
      actions: ["flagged", "fact-checked", "reduced-distribution"],
    },
    {
      id: "2",
      content:
        "Election machines in swing states have been compromised. Insider sources reveal vote switching algorithms. This is how they plan to steal the election!",
      source: "Telegram",
      platform: "telegram",
      detectedAt: "2024-01-15T10:30:00Z",
      confidenceScore: 87,
      severity: "critical",
      category: "Election Misinformation",
      claimType: "False Claim",
      factCheckStatus: "verified-false",
      engagement: 8930,
      reach: 45000,
      author: "Election Truth Channel",
      location: "United States",
      relatedClaims: 23,
      aiAnalysis: {
        sentiment: -0.9,
        toxicity: 0.8,
        manipulation: 0.85,
        credibility: 0.15,
      },
      tags: ["election", "voting", "fraud", "machines"],
      actions: ["flagged", "reported-to-authorities", "content-removed"],
    },
    {
      id: "3",
      content:
        "Climate change is a hoax created by scientists to get more funding. The data has been manipulated for decades. Wake up people!",
      source: "YouTube",
      platform: "youtube",
      detectedAt: "2024-01-15T10:15:00Z",
      confidenceScore: 76,
      severity: "high",
      category: "Climate Misinformation",
      claimType: "Science Denial",
      factCheckStatus: "verified-false",
      engagement: 5670,
      reach: 28000,
      author: "Climate Truth TV",
      location: "Global",
      relatedClaims: 156,
      aiAnalysis: {
        sentiment: -0.6,
        toxicity: 0.5,
        manipulation: 0.7,
        credibility: 0.2,
      },
      tags: ["climate", "science", "hoax", "funding"],
      actions: ["flagged", "demonetized", "warning-added"],
    },
    {
      id: "4",
      content:
        "New study shows that wearing masks actually increases your risk of infection by 300%. The medical establishment doesn't want you to know this.",
      source: "Facebook",
      platform: "facebook",
      detectedAt: "2024-01-15T09:45:00Z",
      confidenceScore: 82,
      severity: "high",
      category: "Health Misinformation",
      claimType: "Misleading Statistics",
      factCheckStatus: "misleading",
      engagement: 3420,
      reach: 18000,
      author: "Health Freedom Network",
      location: "North America",
      relatedClaims: 34,
      aiAnalysis: {
        sentiment: -0.7,
        toxicity: 0.4,
        manipulation: 0.8,
        credibility: 0.25,
      },
      tags: ["masks", "health", "study", "infection"],
      actions: ["fact-check-label", "reduced-distribution"],
    },
    {
      id: "5",
      content:
        "5G towers are causing cancer and the government is covering it up. Multiple studies prove this but they're being suppressed by big tech.",
      source: "Reddit",
      platform: "reddit",
      detectedAt: "2024-01-15T09:30:00Z",
      confidenceScore: 71,
      severity: "medium",
      category: "Technology Misinformation",
      claimType: "Health Scare",
      factCheckStatus: "verified-false",
      engagement: 2100,
      reach: 12000,
      author: "u/truth_seeker_5g",
      location: "Europe",
      relatedClaims: 89,
      aiAnalysis: {
        sentiment: -0.8,
        toxicity: 0.6,
        manipulation: 0.65,
        credibility: 0.18,
      },
      tags: ["5g", "cancer", "government", "coverup"],
      actions: ["flagged", "community-note-added"],
    },
  ]

  useEffect(() => {
    setMisinformationItems(mockMisinformationItems)
  }, [])

  const filteredItems = misinformationItems.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeverity = selectedSeverity === "all" || item.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || item.factCheckStatus === selectedStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const severityStats = {
    critical: misinformationItems.filter((item) => item.severity === "critical").length,
    high: misinformationItems.filter((item) => item.severity === "high").length,
    medium: misinformationItems.filter((item) => item.severity === "medium").length,
    low: misinformationItems.filter((item) => item.severity === "low").length,
  }

  const categoryStats = misinformationItems.reduce(
    (acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "verified-false":
        return "bg-red-600 text-white"
      case "misleading":
        return "bg-yellow-600 text-white"
      case "unverified":
        return "bg-gray-500 text-white"
      case "verified-true":
        return "bg-green-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified-false":
        return <XCircle className="w-4 h-4" />
      case "misleading":
        return <AlertTriangle className="w-4 h-4" />
      case "unverified":
        return <Clock className="w-4 h-4" />
      case "verified-true":
        return <CheckCircle className="w-4 h-4" />
      default:
        return <Eye className="w-4 h-4" />
    }
  }

  const formatPercentage = (value: number) => {
    return `${Math.round(Math.abs(value) * 100)}%`
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4">
      {/* Header */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 xs:w-6 xs:h-6 text-destructive" />
            Misinformation Detection
          </h1>
          <p className="text-xs xs:text-sm text-muted-foreground">AI-powered detection and analysis of false information</p>
        </div>

        <div className="flex items-center gap-2 w-full xs:w-auto">
          <Badge className="bg-destructive text-destructive-foreground text-xs xs:text-sm">{filteredItems.length} Active Cases</Badge>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Brain className="w-4 h-4 text-primary" />
            <span>AI Analysis Active</span>
          </div>
        </div>
      </div>

      {/* Severity Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 lg:gap-4">
        {Object.entries(severityStats).map(([severity, count]) => (
          <Card key={severity} className="bg-card shadow-sm">
            <CardContent className="p-3 xs:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs xs:text-sm font-medium text-card-foreground capitalize truncate" title={severity}>
                    {severity}
                  </p>
                  <p className="text-lg xs:text-2xl font-bold text-primary">{count}</p>
                </div>
                <AlertTriangle
                  className={`w-5 h-5 xs:w-6 xs:h-6 ${
                    severity === "critical"
                      ? "text-red-600"
                      : severity === "high"
                        ? "text-destructive"
                        : severity === "medium"
                          ? "text-yellow-500"
                          : "text-green-500"
                  }`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="bg-card shadow-sm">
        <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
          <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
            <Filter className="w-4 h-4 xs:w-5 xs:h-5" />
            Detection Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
          <div className="flex flex-col gap-3 xs:gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search misinformation content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 xs:h-10 text-sm tap-target"
                />
              </div>
            </div>
            <div className="overflow-auto w-full space-y-3 xs:space-y-4">
              <div className="overflow-x-auto w-full">
                <div className="min-w-[600px]">
                  <Tabs value={selectedSeverity} onValueChange={setSelectedSeverity} className="w-full">
                    <TabsList className="w-full h-9 xs:h-10">
                      <TabsTrigger value="all" className="text-xs xs:text-sm tap-target">All Severity</TabsTrigger>
                      <TabsTrigger value="critical" className="text-xs xs:text-sm tap-target">Critical</TabsTrigger>
                      <TabsTrigger value="high" className="text-xs xs:text-sm tap-target">High</TabsTrigger>
                      <TabsTrigger value="medium" className="text-xs xs:text-sm tap-target">Medium</TabsTrigger>
                      <TabsTrigger value="low" className="text-xs xs:text-sm tap-target">Low</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
              
              <div className="overflow-x-auto w-full">
                <div className="min-w-[500px]">
                  <Tabs value={selectedStatus} onValueChange={setSelectedStatus} className="w-full">
                    <TabsList className="w-full h-9 xs:h-10">
                      <TabsTrigger value="all" className="text-xs xs:text-sm tap-target">All Status</TabsTrigger>
                      <TabsTrigger value="verified-false" className="text-xs xs:text-sm tap-target">False</TabsTrigger>
                      <TabsTrigger value="misleading" className="text-xs xs:text-sm tap-target">Misleading</TabsTrigger>
                      <TabsTrigger value="unverified" className="text-xs xs:text-sm tap-target">Unverified</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Results */}
      <Card className="bg-card shadow-sm">
        <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
          <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
            <Brain className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
            AI Detection Results
            <Badge className="bg-primary text-primary-foreground text-xs">{filteredItems.length} items</Badge>
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">Advanced AI analysis of potential misinformation content</CardDescription>
        </CardHeader>
        <CardContent className="px-3 xs:px-4 py-0 xs:py-0">
          <ScrollArea className="h-[400px] xs:h-[600px] lg:h-[800px] w-full">
            <div className="space-y-3 xs:space-y-4 pr-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-3 xs:p-6 rounded-lg bg-muted/50 border border-border">
                  {/* Header */}
                  <div className="flex flex-col xs:flex-row xs:items-start justify-between gap-2 xs:gap-0 mb-3 xs:mb-4">
                    <div className="flex flex-wrap items-center gap-1 xs:gap-2">
                      <Badge className={getSeverityColor(item.severity)}>{item.severity.toUpperCase()}</Badge>
                      <Badge className={getStatusColor(item.factCheckStatus)} variant="outline">
                        {getStatusIcon(item.factCheckStatus)}
                        <span className="hidden xs:inline">{item.factCheckStatus.replace("-", " ").toUpperCase()}</span>
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.source}
                      </Badge>
                    </div>
                    <div className="text-left xs:text-right text-xs text-muted-foreground">
                      <p>Confidence: {item.confidenceScore}%</p>
                      <p>{new Date(item.detectedAt).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="mb-3 xs:mb-4">
                    <p className="text-xs xs:text-sm text-card-foreground leading-relaxed bg-background/50 p-2 xs:p-3 rounded border-l-4 border-destructive">
                      {item.content}
                    </p>
                  </div>

                  {/* AI Analysis */}
                  <div className="grid grid-cols-2 gap-2 xs:gap-4 mb-3 xs:mb-4">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Sentiment</span>
                        <span className="text-destructive">{formatPercentage(item.aiAnalysis.sentiment)}</span>
                      </div>
                      <Progress value={Math.abs(item.aiAnalysis.sentiment) * 100} className="h-1 xs:h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Toxicity</span>
                        <span className="text-yellow-500">{formatPercentage(item.aiAnalysis.toxicity)}</span>
                      </div>
                      <Progress value={item.aiAnalysis.toxicity * 100} className="h-1 xs:h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Manipulation</span>
                        <span className="text-red-500">{formatPercentage(item.aiAnalysis.manipulation)}</span>
                      </div>
                      <Progress value={item.aiAnalysis.manipulation * 100} className="h-1 xs:h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Credibility</span>
                        <span className="text-green-500">{formatPercentage(item.aiAnalysis.credibility)}</span>
                      </div>
                      <Progress value={item.aiAnalysis.credibility * 100} className="h-1 xs:h-2" />
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-2 gap-2 xs:gap-4 mb-3 xs:mb-4 text-xs text-muted-foreground">
                    <div className="space-y-1 xs:space-y-2">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <Users className="w-3 h-3" />
                        <span className="truncate">Engagement: {item.engagement.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 xs:gap-2">
                        <TrendingUp className="w-3 h-3" />
                        <span className="truncate">Reach: {item.reach.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 xs:gap-2 hidden xs:flex">
                        <Globe className="w-3 h-3" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    </div>
                    <div className="space-y-1 xs:space-y-2">
                      <div className="flex items-center gap-1 xs:gap-2">
                        <MessageSquare className="w-3 h-3" />
                        <span className="truncate" title={item.author}>{item.author}</span>
                      </div>
                      <div className="flex items-center gap-1 xs:gap-2">
                        <Shield className="w-3 h-3" />
                        <span className="truncate">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-1 xs:gap-2">
                        <AlertTriangle className="w-3 h-3" />
                        <span className="truncate">Related: {item.relatedClaims}</span>
                      </div>
                    </div>
                  </div>

                  {/* Tags and Actions */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-3 xs:pt-4 border-t border-border">
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.tags.slice(0, isMobile ? 2 : 4).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                      {item.tags.length > (isMobile ? 2 : 4) && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - (isMobile ? 2 : 4)}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1 flex-wrap">
                      {item.actions.slice(0, isMobile ? 1 : 3).map((action) => (
                        <Badge key={action} className="bg-primary text-primary-foreground text-xs">
                          {action.replace("-", " ")}
                        </Badge>
                      ))}
                      {item.actions.length > (isMobile ? 1 : 3) && (
                        <Badge className="bg-primary text-primary-foreground text-xs">
                          +{item.actions.length - (isMobile ? 1 : 3)}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 mt-3 xs:mt-4">
                    <Button size="sm" variant="outline" className="text-xs h-8 xs:h-9 tap-target">
                      <Eye className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                      <span className="truncate">View Details</span>
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-8 xs:h-9 tap-target">
                      <Shield className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                      <span className="truncate">Verify Source</span>
                    </Button>
                    <Button size="sm" variant="destructive" className="text-xs h-8 xs:h-9 tap-target">
                      <AlertTriangle className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                      <span className="truncate">Escalate</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
