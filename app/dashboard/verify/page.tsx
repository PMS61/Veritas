"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Plus,
  Filter,
} from "lucide-react"
import { createClaim, getClaims } from "@/actions/claims"
import { useAuth } from "@/components/auth-provider"

export default function VerifyPage() {
  const { user } = useAuth()
  const [verificationInput, setVerificationInput] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any>(null)
  const [recentClaims, setRecentClaims] = useState<any[]>([])
  const [isLoadingClaims, setIsLoadingClaims] = useState(true)
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    claim_type: ''
  })

  // Load recent claims
  useEffect(() => {
    const loadClaims = async () => {
      try {
        const result = await getClaims({}, 1, 10)

        if (result.data) {
          setRecentClaims(result.data)
        }
      } catch (error) {
        console.error('Failed to load claims:', error)
      } finally {
        setIsLoadingClaims(false)
      }
    }

    loadClaims()
  }, [])

  const handleVerification = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault()

    if (!verificationInput.trim()) return

    setIsVerifying(true)

    try {
      const formData = new FormData()
      formData.append('claim', verificationInput)
      formData.append('claim_type', 'verification')
      formData.append('source', 'User submission')
      formData.append('tags', JSON.stringify([]))
      formData.append('evidence', JSON.stringify([]))

      const result = await createClaim(formData, user?.id)

      if (result.success) {
        setVerificationResult({
          claim: verificationInput,
          status: "pending",
          confidence: 0,
          sources: 0,
          details: "Your claim has been submitted for verification. Our team will analyze it against trusted sources and provide a detailed assessment.",
          claimId: result.data.id,
          recommendations: [
            "You'll receive updates as we process your claim",
            "Check back later for verification results",
            "Provide additional evidence if available",
          ],
        });

        // Refresh recent claims
        const claimsResult = await getClaims({}, 1, 5)
        if (claimsResult.data) {
          setRecentClaims(claimsResult.data)
        }

        // Clear input
        setVerificationInput('')
      } else {
        setVerificationResult({
          claim: verificationInput,
          status: "error",
          confidence: 0,
          sources: 0,
          details: result.error || "Failed to submit claim for verification. Please try again.",
          recommendations: [],
        });
      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerificationResult({
        claim: verificationInput,
        status: "error",
        confidence: 0,
        sources: 0,
        details: "An unexpected error occurred while submitting your claim. Please try again.",
        recommendations: [],
      });
    } finally {
      setIsVerifying(false);
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "debunked":
      case "misleading":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "unverified":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "pending":
        return <Clock className="w-5 h-5 text-gray-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    const colors = {
      verified: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      debunked: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      misleading: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      unverified: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      pending: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    }
    return colors[status as keyof typeof colors] || colors["pending"]
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    } else {
      return 'Just now'
    }
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
    <DashboardLayout>
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
              <form onSubmit={handleVerification}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="claim">Claim Information</Label>
                    <Textarea
                      id="claim"
                      name="claim"
                      placeholder="Enter the information you want to verify... (e.g., 'Emergency shelters are at full capacity')"
                      value={verificationInput}
                      onChange={(e) => setVerificationInput(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category (Optional)</Label>
                      <Input
                        id="category"
                        name="category"
                        placeholder="e.g., Health, Safety, Infrastructure"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="source">Source (Optional)</Label>
                      <Input
                        id="source"
                        name="source"
                        placeholder="e.g., Social Media, News Report"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Source URL (Optional)</Label>
                    <Input
                      id="url"
                      name="url"
                      type="url"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                    <Button type="submit" disabled={isVerifying || !verificationInput.trim()}>
                      {isVerifying ? (
                        <>
                          <Clock className="w-4 h-4 mr-2 animate-spin" />
                          Submitting for Verification...
                        </>
                      ) : (
                        <>
                          <Search className="w-4 h-4 mr-2" />
                          Submit for Verification
                        </>
                      )}
                    </Button>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <Button type="button" variant="outline" size="sm" className="flex-1 sm:flex-none">
                        <Upload className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Upload </span>Image
                      </Button>
                      <Button type="button" variant="outline" size="sm" className="flex-1 sm:flex-none">
                        <LinkIcon className="w-4 h-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Add </span>URL
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </form>
            </Card>

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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Recent Verification Submissions</h3>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="debunked">Debunked</SelectItem>
                    <SelectItem value="misleading">Misleading</SelectItem>
                    <SelectItem value="unverified">Unverified</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isLoadingClaims ? (
              <div className="text-center py-8">
                <Clock className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                <p className="text-muted-foreground">Loading recent claims...</p>
              </div>
            ) : recentClaims.length > 0 ? (
              recentClaims.map((claim) => (
                <Card key={claim.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getStatusIcon(claim.status)}
                          <Badge className={getStatusBadge(claim.status)}>{claim.status.replace("-", " ")}</Badge>
                          {claim.confidence_score && (
                            <span className="text-sm text-muted-foreground">{claim.confidence_score}% confidence</span>
                          )}
                        </div>
                        <CardTitle className="text-lg">"{claim.claim}"</CardTitle>
                        {claim.category && (
                          <Badge variant="outline" className="mt-1 w-fit">
                            {claim.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {claim.submitted_by_profile?.full_name || 'Anonymous'}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {formatDate(claim.created_at)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {claim.fact_check_details && (
                      <p className="text-muted-foreground mb-2">{claim.fact_check_details}</p>
                    )}
                    {claim.ai_verdict && (
                      <p className="text-sm italic text-muted-foreground">
                        <strong>AI Analysis:</strong> {claim.ai_verdict}
                      </p>
                    )}
                    {claim.tags && claim.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {claim.tags.map((tag: string, idx: number) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">No Recent Claims</h3>
                  <p className="text-muted-foreground">
                    No claims have been submitted for verification recently. Be the first to submit a claim!
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="trending" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Trending Topics</CardTitle>
                <CardDescription>
                  Most frequently verified claims and emerging topics this week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <TrendingUp className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Trending Analytics Coming Soon</h3>
                  <p className="text-muted-foreground">
                    Advanced analytics and trending topic analysis will be available once more data is collected.
                  </p>
                  <Button variant="outline" className="mt-4">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit More Claims to See Trends
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
