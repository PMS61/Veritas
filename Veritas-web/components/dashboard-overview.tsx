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
import {
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  Flag,
  Zap,
  Shield,
  Eye,
  Settings,
  Bell,
  MessageSquare,
  TrendingUp,
  Database,
  FileText,
  Ban,
  CheckCheck,
  AlertCircle,
  Megaphone,
  MoreHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useIsMobile } from "@/hooks/use-mobile";

interface QuickAction {
  id: string;
  title: string;
  description: string;
  urgency: "high" | "medium" | "low";
  type: "verification" | "moderation" | "system";
  count?: number;
}

interface SystemAlert {
  id: string;
  type: "error" | "warning" | "info";
  message: string;
  timestamp: string;
  actionRequired: boolean;
}

const quickActions: QuickAction[] = [
  {
    id: "pending-verifications",
    title: "Pending Verifications",
    description: "Claims awaiting admin review and approval",
    urgency: "high",
    type: "verification",
    count: 12,
  },
  {
    id: "flagged-content",
    title: "Flagged Content",
    description: "User-reported misinformation requiring moderation",
    urgency: "high",
    type: "moderation",
    count: 8,
  },
  {
    id: "system-alerts",
    title: "System Alerts",
    description: "Critical system issues requiring attention",
    urgency: "medium",
    type: "system",
    count: 3,
  },
  {
    id: "source-review",
    title: "Source Review",
    description: "New sources submitted for verification",
    urgency: "medium",
    type: "verification",
    count: 5,
  },
];

const systemAlerts: SystemAlert[] = [
  {
    id: "1",
    type: "error",
    message: "AI verification service experiencing high latency",
    timestamp: "5 minutes ago",
    actionRequired: true,
  },
  {
    id: "2",
    type: "warning",
    message: "Source reliability scores need recalibration",
    timestamp: "15 minutes ago",
    actionRequired: false,
  },
  {
    id: "3",
    type: "info",
    message: "Daily verification report generated successfully",
    timestamp: "1 hour ago",
    actionRequired: false,
  },
];

export function DashboardOverview() {
  const [publishDialog, setPublishDialog] = useState(false);
  const [alertDialog, setAlertDialog] = useState(false);
  const [banDialog, setBanDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("info");
  const [quickActionDialog, setQuickActionDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<QuickAction | null>(
    null,
  );
  const [emergencyActionDialog, setEmergencyActionDialog] = useState(false);
  const [selectedEmergencyAction, setSelectedEmergencyAction] = useState<
    string | null
  >(null);
  const isMobile = useIsMobile();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "error":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "info":
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const handlePublishAlert = async () => {
    try {
      // Simulate API call
      const response = await fetch("/api/admin/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: alertMessage,
          type: alertType,
          timestamp: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        console.log("System alert published successfully");
        // In real app, would show toast notification
      } else {
        console.error("Failed to publish alert");
      }
    } catch (error) {
      console.error("Error publishing alert:", error);
    }

    setAlertDialog(false);
    setAlertMessage("");
    setAlertType("info");
  };

  const handleQuickAction = (action: QuickAction) => {
    setSelectedAction(action);
    setQuickActionDialog(true);
  };

  const executeQuickAction = async () => {
    if (!selectedAction) return;

    try {
      let endpoint = "";
      let method = "GET";

      switch (selectedAction.id) {
        case "pending-verifications":
          endpoint = "/api/admin/verifications/pending";
          break;
        case "flagged-content":
          endpoint = "/api/admin/content/flagged";
          break;
        case "system-alerts":
          endpoint = "/api/admin/system/alerts";
          break;
        case "source-review":
          endpoint = "/api/admin/sources/pending";
          break;
      }

      const response = await fetch(endpoint, { method });
      if (response.ok) {
        const data = await response.json();
        console.log(`${selectedAction.title} action executed:`, data);
        // In real app, would navigate to specific page or show results
      }
    } catch (error) {
      console.error("Error executing quick action:", error);
    }

    setQuickActionDialog(false);
    setSelectedAction(null);
  };

  const handleEmergencyAction = (actionType: string) => {
    setSelectedEmergencyAction(actionType);
    setEmergencyActionDialog(true);
  };

  const executeEmergencyAction = async () => {
    if (!selectedEmergencyAction) return;

    try {
      const response = await fetch("/api/admin/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: selectedEmergencyAction,
          timestamp: new Date().toISOString(),
          adminId: "current-admin-id", // Would get from auth context
        }),
      });

      if (response.ok) {
        console.log(`Emergency action executed: ${selectedEmergencyAction}`);
        // In real app, would show confirmation and update UI state
      } else {
        console.error("Failed to execute emergency action");
      }
    } catch (error) {
      console.error("Error executing emergency action:", error);
    }

    setEmergencyActionDialog(false);
    setSelectedEmergencyAction(null);
    setBanDialog(false);
  };

  return (
    <div className="mobile-spacing-y safe-area-top pb-safe-bottom">
      {/* Header with Quick Actions */}
      <div className="mobile-container space-y-3 xs:space-y-4 md:space-y-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-sm xs:text-base md:text-lg text-muted-foreground">
            Veritas truth verification control center
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 xs:gap-3">
          <Button
            onClick={() => setAlertDialog(true)}
            className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 font-medium tap-target"
          >
            <Megaphone className="w-4 h-4 mr-2" />
            Broadcast Alert
          </Button>
          <Button
            onClick={() => setBanDialog(true)}
            className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 font-medium tap-target"
            variant="destructive"
          >
            <AlertTriangle className="w-4 h-4 mr-2" />
            Emergency Actions
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="mobile-container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 md:gap-4">
          <Card className="bg-card shadow-sm tap-target">
            <CardHeader className="py-2 xs:py-3 md:py-4 pb-0 xs:pb-0 md:pb-0">
              <CardTitle className="text-sm xs:text-base flex items-center">
                <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="sr-only md:not-sr-only">Active Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 xs:py-3 md:py-4">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold">1,342</div>
              <p className="text-xs xs:text-sm text-muted-foreground mt-0 xs:mt-1">
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm tap-target">
            <CardHeader className="py-2 xs:py-3 md:py-4 pb-0 xs:pb-0 md:pb-0">
              <CardTitle className="text-sm xs:text-base flex items-center">
                <Shield className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="sr-only md:not-sr-only">Verifications</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 xs:py-3 md:py-4">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold">24,985</div>
              <p className="text-xs xs:text-sm text-muted-foreground mt-0 xs:mt-1">
                +4.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm tap-target">
            <CardHeader className="py-2 xs:py-3 md:py-4 pb-0 xs:pb-0 md:pb-0">
              <CardTitle className="text-sm xs:text-base flex items-center">
                <Flag className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="sr-only md:not-sr-only">Detected False Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 xs:py-3 md:py-4">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold">312</div>
              <p className="text-xs xs:text-sm text-muted-foreground mt-0 xs:mt-1">
                -8% from yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm tap-target">
            <CardHeader className="py-2 xs:py-3 md:py-4 pb-0 xs:pb-0 md:pb-0">
              <CardTitle className="text-sm xs:text-base flex items-center">
                <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
                <span className="sr-only md:not-sr-only">Response Time</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 xs:py-3 md:py-4">
              <div className="text-2xl xs:text-3xl md:text-4xl font-bold">24s</div>
              <p className="text-xs xs:text-sm text-muted-foreground mt-0 xs:mt-1">
                -1.5s from average
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mobile-container space-y-3 xs:space-y-4">
        <h2 className="text-xl xs:text-2xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-3 md:gap-4">
          {quickActions.map((action) => (
            <Card
              key={action.id}
              className="bg-card shadow-sm hover:shadow-md transition-shadow tap-target"
              onClick={() => handleQuickAction(action)}
            >
              <CardHeader className="py-2 xs:py-3 md:py-4 pb-0 xs:pb-0 md:pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base xs:text-lg">{action.title}</CardTitle>
                  {action.count && (
                    <Badge className={getUrgencyColor(action.urgency)}>
                      {action.count}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="py-2 xs:py-3 md:py-4">
                <CardDescription className="text-xs xs:text-sm">
                  {action.description}
                </CardDescription>
                <div className="flex justify-end mt-2 xs:mt-3">
                  <Button size="sm" variant="outline" className="tap-target h-8 xs:h-9">
                    View & Act
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* System Alerts */}
      <div className="mobile-container space-y-3 xs:space-y-4">
        <h2 className="text-xl xs:text-2xl font-bold">System Alerts</h2>
        <div className="space-y-2 xs:space-y-3">
          {systemAlerts.map((alert) => (
            <Alert
              key={alert.id}
              className={`border-l-4 ${
                alert.type === "error"
                  ? "border-l-red-500"
                  : alert.type === "warning"
                  ? "border-l-yellow-500"
                  : "border-l-blue-500"
              } p-3 xs:p-4`}
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="text-sm xs:text-base font-medium">
                      {alert.message}
                    </p>
                    <span className="text-xs text-muted-foreground ml-2">
                      {alert.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              {alert.actionRequired && (
                <div className="flex justify-end mt-2">
                  <Button size="sm" className="tap-target h-8 xs:h-9">
                    Resolve
                  </Button>
                </div>
              )}
            </Alert>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mobile-container space-y-3 xs:space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl xs:text-2xl font-bold">Recent Activity</h2>
          <Button variant="outline" size="sm" className="h-8 xs:h-9 tap-target">
            See All
          </Button>
        </div>
        <Card className="bg-card shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 text-xs xs:text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-3 text-xs xs:text-sm font-medium text-muted-foreground">Description</th>
                  <th className="text-left p-3 text-xs xs:text-sm font-medium text-muted-foreground">User</th>
                  <th className="text-left p-3 text-xs xs:text-sm font-medium text-muted-foreground">Time</th>
                  <th className="text-right p-3 text-xs xs:text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 text-xs xs:text-sm">
                    <Badge variant="outline">Verification</Badge>
                  </td>
                  <td className="p-3 text-xs xs:text-sm">
                    Health claim verification completed
                  </td>
                  <td className="p-3 text-xs xs:text-sm">john@veritas.com</td>
                  <td className="p-3 text-xs xs:text-sm">2 minutes ago</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 tap-target">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-muted/50">
                  <td className="p-3 text-xs xs:text-sm">
                    <Badge variant="outline">Source</Badge>
                  </td>
                  <td className="p-3 text-xs xs:text-sm">
                    New source added for verification
                  </td>
                  <td className="p-3 text-xs xs:text-sm">maria@veritas.com</td>
                  <td className="p-3 text-xs xs:text-sm">15 minutes ago</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 tap-target">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="hover:bg-muted/50">
                  <td className="p-3 text-xs xs:text-sm">
                    <Badge variant="outline">System</Badge>
                  </td>
                  <td className="p-3 text-xs xs:text-sm">
                    AI model updated to version 2.4.1
                  </td>
                  <td className="p-3 text-xs xs:text-sm">system@veritas.com</td>
                  <td className="p-3 text-xs xs:text-sm">1 hour ago</td>
                  <td className="p-3 text-right">
                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 tap-target">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Alert Dialog */}
      <Dialog open={alertDialog} onOpenChange={setAlertDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-lg mx-auto">
          <DialogHeader className="pb-2 xs:pb-4">
            <DialogTitle className="text-lg xs:text-xl">Broadcast System Alert</DialogTitle>
            <DialogDescription className="text-xs xs:text-sm md:text-base">
              Send an alert notification to all active users on the platform
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 xs:space-y-4">
            <div className="space-y-1 xs:space-y-2">
              <Label htmlFor="alert-type">Alert Type</Label>
              <Select defaultValue={alertType} onValueChange={setAlertType}>
                <SelectTrigger
                  id="alert-type"
                  className="w-full h-10 xs:h-12 tap-target"
                >
                  <SelectValue placeholder="Select alert type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="info">Information</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="error">Critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1 xs:space-y-2">
              <Label htmlFor="alert-message">Alert Message</Label>
              <Textarea
                id="alert-message"
                value={alertMessage}
                onChange={(e) => setAlertMessage(e.target.value)}
                placeholder="Enter your alert message"
                className="min-h-[80px] xs:min-h-[120px] text-sm xs:text-base tap-target"
              />
            </div>
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setAlertDialog(false)}
              className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublishAlert}
              disabled={!alertMessage.trim()}
              className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              <Megaphone className="w-4 h-4 mr-2" />
              Publish Alert
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={banDialog} onOpenChange={setBanDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-lg mx-auto">
          <DialogHeader className="pb-2 xs:pb-4">
            <DialogTitle className="text-lg xs:text-xl">Emergency Actions</DialogTitle>
            <DialogDescription className="text-xs xs:text-sm md:text-base">
              Critical system controls for emergency situations
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 xs:space-y-6">
            <Alert className="p-3 xs:p-4">
              <AlertCircle className="h-4 w-4 md:h-5 md:w-5" />
              <AlertDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                These actions will immediately affect all users. Use with
                caution.
              </AlertDescription>
            </Alert>
            <div className="space-y-2 xs:space-y-3">
              <Button
                className="w-full justify-start text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
                variant="destructive"
                onClick={() => handleEmergencyAction("manual-review")}
              >
                <Ban className="w-4 h-4 mr-2 xs:mr-3" />
                Enable Manual Review Mode
              </Button>
              <Button
                className="w-full justify-start text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
                variant="destructive"
                onClick={() => handleEmergencyAction("disable-ai")}
              >
                <XCircle className="w-4 h-4 mr-2 xs:mr-3" />
                Disable AI Verification
              </Button>
              <Button
                className="w-full justify-start text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
                variant="destructive"
                onClick={() => handleEmergencyAction("crisis-mode")}
              >
                <AlertTriangle className="w-4 h-4 mr-2 xs:mr-3" />
                Activate Crisis Mode
              </Button>
            </div>
          </div>
          <DialogFooter className="pt-2 xs:pt-4">
            <Button
              variant="outline"
              onClick={() => setBanDialog(false)}
              className="w-full text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Quick Action Dialog */}
      <Dialog open={quickActionDialog} onOpenChange={setQuickActionDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-lg mx-auto">
          <DialogHeader className="pb-2 xs:pb-4">
            <DialogTitle className="text-lg xs:text-xl">
              {selectedAction?.title}
            </DialogTitle>
            <DialogDescription className="text-xs xs:text-sm md:text-base">
              {selectedAction?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 xs:space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                You have {selectedAction?.count} items requiring attention.
                Click "Proceed" to review and take action on these items.
              </AlertDescription>
            </Alert>
            {selectedAction?.urgency === "high" && (
              <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-xs xs:text-sm md:text-base leading-relaxed text-red-700 dark:text-red-300">
                  High priority items require immediate attention.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-2 xs:pt-4">
            <Button
              variant="outline"
              onClick={() => setQuickActionDialog(false)}
              className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={executeQuickAction}
              className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Emergency Action Confirmation */}
      <Dialog open={emergencyActionDialog} onOpenChange={setEmergencyActionDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-lg mx-auto">
          <DialogHeader className="pb-2 xs:pb-4">
            <DialogTitle className="text-lg xs:text-xl">Confirm Emergency Action</DialogTitle>
            <DialogDescription className="text-xs xs:text-sm md:text-base">
              You are about to take a critical system action
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 xs:space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs xs:text-sm md:text-base leading-relaxed">
                This action cannot be undone and will affect all users immediately.
              </AlertDescription>
            </Alert>
            <div className="p-3 xs:p-4 border rounded-md bg-muted/50">
              <p className="font-medium text-sm xs:text-base mb-1 xs:mb-2">
                You are about to:
              </p>
              <p className="text-sm xs:text-base">
                {selectedEmergencyAction === "manual-review"
                  ? "Enable Manual Review Mode - All verifications will require manual approval"
                  : selectedEmergencyAction === "disable-ai"
                  ? "Disable AI Verification - Switch to human verification only"
                  : "Activate Crisis Mode - Limit platform functionality for emergency response"}
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-2 xs:pt-4">
            <Button
              variant="outline"
              onClick={() => setEmergencyActionDialog(false)}
              className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={executeEmergencyAction}
              className="w-full xs:w-auto text-sm xs:text-base h-10 xs:h-12 tap-target font-medium"
            >
              Confirm Action
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
