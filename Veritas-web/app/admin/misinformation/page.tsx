"use client";

import { useState } from "react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  EyeOff,
  Flag,
  Shield,
  Users,
  Search,
  Filter,
  MoreHorizontal,
  Ban,
  Trash2,
  Download,
  Upload,
  MessageSquare,
  Image,
  Video,
  Link,
  Calendar,
  TrendingUp,
  Activity,
  FileText,
  Share,
  ExternalLink,
  Zap,
  Target,
} from "lucide-react";

interface MisinformationPost {
  id: string;
  content: string;
  type: "text" | "image" | "video" | "link";
  source: string;
  author: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  submittedBy: {
    id: string;
    name: string;
    email: string;
  };
  submittedAt: string;
  status: "pending" | "approved" | "rejected" | "escalated";
  priority: "low" | "medium" | "high" | "critical";
  category: "false_claim" | "misleading" | "satire" | "opinion" | "spam";
  verificationScore: number;
  engagement: {
    views: number;
    shares: number;
    comments: number;
  };
  evidence: string[];
  moderatorNotes?: string;
  aiAnalysis?: {
    confidence: number;
    flags: string[];
    summary: string;
  };
}

const mockPosts: MisinformationPost[] = [
  {
    id: "1",
    content:
      "Breaking: Local government announces new policy that will revolutionize healthcare access for all citizens...",
    type: "text",
    source: "social_media",
    author: {
      id: "u1",
      name: "John Smith",
      email: "john@example.com",
    },
    submittedBy: {
      id: "u2",
      name: "Sarah Johnson",
      email: "sarah@veritas.org",
    },
    submittedAt: "2024-01-15T10:30:00Z",
    status: "pending",
    priority: "high",
    category: "false_claim",
    verificationScore: 0.2,
    engagement: {
      views: 15420,
      shares: 342,
      comments: 89,
    },
    evidence: [
      "https://example.com/evidence1",
      "https://example.com/evidence2",
    ],
    aiAnalysis: {
      confidence: 0.85,
      flags: ["unverified_claim", "emotional_language"],
      summary: "Contains unverified claims about government policy changes.",
    },
  },
  {
    id: "2",
    content:
      "Scientists discover cure for common cold, pharmaceutical companies trying to suppress the news!",
    type: "text",
    source: "news_site",
    author: {
      id: "u3",
      name: "Mike Chen",
      email: "mike@news.com",
    },
    submittedBy: {
      id: "u4",
      name: "Emily Rodriguez",
      email: "emily@veritas.org",
    },
    submittedAt: "2024-01-15T09:15:00Z",
    status: "escalated",
    priority: "critical",
    category: "false_claim",
    verificationScore: 0.1,
    engagement: {
      views: 25680,
      shares: 1250,
      comments: 445,
    },
    evidence: [
      "https://example.com/medical-journal",
      "https://example.com/expert-opinion",
    ],
    moderatorNotes: "Requires medical expert review",
    aiAnalysis: {
      confidence: 0.92,
      flags: [
        "medical_misinformation",
        "conspiracy_theory",
        "high_viral_potential",
      ],
      summary: "Contains medical misinformation with conspiracy elements.",
    },
  },
  {
    id: "3",
    content: "Weather forecast shows unusual patterns this week...",
    type: "image",
    source: "social_media",
    author: {
      id: "u5",
      name: "Lisa Wang",
      email: "lisa@example.com",
    },
    submittedBy: {
      id: "u6",
      name: "David Kim",
      email: "david@veritas.org",
    },
    submittedAt: "2024-01-15T08:45:00Z",
    status: "approved",
    priority: "low",
    category: "opinion",
    verificationScore: 0.8,
    engagement: {
      views: 3420,
      shares: 45,
      comments: 12,
    },
    evidence: ["https://weather.gov/forecast"],
  },
  {
    id: "4",
    content:
      "Celebrity endorses new cryptocurrency that will make everyone rich overnight!",
    type: "video",
    source: "video_platform",
    author: {
      id: "u7",
      name: "Crypto Guru",
      email: "guru@crypto.com",
    },
    submittedBy: {
      id: "u8",
      name: "Alex Rivera",
      email: "alex@veritas.org",
    },
    submittedAt: "2024-01-15T07:20:00Z",
    status: "rejected",
    priority: "high",
    category: "spam",
    verificationScore: 0.05,
    engagement: {
      views: 45230,
      shares: 2340,
      comments: 892,
    },
    evidence: [],
    moderatorNotes: "Clear financial scam, rejected immediately",
  },
];

const moderationStats = {
  total: mockPosts.length,
  pending: mockPosts.filter((p) => p.status === "pending").length,
  approved: mockPosts.filter((p) => p.status === "approved").length,
  rejected: mockPosts.filter((p) => p.status === "rejected").length,
  escalated: mockPosts.filter((p) => p.status === "escalated").length,
  highPriority: mockPosts.filter(
    (p) => p.priority === "high" || p.priority === "critical",
  ).length,
};

export default function MisinformationModerationPage() {
  const [posts, setPosts] = useState<MisinformationPost[]>(mockPosts);
  const [selectedPosts, setSelectedPosts] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [selectedPost, setSelectedPost] = useState<MisinformationPost | null>(
    null,
  );
  const [detailsDialog, setDetailsDialog] = useState(false);
  const [bulkActionDialog, setBulkActionDialog] = useState(false);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [moderatorNotes, setModeratorNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.submittedBy.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || post.status === filterStatus;
    const matchesPriority =
      filterPriority === "all" || post.priority === filterPriority;
    const matchesCategory =
      filterCategory === "all" || post.category === filterCategory;
    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-500" />;
      case "escalated":
        return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      approved:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      escalated:
        "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    };
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-xs`}>
        {status}
      </Badge>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const variants = {
      low: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
      medium: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      high: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      critical: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return (
      <Badge
        className={`${variants[priority as keyof typeof variants]} text-xs`}
      >
        {priority}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "image":
        return <Image className="w-4 h-4 text-purple-500" />;
      case "video":
        return <Video className="w-4 h-4 text-red-500" />;
      case "link":
        return <Link className="w-4 h-4 text-blue-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleSelectPost = (postId: string, checked: boolean) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter((id) => id !== postId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPosts(filteredPosts.map((post) => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleBulkAction = (action: string) => {
    setBulkAction(action);
    setBulkActionDialog(true);
  };

  const executeBulkAction = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/admin/misinformation/bulk", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postIds: selectedPosts,
          action: bulkAction,
          moderatorNotes,
        }),
      });

      if (response.ok) {
        // Update local state
        let updatedPosts = [...posts];
        selectedPosts.forEach((postId) => {
          const postIndex = updatedPosts.findIndex((p) => p.id === postId);
          if (postIndex !== -1) {
            switch (bulkAction) {
              case "approve":
                updatedPosts[postIndex].status = "approved";
                break;
              case "reject":
                updatedPosts[postIndex].status = "rejected";
                break;
              case "escalate":
                updatedPosts[postIndex].status = "escalated";
                break;
              case "delete":
                updatedPosts = updatedPosts.filter((p) => p.id !== postId);
                break;
            }
            if (moderatorNotes) {
              updatedPosts[postIndex] = {
                ...updatedPosts[postIndex],
                moderatorNotes,
              };
            }
          }
        });

        setPosts(updatedPosts);
        setSelectedPosts([]);
        setBulkActionDialog(false);
        setModeratorNotes("");
        console.log(`Bulk ${bulkAction} completed successfully`);
      }
    } catch (error) {
      console.error(`Error executing bulk ${bulkAction}:`, error);
    }
    setIsLoading(false);
  };

  const handlePostAction = async (
    postId: string,
    action: string,
    notes?: string,
  ) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/misinformation/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, moderatorNotes: notes }),
      });

      if (response.ok) {
        const updatedPosts = posts.map((post) => {
          if (post.id === postId) {
            let newStatus: MisinformationPost["status"] = post.status;
            switch (action) {
              case "approve":
                newStatus = "approved";
                break;
              case "reject":
                newStatus = "rejected";
                break;
              case "escalate":
                newStatus = "escalated";
                break;
            }
            return {
              ...post,
              status: newStatus,
              moderatorNotes: notes || post.moderatorNotes,
            };
          }
          return post;
        });

        setPosts(updatedPosts);
        console.log(`Post ${action} completed successfully`);
      }
    } catch (error) {
      console.error(`Error executing ${action} on post:`, error);
    }
    setIsLoading(false);
  };

  const viewPostDetails = (post: MisinformationPost) => {
    setSelectedPost(post);
    setDetailsDialog(true);
  };

  const exportModerationData = async () => {
    try {
      const response = await fetch("/api/admin/misinformation/export", {
        method: "GET",
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `moderation-report-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error exporting moderation data:", error);
    }
  };

  const getBulkActionTitle = (action: string) => {
    switch (action) {
      case "approve":
        return "Approve Posts";
      case "reject":
        return "Reject Posts";
      case "escalate":
        return "Escalate Posts";
      case "delete":
        return "Delete Posts";
      default:
        return "Bulk Action";
    }
  };

  const getBulkActionDescription = (action: string, count: number) => {
    switch (action) {
      case "approve":
        return `Are you sure you want to approve ${count} selected post${count > 1 ? "s" : ""}? They will be marked as verified and safe.`;
      case "reject":
        return `Are you sure you want to reject ${count} selected post${count > 1 ? "s" : ""}? They will be marked as misinformation.`;
      case "escalate":
        return `Are you sure you want to escalate ${count} selected post${count > 1 ? "s" : ""}? They will be sent for expert review.`;
      case "delete":
        return `Are you sure you want to permanently delete ${count} selected post${count > 1 ? "s" : ""}? This action cannot be undone.`;
      default:
        return `Are you sure you want to perform this action on ${count} selected post${count > 1 ? "s" : ""}?`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Misinformation Moderation
          </h1>
          <p className="text-muted-foreground">
            Review and moderate flagged content for misinformation
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2">
          <Button
            onClick={exportModerationData}
            variant="outline"
            size="sm"
            className="h-9 tap-target"
          >
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Total Posts
              </p>
              <p className="text-lg sm:text-2xl font-bold">
                {moderationStats.total}
              </p>
            </div>
            <FileText className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Pending
              </p>
              <p className="text-lg sm:text-2xl font-bold text-yellow-600">
                {moderationStats.pending}
              </p>
            </div>
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Approved
              </p>
              <p className="text-lg sm:text-2xl font-bold text-green-600">
                {moderationStats.approved}
              </p>
            </div>
            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Rejected
              </p>
              <p className="text-lg sm:text-2xl font-bold text-red-600">
                {moderationStats.rejected}
              </p>
            </div>
            <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Escalated
              </p>
              <p className="text-lg sm:text-2xl font-bold text-orange-600">
                {moderationStats.escalated}
              </p>
            </div>
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500" />
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                High Priority
              </p>
              <p className="text-lg sm:text-2xl font-bold text-purple-600">
                {moderationStats.highPriority}
              </p>
            </div>
            <Flag className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
          </div>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search posts, authors, or submitters..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-9"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-40 h-9">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="escalated">Escalated</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-full sm:w-40 h-9">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-40 h-9">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="false_claim">False Claim</SelectItem>
                <SelectItem value="misleading">Misleading</SelectItem>
                <SelectItem value="satire">Satire</SelectItem>
                <SelectItem value="opinion">Opinion</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedPosts.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                {selectedPosts.length} post{selectedPosts.length > 1 ? "s" : ""}{" "}
                selected
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("approve")}
                  className="h-8 text-xs"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("reject")}
                  className="h-8 text-xs"
                >
                  <XCircle className="w-3 h-3 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("escalate")}
                  className="h-8 text-xs"
                >
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Escalate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkAction("delete")}
                  className="h-8 text-xs text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Table */}
        <div className="hidden md:block">
          <div className="border rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">
                      <Checkbox
                        checked={
                          selectedPosts.length === filteredPosts.length &&
                          filteredPosts.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="text-left p-3 font-medium">Content</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Priority</th>
                    <th className="text-left p-3 font-medium">Author</th>
                    <th className="text-left p-3 font-medium">Engagement</th>
                    <th className="text-left p-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="border-b hover:bg-muted/50">
                      <td className="p-3">
                        <Checkbox
                          checked={selectedPosts.includes(post.id)}
                          onCheckedChange={(checked) =>
                            handleSelectPost(post.id, checked as boolean)
                          }
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex items-start gap-3 max-w-md">
                          <div className="flex items-center gap-2 shrink-0">
                            {getTypeIcon(post.type)}
                            {getPriorityBadge(post.priority)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium line-clamp-2 mb-1">
                              {post.content}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <span>{post.source.replace("_", " ")}</span>
                              <span>•</span>
                              <span>
                                {new Date(
                                  post.submittedAt,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(post.status)}
                          {getStatusBadge(post.status)}
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              post.priority === "critical"
                                ? "bg-red-500"
                                : post.priority === "high"
                                  ? "bg-orange-500"
                                  : post.priority === "medium"
                                    ? "bg-blue-500"
                                    : "bg-gray-500"
                            }`}
                          />
                          <span className="text-sm capitalize">
                            {post.priority}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage
                              src={post.author.avatar}
                              alt={post.author.name}
                            />
                            <AvatarFallback className="text-xs">
                              {post.author.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {post.author.name}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>
                              {post.engagement.views.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Share className="w-3 h-3" />
                            <span>{post.engagement.shares}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => viewPostDetails(post)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            {post.status === "pending" && (
                              <>
                                <DropdownMenuItem
                                  className="text-green-600"
                                  onClick={() =>
                                    handlePostAction(post.id, "approve")
                                  }
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                  Approve
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-red-600"
                                  onClick={() =>
                                    handlePostAction(post.id, "reject")
                                  }
                                >
                                  <XCircle className="w-4 h-4 mr-2" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="text-orange-600"
                                  onClick={() =>
                                    handlePostAction(post.id, "escalate")
                                  }
                                >
                                  <AlertTriangle className="w-4 h-4 mr-2" />
                                  Escalate
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuItem className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-4">
          <div className="flex items-center justify-between mb-4">
            <Checkbox
              checked={
                selectedPosts.length === filteredPosts.length &&
                filteredPosts.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-muted-foreground">
              Select all posts
            </span>
          </div>

          {filteredPosts.map((post) => (
            <Card key={post.id} className="p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedPosts.includes(post.id)}
                    onCheckedChange={(checked) =>
                      handleSelectPost(post.id, checked as boolean)
                    }
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getTypeIcon(post.type)}
                      {getPriorityBadge(post.priority)}
                      {getStatusBadge(post.status)}
                    </div>
                    <p className="font-medium text-sm line-clamp-3 mb-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="w-6 h-6">
                        <AvatarImage
                          src={post.author.avatar}
                          alt={post.author.name}
                        />
                        <AvatarFallback className="text-xs">
                          {post.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        {post.author.name}
                      </span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => viewPostDetails(post)}>
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {post.status === "pending" && (
                      <>
                        <DropdownMenuItem
                          className="text-green-600"
                          onClick={() => handlePostAction(post.id, "approve")}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => handlePostAction(post.id, "reject")}
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-orange-600"
                          onClick={() => handlePostAction(post.id, "escalate")}
                        >
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Escalate
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuItem className="text-red-600">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(post.submittedAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-muted-foreground" />
                  <span>{post.engagement.views.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Share className="w-4 h-4 text-muted-foreground" />
                  <span>{post.engagement.shares} shares</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  <span>{post.engagement.comments} comments</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground">
                Source: {post.source.replace("_", " ")} • Submitted by{" "}
                {post.submittedBy.name}
              </div>
            </Card>
          ))}
        </div>
      </Card>

      {/* Post Details Dialog */}
      <Dialog open={detailsDialog} onOpenChange={setDetailsDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Post Details</DialogTitle>
            <DialogDescription className="text-base">
              Detailed information and moderation tools
            </DialogDescription>
          </DialogHeader>
          {selectedPost && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  {getTypeIcon(selectedPost.type)}
                  {getPriorityBadge(selectedPost.priority)}
                  {getStatusBadge(selectedPost.status)}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Content</h4>
                  <p className="text-sm">{selectedPost.content}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Author</h4>
                    <div className="flex items-center gap-2">
                      <Avatar className="w-8 h-8">
                        <AvatarImage
                          src={selectedPost.author.avatar}
                          alt={selectedPost.author.name}
                        />
                        <AvatarFallback className="text-sm">
                          {selectedPost.author.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {selectedPost.author.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {selectedPost.author.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Submitted By</h4>
                    <div>
                      <p className="font-medium">
                        {selectedPost.submittedBy.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedPost.submittedBy.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Eye className="w-4 h-4" />
                    </div>
                    <p className="font-medium">
                      {selectedPost.engagement.views.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Views</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Share className="w-4 h-4" />
                    </div>
                    <p className="font-medium">
                      {selectedPost.engagement.shares}
                    </p>
                    <p className="text-sm text-muted-foreground">Shares</p>
                  </div>
                  <div className="p-3 bg-muted rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <MessageSquare className="w-4 h-4" />
                    </div>
                    <p className="font-medium">
                      {selectedPost.engagement.comments}
                    </p>
                    <p className="text-sm text-muted-foreground">Comments</p>
                  </div>
                </div>

                {selectedPost.aiAnalysis && (
                  <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-blue-500" />
                      AI Analysis
                    </h4>
                    <p className="text-sm mb-2">
                      {selectedPost.aiAnalysis.summary}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm">Confidence:</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${selectedPost.aiAnalysis.confidence * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium">
                        {Math.round(selectedPost.aiAnalysis.confidence * 100)}%
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {selectedPost.aiAnalysis.flags.map((flag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-xs"
                        >
                          {flag.replace("_", " ")}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedPost.moderatorNotes && (
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Moderator Notes</h4>
                    <p className="text-sm">{selectedPost.moderatorNotes}</p>
                  </div>
                )}
              </div>

              {selectedPost.status === "pending" && (
                <div className="flex flex-col xs:flex-row gap-3 pt-4 border-t">
                  <Button
                    onClick={() => handlePostAction(selectedPost.id, "approve")}
                    disabled={isLoading}
                    className="flex-1 text-base h-12 tap-target font-medium bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Post
                  </Button>
                  <Button
                    onClick={() => handlePostAction(selectedPost.id, "reject")}
                    disabled={isLoading}
                    variant="destructive"
                    className="flex-1 text-base h-12 tap-target font-medium"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Post
                  </Button>
                  <Button
                    onClick={() =>
                      handlePostAction(selectedPost.id, "escalate")
                    }
                    disabled={isLoading}
                    variant="outline"
                    className="flex-1 text-base h-12 tap-target font-medium"
                  >
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Escalate
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk Action Dialog */}
      <Dialog open={bulkActionDialog} onOpenChange={setBulkActionDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {getBulkActionTitle(bulkAction)}
            </DialogTitle>
            <DialogDescription className="text-base">
              Confirm bulk moderation action
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert
              className={
                bulkAction === "delete"
                  ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950"
                  : ""
              }
            >
              <AlertTriangle
                className={`h-4 w-4 ${bulkAction === "delete" ? "text-red-600" : "text-yellow-600"}`}
              />
              <AlertDescription
                className={`text-sm md:text-base leading-relaxed ${bulkAction === "delete" ? "text-red-700 dark:text-red-300" : "text-yellow-700 dark:text-yellow-300"}`}
              >
                {getBulkActionDescription(bulkAction, selectedPosts.length)}
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label htmlFor="moderator-notes">
                Moderator Notes (Optional)
              </Label>
              <Textarea
                id="moderator-notes"
                placeholder="Add notes about this moderation action..."
                value={moderatorNotes}
                onChange={(e) => setModeratorNotes(e.target.value)}
                className="min-h-20 text-base"
              />
            </div>

            {selectedPosts.length > 0 && (
              <div className="bg-muted p-3 rounded-lg max-h-32 overflow-y-auto">
                <p className="text-sm font-medium mb-2">Selected posts:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  {selectedPosts.slice(0, 3).map((postId) => {
                    const post = posts.find((p) => p.id === postId);
                    return post ? (
                      <li key={postId} className="truncate">
                        • {post.content.substring(0, 50)}...
                      </li>
                    ) : null;
                  })}
                  {selectedPosts.length > 3 && (
                    <li className="text-xs">
                      ... and {selectedPosts.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setBulkActionDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              variant={bulkAction === "delete" ? "destructive" : "default"}
              onClick={executeBulkAction}
              disabled={isLoading}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Confirm {bulkAction === "delete" ? "Delete" : "Action"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
