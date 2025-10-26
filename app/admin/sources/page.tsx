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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SourceConfigModal } from "@/components/source-config-modal";
import {
  Globe,
  MessageSquare,
  Users,
  FileText,
  Settings,
  Plus,
  Search,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Activity,
  BarChart3,
  Clock,
  Database,
} from "lucide-react";

const dataSources = [
  {
    id: 1,
    name: "Twitter/X API",
    type: "Social Media",
    status: "active",
    reliability: 85,
    dataPoints: 15420,
    lastUpdate: "2 minutes ago",
    icon: MessageSquare,
    config: {
      rateLimit: "300/15min",
      keywords: ["misinformation", "fact-check", "verification"],
      languages: ["en", "es", "fr"],
    },
    credentials: {
      apiKey: "****abc123",
      secretKey: "****xyz789",
      accessToken: "****def456",
    },
    monitoring: {
      uptime: 98.5,
      errorRate: 1.2,
      latency: 45,
      dataQuality: 94,
    },
  },
  {
    id: 2,
    name: "Telegram Channels",
    type: "Messaging",
    status: "active",
    reliability: 92,
    dataPoints: 8934,
    lastUpdate: "1 minute ago",
    icon: MessageSquare,
    config: {
      channels: 45,
      keywords: ["breaking", "urgent", "alert"],
      languages: ["en", "es"],
    },
    credentials: {
      apiKey: "****bot123",
    },
    monitoring: {
      uptime: 99.1,
      errorRate: 0.8,
      latency: 32,
      dataQuality: 96,
    },
  },
  {
    id: 3,
    name: "News Portals RSS",
    type: "News",
    status: "active",
    reliability: 96,
    dataPoints: 2341,
    lastUpdate: "5 minutes ago",
    icon: FileText,
    config: {
      feeds: 120,
      updateFreq: "5min",
      categories: ["breaking", "local", "international"],
    },
    monitoring: {
      uptime: 99.8,
      errorRate: 0.2,
      latency: 28,
      dataQuality: 98,
    },
  },
  {
    id: 4,
    name: "Reddit Communities",
    type: "Forum",
    status: "warning",
    reliability: 78,
    dataPoints: 5672,
    lastUpdate: "15 minutes ago",
    icon: Users,
    config: {
      subreddits: 25,
      keywords: ["misinformation", "fact-check", "claims"],
      minScore: 10,
    },
    credentials: {
      apiKey: "****red789",
      secretKey: "****dit123",
    },
    monitoring: {
      uptime: 87.3,
      errorRate: 5.2,
      latency: 120,
      dataQuality: 82,
    },
  },
  {
    id: 5,
    name: "Government Bulletins",
    type: "Official",
    status: "active",
    reliability: 99,
    dataPoints: 156,
    lastUpdate: "30 minutes ago",
    icon: Globe,
    config: {
      agencies: 12,
      alertTypes: ["misinformation", "fact-check", "verification"],
      priority: "high",
    },
    monitoring: {
      uptime: 99.9,
      errorRate: 0.1,
      latency: 15,
      dataQuality: 99,
    },
  },
  {
    id: 6,
    name: "WhatsApp Monitor",
    type: "Messaging",
    status: "inactive",
    reliability: 65,
    dataPoints: 0,
    lastUpdate: "2 hours ago",
    icon: MessageSquare,
    config: {
      groups: 8,
      keywords: ["truth", "verification"],
      privacy: "high",
    },
    credentials: {
      accessToken: "****wha456",
    },
    monitoring: {
      uptime: 45.2,
      errorRate: 15.8,
      latency: 250,
      dataQuality: 68,
    },
  },
];

const sourceStats = {
  total: dataSources.length,
  active: dataSources.filter((s) => s.status === "active").length,
  warning: dataSources.filter((s) => s.status === "warning").length,
  inactive: dataSources.filter((s) => s.status === "inactive").length,
  totalDataPoints: dataSources.reduce((sum, s) => sum + s.dataPoints, 0),
  avgReliability: Math.round(
    dataSources.reduce((sum, s) => sum + s.reliability, 0) / dataSources.length,
  ),
};

export default function SourcesPage() {
  const [selectedSource, setSelectedSource] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sources, setSources] = useState(dataSources);
  const [configModalOpen, setConfigModalOpen] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case "inactive":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      warning:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[status as keyof typeof colors] || colors.inactive;
  };

  const handleConfigureSource = (source: any) => {
    setSelectedSource(source);
    setConfigModalOpen(true);
  };

  const handleSaveSource = (updatedSource: any) => {
    setSources((prev) =>
      prev.map((source) =>
        source.id === updatedSource.id ? updatedSource : source,
      ),
    );
  };

  const filteredSources = sources.filter((source) => {
    const matchesSearch =
      source.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      source.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" || source.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold truncate">
            Source Management
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Monitor and configure data sources
          </p>
        </div>
        <Button className="w-full sm:w-auto shrink-0">
          <Plus className="w-4 h-4 mr-2" />
          Add Source
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Total Sources
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {sourceStats.total}
                </p>
              </div>
              <Database className="w-6 h-6 sm:w-8 sm:h-8 text-primary shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <span className="text-green-600 truncate">
                {sourceStats.active} active
              </span>
              <span className="text-muted-foreground mx-1">•</span>
              <span className="text-yellow-600 truncate">
                {sourceStats.warning} warning
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Data Points
                </p>
                <p className="text-xl sm:text-2xl font-bold truncate">
                  {sourceStats.totalDataPoints.toLocaleString()}
                </p>
              </div>
              <Activity className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <span className="text-green-600">+2.3K</span>
              <span className="text-muted-foreground ml-1 truncate">
                last hour
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  Avg Reliability
                </p>
                <p className="text-xl sm:text-2xl font-bold">
                  {sourceStats.avgReliability}%
                </p>
              </div>
              <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 shrink-0" />
            </div>
            <Progress value={sourceStats.avgReliability} className="mt-2 h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">
                  System Health
                </p>
                <p className="text-xl sm:text-2xl font-bold">Good</p>
              </div>
              <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 shrink-0" />
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm">
              <span className="text-green-600 truncate">
                All systems operational
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search sources..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sources Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {filteredSources.map((source) => {
          const Icon = source.icon;
          return (
            <Card key={source.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3 p-4 sm:p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <CardTitle className="text-base sm:text-lg truncate">
                        {source.name}
                      </CardTitle>
                      <CardDescription className="text-sm truncate">
                        {source.type}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                    <div className="hidden sm:flex">
                      {getStatusIcon(source.status)}
                    </div>
                    <Badge
                      className={`${getStatusBadge(source.status)} text-xs`}
                    >
                      {source.status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 p-4 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Reliability
                    </p>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={source.reliability}
                        className="flex-1 h-2"
                      />
                      <span className="font-medium text-xs sm:text-sm shrink-0">
                        {source.reliability}%
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Data Points
                    </p>
                    <p className="font-medium text-xs sm:text-sm truncate">
                      {source.dataPoints.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="text-sm space-y-1">
                  <p className="text-muted-foreground text-xs sm:text-sm">
                    Last Update
                  </p>
                  <p className="font-medium text-xs sm:text-sm truncate">
                    {source.lastUpdate}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={source.status === "active"}
                      disabled={source.status === "warning"}
                    />
                    <span className="text-xs sm:text-sm">Auto-collect</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleConfigureSource(source)}
                    className="w-full sm:w-auto text-xs sm:text-sm"
                  >
                    <Settings className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Source Configuration Modal */}
      <SourceConfigModal
        source={selectedSource}
        isOpen={configModalOpen}
        onClose={() => {
          setConfigModalOpen(false);
          setSelectedSource(null);
        }}
        onSave={handleSaveSource}
      />
    </div>
  );
}
