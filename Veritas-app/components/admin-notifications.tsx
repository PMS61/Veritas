"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Bell,
  X,
  Clock,
  User,
  Activity,
  Shield,
  Zap,
} from "lucide-react";

interface AdminNotification {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
  timestamp: string;
  category: "system" | "verification" | "user" | "emergency" | "alert";
  priority: "low" | "medium" | "high" | "critical";
  read: boolean;
  actionRequired?: boolean;
  metadata?: {
    userId?: string;
    claimId?: string;
    actionType?: string;
    systemComponent?: string;
  };
}

interface AdminNotificationsProps {
  notifications: AdminNotification[];
  onNotificationRead: (id: string) => void;
  onNotificationDismiss: (id: string) => void;
  onClearAll: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminNotifications({
  notifications,
  onNotificationRead,
  onNotificationDismiss,
  onClearAll,
  isOpen,
  onOpenChange,
}: AdminNotificationsProps) {
  const [selectedNotification, setSelectedNotification] = useState<AdminNotification | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "priority">("all");

  const unreadCount = notifications.filter(n => !n.read).length;
  const priorityCount = notifications.filter(n => n.priority === "high" || n.priority === "critical").length;

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case "unread":
        return !notification.read;
      case "priority":
        return notification.priority === "high" || notification.priority === "critical";
      default:
        return true;
    }
  });

  const getNotificationIcon = (type: string, category: string) => {
    if (category === "emergency") {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }

    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Bell className="w-5 h-5 text-blue-500" />;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "system":
        return <Activity className="w-4 h-4" />;
      case "verification":
        return <Shield className="w-4 h-4" />;
      case "user":
        return <User className="w-4 h-4" />;
      case "emergency":
        return <Zap className="w-4 h-4" />;
      case "alert":
        return <Bell className="w-4 h-4" />;
      default:
        return <Bell className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 border-blue-200";
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const handleNotificationClick = (notification: AdminNotification) => {
    if (!notification.read) {
      onNotificationRead(notification.id);
    }
    setSelectedNotification(notification);
  };

  return (
    <>
      {/* Notification Panel */}
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-3">
              <Bell className="w-5 h-5" />
              Admin Notifications
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} new
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              System alerts, verification updates, and admin actions
            </DialogDescription>
          </DialogHeader>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 pb-4">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All ({notifications.length})
            </Button>
            <Button
              variant={filter === "unread" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("unread")}
            >
              Unread ({unreadCount})
            </Button>
            <Button
              variant={filter === "priority" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("priority")}
            >
              Priority ({priorityCount})
            </Button>
            <div className="flex-1" />
            {notifications.length > 0 && (
              <Button variant="ghost" size="sm" onClick={onClearAll}>
                Clear All
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <ScrollArea className="flex-1 max-h-96">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications to show</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-blue-50/50 dark:bg-blue-950/20 border-blue-200" : "bg-background"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      {getNotificationIcon(notification.type, notification.category)}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium truncate ${!notification.read ? "text-primary" : ""}`}>
                            {notification.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={`${getPriorityColor(notification.priority)} text-xs shrink-0`}
                          >
                            {notification.priority}
                          </Badge>
                        </div>

                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                          {notification.message}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(notification.category)}
                            {notification.category}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimestamp(notification.timestamp)}
                          </span>
                          {notification.actionRequired && (
                            <Badge variant="destructive" className="text-xs">
                              Action Required
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {!notification.read && (
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-6 w-6 p-0 hover:bg-red-100 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            onNotificationDismiss(notification.id);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Notification Detail Dialog */}
      {selectedNotification && (
        <Dialog
          open={!!selectedNotification}
          onOpenChange={() => setSelectedNotification(null)}
        >
          <DialogContent className="max-w-lg">
            <DialogHeader className="pb-4">
              <DialogTitle className="flex items-center gap-3">
                {getNotificationIcon(selectedNotification.type, selectedNotification.category)}
                {selectedNotification.title}
                <Badge
                  variant="outline"
                  className={getPriorityColor(selectedNotification.priority)}
                >
                  {selectedNotification.priority}
                </Badge>
              </DialogTitle>
              <DialogDescription className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1">
                  {getCategoryIcon(selectedNotification.category)}
                  {selectedNotification.category}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimestamp(selectedNotification.timestamp)}
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Message</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedNotification.message}
                </p>
              </div>

              {selectedNotification.metadata && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Details</h4>
                  <div className="space-y-2 text-sm">
                    {selectedNotification.metadata.userId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">User ID:</span>
                        <span className="font-mono">{selectedNotification.metadata.userId}</span>
                      </div>
                    )}
                    {selectedNotification.metadata.claimId && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Claim ID:</span>
                        <span className="font-mono">{selectedNotification.metadata.claimId}</span>
                      </div>
                    )}
                    {selectedNotification.metadata.actionType && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Action:</span>
                        <span className="capitalize">{selectedNotification.metadata.actionType}</span>
                      </div>
                    )}
                    {selectedNotification.metadata.systemComponent && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">System:</span>
                        <span>{selectedNotification.metadata.systemComponent}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedNotification.actionRequired && (
                <Alert className="border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-700 dark:text-orange-300">
                    This notification requires immediate action. Please review and take appropriate measures.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setSelectedNotification(null)}
              >
                Close
              </Button>
              {selectedNotification.actionRequired && (
                <Button>
                  Take Action
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}

// Toast notification component for quick alerts
export function AdminToast({
  notification,
  onDismiss,
}: {
  notification: AdminNotification;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, notification.priority === "critical" ? 10000 : 5000);

    return () => clearTimeout(timer);
  }, [notification.priority, onDismiss]);

  return (
    <div className="fixed top-4 right-4 z-50 w-96 animate-in slide-in-from-right duration-300">
      <Alert className={`border-2 ${
        notification.type === "error" ? "border-red-200 bg-red-50" :
        notification.type === "warning" ? "border-yellow-200 bg-yellow-50" :
        notification.type === "success" ? "border-green-200 bg-green-50" :
        "border-blue-200 bg-blue-50"
      }`}>
        <div className="flex items-start gap-3">
          {getNotificationIcon(notification.type, notification.category)}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-medium text-sm">{notification.title}</h4>
              <Badge
                variant="outline"
                className="text-xs"
              >
                {notification.priority}
              </Badge>
            </div>
            <AlertDescription className="text-sm">
              {notification.message}
            </AlertDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={onDismiss}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </Alert>
    </div>
  );
}

function getNotificationIcon(type: string, category: string) {
  if (category === "emergency") {
    return <AlertTriangle className="w-4 h-4 text-red-500" />;
  }

  switch (type) {
    case "success":
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    case "error":
      return <XCircle className="w-4 h-4 text-red-500" />;
    case "warning":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    default:
      return <Bell className="w-4 h-4 text-blue-500" />;
  }
}
