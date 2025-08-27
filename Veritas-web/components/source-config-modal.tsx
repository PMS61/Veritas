"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Settings,
  Activity,
  BarChart3,
  Shield,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Plus,
  Trash2,
  Key,
  Globe,
  MessageSquare,
  FileText,
  Users,
} from "lucide-react";

interface SourceData {
  id: number;
  name: string;
  type: string;
  status: string;
  reliability: number;
  dataPoints: number;
  lastUpdate: string;
  icon: any;
  config: Record<string, any>;
  credentials?: {
    apiKey?: string;
    secretKey?: string;
    accessToken?: string;
  };
  monitoring: {
    uptime: number;
    errorRate: number;
    latency: number;
    dataQuality: number;
  };
}

interface SourceConfigModalProps {
  source: SourceData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedSource: SourceData) => void;
}

export function SourceConfigModal({
  source,
  isOpen,
  onClose,
  onSave,
}: SourceConfigModalProps) {
  const [formData, setFormData] = useState<SourceData | null>(null);
  const [activeTab, setActiveTab] = useState("general");
  const [isSaving, setIsSaving] = useState(false);
  const [testConnection, setTestConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    if (source) {
      setFormData({ ...source });
    }
  }, [source]);

  const handleInputChange = (field: string, value: any, section?: string) => {
    if (!formData) return;

    setFormData((prev) => {
      if (!prev) return prev;

      if (section) {
        return {
          ...prev,
          [section]: {
            ...prev[section as keyof typeof prev],
            [field]: value,
          },
        };
      }

      return {
        ...prev,
        [field]: value,
      };
    });
  };

  const handleTestConnection = async () => {
    if (!formData) return;

    setTestConnection(true);
    setConnectionResult(null);

    try {
      // Simulate API call to test connection
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock success/failure based on source status
      const success = formData.status === "active" || Math.random() > 0.3;

      setConnectionResult({
        success,
        message: success
          ? "Connection successful! Data source is responding correctly."
          : "Connection failed. Please check your credentials and configuration."
      });
    } catch (error) {
      setConnectionResult({
        success: false,
        message: "Failed to test connection. Please try again."
      });
    } finally {
      setTestConnection(false);
    }
  };

  const handleSave = async () => {
    if (!formData) return;

    setIsSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving source configuration:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200";
      case "warning":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200";
      case "inactive":
        return "text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "social media":
        return MessageSquare;
      case "messaging":
        return MessageSquare;
      case "news":
        return FileText;
      case "forum":
        return Users;
      case "official":
        return Globe;
      default:
        return Settings;
    }
  };

  if (!formData) return null;

  const SourceIcon = getSourceIcon(formData.type);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <SourceIcon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl">Configure Source</DialogTitle>
              <DialogDescription className="text-base">
                Manage settings and monitoring for {formData.name}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(formData.status)}>
              {formData.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <div className="mt-4 max-h-[60vh] overflow-y-auto">
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="source-name">Source Name</Label>
                    <Input
                      id="source-name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Enter source name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source-type">Source Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Social Media">Social Media</SelectItem>
                        <SelectItem value="Messaging">Messaging</SelectItem>
                        <SelectItem value="News">News</SelectItem>
                        <SelectItem value="Forum">Forum</SelectItem>
                        <SelectItem value="Official">Official</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="source-status">Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="warning">Warning</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm">Current Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Reliability</span>
                        <div className="flex items-center gap-2">
                          <Progress value={formData.reliability} className="w-16" />
                          <span className="text-sm font-medium">{formData.reliability}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Data Points</span>
                        <span className="text-sm font-medium">
                          {formData.dataPoints.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Last Update</span>
                        <span className="text-sm font-medium">{formData.lastUpdate}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Configuration</Label>
                  <div className="space-y-3">
                    {Object.entries(formData.config).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-3">
                        <Label className="w-32 capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </Label>
                        {typeof value === "boolean" ? (
                          <Switch
                            checked={value}
                            onCheckedChange={(checked) =>
                              handleInputChange(key, checked, "config")
                            }
                          />
                        ) : Array.isArray(value) ? (
                          <Input
                            value={value.join(", ")}
                            onChange={(e) =>
                              handleInputChange(
                                key,
                                e.target.value.split(", "),
                                "config"
                              )
                            }
                            placeholder="Comma-separated values"
                          />
                        ) : (
                          <Input
                            value={value}
                            onChange={(e) =>
                              handleInputChange(key, e.target.value, "config")
                            }
                            placeholder={`Enter ${key}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="credentials" className="space-y-6">
              <Alert>
                <Key className="h-4 w-4" />
                <AlertDescription>
                  Credentials are encrypted and securely stored. Only the last 4 characters are displayed.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    value={formData.credentials?.apiKey || ""}
                    onChange={(e) =>
                      handleInputChange("apiKey", e.target.value, "credentials")
                    }
                    placeholder="Enter API key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secret-key">Secret Key</Label>
                  <Input
                    id="secret-key"
                    type="password"
                    value={formData.credentials?.secretKey || ""}
                    onChange={(e) =>
                      handleInputChange("secretKey", e.target.value, "credentials")
                    }
                    placeholder="Enter secret key"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="access-token">Access Token</Label>
                  <Input
                    id="access-token"
                    type="password"
                    value={formData.credentials?.accessToken || ""}
                    onChange={(e) =>
                      handleInputChange("accessToken", e.target.value, "credentials")
                    }
                    placeholder="Enter access token"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={testConnection}
                    className="flex-1"
                  >
                    {testConnection ? (
                      <>
                        <Activity className="w-4 h-4 mr-2 animate-spin" />
                        Testing Connection...
                      </>
                    ) : (
                      <>
                        <Shield className="w-4 h-4 mr-2" />
                        Test Connection
                      </>
                    )}
                  </Button>
                </div>

                {connectionResult && (
                  <Alert className={connectionResult.success ? "border-green-200" : "border-red-200"}>
                    {connectionResult.success ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <AlertDescription className={connectionResult.success ? "text-green-700" : "text-red-700"}>
                      {connectionResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </TabsContent>

            <TabsContent value="monitoring" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Uptime</span>
                        <span className="font-medium">{formData.monitoring.uptime}%</span>
                      </div>
                      <Progress value={formData.monitoring.uptime} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Error Rate</span>
                        <span className="font-medium">{formData.monitoring.errorRate}%</span>
                      </div>
                      <Progress value={100 - formData.monitoring.errorRate} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Latency</span>
                        <span className="font-medium">{formData.monitoring.latency}ms</span>
                      </div>
                      <Progress value={Math.max(0, 100 - formData.monitoring.latency / 10)} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Data Quality</span>
                        <span className="font-medium">{formData.monitoring.dataQuality}%</span>
                      </div>
                      <Progress value={formData.monitoring.dataQuality} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <BarChart3 className="w-4 h-4" />
                      Monitoring Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Real-time monitoring</p>
                        <p className="text-xs text-muted-foreground">Monitor source health</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Alert notifications</p>
                        <p className="text-xs text-muted-foreground">Send alerts on issues</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Automatic retry</p>
                        <p className="text-xs text-muted-foreground">Retry failed requests</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">Data validation</p>
                        <p className="text-xs text-muted-foreground">Validate incoming data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="rate-limit">Rate Limiting</Label>
                  <Input
                    id="rate-limit"
                    value={formData.config.rateLimit || ""}
                    onChange={(e) =>
                      handleInputChange("rateLimit", e.target.value, "config")
                    }
                    placeholder="e.g., 300/15min"
                  />
                  <p className="text-xs text-muted-foreground">
                    Requests per time period (e.g., 300/15min, 1000/hour)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeout">Request Timeout (seconds)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={formData.config.timeout || 30}
                    onChange={(e) =>
                      handleInputChange("timeout", parseInt(e.target.value), "config")
                    }
                    placeholder="30"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="retry-attempts">Retry Attempts</Label>
                  <Input
                    id="retry-attempts"
                    type="number"
                    value={formData.config.retryAttempts || 3}
                    onChange={(e) =>
                      handleInputChange("retryAttempts", parseInt(e.target.value), "config")
                    }
                    placeholder="3"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook URL</Label>
                  <Input
                    id="webhook-url"
                    value={formData.config.webhookUrl || ""}
                    onChange={(e) =>
                      handleInputChange("webhookUrl", e.target.value, "config")
                    }
                    placeholder="https://your-webhook-endpoint.com"
                  />
                  <p className="text-xs text-muted-foreground">
                    Optional webhook for real-time notifications
                  </p>
                </div>

                <Alert className="border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-700 dark:text-red-300">
                    <strong>Danger Zone:</strong> The actions below cannot be undone.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3 pt-2">
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All Historical Data
                  </Button>

                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                    <XCircle className="w-4 h-4 mr-2" />
                    Reset Configuration to Defaults
                  </Button>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="flex-col xs:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full xs:w-auto"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="w-full xs:w-auto"
          >
            {isSaving ? (
              <>
                <Activity className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
