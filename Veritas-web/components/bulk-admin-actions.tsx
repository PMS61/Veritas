"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Ban,
  Trash2,
  Flag,
  Shield,
  Mail,
  Clock,
  ChevronDown,
  Play,
  Pause,
  Users,
  FileText,
  Settings,
  Activity,
} from "lucide-react";

interface BulkAction {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive" | "outline";
  requiresConfirmation: boolean;
  requiresNote?: boolean;
  category: "moderation" | "verification" | "user" | "system";
}

interface SelectedItem {
  id: string;
  type: string;
  title: string;
  status?: string;
}

interface BulkAdminActionsProps {
  selectedItems: SelectedItem[];
  onAction: (actionId: string, items: SelectedItem[], note?: string) => Promise<void>;
  onClearSelection: () => void;
  isVisible: boolean;
}

const bulkActions: BulkAction[] = [
  // Moderation Actions
  {
    id: "approve",
    label: "Approve Selected",
    description: "Mark items as verified and approved",
    icon: <CheckCircle className="w-4 h-4" />,
    variant: "default",
    requiresConfirmation: false,
    category: "moderation",
  },
  {
    id: "reject",
    label: "Reject Selected",
    description: "Mark items as rejected or false",
    icon: <XCircle className="w-4 h-4" />,
    variant: "destructive",
    requiresConfirmation: true,
    requiresNote: true,
    category: "moderation",
  },
  {
    id: "flag",
    label: "Flag for Review",
    description: "Mark items for manual review",
    icon: <Flag className="w-4 h-4" />,
    variant: "outline",
    requiresConfirmation: false,
    requiresNote: true,
    category: "moderation",
  },
  {
    id: "priority",
    label: "Set Priority",
    description: "Change priority level for selected items",
    icon: <AlertTriangle className="w-4 h-4" />,
    variant: "outline",
    requiresConfirmation: false,
    category: "verification",
  },

  // User Actions
  {
    id: "suspend-users",
    label: "Suspend Users",
    description: "Temporarily suspend selected user accounts",
    icon: <Ban className="w-4 h-4" />,
    variant: "destructive",
    requiresConfirmation: true,
    requiresNote: true,
    category: "user",
  },
  {
    id: "activate-users",
    label: "Activate Users",
    description: "Activate selected user accounts",
    icon: <Shield className="w-4 h-4" />,
    variant: "default",
    requiresConfirmation: false,
    category: "user",
  },
  {
    id: "notify-users",
    label: "Send Notification",
    description: "Send message to selected users",
    icon: <Mail className="w-4 h-4" />,
    variant: "outline",
    requiresConfirmation: false,
    requiresNote: true,
    category: "user",
  },

  // System Actions
  {
    id: "delete",
    label: "Delete Selected",
    description: "Permanently delete selected items",
    icon: <Trash2 className="w-4 h-4" />,
    variant: "destructive",
    requiresConfirmation: true,
    category: "system",
  },
  {
    id: "archive",
    label: "Archive Selected",
    description: "Move items to archive",
    icon: <FileText className="w-4 h-4" />,
    variant: "outline",
    requiresConfirmation: false,
    category: "system",
  },
  {
    id: "export",
    label: "Export Data",
    description: "Export selected items to file",
    icon: <FileText className="w-4 h-4" />,
    variant: "outline",
    requiresConfirmation: false,
    category: "system",
  },
];

export function BulkAdminActions({
  selectedItems,
  onAction,
  onClearSelection,
  isVisible,
}: BulkAdminActionsProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [selectedAction, setSelectedAction] = useState<BulkAction | null>(null);
  const [actionNote, setActionNote] = useState("");
  const [processingProgress, setProcessingProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categorizedActions = bulkActions.reduce((acc, action) => {
    if (!acc[action.category]) acc[action.category] = [];
    acc[action.category].push(action);
    return acc;
  }, {} as Record<string, BulkAction[]>);

  const filteredActions = selectedCategory === "all"
    ? bulkActions
    : bulkActions.filter(action => action.category === selectedCategory);

  const handleActionClick = async (action: BulkAction) => {
    setSelectedAction(action);

    if (action.requiresConfirmation) {
      setConfirmDialog(true);
    } else {
      await executeAction(action);
    }
  };

  const executeAction = async (action: BulkAction) => {
    setIsProcessing(true);
    setProcessingProgress(0);
    setProcessingStatus(`Executing ${action.label}...`);

    try {
      // Simulate progress for better UX
      const progressSteps = selectedItems.length;
      const progressIncrement = 100 / progressSteps;

      for (let i = 0; i < selectedItems.length; i++) {
        setProcessingProgress(Math.round((i + 1) * progressIncrement));
        setProcessingStatus(`Processing item ${i + 1} of ${selectedItems.length}...`);

        // Small delay to show progress
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      await onAction(action.id, selectedItems, actionNote);

      setProcessingStatus("Action completed successfully!");
      setTimeout(() => {
        setIsProcessing(false);
        setConfirmDialog(false);
        setActionNote("");
        onClearSelection();
      }, 1000);

    } catch (error) {
      console.error("Error executing bulk action:", error);
      setProcessingStatus("Action failed. Please try again.");
      setTimeout(() => {
        setIsProcessing(false);
      }, 2000);
    }
  };

  const confirmAction = async () => {
    if (!selectedAction) return;
    await executeAction(selectedAction);
  };

  const getActionsByCategory = (category: string) => {
    return categorizedActions[category] || [];
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "moderation":
        return <Shield className="w-4 h-4" />;
      case "verification":
        return <CheckCircle className="w-4 h-4" />;
      case "user":
        return <Users className="w-4 h-4" />;
      case "system":
        return <Settings className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  if (!isVisible || selectedItems.length === 0) {
    return null;
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background border-t shadow-lg">
        <div className="max-w-7xl mx-auto">
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="text-sm">
                  {selectedItems.length} selected
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Choose an action to perform on selected items
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="All Actions" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Actions</SelectItem>
                    <SelectItem value="moderation">Moderation</SelectItem>
                    <SelectItem value="verification">Verification</SelectItem>
                    <SelectItem value="user">User Actions</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>

                {/* Quick Actions */}
                {filteredActions.slice(0, 3).map((action) => (
                  <Button
                    key={action.id}
                    variant={action.variant || "default"}
                    size="sm"
                    onClick={() => handleActionClick(action)}
                    disabled={isProcessing}
                    className="hidden sm:flex"
                  >
                    {action.icon}
                    <span className="ml-2">{action.label}</span>
                  </Button>
                ))}

                {/* More Actions Dropdown */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" disabled={isProcessing}>
                      More Actions
                      <ChevronDown className="w-4 h-4 ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64">
                    {Object.entries(categorizedActions).map(([category, actions]) => (
                      <div key={category}>
                        <DropdownMenuLabel className="flex items-center gap-2">
                          {getCategoryIcon(category)}
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </DropdownMenuLabel>
                        {actions.map((action) => (
                          <DropdownMenuItem
                            key={action.id}
                            onClick={() => handleActionClick(action)}
                            className={action.variant === "destructive" ? "text-red-600" : ""}
                          >
                            {action.icon}
                            <div className="ml-2">
                              <div className="font-medium">{action.label}</div>
                              <div className="text-xs text-muted-foreground">
                                {action.description}
                              </div>
                            </div>
                          </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator />
                      </div>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClearSelection}
                  disabled={isProcessing}
                >
                  Clear Selection
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={confirmDialog} onOpenChange={setConfirmDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAction?.icon}
              Confirm {selectedAction?.label}
            </DialogTitle>
            <DialogDescription>
              {selectedAction?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert className={selectedAction?.variant === "destructive" ? "border-red-200" : ""}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This action will be applied to <strong>{selectedItems.length}</strong> selected items.
                {selectedAction?.variant === "destructive" && (
                  <span className="text-red-600 font-medium"> This action cannot be undone.</span>
                )}
              </AlertDescription>
            </Alert>

            {/* Selected Items Preview */}
            <div className="max-h-32 overflow-y-auto border rounded p-2">
              <div className="text-sm font-medium mb-2">Selected Items:</div>
              {selectedItems.slice(0, 5).map((item) => (
                <div key={item.id} className="text-xs text-muted-foreground py-1">
                  • {item.title} ({item.type})
                </div>
              ))}
              {selectedItems.length > 5 && (
                <div className="text-xs text-muted-foreground py-1">
                  ... and {selectedItems.length - 5} more items
                </div>
              )}
            </div>

            {selectedAction?.requiresNote && (
              <div className="space-y-2">
                <Label htmlFor="action-note">
                  {selectedAction.id === "notify-users" ? "Message" : "Reason"} (Required)
                </Label>
                <Textarea
                  id="action-note"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  placeholder={
                    selectedAction.id === "notify-users"
                      ? "Enter message to send to users..."
                      : "Enter reason for this action..."
                  }
                  rows={3}
                />
              </div>
            )}

            {/* Processing Progress */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>{processingStatus}</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setConfirmDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={selectedAction?.variant === "destructive" ? "destructive" : "default"}
              onClick={confirmAction}
              disabled={isProcessing || (selectedAction?.requiresNote && !actionNote.trim())}
            >
              {isProcessing ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {selectedAction?.icon}
                  <span className="ml-2">Confirm {selectedAction?.label}</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
