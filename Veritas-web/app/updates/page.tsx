"use client";

import { useState } from "react";
import { PublicLayout } from "@/components/public-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Bell,
  Share2,
  ExternalLink,
  Calendar,
  Eye,
  Shield,
  XCircle,
} from "lucide-react";

const verificationUpdates = [
  {
    id: 1,
    title: "Health Misinformation Campaign Debunked",
    description:
      "Large-scale misinformation about vaccine side effects successfully fact-checked and countered",
    credibility: "verified",
    category: "Health",
    timestamp: "2 minutes ago",
    source: "WHO Medical Review Board",
    verified: true,
    type: "fact-check",
    details:
      "Comprehensive analysis of social media claims reveals coordinated misinformation campaign. Medical experts confirm safety data remains consistent with clinical trials.",
    reach: "2.3M users",
    accuracy: 98,
  },
  {
    id: 2,
    title: "Climate Data Verification Complete",
    description:
      "Latest climate change statistics cross-verified against multiple scientific sources",
    credibility: "verified",
    category: "Environment",
    timestamp: "15 minutes ago",
    source: "IPCC Scientific Committee",
    verified: true,
    type: "verification",
    details:
      "Temperature data from 2024 independently verified across NASA, NOAA, and European climate agencies. Consistent warming trends confirmed.",
    reach: "850K users",
    accuracy: 96,
  },
  {
    id: 3,
    title: "Political Claim Analysis Published",
    description:
      "Recent political statements fact-checked against official government records",
    credibility: "mixed",
    category: "Politics",
    timestamp: "1 hour ago",
    source: "Independent Fact-Check Consortium",
    verified: true,
    type: "fact-check",
    details:
      "Claims about government spending partially accurate but lack important context. Full analysis includes supporting documentation.",
    reach: "1.1M users",
    accuracy: 73,
  },
  {
    id: 4,
    title: "Technology Hoax Identified",
    description:
      "False claims about new AI breakthrough spreading on social platforms",
    credibility: "false",
    category: "Technology",
    timestamp: "2 hours ago",
    source: "Tech Research Institute",
    verified: true,
    type: "debunk",
    details:
      "Claims about revolutionary AI breakthrough lack peer review and contradict established scientific principles. No evidence found in academic databases.",
    reach: "450K users",
    accuracy: 94,
  },
];

const trendingTopics = [
  {
    id: 1,
    topic: "Vaccine Safety Studies",
    verificationStatus: "high-confidence",
    mentions: 15420,
    trend: "stable",
    summary:
      "Latest peer-reviewed studies confirm established safety profiles across all approved vaccines.",
  },
  {
    id: 2,
    topic: "Election Integrity Claims",
    verificationStatus: "mixed-evidence",
    mentions: 8750,
    trend: "increasing",
    summary:
      "Various claims require case-by-case analysis. Some verified, others lack supporting evidence.",
  },
  {
    id: 3,
    topic: "Climate Change Data",
    verificationStatus: "high-confidence",
    mentions: 12100,
    trend: "stable",
    summary:
      "Scientific consensus remains strong with consistent data across multiple independent sources.",
  },
];

export default function UpdatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCredibility, setSelectedCredibility] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const getCredibilityBadge = (credibility: string) => {
    const colors = {
      verified:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      mixed:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      false: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[credibility as keyof typeof colors] || colors.mixed;
  };

  const getCredibilityIcon = (credibility: string) => {
    switch (credibility) {
      case "verified":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "mixed":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "false":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fact-check":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "verification":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "debunk":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredUpdates = verificationUpdates.filter((update) => {
    const matchesSearch =
      update.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      update.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCredibility =
      selectedCredibility === "all" ||
      update.credibility === selectedCredibility;
    const matchesCategory =
      selectedCategory === "all" || update.category === selectedCategory;
    return matchesSearch && matchesCredibility && matchesCategory;
  });

  return (
    <PublicLayout>
      <div className="mobile-container mobile-spacing-y safe-area-top flex flex-col min-h-0 flex-1">
        {/* Header */}
        <div className="text-center space-y-4 md:space-y-6 py-8 md:py-10">
          <div className="flex items-center justify-center gap-3 md:gap-4 mb-4 md:mb-6">
            <Eye className="w-10 h-10 md:w-12 md:h-12 text-primary flex-shrink-0" />
            <div>
              <h1 className="text-3xl xs:text-4xl md:text-5xl font-bold leading-tight">
                Truth Verifications
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Veritas - Eye that discerns the truth
              </p>
            </div>
          </div>
          <p className="text-base md:text-lg text-muted-foreground max-w-4xl mx-auto leading-relaxed">
            Stay informed with the latest fact-checks, truth verifications, and
            misinformation analysis. Our platform continuously analyzes claims
            and provides verified, evidence-based conclusions.
          </p>
        </div>

        {/* Alert Banner */}
        <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950 mobile-card-spacing">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start md:items-center gap-3 md:gap-4">
              <Shield className="w-5 h-5 md:w-6 md:h-6 text-blue-600 shrink-0 mt-0.5 md:mt-0" />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-base md:text-lg text-blue-800 dark:text-blue-200">
                  Active Truth Verification
                </p>
                <p className="text-sm md:text-base text-blue-700 dark:text-blue-300 mt-2 leading-relaxed">
                  Our AI systems continuously monitor and verify claims. All
                  updates below are fact-checked.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="shrink-0 text-sm md:text-base h-10 md:h-11 tap-target font-medium"
              >
                <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                <span className="hidden sm:inline">Get </span>Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="verifications" className="mobile-spacing-y flex-1 min-h-0">
          <TabsList className="grid w-full grid-cols-2 h-12 md:h-14">
            <TabsTrigger
              value="verifications"
              className="text-sm md:text-base font-medium tap-target"
            >
              Latest Verifications
            </TabsTrigger>
            <TabsTrigger
              value="trending"
              className="text-sm md:text-base font-medium tap-target"
            >
              Trending Topics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="verifications" className="mobile-spacing-y">
            {/* Filters */}
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 md:w-5 md:h-5" />
                <Input
                  placeholder="Search fact-checks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 md:h-14 text-base rounded-xl touch-pan-x"
                />
              </div>
              <div className="flex flex-col xs:flex-row gap-3 md:gap-4">
                <Select
                  value={selectedCredibility}
                  onValueChange={setSelectedCredibility}
                >
                  <SelectTrigger className="w-full xs:w-56 h-12 md:h-14 text-base rounded-xl tap-target">
                    <SelectValue placeholder="All Results" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Results</SelectItem>
                    <SelectItem value="verified">Verified True</SelectItem>
                    <SelectItem value="mixed">Mixed/Partial</SelectItem>
                    <SelectItem value="false">Debunked/False</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="w-full xs:w-56 h-12 md:h-14 text-base rounded-xl tap-target">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Health">Health</SelectItem>
                    <SelectItem value="Politics">Politics</SelectItem>
                    <SelectItem value="Environment">Environment</SelectItem>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Economy">Economy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Verifications List */}
            <div className="space-y-4 md:space-y-6">
              {filteredUpdates.map((update) => (
                <Card
                  key={update.id}
                  className="hover:shadow-lg transition-all duration-200 mobile-card-spacing touch-pan-y rounded-xl"
                >
                  <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                    <div className="flex items-start justify-between gap-3 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 md:gap-3 mb-3 flex-wrap">
                          {getCredibilityIcon(update.credibility)}
                          <Badge
                            className={`${getCredibilityBadge(update.credibility)} text-sm font-medium`}
                          >
                            {update.credibility === "verified"
                              ? "Verified"
                              : update.credibility === "mixed"
                                ? "Mixed"
                                : "Debunked"}
                          </Badge>
                          <div className="flex items-center gap-2">
                            {getTypeIcon(update.type)}
                            <Badge variant="outline" className="text-sm">
                              {update.type}
                            </Badge>
                          </div>
                          {update.verified && (
                            <Badge
                              variant="outline"
                              className="text-green-600 border-green-600 text-sm hidden sm:inline-flex"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Expert
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-lg md:text-xl leading-tight mb-2">
                          {update.title}
                        </CardTitle>
                        <CardDescription className="text-base md:text-lg leading-relaxed">
                          {update.description}
                        </CardDescription>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl md:text-3xl font-bold text-primary">
                          {update.accuracy}%
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Accuracy
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 md:gap-4 text-sm md:text-base text-muted-foreground flex-wrap">
                      <Badge variant="secondary" className="text-sm">
                        {update.category}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="hidden sm:inline">
                          {update.timestamp}
                        </span>
                        <span className="sm:hidden">
                          {update.timestamp.split(" ")[0]}
                        </span>
                      </div>
                      <div className="hidden md:flex items-center gap-1">
                        <span>Reach: {update.reach}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 md:px-6">
                    <p className="text-base md:text-lg text-muted-foreground mb-4 md:mb-5 leading-relaxed">
                      {update.details}
                    </p>
                    <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-4">
                      <div className="text-sm md:text-base text-muted-foreground order-2 xs:order-1">
                        <span className="font-medium">Source:</span>{" "}
                        <span className="truncate">{update.source}</span>
                        <div className="md:hidden mt-1 text-sm">
                          Reach: {update.reach}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 order-1 xs:order-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 xs:flex-none text-sm h-11 tap-target font-medium rounded-xl"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 xs:flex-none text-sm h-11 tap-target font-medium rounded-xl"
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          <span className="hidden sm:inline">Full </span>
                          Analysis
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mobile-spacing-y">
            <div className="mb-6 md:mb-8">
              <h3 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3">
                Trending Verification Topics
              </h3>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                Most discussed topics under verification analysis
              </p>
            </div>

            <div className="space-y-4 md:space-y-6">
              {trendingTopics.map((topic) => (
                <Card
                  key={topic.id}
                  className="hover:shadow-lg transition-all duration-200 mobile-card-spacing touch-pan-y rounded-xl"
                >
                  <CardHeader className="pb-3 md:pb-4 px-4 md:px-6">
                    <div className="flex items-start justify-between gap-2 md:gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 md:gap-2 mb-2 flex-wrap">
                          <Badge
                            className={`${getCredibilityBadge(
                              topic.verificationStatus === "high-confidence"
                                ? "verified"
                                : topic.verificationStatus === "mixed-evidence"
                                  ? "mixed"
                                  : "false",
                            )} text-xs`}
                          >
                            {topic.verificationStatus === "high-confidence"
                              ? "High"
                              : topic.verificationStatus === "mixed-evidence"
                                ? "Mixed"
                                : "Low"}
                          </Badge>
                          <Badge
                            variant={
                              topic.trend === "increasing"
                                ? "destructive"
                                : "secondary"
                            }
                            className="text-xs"
                          >
                            {topic.trend === "increasing"
                              ? "↗ Trending"
                              : "→ Stable"}
                          </Badge>
                        </div>
                        <CardTitle className="text-base md:text-xl leading-tight">
                          {topic.topic}
                        </CardTitle>
                        <CardDescription className="text-sm md:text-base mt-1 md:mt-2">
                          {topic.summary}
                        </CardDescription>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-lg md:text-2xl font-bold text-primary">
                          {(topic.mentions / 1000).toFixed(1)}K
                        </div>
                        <div className="text-xs text-muted-foreground">
                          mentions
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-3 md:px-6">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none text-xs md:text-sm h-8 md:h-9"
                      >
                        <Eye className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        View Analysis
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 sm:flex-none text-xs md:text-sm h-8 md:h-9"
                      >
                        <Bell className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                        Track Topic
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-primary/5 border-primary/20 mobile-card-spacing rounded-xl">
          <CardContent className="p-6 md:p-8 text-center">
            <Eye className="w-12 h-12 md:w-16 md:h-16 text-primary mx-auto mb-4 md:mb-6" />
            <h3 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">
              Submit a Claim for Verification
            </h3>
            <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed">
              Found questionable information? Submit it to our verification team
              for fact-checking analysis.
            </p>
            <Button
              size="lg"
              className="w-full xs:w-auto h-12 text-base font-medium tap-target px-8 rounded-xl"
            >
              Submit for Verification
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
