"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/public-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Upload,
  LinkIcon,
  Shield,
  Clock,
  Users,
  TrendingUp,
} from "lucide-react"

const verificationResults = [
  {
    id: 1,
    claim: "Emergency shelters are at full capacity",
    status: "verified",
    confidence: 95,
    sources: 3,
    lastChecked: "5 minutes ago",
    details: "Confirmed by Red Cross and Emergency Management Agency. Alternative arrangements being made.",
  },
  {
    id: 2,
    claim: "Main highway completely blocked",
    status: "partially-true",
    confidence: 78,
    sources: 2,
    lastChecked: "15 minutes ago",
    details: "One lane remains open for emergency vehicles. Full closure expected within 2 hours.",
  },
  {
    id: 3,
    claim: "Water contamination in downtown area",
    status: "false",
    confidence: 92,
    sources: 4,
    lastChecked: "1 hour ago",
    details:
      "Water quality tests show no contamination. Rumor appears to have originated from unverified social media post.",
  },
]

const trendingClaims = [
  { claim: "Government response inadequate", mentions: 1247, trend: "up" },
  { claim: "Volunteer coordination issues", mentions: 892, trend: "up" },
  { claim: "Supply shortages at shelters", mentions: 634, trend: "down" },
  { claim: "Communication system failures", mentions: 523, trend: "stable" },
]

export default function VerifyPage() {
  const [verificationInput, setVerificationInput] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)

  const handleVerification = async () => {
    if (!verificationInput.trim()) return

    setIsVerifying(true)

    // Simulate verification process
    setTimeout(() => {
      setVerificationResult({
        claim: verificationInput,
        status: "verified",
        confidence: 87,
        sources: 2,
        details: "This claim has been cross-referenced with official sources and appears to be accurate.",
        recommendations: [
          "Check official government websites for updates",
          "Follow verified news sources",
          "Be cautious of unverified social media posts",
        ],
      })
      setIsVerifying(false)
    }, 2000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "false":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "partially-true":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      false: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      "partially-true": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    }
    return colors[status as keyof typeof colors] || colors["partially-true"]
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "down":
        return <TrendingUp className="w-4 h-4 text-green-500 rotate-180" />
      default:
        return <div className="w-4 h-4 bg-gray-400 rounded-full" />
    }
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Verify Information</h1>
              <p className="text-xl text-muted-foreground">
                Check the accuracy of crisis-related information with our verification system
              </p>
            </div>
          </div>
        </div>

        <Tabs defaultValue="verify" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="verify">Verify Claim</TabsTrigger>
            <TabsTrigger value="recent">Recent Checks</TabsTrigger>
            <TabsTrigger value="trending">Trending Claims</TabsTrigger>
          </TabsList>

          <TabsContent value="verify" className="space-y-6">
            {/* Verification Input */}
            <Card>
              <CardHeader>
                <CardTitle>Submit Information for Verification</CardTitle>
                <CardDescription>
                  Enter a claim, statement, or piece of information you'd like us to verify against trusted sources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Textarea
                    placeholder="Enter the information you want to verify... (e.g., 'Emergency shelters are at full capacity')"
                    value={verificationInput}
                    onChange={(e) => setVerificationInput(e.target.value)}
                    rows={4}
                  />
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                  <Button onClick={handleVerification} disabled={isVerifying || !verificationInput.trim()}>
                    {isVerifying ? (
                      <>
                        <Clock className="w-4 h-4 mr-2 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 mr-2" />
                        Verify Information
                      </>
                    )}
                  </Button>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Upload </span>Image
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                      <LinkIcon className="w-4 h-4 mr-1 sm:mr-2" />
                      <span className="hidden xs:inline">Add </span>URL
                    </Button>
                  </div>
                </div>

                {verificationResult && (
                  <Alert className="mt-4">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(verificationResult.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getStatusBadge(verificationResult.status)}>
                            {verificationResult.status.replace("-", " ")}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {verificationResult.confidence}% confidence
                          </span>
                        </div>
                        <AlertDescription className="text-base">
                          <strong>Claim:</strong> "{verificationResult.claim}"
                        </AlertDescription>
                        <AlertDescription className="mt-2">{verificationResult.details}</AlertDescription>
                        {verificationResult.recommendations && (
                          <div className="mt-3">
                            <p className="font-medium text-sm">Recommendations:</p>
                            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                              {verificationResult.recommendations.map((rec: string, idx: number) => (
                                <li key={idx}>{rec}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* How It Works */}
            <Card>
              <CardHeader>
                <CardTitle>How Verification Works</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Search className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Cross-Reference</h3>
                    <p className="text-sm text-muted-foreground">
                      We check your claim against multiple trusted sources including government agencies and verified
                      news outlets.
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <Shield className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">AI Analysis</h3>
                    <p className="text-sm text-muted-foreground">
                      Our AI system analyzes the information for consistency, source credibility, and potential
                      misinformation patterns.
                    </p>
                  </div>
                  <div className="text-center space-y-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                      <CheckCircle className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold">Confidence Score</h3>
                    <p className="text-sm text-muted-foreground">
                      You receive a confidence score and detailed explanation of our findings with source references.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-4">
            {verificationResults.map((result) => (
              <Card key={result.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getStatusIcon(result.status)}
                        <Badge className={getStatusBadge(result.status)}>{result.status.replace("-", " ")}</Badge>
                        <span className="text-sm text-muted-foreground">{result.confidence}% confidence</span>
                      </div>
                      <CardTitle className="text-lg">"{result.claim}"</CardTitle>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {result.sources} sources
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {result.lastChecked}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{result.details}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trending Claims</CardTitle>
                <CardDescription>
                  Most frequently submitted claims for verification in the past 24 hours
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trendingClaims.map((claim, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{claim.claim}</p>
                        <p className="text-sm text-muted-foreground">{claim.mentions.toLocaleString()} mentions</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(claim.trend)}
                        <Button variant="outline" size="sm">
                          <Search className="w-4 h-4 mr-2" />
                          Verify
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PublicLayout>
  )
}
