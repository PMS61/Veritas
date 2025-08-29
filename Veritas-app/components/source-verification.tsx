"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Eye,
  Edit,
  Trash2,
  Flag,
  MessageSquare,
  Clock,
  User,
  ExternalLink,
  Shield,
  Zap,
  Settings,
  Ban,
  CheckCheck,
  AlertCircle,
} from "lucide-react";

interface PendingClaim {
  id: number;
  claim: string;
  source: string;
  submittedBy: string;
  timestamp: string;
  aiConfidence: number;
  aiVerdict: "true" | "false" | "mixed" | "unverified";
  priority: "high" | "medium" | "low";
  category: string;
  evidence: string[];
  flagged: boolean;
}

interface VerificationAction {
  id: string;
  type: "approve" | "reject" | "flag" | "edit";
  claim: string;
  reason: string;
  timestamp: string;
}

const pendingClaims: PendingClaim[] = [
  {
    id: 1,
    claim: "New vaccine reduces transmission by 95% according to latest study",
    source: "Social Media Post",
    submittedBy: "user@example.com",
    timestamp: "5 minutes ago",
    aiConfidence: 85,
    aiVerdict: "true",
    priority: "high",
    category: "Health",
    evidence: [
      "WHO Study #2024-001",
      "Peer Review by Johns Hopkins",
      "CDC Confirmation",
    ],
    flagged: false,
  },
  {
    id: 2,
    claim:
      "Local government plans to shut down all public transport next month",
    source: "WhatsApp Forward",
    submittedBy: "concerned.citizen@email.com",
    timestamp: "12 minutes ago",
    aiConfidence: 25,
    aiVerdict: "false",
    priority: "medium",
    category: "Government",
    evidence: ["No official announcement", "Transport authority denial"],
    flagged: true,
  },
  {
    id: 3,
    claim: "Climate data shows unprecedented temperature rise in polar regions",
    source: "News Article",
    submittedBy: "reporter@news.com",
    timestamp: "1 hour ago",
    aiConfidence: 92,
    aiVerdict: "true",
    priority: "high",
    category: "Environment",
    evidence: [
      "NOAA Climate Report 2024",
      "NASA Satellite Data",
      "IPCC Preliminary Findings",
    ],
    flagged: false,
  },
  {
    id: 4,
    claim: "New technology allows cars to run on water alone",
    source: "YouTube Video",
    submittedBy: "tech.enthusiast@gmail.com",
    timestamp: "2 hours ago",
    aiConfidence: 15,
    aiVerdict: "false",
    priority: "low",
    category: "Technology",
    evidence: ["Physics contradicts claim", "No peer-reviewed studies"],
    flagged: false,
  },
];

export function SourceVerification() {
  const [claims, setClaims] = useState(pendingClaims);
  const [selectedClaim, setSelectedClaim] = useState<PendingClaim | null>(null);
  const [actionDialog, setActionDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "flag" | null
  >(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");

  const getVerdictIcon = (verdict: string) => {
    switch (verdict) {
      case "true":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "false":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "mixed":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return <Eye className="w-4 h-4 text-gray-600" />;
    }
  };

  const getVerdictBadge = (verdict: string) => {
    const colors = {
      true: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      false: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      mixed:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      unverified:
        "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
    };
    return colors[verdict as keyof typeof colors] || colors.unverified;
  };

  const getPriorityBadge = (priority: string) => {
    const colors = {
      high: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
      medium:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      low: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    };
    return colors[priority as keyof typeof colors] || colors.low;
  };

  const handleAction = (
    claim: PendingClaim,
    action: "approve" | "reject" | "flag",
  ) => {
    setSelectedClaim(claim);
    setActionType(action);
    setActionDialog(true);
  };

  const executeAction = async () => {
    if (!selectedClaim || !actionType) return;

    // Update claim status
    setClaims((prev) =>
      prev.map((claim) =>
        claim.id === selectedClaim.id
          ? {
              ...claim,
              flagged: actionType === "flag" ? true : claim.flagged,
            }
          : claim,
      ),
    );

    // Make API call to process the verification action
    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Verification action completed:`, {
        claimId: selectedClaim.id,
        action: actionType,
        notes: adminNotes,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error processing verification action:", error);
    }

    // Reset state
    setActionDialog(false);
    setSelectedClaim(null);
    setActionType(null);
    setAdminNotes("");
  };

  const handleEdit = (claim: PendingClaim) => {
    setSelectedClaim(claim);
    setEditDialog(true);
  };

  const handleDelete = (claimId: number) => {
    setClaims((prev) => prev.filter((claim) => claim.id !== claimId));
  };

  const filteredClaims = claims.filter((claim) => {
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "flagged" && claim.flagged) ||
      (filterStatus === "unflagged" && !claim.flagged);

    const priorityMatch =
      filterPriority === "all" || claim.priority === filterPriority;

    return statusMatch && priorityMatch;
  });

  return (
    <div className="space-y-6">
      {/* Header with Stats and Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Claim Verification</h1>
          <p className="text-muted-foreground">
            Review and manage pending verification claims
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            AI Settings
          </Button>
          <Button>
            <Zap className="w-4 h-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{claims.length}</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Priority</p>
                <p className="text-2xl font-bold">
                  {claims.filter((c) => c.priority === "high").length}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Flagged</p>
                <p className="text-2xl font-bold">
                  {claims.filter((c) => c.flagged).length}
                </p>
              </div>
              <Flag className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Confidence</p>
                <p className="text-2xl font-bold">
                  {Math.round(
                    claims.reduce((sum, c) => sum + c.aiConfidence, 0) /
                      claims.length,
                  )}
                  %
                </p>
              </div>
              <Shield className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4">
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full xs:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Claims</SelectItem>
            <SelectItem value="flagged">Flagged Only</SelectItem>
            <SelectItem value="unflagged">Unflagged Only</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-full xs:w-48">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="high">High Priority</SelectItem>
            <SelectItem value="medium">Medium Priority</SelectItem>
            <SelectItem value="low">Low Priority</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Claims List */}
      <div className="grid gap-4">
        {filteredClaims.map((claim) => (
          <Card key={claim.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3 xs:gap-4">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={getPriorityBadge(claim.priority)}>
                      {claim.priority.toUpperCase()}
                    </Badge>
                    <Badge className={getVerdictBadge(claim.aiVerdict)}>
                      {getVerdictIcon(claim.aiVerdict)}
                      <span className="ml-1">
                        {claim.aiVerdict.toUpperCase()}
                      </span>
                    </Badge>
                    <Badge variant="outline">AI: {claim.aiConfidence}%</Badge>
                    {claim.flagged && (
                      <Badge variant="destructive">
                        <Flag className="w-3 h-3 mr-1" />
                        Flagged
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base xs:text-lg leading-tight break-words">
                    {claim.claim}
                  </CardTitle>
                </div>
                <div className="text-left xs:text-right text-sm text-muted-foreground xs:flex-shrink-0">
                  <p>{claim.timestamp}</p>
                  <p className="flex items-center gap-1 mt-1">
                    <User className="w-3 h-3" />
                    <span className="break-all">{claim.submittedBy}</span>
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Source:</p>
                  <p className="font-medium break-words">{claim.source}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Category:</p>
                  <p className="font-medium">{claim.category}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Evidence:</p>
                <div className="space-y-1">
                  {claim.evidence.map((evidence, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-3 h-3 text-blue-500" />
                      {evidence}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 h-8 text-xs tap-target"
                  onClick={() => handleAction(claim, "approve")}
                >
                  <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="h-8 text-xs tap-target"
                  onClick={() => handleAction(claim, "reject")}
                >
                  <XCircle className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs tap-target"
                  onClick={() => handleAction(claim, "flag")}
                >
                  <Flag className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                  Flag
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs tap-target"
                  onClick={() => handleEdit(claim)}
                >
                  <Edit className="w-3 h-3 xs:w-4 xs:h-4 mr-1" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(claim.id)}
                  className="text-red-600 hover:text-red-700 h-8 text-xs tap-target"
                >
                  <Trash2 className="w-3 h-3 xs:w-4 xs:h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Confirmation Dialog */}
      <Dialog open={actionDialog} onOpenChange={setActionDialog}>
        <DialogContent className="w-[95vw] max-w-md">
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" && "Approve Claim"}
              {actionType === "reject" && "Reject Claim"}
              {actionType === "flag" && "Flag for Review"}
            </DialogTitle>
            <DialogDescription>
              {selectedClaim && (
                <span className="font-medium break-words">"{selectedClaim.claim}"</span>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="admin-notes">Admin Notes (Required)</Label>
              <Textarea
                id="admin-notes"
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Provide reasoning for this action..."
                rows={3}
                className="resize-none"
              />
            </div>
            {actionType === "approve" && (
              <Alert>
                <CheckCheck className="h-4 w-4" />
                <AlertDescription>
                  This claim will be published as verified truth.
                </AlertDescription>
              </Alert>
            )}
            {actionType === "reject" && (
              <Alert>
                <Ban className="h-4 w-4" />
                <AlertDescription>
                  This claim will be marked as misinformation.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-2">
            <Button variant="outline" onClick={() => setActionDialog(false)} className="w-full xs:w-auto">
              Cancel
            </Button>
            <Button
              onClick={executeAction}
              disabled={!adminNotes.trim()}
              className={`w-full xs:w-auto ${
                actionType === "approve"
                  ? "bg-green-600 hover:bg-green-700"
                  : actionType === "reject"
                    ? "bg-red-600 hover:bg-red-700"
                    : ""
              }`}
            >
              Confirm {actionType}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog} onOpenChange={setEditDialog}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Claim</DialogTitle>
            <DialogDescription>
              Modify claim details and verification parameters
            </DialogDescription>
          </DialogHeader>
          {selectedClaim && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="claim-text">Claim Text</Label>
                <Textarea
                  id="claim-text"
                  defaultValue={selectedClaim.claim}
                  rows={3}
                  className="resize-none"
                />
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <Select defaultValue={selectedClaim.priority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select defaultValue={selectedClaim.category}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Health">Health</SelectItem>
                      <SelectItem value="Politics">Politics</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Economy">Economy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="flagged" defaultChecked={selectedClaim.flagged} />
                <Label htmlFor="flagged">Flag for manual review</Label>
              </div>
            </div>
          )}
          <DialogFooter className="flex-col xs:flex-row gap-2">
            <Button variant="outline" onClick={() => setEditDialog(false)} className="w-full xs:w-auto">
              Cancel
            </Button>
            <Button onClick={() => setEditDialog(false)} className="w-full xs:w-auto">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
