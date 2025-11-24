"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Bell,
  BellRing,
  Clock,
  Filter,
  Mail,
  MessageSquare,
  Phone,
  Search,
  Settings,
  Shield,
  Smartphone,
  Users,
  Zap,
  CheckCircle,
  XCircle,
  Eye,
  Plus,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getAlerts, getAlertStats, updateAlertStatus, assignAlert, type Alert } from "@/actions/alerts"

interface AlertRule {
  id: string
  name: string
  description: string
  conditions: string[]
  severity: "critical" | "high" | "medium" | "low"
  channels: string[]
  recipients: string[]
  enabled: boolean
  lastTriggered?: string
  triggerCount: number
}

interface NotificationChannel {
  id: string
  type: "email" | "sms" | "slack" | "webhook" | "push"
  name: string
  endpoint: string
  enabled: boolean
  lastUsed?: string
}

export function AlertsManagement() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [alertStats, setAlertStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [isPerformingAction, setIsPerformingAction] = useState<string | null>(null)

  // Mock data for rules and channels (these would have their own server actions)
  const [alertRules] = useState<AlertRule[]>([
    {
      id: "1",
      name: "Critical Misinformation Spike",
      description: "Trigger when misinformation detection increases by >200% in 1 hour",
      conditions: ["misinformation_rate > 200%", "time_window = 1h"],
      severity: "critical",
      channels: ["email", "sms", "slack"],
      recipients: ["crisis-team@org.com"],
      enabled: true,
      lastTriggered: "2024-01-15T10:45:00Z",
      triggerCount: 3,
    },
  ])

  const [channels] = useState<NotificationChannel[]>([
    {
      id: "1",
      type: "email",
      name: "Crisis Team Email",
      endpoint: "crisis-team@organization.com",
      enabled: true,
      lastUsed: "2024-01-15T10:45:00Z",
    },
  ])

  // Load alerts and stats
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        setError("")

        const [alertsResult, statsResult] = await Promise.all([
          getAlerts({
            severity: selectedSeverity !== "all" ? selectedSeverity as any : undefined,
            status: selectedStatus !== "all" ? selectedStatus as any : undefined,
          }),
          getAlertStats()
        ])

        if (alertsResult.error) {
          setError(alertsResult.error)
        } else if (alertsResult.data) {
          setAlerts(alertsResult.data)
        }

        if (statsResult.data) {
          setAlertStats(statsResult.data)
        }
      } catch (error) {
        console.error('Failed to load alerts:', error)
        setError("Failed to load alerts. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [selectedSeverity, selectedStatus])

  // Handle alert actions
  const handleStatusUpdate = async (alertId: string, newStatus: 'acknowledged' | 'resolved' | 'dismissed') => {
    if (!user) return

    try {
      setIsPerformingAction(alertId)
      const result = await updateAlertStatus(alertId, newStatus, user.id)

      if (result.success) {
        // Update local state
        setAlerts(prev => prev.map(alert =>
          alert.id === alertId
            ? { ...alert, status: newStatus, resolved_at: newStatus === 'resolved' ? new Date().toISOString() : undefined }
            : alert
        ))

        // Update stats if available
        if (alertStats) {
          setAlertStats(prev => ({
            ...prev,
            active_alerts: newStatus === 'resolved' ? Math.max(0, prev.active_alerts - 1) : prev.active_alerts,
            resolved_alerts: newStatus === 'resolved' ? prev.resolved_alerts + 1 : prev.resolved_alerts,
          }))
        }
      } else {
        setError(result.error || "Failed to update alert status")
      }
    } catch (error) {
      console.error('Failed to update alert status:', error)
      setError("An unexpected error occurred")
    } finally {
      setIsPerformingAction(null)
    }
  }

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      alert.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alert.tags && alert.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
    const matchesSeverity = selectedSeverity === "all" || alert.severity === selectedSeverity
    const matchesStatus = selectedStatus === "all" || alert.status === selectedStatus
    return matchesSearch && matchesSeverity && matchesStatus
  })

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-destructive text-destructive-foreground"
      case "medium":
        return "bg-yellow-500 text-white"
      case "low":
        return "bg-green-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-destructive text-destructive-foreground"
      case "acknowledged":
        return "bg-yellow-500 text-white"
      case "resolved":
        return "bg-green-500 text-white"
      case "dismissed":
        return "bg-gray-500 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <BellRing className="w-4 h-4" />
      case "acknowledged":
        return <Eye className="w-4 h-4" />
      case "resolved":
        return <CheckCircle className="w-4 h-4" />
      case "dismissed":
        return <XCircle className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const getChannelIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="w-4 h-4" />
      case "sms":
        return <Phone className="w-4 h-4" />
      case "slack":
        return <MessageSquare className="w-4 h-4" />
      case "webhook":
        return <Zap className="w-4 h-4" />
      case "push":
        return <Smartphone className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  // Calculate stats from loaded data or fallback
  const currentAlertStats = alertStats || {
    active_alerts: alerts.filter((a) => a.status === "active").length,
    resolved_alerts: alerts.filter((a) => a.status === "resolved").length,
  }

  const displayStats = {
    active: currentAlertStats.active_alerts || alerts.filter((a) => a.status === "active").length,
    acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
    resolved: currentAlertStats.resolved_alerts || alerts.filter((a) => a.status === "resolved").length,
    dismissed: alerts.filter((a) => a.status === "dismissed").length,
  }

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4">
      {/* Header */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-foreground flex items-center gap-2">
            <Bell className="w-5 h-5 xs:w-6 xs:h-6 text-primary" />
            Alerts & Notifications
          </h1>
          <p className="text-xs xs:text-sm text-muted-foreground">Manage crisis alerts and notification systems</p>
        </div>

        <div className="flex flex-col xs:flex-row items-start xs:items-center gap-2 w-full xs:w-auto">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.location.reload()}
            className="text-xs"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Refresh
          </Button>
          <Badge className="bg-destructive text-destructive-foreground text-xs">{displayStats.active} Active</Badge>
          <div className="flex items-center gap-2 text-xs xs:text-sm text-muted-foreground">
            <BellRing className="w-3 h-3 xs:w-4 xs:h-4 text-primary" />
            <span>Real-time Alerts</span>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Alert Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 lg:gap-4">
        {Object.entries(displayStats).map(([status, count]) => (
          <Card key={status} className="bg-card shadow-sm">
            <CardContent className="p-3 xs:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs xs:text-sm font-medium text-card-foreground capitalize truncate">{status}</p>
                  <p className="text-lg xs:text-2xl font-bold text-primary">{count}</p>
                </div>
                <div className={getStatusColor(status).split(" ")[0]}>{getStatusIcon(status)}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="alerts" className="space-y-3 xs:space-y-4 sm:space-y-6">
        <div className="overflow-x-auto">
          <TabsList className="grid min-w-[300px] w-full grid-cols-3 h-9 xs:h-10">
            <TabsTrigger value="alerts" className="text-xs xs:text-sm tap-target">Active Alerts</TabsTrigger>
            <TabsTrigger value="rules" className="text-xs xs:text-sm tap-target">Alert Rules</TabsTrigger>
            <TabsTrigger value="channels" className="text-xs xs:text-sm tap-target">Notification Channels</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="alerts" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Filters */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Filter className="w-4 h-4 xs:w-5 xs:h-5" />
                Alert Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search alerts, descriptions, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex flex-col xs:flex-row gap-2 xs:gap-4">
                  <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                    <SelectTrigger className="w-full xs:w-32">
                      <SelectValue placeholder="Severity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Severity</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-full xs:w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="acknowledged">Acknowledged</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="dismissed">Dismissed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Alerts List */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <BellRing className="w-5 h-5 text-primary" />
                Crisis Alerts
                <Badge className="bg-primary text-primary-foreground">{filteredAlerts.length} alerts</Badge>
              </CardTitle>
              <CardDescription>Real-time crisis monitoring alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center h-[400px] xs:h-[500px] sm:h-[600px]">
                  <div className="text-center">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-muted-foreground" />
                    <p className="text-muted-foreground">Loading alerts...</p>
                  </div>
                </div>
              ) : (
                <ScrollArea className="h-[400px] xs:h-[500px] sm:h-[600px] w-full">
                  <div className="space-y-3 xs:space-y-4">
                    {filteredAlerts.length > 0 ? filteredAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 xs:p-4 rounded-lg bg-muted/50 border border-border">
                      {/* Header */}
                      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 xs:gap-3 mb-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge className={getSeverityColor(alert.severity)}>{alert.severity.toUpperCase()}</Badge>
                          <Badge className={getStatusColor(alert.status)} variant="outline">
                            {getStatusIcon(alert.status)}
                            <span className="ml-1">{alert.status.toUpperCase()}</span>
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {alert.category}
                          </Badge>
                        </div>
                        <div className="text-left xs:text-right text-xs text-muted-foreground xs:flex-shrink-0">
                          <p>{new Date(alert.timestamp).toLocaleString()}</p>
                          {alert.relatedIncidents > 0 && <p>{alert.relatedIncidents} related incidents</p>}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="mb-3">
                        <h3 className="font-semibold text-card-foreground mb-1 break-words">{alert.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed break-words">{alert.description}</p>
                      </div>

                      {/* Metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 xs:gap-4 mb-3 text-xs text-muted-foreground">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 flex-shrink-0" />
                            <span className="break-words">Source: {alert.source || 'Unknown'}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-3 h-3 flex-shrink-0" />
                            <span className="break-words">Assigned: {alert.assigned_to_profile?.full_name || 'Unassigned'}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 flex-shrink-0" />
                            <span>Age: {Math.round((Date.now() - new Date(alert.created_at || alert.timestamp).getTime()) / 60000)}m</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags and Actions */}
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2 pt-3 border-t border-border">
                        <div className="flex items-center gap-1 flex-wrap">
                          {alert.tags && alert.tags.length > 0 && alert.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 flex-wrap">
                          {alert.actions && alert.actions.length > 0 && alert.actions.map((action: string) => (
                            <Badge key={action} className="bg-primary text-primary-foreground text-xs">
                              {action.replace("-", " ")}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 mt-3">
                        {alert.status === "active" && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 text-xs tap-target"
                            onClick={() => handleStatusUpdate(alert.id, 'acknowledged')}
                            disabled={isPerformingAction === alert.id}
                          >
                            <Eye className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                            <span className="hidden xs:inline">Acknowledge</span>
                            <span className="xs:hidden">Ack</span>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="h-8 text-xs tap-target">
                          <Users className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                          Assign
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs tap-target">
                          <MessageSquare className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                          <span className="hidden xs:inline">Add Note</span>
                          <span className="xs:hidden">Note</span>
                        </Button>
                        {alert.status !== "resolved" && (
                          <Button
                            size="sm"
                            variant="default"
                            className="h-8 text-xs tap-target"
                            onClick={() => handleStatusUpdate(alert.id, 'resolved')}
                            disabled={isPerformingAction === alert.id}
                          >
                            <CheckCircle className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  )) : (
                      <div className="text-center py-8">
                        <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Alerts Found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery || selectedSeverity !== "all" || selectedStatus !== "all"
                            ? "No alerts match your current filters."
                            : "No alerts have been created yet."
                          }
                        </p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          {/* Alert Rules */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <Settings className="w-5 h-5 text-primary" />
                Alert Rules Configuration
                <Badge className="bg-primary text-primary-foreground">{alertRules.length} rules</Badge>
              </CardTitle>
              <CardDescription>Configure automated alert triggers and conditions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {alertRules.map((rule) => (
                  <div key={rule.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-card-foreground">{rule.name}</h3>
                          <Badge className={getSeverityColor(rule.severity)}>{rule.severity}</Badge>
                          <Switch checked={rule.enabled} />
                        </div>
                        <p className="text-sm text-muted-foreground">{rule.description}</p>
                      </div>
                      <div className="text-right text-xs text-muted-foreground">
                        <p>Triggered: {rule.triggerCount} times</p>
                        {rule.lastTriggered && <p>Last: {new Date(rule.lastTriggered).toLocaleString()}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-3">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Conditions:</p>
                        <div className="space-y-1">
                          {rule.conditions.map((condition, index) => (
                            <Badge key={index} variant="secondary" className="text-xs mr-1">
                              {condition}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Notification Channels:</p>
                        <div className="space-y-1">
                          {rule.channels.map((channel, index) => (
                            <Badge key={index} className="bg-primary text-primary-foreground text-xs mr-1">
                              {channel}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <div className="text-xs text-muted-foreground">Recipients: {rule.recipients.join(", ")}</div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Edit Rule
                        </Button>
                        <Button size="sm" variant="outline">
                          Test Rule
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="channels" className="space-y-6">
          {/* Notification Channels */}
          <Card className="bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-card-foreground">
                <MessageSquare className="w-5 h-5 text-primary" />
                Notification Channels
                <Badge className="bg-primary text-primary-foreground">{channels.length} channels</Badge>
              </CardTitle>
              <CardDescription>Configure notification delivery channels and endpoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {channels.map((channel) => (
                  <div key={channel.id} className="p-4 rounded-lg bg-muted/50 border border-border">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getChannelIcon(channel.type)}
                        <div>
                          <h3 className="font-semibold text-card-foreground">{channel.name}</h3>
                          <p className="text-sm text-muted-foreground">{channel.endpoint}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch checked={channel.enabled} />
                        <Badge className={channel.enabled ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>
                          {channel.enabled ? "Active" : "Disabled"}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-border text-xs text-muted-foreground">
                      <div>
                        Type: <span className="capitalize">{channel.type}</span>
                        {channel.lastUsed && (
                          <span className="ml-4">Last used: {new Date(channel.lastUsed).toLocaleString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline">
                          Test
                        </Button>
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
