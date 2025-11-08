"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Activity,
  Clock,
  Filter,
  Globe,
  MessageSquare,
  Play,
  Pause,
  Search,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import { useIsMobile } from "@/components/ui/use-mobile"

interface FeedItem {
  id: string
  source: string
  platform: string
  content: string
  timestamp: string
  engagement: number
  sentiment: "positive" | "negative" | "neutral"
  riskLevel: "low" | "medium" | "high"
  verified: boolean
  location?: string
  author: string
  tags: string[]
}

export function MonitoringFeeds() {
  const [isLive, setIsLive] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSource, setSelectedSource] = useState("all")
  const [feedItems, setFeedItems] = useState<FeedItem[]>([])
  const isMobile = useIsMobile()

  // Mock real-time feed data
  const mockFeedItems: FeedItem[] = [
    {
      id: "1",
      source: "Twitter/X",
      platform: "twitter",
      content:
        "Breaking: New study reveals concerning trends in vaccine misinformation spreading across social platforms. Researchers warn of coordinated disinformation campaign.",
      timestamp: "2024-01-15T10:32:00Z",
      engagement: 1247,
      sentiment: "negative",
      riskLevel: "high",
      verified: false,
      location: "Global",
      author: "@healthwatch_news",
      tags: ["vaccine", "misinformation", "health"],
    },
    {
      id: "2",
      source: "Telegram",
      platform: "telegram",
      content:
        "URGENT: Election officials confirm security measures in place. All voting systems tested and verified. Ignore false claims about system vulnerabilities.",
      timestamp: "2024-01-15T10:30:00Z",
      engagement: 892,
      sentiment: "positive",
      riskLevel: "medium",
      verified: true,
      location: "United States",
      author: "Election Security Channel",
      tags: ["election", "security", "verification"],
    },
    {
      id: "3",
      source: "News Portal",
      platform: "news",
      content:
        "Climate scientists debunk latest wave of climate denial claims circulating on social media. Peer-reviewed research contradicts viral misinformation.",
      timestamp: "2024-01-15T10:28:00Z",
      engagement: 634,
      sentiment: "neutral",
      riskLevel: "medium",
      verified: true,
      location: "Europe",
      author: "Climate News Network",
      tags: ["climate", "science", "debunk"],
    },
    {
      id: "4",
      source: "Reddit",
      platform: "reddit",
      content:
        "r/conspiracy discussing unverified claims about government surveillance. Moderators working to fact-check and remove false information.",
      timestamp: "2024-01-15T10:25:00Z",
      engagement: 445,
      sentiment: "negative",
      riskLevel: "low",
      verified: false,
      location: "Global",
      author: "u/factcheck_mod",
      tags: ["surveillance", "conspiracy", "moderation"],
    },
    {
      id: "5",
      source: "WhatsApp",
      platform: "whatsapp",
      content:
        "Forwarded message claiming false health remedies detected in multiple groups. Health authorities urge users to verify medical information.",
      timestamp: "2024-01-15T10:22:00Z",
      engagement: 267,
      sentiment: "negative",
      riskLevel: "high",
      verified: false,
      location: "Asia",
      author: "Health Ministry Alert",
      tags: ["health", "remedy", "forward"],
    },
    {
      id: "6",
      source: "YouTube",
      platform: "youtube",
      content:
        "Video spreading false information about renewable energy removed for policy violations. Creator issued warning for misinformation.",
      timestamp: "2024-01-15T10:20:00Z",
      engagement: 112,
      sentiment: "neutral",
      riskLevel: "medium",
      verified: true,
      location: "Global",
      author: "YouTube Policy Team",
      tags: ["energy", "policy", "removal"],
    },
  ]

  // Simulate real-time updates
  useEffect(() => {
    setFeedItems(mockFeedItems)

    if (isLive) {
      const interval = setInterval(() => {
        // Simulate new feed items arriving
        const newItem: FeedItem = {
          id: Date.now().toString(),
          source: ["Twitter/X", "Telegram", "News Portal", "Reddit"][Math.floor(Math.random() * 4)],
          platform: "twitter",
          content: "New monitoring alert detected. Analyzing content for potential misinformation patterns...",
          timestamp: new Date().toISOString(),
          engagement: Math.floor(Math.random() * 1000),
          sentiment: ["positive", "negative", "neutral"][Math.floor(Math.random() * 3)] as any,
          riskLevel: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as any,
          verified: Math.random() > 0.5,
          location: "Live Update",
          author: "CrisisLens Monitor",
          tags: ["live", "monitoring"],
        }

        setFeedItems((prev) => [newItem, ...prev.slice(0, 19)]) // Keep only 20 items
      }, 5000) // Update every 5 seconds

      return () => clearInterval(interval)
    }
  }, [isLive])

  const filteredItems = feedItems.filter((item) => {
    const matchesSearch =
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesSource = selectedSource === "all" || item.source === selectedSource
    return matchesSearch && matchesSource
  })

  const sourceStats = {
    "Twitter/X": feedItems.filter((item) => item.source === "Twitter/X").length,
    Telegram: feedItems.filter((item) => item.source === "Telegram").length,
    "News Portal": feedItems.filter((item) => item.source === "News Portal").length,
    Reddit: feedItems.filter((item) => item.source === "Reddit").length,
    WhatsApp: feedItems.filter((item) => item.source === "WhatsApp").length,
    YouTube: feedItems.filter((item) => item.source === "YouTube").length,
  }

  const getRiskColor = (level: string) => {
    switch (level) {
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

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-500"
      case "negative":
        return "text-destructive"
      case "neutral":
        return "text-muted-foreground"
      default:
        return "text-muted-foreground"
    }
  }

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "twitter":
        return "𝕏"
      case "telegram":
        return "✈"
      case "news":
        return "📰"
      case "reddit":
        return "🔴"
      case "whatsapp":
        return "💬"
      case "youtube":
        return "▶"
      default:
        return "🌐"
    }
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4 flex flex-col min-h-0 flex-1">
      {/* Header Controls */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between py-6 sm:py-8 md:py-10">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-foreground flex items-center gap-2">
            <Activity className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            Live Monitoring Feeds
          </h1>
          <p className="text-xs xs:text-sm text-muted-foreground">Real-time crisis monitoring across all input sources</p>
        </div>

        <div className="flex items-center gap-2 w-full xs:w-auto">
          <Button
            variant={isLive ? "default" : "outline"}
            size="sm"
            onClick={() => setIsLive(!isLive)}
            className="flex items-center gap-2 w-full xs:w-auto h-9 xs:h-10 tap-target"
          >
            {isLive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span className="xs:inline">{isLive ? "Pause" : "Resume"}</span>
            <span className="hidden xs:inline"> Live Feed</span>
          </Button>
          <div className="hidden xs:flex items-center gap-2 text-xs xs:text-sm text-muted-foreground">
            <Zap className="w-4 h-4 text-primary" />
            <span>{isLive ? "Live" : "Paused"}</span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 xs:gap-3 lg:gap-4">
        {Object.entries(sourceStats).map(([source, count]) => (
          <Card key={source} className="bg-card shadow-sm">
            <CardContent className="p-3 xs:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs xs:text-sm font-medium text-card-foreground truncate" title={source}>
                    {isMobile && source.length > 8 ? `${source.substring(0, 8)}...` : source}
                  </p>
                  <p className="text-lg xs:text-2xl font-bold text-primary">{count}</p>
                </div>
                <div className="text-xl xs:text-2xl">{getPlatformIcon(source.toLowerCase())}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-card shadow-sm">
        <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
          <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
            <Filter className="w-4 h-4 xs:w-5 xs:h-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 xs:px-4 pt-0 pb-3 xs:pb-4">
          <div className="flex flex-col gap-3 xs:gap-4">
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search feeds, content, or tags..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-9 xs:h-10 text-sm tap-target"
                />
              </div>
            </div>
            <div className="overflow-x-auto w-full">
              <Tabs value={selectedSource} onValueChange={setSelectedSource} className="w-full flex-1 min-h-0">
                <TabsList className="grid w-full grid-cols-7 ">
                  <TabsTrigger value="all" className="text-xs xs:text-sm tap-target">All</TabsTrigger>
                  <TabsTrigger value="Twitter/X" className="text-xs xs:text-sm tap-target">Twitter</TabsTrigger>
                  <TabsTrigger value="Telegram" className="text-xs xs:text-sm tap-target">Telegram</TabsTrigger>
                  <TabsTrigger value="News Portal" className="text-xs xs:text-sm tap-target">News</TabsTrigger>
                  <TabsTrigger value="Reddit" className="text-xs xs:text-sm tap-target">Reddit</TabsTrigger>
                  <TabsTrigger value="WhatsApp" className="text-xs xs:text-sm tap-target">WhatsApp</TabsTrigger>
                  <TabsTrigger value="YouTube" className="text-xs xs:text-sm tap-target">YouTube</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Live Feed */}
      <Card className="bg-card shadow-sm">
        <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
          <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
            <Globe className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
            Live Feed Stream
            <Badge className="bg-primary text-primary-foreground text-xs">{filteredItems.length} items</Badge>
          </CardTitle>
          <CardDescription className="text-xs xs:text-sm">Real-time monitoring data from all connected sources</CardDescription>
        </CardHeader>
        <CardContent className="px-3 xs:px-4 py-0 xs:py-0">
          <ScrollArea className="h-[400px] xs:h-[500px] lg:h-[600px] w-full">
            <div className="space-y-3 xs:space-y-4 pr-2">
              {filteredItems.map((item) => (
                <div key={item.id} className="p-3 xs:p-4 rounded-lg bg-muted/50 border border-border">
                  <div className="flex items-start gap-2 xs:gap-3">
                    <div className="text-xl xs:text-2xl">{getPlatformIcon(item.platform)}</div>
                    <div className="flex-1 min-w-0 space-y-2">
                      {/* Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-1 xs:gap-2">
                          <Badge variant="outline" className="text-xs truncate max-w-[100px]">
                            {item.source}
                          </Badge>
                          <Badge className={`text-xs ${getRiskColor(item.riskLevel)}`}>{item.riskLevel} risk</Badge>
                          {item.verified && <Badge className="bg-green-500 text-white text-xs">Verified</Badge>}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                          <Clock className="w-3 h-3" />
                          {new Date(item.timestamp).toLocaleTimeString()}
                        </div>
                      </div>

                      {/* Content */}
                      <p className="text-xs xs:text-sm text-card-foreground leading-relaxed break-words">{item.content}</p>

                      {/* Metadata */}
                      <div className="flex flex-wrap items-center justify-between gap-1 xs:gap-2 pt-2 border-t border-border">
                        <div className="flex flex-wrap items-center gap-2 xs:gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {item.engagement.toLocaleString()}
                          </span>
                          <span className={`flex items-center gap-1 ${getSentimentColor(item.sentiment)}`}>
                            <TrendingUp className="w-3 h-3" />
                            {item.sentiment}
                          </span>
                          {item.location && (
                            <span className="flex items-center gap-1 hidden xs:flex">
                              <Globe className="w-3 h-3" />
                              {item.location}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-1 xs:mt-0">
                          {item.tags.slice(0, isMobile ? 2 : 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {item.tags.length > (isMobile ? 2 : 3) && (
                            <Badge variant="secondary" className="text-xs">
                              +{item.tags.length - (isMobile ? 2 : 3)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Author */}
                      <div className="text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          <span className="truncate max-w-[200px]" title={item.author}>
                            {item.author}
                          </span>
                        </span>
                      </div>
                    </div>
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
