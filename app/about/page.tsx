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
import {
  Shield,
  Eye,
  Users,
  CheckCircle,
  Search,
  BarChart3,
  Zap,
  Heart,
  Award,
  Target,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Eye,
    title: "Truth Analysis",
    description:
      "24/7 monitoring of multiple information sources to identify claims requiring fact-checking and verification.",
  },
  {
    icon: Shield,
    title: "AI-Powered Verification",
    description:
      "Advanced AI algorithms cross-reference information against trusted sources to assess credibility and detect misinformation.",
  },
  {
    icon: Search,
    title: "Source Investigation",
    description:
      "Deep analysis of information provenance and source reliability through comprehensive research tools.",
  },
  {
    icon: BarChart3,
    title: "Credibility Dashboard",
    description:
      "Comprehensive analytics and reporting tools for researchers, journalists, and fact-checkers.",
  },
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief Technology Officer",
    expertise: "AI & Machine Learning",
    description:
      "15+ years in information verification and AI-powered truth analysis systems.",
  },
  {
    name: "Michael Rodriguez",
    role: "Director of Operations",
    expertise: "Information Research",
    description:
      "Former investigative journalist with extensive fact-checking and source verification experience.",
  },
  {
    name: "Dr. Aisha Patel",
    role: "Head of Research",
    expertise: "Information Science",
    description:
      "Leading researcher in misinformation detection and credibility assessment methodologies.",
  },
  {
    name: "James Thompson",
    role: "Security Director",
    expertise: "Cybersecurity",
    description:
      "Expert in information security and data protection for truth verification systems.",
  },
];

const stats = [
  { label: "Information Sources Monitored", value: "1,000+" },
  { label: "Claims Verified Daily", value: "25,000+" },
  { label: "Research Organizations Served", value: "200+" },
  { label: "Verification Time", value: "<90 sec" },
];

export default function AboutPage() {
  return (
    <PublicLayout>
      <div className="container mx-auto px-4 py-8 space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center">
              <Eye className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-4xl font-bold">About Veritas</h1>
              <p className="text-xl text-muted-foreground">
                Eye that discerns the truth
              </p>
            </div>
          </div>

          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Veritas is a comprehensive information verification and truth
            discernment platform designed to combat misinformation across all
            domains and provide researchers, journalists, and truth-seekers with
            accurate, credible analysis when they need it most.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Target className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To provide researchers, journalists, and truth-seekers with
                accurate, verified information analysis across all domains,
                helping to combat misinformation and promote informed
                decision-making in our complex information landscape.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <Lightbulb className="w-8 h-8 text-primary" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where truth prevails over misinformation, enabling
                informed discourse, evidence-based decision-making, and a
                society built on verified, credible information.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Key Features */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">How Veritas Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge technology with human expertise
              to deliver reliable truth verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Statistics */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Impact by the Numbers</CardTitle>
            <CardDescription>
              Our platform's reach and effectiveness in truth verification and
              fact-checking
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Our Team</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Led by experts in information verification, AI technology, and
              credibility research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <Card key={index}>
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                  <Badge variant="outline">{member.expertise}</Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-center">
                    {member.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Our Core Values</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-3">
                <CheckCircle className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="font-semibold text-lg">Accuracy</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize truth and accuracy above all else, ensuring
                  every claim is thoroughly verified against multiple credible
                  sources.
                </p>
              </div>
              <div className="text-center space-y-3">
                <Zap className="w-12 h-12 text-blue-600 mx-auto" />
                <h3 className="font-semibold text-lg">Speed</h3>
                <p className="text-sm text-muted-foreground">
                  In our fast-moving information landscape, time is critical. We
                  deliver verification results as quickly as possible.
                </p>
              </div>
              <div className="text-center space-y-3">
                <Heart className="w-12 h-12 text-red-600 mx-auto" />
                <h3 className="font-semibold text-lg">Community</h3>
                <p className="text-sm text-muted-foreground">
                  We serve truth-seekers first, ensuring everyone has access to
                  verified, credible information.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call to Action */}
        <Card className="text-center">
          <CardContent className="p-8">
            <Award className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're a researcher, journalist, or truth-seeker, Veritas
              is here to support you with accurate, verified information
              analysis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg">
                <Link href="/updates">View Fact Checks</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/verify">Verify Claims</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
