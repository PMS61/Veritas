import { PublicLayout } from "@/components/public-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  HelpCircle,
  Search,
  Shield,
  AlertTriangle,
  MessageSquare,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  BookOpen,
  Settings,
} from "lucide-react";
import Link from "next/link";

const faqCategories = [
  {
    title: "Getting Started",
    icon: BookOpen,
    faqs: [
      {
        question: "What is Veritas?",
        answer:
          "Veritas is a comprehensive information verification and truth discernment platform - the eye that discerns the truth. It helps users analyze claims, detect misinformation, and access accurate, verified information across all domains.",
      },
      {
        question: "How do I verify information?",
        answer:
          "Visit our Verify Information page, enter the claim or statement you want to check, and our AI system will cross-reference it against trusted sources to provide a confidence score and detailed analysis.",
      },
      {
        question: "Is Veritas free to use?",
        answer:
          "Yes, basic access to fact-checking and information verification is completely free for the public. Premium features are available for research institutions, news organizations, and professional fact-checkers.",
      },
    ],
  },
  {
    title: "Verification Process",
    icon: Shield,
    faqs: [
      {
        question: "How accurate is the verification system?",
        answer:
          "Our AI-powered verification system achieves over 95% accuracy by cross-referencing multiple trusted sources including government agencies, verified news outlets, and official databases.",
      },
      {
        question: "What sources do you use for verification?",
        answer:
          "We use official government sources, verified news organizations, emergency management agencies, and trusted databases like WHO, UN, and national health departments.",
      },
      {
        question: "How long does verification take?",
        answer:
          "Most verifications are completed within 2 minutes. Complex claims requiring multiple source checks may take up to 10 minutes.",
      },
    ],
  },
  {
    title: "Truth Verification",
    icon: AlertTriangle,
    faqs: [
      {
        question: "How often are verifications published?",
        answer:
          "Truth verifications are published in real-time as new fact-checks become available. Our system monitors information sources 24/7 and verification results are typically available within minutes of analysis completion.",
      },
      {
        question: "Can I subscribe to alerts?",
        answer:
          "Yes, you can subscribe to email alerts, SMS notifications, or push notifications for specific types of crises or geographic areas through your account settings.",
      },
      {
        question: "What types of crises do you monitor?",
        answer:
          "We monitor natural disasters, public health emergencies, security threats, infrastructure failures, and other situations that may impact public safety.",
      },
    ],
  },
  {
    title: "Technical Support",
    icon: Settings,
    faqs: [
      {
        question: "The website is not loading properly",
        answer:
          "Try refreshing the page, clearing your browser cache, or using a different browser. If issues persist, contact our technical support team.",
      },
      {
        question: "How do I report a technical issue?",
        answer:
          "Use the contact form below or email support@veritas.org with details about the issue, including your browser type and any error messages.",
      },
      {
        question: "Is my data secure?",
        answer:
          "Yes, we use industry-standard encryption and security measures to protect all user data. We do not share personal information with third parties.",
      },
    ],
  },
];

const contactOptions = [
  {
    title: "Priority Support",
    description: "For urgent verification inquiries",
    icon: Phone,
    contact: "1-800-VERITAS",
    availability: "24/7",
    badge: "Urgent",
  },
  {
    title: "General Support",
    description: "For questions about using Veritas",
    icon: Mail,
    contact: "support@veritas.org",
    availability: "Mon-Fri 9AM-6PM EST",
    badge: "Standard",
  },
  {
    title: "Technical Issues",
    description: "For website and app technical problems",
    icon: Settings,
    contact: "tech@veritas.org",
    availability: "24/7",
    badge: "Technical",
  },
  {
    title: "Media Inquiries",
    description: "For press and media questions",
    icon: MessageSquare,
    contact: "media@veritas.org",
    availability: "Mon-Fri 9AM-5PM EST",
    badge: "Media",
  },
];

export default function HelpPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle className="w-12 h-12 text-primary" />
            <div>
              <h1 className="text-4xl font-bold">Help Center</h1>
              <p className="text-xl text-muted-foreground">
                Find answers and get support
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/verify">
              <CardContent className="p-6 text-center">
                <Search className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Verify Information</h3>
                <p className="text-sm text-muted-foreground">
                  Check the accuracy of crisis-related claims
                </p>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/updates">
              <CardContent className="p-6 text-center">
                <AlertTriangle className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Crisis Updates</h3>
                <p className="text-sm text-muted-foreground">
                  View latest verified crisis information
                </p>
              </CardContent>
            </Link>
          </Card>
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <Link href="/report">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Report Misinformation</h3>
                <p className="text-sm text-muted-foreground">
                  Help us identify false information
                </p>
              </CardContent>
            </Link>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground">
              Find quick answers to common questions
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {faqCategories.map((category, categoryIndex) => {
              const Icon = category.icon;
              return (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon className="w-6 h-6 text-primary" />
                      <CardTitle>{category.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Accordion type="single" collapsible>
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem
                          key={faqIndex}
                          value={`item-${categoryIndex}-${faqIndex}`}
                        >
                          <AccordionTrigger className="text-left">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Contact Support */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Contact Support</h2>
            <p className="text-muted-foreground">
              Need more help? Get in touch with our support team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactOptions.map((option, index) => {
              const Icon = option.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="w-6 h-6 text-primary" />
                        <CardTitle className="text-lg">
                          {option.title}
                        </CardTitle>
                      </div>
                      <Badge variant="outline">{option.badge}</Badge>
                    </div>
                    <CardDescription>{option.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Contact:</span>
                        <span className="text-primary">{option.contact}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {option.availability}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <span className="font-medium">Verification System</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <span className="font-medium">Crisis Updates</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <span className="font-medium">API Services</span>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
