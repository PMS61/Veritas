"use client"

import type React from "react"

import { useState } from "react"
import { PublicLayout } from "@/components/public-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Upload, Send, CheckCircle, Shield, Eye } from "lucide-react"

export default function ReportPage() {
  const [formData, setFormData] = useState({
    type: "",
    source: "",
    url: "",
    description: "",
    impact: "",
    evidence: "",
    anonymous: false,
    contact: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitted(true)
      setIsSubmitting(false)
    }, 2000)
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-16">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Report Submitted!</h2>
              <p className="text-muted-foreground mb-6">
                Thank you for helping us combat misinformation. Your report has been received and will be reviewed by
                our team.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  <strong>Reference ID:</strong> CR-{Math.random().toString(36).substr(2, 9).toUpperCase()}
                </p>
                <Button onClick={() => setIsSubmitted(false)}>Submit Another Report</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    )
  }

  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Report Misinformation</h1>
              <p className="text-xl text-muted-foreground">Help us identify and combat false information</p>
            </div>
          </div>
        </div>

        {/* Alert */}
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Your reports help us maintain the integrity of crisis information. All submissions are reviewed by our
            verification team and contribute to our misinformation detection systems.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Guidelines */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Reporting Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm">
                  <div>
                    <h4 className="font-medium">What to Report:</h4>
                    <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                      <li>False crisis information</li>
                      <li>Misleading emergency updates</li>
                      <li>Fake official statements</li>
                      <li>Manipulated images/videos</li>
                      <li>Conspiracy theories</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium">Include if Possible:</h4>
                    <ul className="list-disc list-inside text-muted-foreground mt-1 space-y-1">
                      <li>Source URL or screenshot</li>
                      <li>Date and time observed</li>
                      <li>Platform where found</li>
                      <li>Evidence of falseness</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Privacy & Security</CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground space-y-2">
                <p>• Reports can be submitted anonymously</p>
                <p>• All data is encrypted and secure</p>
                <p>• We never share reporter information</p>
                <p>• Reports are reviewed within 24 hours</p>
              </CardContent>
            </Card>
          </div>

          {/* Report Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Submit Misinformation Report</CardTitle>
                <CardDescription>Provide as much detail as possible to help our verification team</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type of Misinformation *</Label>
                    <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the type of false information" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="false-emergency">False Emergency Alert</SelectItem>
                        <SelectItem value="fake-news">Fake News Article</SelectItem>
                        <SelectItem value="manipulated-media">Manipulated Image/Video</SelectItem>
                        <SelectItem value="false-official">False Official Statement</SelectItem>
                        <SelectItem value="conspiracy">Conspiracy Theory</SelectItem>
                        <SelectItem value="health-misinfo">Health Misinformation</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="source">Source Platform</Label>
                      <Select value={formData.source} onValueChange={(value) => handleInputChange("source", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Where did you find this?" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="twitter">Twitter/X</SelectItem>
                          <SelectItem value="facebook">Facebook</SelectItem>
                          <SelectItem value="instagram">Instagram</SelectItem>
                          <SelectItem value="telegram">Telegram</SelectItem>
                          <SelectItem value="whatsapp">WhatsApp</SelectItem>
                          <SelectItem value="news-site">News Website</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="url">Source URL (if available)</Label>
                      <Input
                        id="url"
                        value={formData.url}
                        onChange={(e) => handleInputChange("url", e.target.value)}
                        placeholder="https://example.com/post"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description of Misinformation *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe the false information in detail..."
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="impact">Potential Impact</Label>
                    <Select value={formData.impact} onValueChange={(value) => handleInputChange("impact", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="How serious is this misinformation?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Minor confusion</SelectItem>
                        <SelectItem value="medium">Medium - Could mislead people</SelectItem>
                        <SelectItem value="high">High - Could cause harm</SelectItem>
                        <SelectItem value="critical">Critical - Immediate danger</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="evidence">Evidence or Proof (optional)</Label>
                    <Textarea
                      id="evidence"
                      value={formData.evidence}
                      onChange={(e) => handleInputChange("evidence", e.target.value)}
                      placeholder="Provide links to credible sources that contradict this information..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="anonymous"
                        checked={formData.anonymous}
                        onCheckedChange={(checked) => handleInputChange("anonymous", checked as boolean)}
                      />
                      <Label htmlFor="anonymous" className="text-sm">
                        Submit this report anonymously
                      </Label>
                    </div>

                    {!formData.anonymous && (
                      <div className="space-y-2">
                        <Label htmlFor="contact">Contact Information (optional)</Label>
                        <Input
                          id="contact"
                          value={formData.contact}
                          onChange={(e) => handleInputChange("contact", e.target.value)}
                          placeholder="Email or phone number for follow-up"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button type="submit" className="flex-1" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2 animate-spin" />
                          Submitting Report...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Submit Report
                        </>
                      )}
                    </Button>
                    <Button type="button" variant="outline">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Evidence
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Additional Information */}
        <Card>
          <CardHeader>
            <CardTitle>What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Review</h3>
                <p className="text-sm text-muted-foreground">
                  Our verification team reviews your report within 24 hours
                </p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Verify</h3>
                <p className="text-sm text-muted-foreground">We cross-reference the information with trusted sources</p>
              </div>
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold">Action</h3>
                <p className="text-sm text-muted-foreground">
                  Confirmed misinformation is flagged and added to our database
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
