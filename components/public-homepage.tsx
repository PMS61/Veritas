"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Globe,
  Eye,
  Shield,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useIsMobile } from "@/components/ui/use-mobile";
import { GettingStarted } from "@/components/getting-started";

// Mock data for public interface
const recentVerifications = [
  {
    id: 1,
    title: "Climate Data Verification Complete",
    description:
      "Temperature records from 2023 independently verified across multiple meteorological sources",
    credibility: "high",
    timestamp: "2 minutes ago",
    verified: true,
    sources: "Scientific Journals",
  },
  {
    id: 2,
    title: "Social Media Claim Fact-Checked",
    description:
      "Viral health claim cross-referenced with medical databases - partially accurate with important caveats",
    credibility: "medium",
    timestamp: "15 minutes ago",
    verified: true,
    sources: "Medical Research",
  },
  {
    id: 3,
    title: "News Article Source Verification",
    description:
      "Financial report claims verified through multiple independent sources and regulatory filings",
    credibility: "high",
    timestamp: "1 hour ago",
    verified: true,
    sources: "Financial Records",
  },
];

const verifiedSources = [
  { name: "Reuters Fact Check", status: "active", lastUpdate: "1 min ago" },
  { name: "Scientific Journals", status: "active", lastUpdate: "3 min ago" },
  { name: "Government Records", status: "active", lastUpdate: "5 min ago" },
  { name: "Medical Databases", status: "active", lastUpdate: "2 min ago" },
];

const stats = [
  { label: "Truth Analysis", value: "24/7", icon: Eye },
  { label: "Verified Sources", value: "500+", icon: CheckCircle },
  { label: "Facts Verified", value: "1.2M+", icon: Users },
  { label: "Verification Time", value: "<30s", icon: Clock },
];

export function PublicHomepage() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const isMobile = useIsMobile();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getCredibilityColor = (credibility: string) => {
    switch (credibility) {
      case "high":
        return "default";
      case "medium":
        return "secondary";
      case "low":
        return "destructive";
      default:
        return "outline";
    }
  };

  return (
    <div className="mobile-spacing-y pb-safe-bottom">
      {/* Hero Section */}
      <section className="relative py-12 xs:py-16 md:py-24 safe-area-top">
        <div className="mobile-container text-center mobile-spacing-y">
          <div className="space-y-3 xs:space-y-4 md:space-y-6">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-tight">
              Veritas
              <span className="text-primary block text-2xl xs:text-3xl sm:text-4xl md:text-5xl mt-2">
                Eye that discerns the truth
              </span>
            </h1>
            <p className="text-base xs:text-lg md:text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Veritas is an advanced AI-powered platform that analyzes
              information from multiple sources, verifies claims, and helps you
              distinguish truth from misinformation in our complex information
              landscape.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center mt-6 md:mt-10">
            <Button
              size="lg"
              className="w-full xs:w-auto tap-target h-12 text-base font-medium px-8"
              asChild
            >
              <Link href="/register">Get Started</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full xs:w-auto tap-target h-12 text-base font-medium px-8"
              asChild
            >
              <Link href="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What We Provide Section */}
      <section className="py-10 xs:py-12 md:py-16">
        <div className="mobile-container mobile-spacing-y">
          <div className="text-center space-y-3 xs:space-y-4 md:space-y-6">
            <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold">
              What Veritas Provides
            </h2>
            <p className="text-sm xs:text-base md:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our comprehensive platform offers multiple layers of truth
              verification and information analysis
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="text-center mobile-card-spacing hover:shadow-lg transition-all duration-200 touch-pan-y">
              <CardHeader className="pb-2 xs:pb-4">
                <Eye className="h-8 w-8 xs:h-10 xs:w-10 md:h-12 md:w-12 mx-auto text-primary mb-2 xs:mb-3 md:mb-4" />
                <CardTitle className="text-base xs:text-lg md:text-xl">
                  Truth Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                  24/7 monitoring of information sources to identify claims that
                  need verification and fact-checking
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center mobile-card-spacing hover:shadow-lg transition-all duration-200 touch-pan-y">
              <CardHeader className="pb-2 xs:pb-4">
                <Shield className="h-8 w-8 xs:h-10 xs:w-10 md:h-12 md:w-12 mx-auto text-primary mb-2 xs:mb-3 md:mb-4" />
                <CardTitle className="text-base xs:text-lg md:text-xl">
                  Misinformation Detection
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                  AI-powered analysis to identify patterns of misinformation and
                  assess claim credibility
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center mobile-card-spacing hover:shadow-lg transition-all duration-200 touch-pan-y">
              <CardHeader className="pb-2 xs:pb-4">
                <CheckCircle className="h-8 w-8 xs:h-10 xs:w-10 md:h-12 md:w-12 mx-auto text-primary mb-2 xs:mb-3 md:mb-4" />
                <CardTitle className="text-base xs:text-lg md:text-xl">
                  Source Verification
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                  Cross-verification against trusted databases and official
                  sources for accuracy
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center mobile-card-spacing hover:shadow-lg transition-all duration-200 touch-pan-y">
              <CardHeader className="pb-2 xs:pb-4">
                <Zap className="h-8 w-8 xs:h-10 xs:w-10 md:h-12 md:w-12 mx-auto text-primary mb-2 xs:mb-3 md:mb-4" />
                <CardTitle className="text-base xs:text-lg md:text-xl">
                  Instant Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                  Real-time analysis and instant verification results with
                  detailed explanations
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 xs:py-12 md:py-16 bg-muted/50">
        <div className="mobile-container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <Card
                key={i}
                className="text-center border-none mobile-card-spacing bg-transparent shadow-none"
              >
                <CardHeader className="pb-1 xs:pb-2">
                  <stat.icon className="h-8 w-8 md:h-10 md:w-10 mx-auto text-primary mb-1 xs:mb-2 md:mb-3" />
                  <CardTitle className="text-2xl xs:text-3xl md:text-4xl">
                    {stat.value}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-1 xs:pt-2">
                  <CardDescription className="text-xs xs:text-sm md:text-base font-medium">
                    {stat.label}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Verifications */}
      <section className="py-10 xs:py-12 md:py-16">
        <div className="mobile-container mobile-spacing-y">
          <div className="space-y-2 md:space-y-3">
            <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold">
              Recent Verifications
            </h2>
            <p className="text-sm xs:text-base md:text-lg text-muted-foreground">
              Latest truth verifications from our platform
            </p>
          </div>

          <div className="space-y-3 xs:space-y-4 md:space-y-6">
            {recentVerifications.map((verification) => (
              <Card
                key={verification.id}
                className="mobile-card-spacing hover:shadow-lg transition-all duration-200 overflow-hidden touch-pan-y"
              >
                <CardHeader className="pb-1 xs:pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base xs:text-lg md:text-xl">
                      {verification.title}
                    </CardTitle>
                    <Badge
                      variant={getCredibilityColor(verification.credibility)}
                      className="ml-2 flex-shrink-0"
                    >
                      {verification.credibility === "high"
                        ? "High Credibility"
                        : verification.credibility === "medium"
                        ? "Medium Credibility"
                        : "Low Credibility"}
                    </Badge>
                  </div>
                  <CardDescription className="text-xs xs:text-sm md:text-base flex items-center gap-1">
                    <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    {verification.timestamp}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-xs xs:text-sm md:text-base">
                    {verification.description}
                  </p>
                  <div className="flex items-center justify-between mt-4">
                    <Badge variant="outline">{verification.sources}</Badge>
                    <Button variant="outline" size="sm" asChild className="tap-target h-8">
                      <Link href="/verify">View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-4 xs:mt-6 md:mt-8">
            <Button
              variant="outline"
              size="lg"
              asChild
              className="tap-target h-10 xs:h-12"
            >
              <Link href="/updates">See All Verifications</Link>
            </Button>
          </div>
        </div>
      </section>

      <GettingStarted />

      {/* CTA */}
      <section className="py-10 xs:py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="mobile-container text-center mobile-spacing-y">
          <div className="space-y-3 xs:space-y-4 md:space-y-6">
            <h2 className="text-2xl xs:text-3xl md:text-4xl font-bold">
              Start Discovering the Truth Today
            </h2>
            <p className="text-sm xs:text-base md:text-lg text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
              Join Veritas to access advanced truth verification tools and
              protect yourself from misinformation in today's complex information
              landscape.
            </p>
          </div>

          <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 justify-center mt-6 xs:mt-8 md:mt-10">
            <Button
              size="lg"
              variant="secondary"
              className="w-full xs:w-auto tap-target h-12 text-base font-medium px-8"
              asChild
            >
              <Link href="/register">Get Started Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full xs:w-auto bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10 tap-target h-12 text-base font-medium px-8"
              asChild
            >
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
