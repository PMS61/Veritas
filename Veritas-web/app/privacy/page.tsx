import { PublicLayout } from "@/components/public-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, FileText, Mail } from "lucide-react";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Privacy Policy</h1>
              <p className="text-xl text-muted-foreground">
                How we protect and use your information
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Last updated: January 2025
          </p>
        </div>

        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Privacy Overview</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              At Veritas, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our truth verification and information
              analysis platform.
            </p>
          </CardContent>
        </Card>

        {/* Information Collection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Personal Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Name and contact information when you create an account</li>
                <li>Email address for notifications and communications</li>
                <li>
                  Location data (if you choose to share it) for localized crisis
                  updates
                </li>
                <li>Information you provide when reporting misinformation</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Usage Information</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Pages visited and features used on our platform</li>
                <li>Search queries and verification requests</li>
                <li>Device information and browser type</li>
                <li>IP address and general location information</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Cookies and Tracking</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to improve our services</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Service Provision</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Provide crisis monitoring and verification services</li>
                  <li>Send relevant crisis updates and alerts</li>
                  <li>Personalize your experience based on location</li>
                  <li>Respond to your inquiries and support requests</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Platform Improvement</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Analyze usage patterns to improve our services</li>
                  <li>Develop new features and functionality</li>
                  <li>Enhance our misinformation detection algorithms</li>
                  <li>Ensure platform security and prevent abuse</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Data Protection & Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Security Measures</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>End-to-end encryption for sensitive data transmission</li>
                <li>Secure servers with regular security audits</li>
                <li>Access controls and authentication protocols</li>
                <li>Regular data backups and disaster recovery procedures</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Data Retention</h3>
              <p className="text-muted-foreground">
                We retain your personal information only as long as necessary to
                provide our services and comply with legal obligations. Account
                data is typically retained for 3 years after account closure,
                while anonymized usage data may be retained longer for research
                and improvement purposes.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Information Sharing */}
        <Card>
          <CardHeader>
            <CardTitle>Information Sharing & Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">
                We DO NOT sell your personal information
              </h3>
              <p className="text-muted-foreground">
                Veritas never sells, rents, or trades your personal information
                to third parties for commercial purposes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Limited Sharing Scenarios</h3>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>
                  With emergency responders during active crisis situations
                  (anonymized data only)
                </li>
                <li>
                  With trusted research institutions for crisis response studies
                  (anonymized data only)
                </li>
                <li>When required by law or to protect public safety</li>
                <li>
                  With service providers who help us operate the platform (under
                  strict confidentiality agreements)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Privacy Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Access & Control</h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Access your personal information</li>
                  <li>Correct inaccurate data</li>
                  <li>Delete your account and data</li>
                  <li>Export your data</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">
                  Communication Preferences
                </h3>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Opt out of non-essential communications</li>
                  <li>Customize alert preferences</li>
                  <li>Choose data processing preferences</li>
                  <li>Withdraw consent where applicable</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" />
              Contact Us About Privacy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have questions about this Privacy Policy or want to
              exercise your privacy rights, please contact us:
            </p>
            <div className="space-y-2">
              <p>
                <strong>Privacy Officer</strong>
              </p>
              <p>Email: privacy@crisislens.org</p>
              <p>Phone: +1 (555) 123-4567</p>
              <p>
                Address: 123 Crisis Response Ave
                <br />
                Emergency City, EC 12345
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Updates */}
        <Card>
          <CardHeader>
            <CardTitle>Policy Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any material changes by email or through our platform. Your
              continued use of Veritas after such modifications constitutes
              acceptance of the updated Privacy Policy.
            </p>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
