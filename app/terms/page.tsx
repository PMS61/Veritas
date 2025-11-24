import { PublicLayout } from "@/components/public-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Scale, Shield, AlertTriangle, Users, Mail } from "lucide-react"

export default function TermsPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Scale className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Terms of Service</h1>
              <p className="text-xl text-muted-foreground">Terms and conditions for using Veritas</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">Last updated: January 2025</p>
        </div>

        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              By accessing and using Veritas ("the Service"), you agree to be bound by these Terms of Service
              ("Terms"). If you do not agree to these Terms, please do not use our Service. Veritas is a crisis
              monitoring and information verification platform designed to provide accurate, real-time information
              during emergency situations.
            </p>
          </CardContent>
        </Card>

        {/* Service Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Service Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">What We Provide</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Real-time crisis monitoring and information aggregation</li>
                <li>AI-powered information verification services</li>
                <li>Crisis updates from verified sources</li>
                <li>Misinformation detection and reporting tools</li>
                <li>Analytics and reporting for authorized users</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Service Availability</h3>
              <p className="text-muted-foreground">
                We strive to maintain 99.9% uptime, but cannot guarantee uninterrupted service. During maintenance or
                technical issues, some features may be temporarily unavailable.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              User Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Acceptable Use</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Use the Service only for lawful purposes</li>
                <li>Provide accurate information when creating accounts or submitting reports</li>
                <li>Respect the intellectual property rights of others</li>
                <li>Do not attempt to circumvent security measures</li>
                <li>Report suspected misinformation in good faith</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Prohibited Activities</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Submitting false or misleading information</li>
                <li>Attempting to hack, disrupt, or damage the Service</li>
                <li>Using the Service to spread misinformation</li>
                <li>Harassing other users or our staff</li>
                <li>Violating any applicable laws or regulations</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Account Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Account Registration & Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Account Creation</h3>
              <p className="text-muted-foreground">
                You may need to create an account to access certain features. You are responsible for maintaining the
                confidentiality of your account credentials and for all activities that occur under your account.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Account Security</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Choose a strong, unique password</li>
                <li>Do not share your account credentials</li>
                <li>Notify us immediately of any unauthorized access</li>
                <li>Keep your contact information up to date</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Information Accuracy */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Information Accuracy & Disclaimers
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Best Efforts</h3>
              <p className="text-muted-foreground">
                While we strive to provide accurate and up-to-date information, Veritas cannot guarantee the
                completeness, accuracy, or timeliness of all information on the platform. Users should verify critical
                information through official sources.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Emergency Situations</h3>
              <p className="text-muted-foreground">
                In life-threatening emergencies, always contact local emergency services (911, 112, etc.) immediately.
                Do not rely solely on Veritas for emergency response.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Third-Party Content</h3>
              <p className="text-muted-foreground">
                Our platform aggregates information from various sources. We are not responsible for the accuracy of
                third-party content, though we work to verify information through our systems.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Our Rights</h3>
              <p className="text-muted-foreground">
                Veritas and its original content, features, and functionality are owned by us and are protected by
                international copyright, trademark, and other intellectual property laws.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">User Content</h3>
              <p className="text-muted-foreground">
                By submitting content to Veritas (such as misinformation reports), you grant us a non-exclusive,
                worldwide, royalty-free license to use, modify, and distribute such content for the purpose of providing
                and improving our services.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Limitation of Liability */}
        <Card>
          <CardHeader>
            <CardTitle>Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Service Limitations</h3>
              <p className="text-muted-foreground">
                Veritas is provided "as is" without warranties of any kind. We do not guarantee that the service will
                be error-free, secure, or available at all times.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Liability Limits</h3>
              <p className="text-muted-foreground">
                To the maximum extent permitted by law, Veritas shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, including but not limited to loss of profits, data, or use.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Privacy */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the
              Service, to understand our practices regarding the collection and use of your information.
            </p>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">By You</h3>
              <p className="text-muted-foreground">
                You may terminate your account at any time by contacting us or using the account deletion feature in
                your settings.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">By Us</h3>
              <p className="text-muted-foreground">
                We may terminate or suspend your account immediately, without prior notice, if you breach these Terms or
                engage in prohibited activities.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We reserve the right to modify these Terms at any time. We will notify users of any material changes via
              email or through the platform. Your continued use of Veritas after such modifications constitutes
              acceptance of the updated Terms.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about these Terms of Service, please contact us:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Legal Department</strong>
              </p>
              <p>Email: legal@veritas.org</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>
                Address: 123 Crisis Response Ave
                <br />
                Emergency City, EC 12345
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  )
}
