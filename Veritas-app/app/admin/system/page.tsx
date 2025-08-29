"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Server,
  Database,
  Shield,
  Zap,
  Settings,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Activity,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Clock,
  Users,
  FileText,
  Trash2,
  Archive,
  Play,
  Pause,
  Square,
  RotateCcw,
} from "lucide-react";

interface SystemMetric {
  name: string;
  value: number;
  unit: string;
  status: "healthy" | "warning" | "critical";
  threshold: {
    warning: number;
    critical: number;
  };
}

interface SystemService {
  name: string;
  status: "running" | "stopped" | "error";
  uptime: string;
  port: number;
  memory: number;
  cpu: number;
}

interface BackupJob {
  id: string;
  type: "database" | "files" | "config" | "full";
  status: "completed" | "running" | "failed" | "scheduled";
  lastRun: string;
  nextRun: string;
  size: string;
  duration: string;
}

const systemMetrics: SystemMetric[] = [
  {
    name: "CPU Usage",
    value: 45,
    unit: "%",
    status: "healthy",
    threshold: { warning: 70, critical: 90 },
  },
  {
    name: "Memory Usage",
    value: 62,
    unit: "%",
    status: "healthy",
    threshold: { warning: 80, critical: 95 },
  },
  {
    name: "Disk Usage",
    value: 78,
    unit: "%",
    status: "warning",
    threshold: { warning: 75, critical: 90 },
  },
  {
    name: "Network I/O",
    value: 34,
    unit: "Mbps",
    status: "healthy",
    threshold: { warning: 80, critical: 100 },
  },
];

const systemServices: SystemService[] = [
  {
    name: "API Server",
    status: "running",
    uptime: "7d 12h 34m",
    port: 3000,
    memory: 512,
    cpu: 15,
  },
  {
    name: "Database",
    status: "running",
    uptime: "7d 12h 34m",
    port: 5432,
    memory: 1024,
    cpu: 25,
  },
  {
    name: "Redis Cache",
    status: "running",
    uptime: "7d 12h 34m",
    port: 6379,
    memory: 128,
    cpu: 5,
  },
  {
    name: "AI Processing",
    status: "running",
    uptime: "2d 4h 16m",
    port: 8080,
    memory: 2048,
    cpu: 45,
  },
  {
    name: "Background Jobs",
    status: "running",
    uptime: "7d 12h 34m",
    port: 9000,
    memory: 256,
    cpu: 8,
  },
];

const backupJobs: BackupJob[] = [
  {
    id: "1",
    type: "database",
    status: "completed",
    lastRun: "2024-01-15 02:00:00",
    nextRun: "2024-01-16 02:00:00",
    size: "2.3 GB",
    duration: "4m 32s",
  },
  {
    id: "2",
    type: "files",
    status: "completed",
    lastRun: "2024-01-15 03:00:00",
    nextRun: "2024-01-16 03:00:00",
    size: "890 MB",
    duration: "2m 18s",
  },
  {
    id: "3",
    type: "config",
    status: "completed",
    lastRun: "2024-01-15 01:00:00",
    nextRun: "2024-01-16 01:00:00",
    size: "12 MB",
    duration: "15s",
  },
  {
    id: "4",
    type: "full",
    status: "scheduled",
    lastRun: "2024-01-14 00:00:00",
    nextRun: "2024-01-21 00:00:00",
    size: "15.2 GB",
    duration: "45m 12s",
  },
];

export default function SystemManagementPage() {
  const [systemConfig, setSystemConfig] = useState({
    maintenanceMode: false,
    debugMode: false,
    apiRateLimit: 1000,
    maxUsers: 10000,
    dataRetentionDays: 90,
  });

  const [backupDialog, setBackupDialog] = useState(false);
  const [restoreDialog, setRestoreDialog] = useState(false);
  const [maintenanceDialog, setMaintenanceDialog] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<BackupJob | null>(null);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "healthy":
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case "stopped":
      case "failed":
      case "error":
      case "critical":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
      case "healthy":
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "warning":
      case "scheduled":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "stopped":
      case "failed":
      case "error":
      case "critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const handleServiceAction = async (serviceName: string, action: string) => {
    setIsLoading(true);
    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Service ${serviceName} ${action} executed successfully`);
    } catch (error) {
      console.error(`Error executing ${action} on ${serviceName}:`, error);
    }
    setIsLoading(false);
  };

  const handleBackupAction = async (backupId: string, action: string) => {
    setIsLoading(true);
    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Backup ${action} executed successfully`);
    } catch (error) {
      console.error(`Error executing backup ${action}:`, error);
    }
    setIsLoading(false);
    setBackupDialog(false);
  };

  const handleConfigUpdate = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("System configuration updated successfully");
    } catch (error) {
      console.error("Error updating system configuration:", error);
    }
    setIsLoading(false);
  };

  const handleMaintenanceMode = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for static export
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSystemConfig((prev) => ({
        ...prev,
        maintenanceMode: !prev.maintenanceMode,
      }));
      console.log("Maintenance mode toggled successfully");
    } catch (error) {
      console.error("Error toggling maintenance mode:", error);
    }
    setIsLoading(false);
    setMaintenanceDialog(false);
  };

  const exportSystemLogs = async () => {
    try {
      // Simulate export for static export - create dummy CSV data
      const csvData = "timestamp,level,message,source\n2024-01-15T10:30:00Z,INFO,System started,core\n2024-01-15T10:31:00Z,WARNING,High memory usage,monitor\n";
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `system-logs-${new Date().toISOString().split("T")[0]}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting system logs:", error);
    }
  };

  return (
    <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4">
      {/* Header */}
      <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-foreground">
            System Management
          </h1>
          <p className="text-xs xs:text-sm text-muted-foreground">
            Monitor and manage system resources, services, and configurations
          </p>
        </div>
        <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
          <Button
            onClick={exportSystemLogs}
            variant="outline"
            size="sm"
            className="h-8 xs:h-9 text-xs xs:text-sm tap-target"
          >
            <Download className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
            Export Logs
          </Button>
          <Button
            onClick={() => setMaintenanceDialog(true)}
            variant={systemConfig.maintenanceMode ? "destructive" : "outline"}
            size="sm"
            className="h-8 xs:h-9 text-xs xs:text-sm tap-target"
          >
            <Settings className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
            <span className="truncate">{systemConfig.maintenanceMode ? "Exit Maintenance" : "Maintenance"}</span>
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 xs:gap-3 lg:gap-4">
        {systemMetrics.map((metric) => (
          <Card key={metric.name} className="p-3 xs:p-4 shadow-sm">
            <div className="flex items-center justify-between mb-2 xs:mb-3">
              <div className="flex items-center gap-1 xs:gap-2">
                {metric.name.includes("CPU") && (
                  <Cpu className="w-3 h-3 xs:w-4 xs:h-4 text-blue-500" />
                )}
                {metric.name.includes("Memory") && (
                  <MemoryStick className="w-3 h-3 xs:w-4 xs:h-4 text-green-500" />
                )}
                {metric.name.includes("Disk") && (
                  <HardDrive className="w-3 h-3 xs:w-4 xs:h-4 text-purple-500" />
                )}
                {metric.name.includes("Network") && (
                  <Network className="w-3 h-3 xs:w-4 xs:h-4 text-orange-500" />
                )}
                <span className="text-xs xs:text-sm font-medium truncate" title={metric.name}>{metric.name}</span>
              </div>
              {getStatusIcon(metric.status)}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className="text-sm text-muted-foreground">
                  {metric.unit}
                </span>
              </div>
              <Progress
                value={metric.value}
                className={`h-2 ${
                  metric.status === "critical"
                    ? "[&>div]:bg-red-500"
                    : metric.status === "warning"
                      ? "[&>div]:bg-yellow-500"
                      : "[&>div]:bg-green-500"
                }`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>
                  Warning: {metric.threshold.warning}
                  {metric.unit}
                </span>
                <span>
                  Critical: {metric.threshold.critical}
                  {metric.unit}
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="services" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="services" className="text-xs sm:text-sm">
            Services
          </TabsTrigger>
          <TabsTrigger value="backups" className="text-xs sm:text-sm">
            Backups
          </TabsTrigger>
          <TabsTrigger value="config" className="text-xs sm:text-sm">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="logs" className="text-xs sm:text-sm">
            Logs
          </TabsTrigger>
        </TabsList>

        {/* Services Tab */}
        <TabsContent value="services" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5" />
                System Services
              </CardTitle>
              <CardDescription>
                Monitor and control system services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {systemServices.map((service) => (
                  <div
                    key={service.name}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(service.status)}
                          <span className="font-medium">{service.name}</span>
                        </div>
                        <Badge
                          className={`${getStatusColor(service.status)} text-xs`}
                        >
                          {service.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>Port: {service.port}</div>
                        <div>Uptime: {service.uptime}</div>
                        <div>Memory: {service.memory}MB</div>
                        <div>CPU: {service.cpu}%</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleServiceAction(service.name, "restart")
                        }
                        disabled={isLoading}
                        className="h-8 text-xs"
                      >
                        <RefreshCw className="w-3 h-3 mr-1" />
                        Restart
                      </Button>
                      {service.status === "running" ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleServiceAction(service.name, "stop")
                          }
                          disabled={isLoading}
                          className="h-8 text-xs"
                        >
                          <Pause className="w-3 h-3 mr-1" />
                          Stop
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            handleServiceAction(service.name, "start")
                          }
                          disabled={isLoading}
                          className="h-8 text-xs"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Start
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backups Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Archive className="w-5 h-5" />
                    Backup Management
                  </CardTitle>
                  <CardDescription>
                    Manage automated backups and restore points
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setBackupDialog(true)}
                    className="h-9 tap-target"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Create Backup
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setRestoreDialog(true)}
                    className="h-9 tap-target"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Restore
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backupJobs.map((backup) => (
                  <div
                    key={backup.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          {backup.type === "database" && (
                            <Database className="w-4 h-4 text-blue-500" />
                          )}
                          {backup.type === "files" && (
                            <FileText className="w-4 h-4 text-green-500" />
                          )}
                          {backup.type === "config" && (
                            <Settings className="w-4 h-4 text-purple-500" />
                          )}
                          {backup.type === "full" && (
                            <Archive className="w-4 h-4 text-orange-500" />
                          )}
                          <span className="font-medium capitalize">
                            {backup.type} Backup
                          </span>
                        </div>
                        <Badge
                          className={`${getStatusColor(backup.status)} text-xs`}
                        >
                          {backup.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-muted-foreground">
                        <div>Size: {backup.size}</div>
                        <div>Duration: {backup.duration}</div>
                        <div>Last: {backup.lastRun}</div>
                        <div>Next: {backup.nextRun}</div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleBackupAction(backup.id, "run")}
                        disabled={isLoading || backup.status === "running"}
                        className="h-8 text-xs"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Run Now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          handleBackupAction(backup.id, "download")
                        }
                        disabled={isLoading || backup.status !== "completed"}
                        className="h-8 text-xs"
                      >
                        <Download className="w-3 h-3 mr-1" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Configuration
              </CardTitle>
              <CardDescription>
                Configure system settings and operational parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">
                        Maintenance Mode
                      </Label>
                      <p className="text-xs text-muted-foreground">
                        Block user access for system maintenance
                      </p>
                    </div>
                    <Switch
                      checked={systemConfig.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSystemConfig((prev) => ({
                          ...prev,
                          maintenanceMode: checked,
                        }))
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-sm font-medium">Debug Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Enable detailed logging and error reporting
                      </p>
                    </div>
                    <Switch
                      checked={systemConfig.debugMode}
                      onCheckedChange={(checked) =>
                        setSystemConfig((prev) => ({
                          ...prev,
                          debugMode: checked,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit">
                      API Rate Limit (requests/hour)
                    </Label>
                    <Input
                      id="rate-limit"
                      type="number"
                      value={systemConfig.apiRateLimit}
                      onChange={(e) =>
                        setSystemConfig((prev) => ({
                          ...prev,
                          apiRateLimit: parseInt(e.target.value) || 1000,
                        }))
                      }
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="max-users">Maximum Users</Label>
                    <Input
                      id="max-users"
                      type="number"
                      value={systemConfig.maxUsers}
                      onChange={(e) =>
                        setSystemConfig((prev) => ({
                          ...prev,
                          maxUsers: parseInt(e.target.value) || 10000,
                        }))
                      }
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="retention">Data Retention (days)</Label>
                    <Input
                      id="retention"
                      type="number"
                      value={systemConfig.dataRetentionDays}
                      onChange={(e) =>
                        setSystemConfig((prev) => ({
                          ...prev,
                          dataRetentionDays: parseInt(e.target.value) || 90,
                        }))
                      }
                      className="h-9"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleConfigUpdate}
                  disabled={isLoading}
                  className="h-9 tap-target"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isLoading ? "Updating..." : "Update Configuration"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Logs Tab */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    System Logs
                  </CardTitle>
                  <CardDescription>
                    View and analyze system activity logs
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={exportSystemLogs}
                    className="h-9 tap-target"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 tap-target"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear Logs
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Select defaultValue="all">
                    <SelectTrigger className="w-full sm:w-48 h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Logs</SelectItem>
                      <SelectItem value="error">Error Logs</SelectItem>
                      <SelectItem value="warning">Warning Logs</SelectItem>
                      <SelectItem value="info">Info Logs</SelectItem>
                      <SelectItem value="debug">Debug Logs</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input placeholder="Search logs..." className="h-9" />

                  <Button variant="outline" size="sm" className="h-9 shrink-0">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                  </Button>
                </div>

                <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-y-auto">
                  <div>
                    [2024-01-15 14:32:15] INFO: System startup completed
                  </div>
                  <div>
                    [2024-01-15 14:32:16] INFO: Database connection established
                  </div>
                  <div>[2024-01-15 14:32:17] INFO: Redis cache connected</div>
                  <div>[2024-01-15 14:32:18] INFO: AI service initialized</div>
                  <div>
                    [2024-01-15 14:32:19] INFO: API server listening on port
                    3000
                  </div>
                  <div>
                    [2024-01-15 14:35:23] INFO: User authentication successful -
                    user@example.com
                  </div>
                  <div>
                    [2024-01-15 14:36:45] WARNING: High memory usage detected -
                    78%
                  </div>
                  <div>
                    [2024-01-15 14:38:12] INFO: Verification completed -
                    claim_id: 12345
                  </div>
                  <div>
                    [2024-01-15 14:40:33] ERROR: Failed to process image -
                    invalid format
                  </div>
                  <div>
                    [2024-01-15 14:42:15] INFO: Backup job started - database
                  </div>
                  <div>
                    [2024-01-15 14:46:47] INFO: Backup job completed - database
                    (4m 32s)
                  </div>
                  <div>
                    [2024-01-15 14:48:22] INFO: Cache cleared - expired entries
                    removed
                  </div>
                  <div>
                    [2024-01-15 14:50:11] WARNING: API rate limit exceeded - IP:
                    192.168.1.100
                  </div>
                  <div>
                    [2024-01-15 14:52:33] INFO: System health check passed
                  </div>
                  <div>
                    [2024-01-15 14:54:56] INFO: New user registered -
                    user123@example.com
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Backup Dialog */}
      <Dialog open={backupDialog} onOpenChange={setBackupDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">Create System Backup</DialogTitle>
            <DialogDescription className="text-base">
              Choose backup type and configuration
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Backup Type</Label>
              <Select defaultValue="database">
                <SelectTrigger className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="database">Database Only</SelectItem>
                  <SelectItem value="files">Files Only</SelectItem>
                  <SelectItem value="config">Configuration</SelectItem>
                  <SelectItem value="full">Full System Backup</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-sm md:text-base leading-relaxed">
                Full system backups may take up to 45 minutes and will
                temporarily impact performance.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setBackupDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={() => handleBackupAction("new", "create")}
              disabled={isLoading}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <Archive className="w-4 h-4 mr-2" />
              Create Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Restore Dialog */}
      <Dialog open={restoreDialog} onOpenChange={setRestoreDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl text-red-600">
              System Restore
            </DialogTitle>
            <DialogDescription className="text-base">
              Restore system from a backup point
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-sm md:text-base leading-relaxed text-red-700 dark:text-red-300">
                <strong>Warning:</strong> System restore will overwrite current
                data and may cause downtime. Ensure you have recent backups.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              <Label>Select Backup</Label>
              <Select>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Choose backup to restore from" />
                </SelectTrigger>
                <SelectContent>
                  {backupJobs
                    .filter((b) => b.status === "completed")
                    .map((backup) => (
                      <SelectItem key={backup.id} value={backup.id}>
                        {backup.type} - {backup.lastRun} ({backup.size})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="restore-confirm">Type "RESTORE" to confirm</Label>
              <Input
                id="restore-confirm"
                placeholder="Type RESTORE to confirm"
                className="h-10 text-base"
              />
            </div>
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setRestoreDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={isLoading}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Restore System
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Maintenance Mode Dialog */}
      <Dialog open={maintenanceDialog} onOpenChange={setMaintenanceDialog}>
        <DialogContent className="mobile-modal w-[95vw] max-w-md mx-4">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl">
              {systemConfig.maintenanceMode
                ? "Exit Maintenance Mode"
                : "Enter Maintenance Mode"}
            </DialogTitle>
            <DialogDescription className="text-base">
              {systemConfig.maintenanceMode
                ? "Allow users to access the platform again"
                : "Block user access for system maintenance"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {!systemConfig.maintenanceMode && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-sm md:text-base leading-relaxed">
                  Users will be unable to access the platform while maintenance
                  mode is active.
                </AlertDescription>
              </Alert>
            )}

            {!systemConfig.maintenanceMode && (
              <div className="space-y-2">
                <Label htmlFor="maintenance-message">Maintenance Message</Label>
                <Textarea
                  id="maintenance-message"
                  placeholder="Enter a message to display to users..."
                  value={maintenanceMessage}
                  onChange={(e) => setMaintenanceMessage(e.target.value)}
                  className="min-h-20 text-base"
                />
              </div>
            )}
          </div>
          <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setMaintenanceDialog(false)}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleMaintenanceMode}
              disabled={isLoading}
              variant={systemConfig.maintenanceMode ? "default" : "destructive"}
              className="w-full xs:w-auto text-base h-12 tap-target font-medium"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isLoading
                ? "Processing..."
                : systemConfig.maintenanceMode
                  ? "Exit Maintenance"
                  : "Enter Maintenance"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
