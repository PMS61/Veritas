"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Settings, User, Shield, Bell, Users, Save, Eye, EyeOff, Mail, Phone, Lock, ChevronDown } from "lucide-react"
import { useIsMobile } from "@/hooks/use-mobile"

export function UserSettings() {
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    slack: true,
  })
  const isMobile = useIsMobile()

  const [userProfile, setUserProfile] = useState({
    name: "Dr. Sarah Chen",
    email: "sarah.chen@crisisorg.com",
    role: "Crisis Analyst",
    department: "Misinformation Detection",
    phone: "+1-555-0123",
    timezone: "UTC-5",
    language: "English",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: true,
    sessionTimeout: "4h",
    ipWhitelist: true,
    auditLogging: true,
  })

  const userRoles = [
    { id: "admin", name: "Administrator", permissions: ["all"] },
    { id: "analyst", name: "Crisis Analyst", permissions: ["read", "analyze", "report"] },
    { id: "monitor", name: "Monitor", permissions: ["read", "monitor"] },
    { id: "viewer", name: "Viewer", permissions: ["read"] },
  ]

  const teamMembers = [
    {
      id: "1",
      name: "Dr. Sarah Chen",
      email: "sarah.chen@crisisorg.com",
      role: "Crisis Analyst",
      status: "active",
      lastActive: "2024-01-15T10:45:00Z",
    },
    {
      id: "2",
      name: "Michael Rodriguez",
      email: "m.rodriguez@crisisorg.com",
      role: "Verification Specialist",
      status: "active",
      lastActive: "2024-01-15T10:30:00Z",
    },
    {
      id: "3",
      name: "Dr. Emily Watson",
      email: "e.watson@crisisorg.com",
      role: "Research Director",
      status: "active",
      lastActive: "2024-01-15T09:15:00Z",
    },
    {
      id: "4",
      name: "James Park",
      email: "j.park@crisisorg.com",
      role: "Technical Lead",
      status: "inactive",
      lastActive: "2024-01-14T16:20:00Z",
    },
  ]

  return (
    <div className="w-full max-w-full overflow-hidden">
      <div className="space-y-3 xs:space-y-4 sm:space-y-6 safe-area-top safe-area-bottom pb-4">
        {/* Header */}
        <div className="flex flex-col xs:flex-row gap-3 xs:gap-4 items-start xs:items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl xs:text-2xl font-bold text-foreground flex items-center gap-2">
              <Settings className="w-5 h-5 xs:w-6 xs:h-6 text-primary flex-shrink-0" />
              <span className="truncate">Settings & User Management</span>
            </h1>
            <p className="text-xs xs:text-sm text-muted-foreground">Manage user accounts, permissions, and system settings</p>
          </div>

          <div className="flex items-center gap-2 w-full xs:w-auto flex-shrink-0">
            <Badge className="bg-green-500 text-white text-xs">System Operational</Badge>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3 xs:w-4 xs:h-4 text-primary" />
              <span>Secure Session</span>
            </div>
          </div>
        </div>        {/* Main Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3 xs:space-y-4 sm:space-y-6">
          {/* Mobile Dropdown for very small screens */}
          <div className="block xs:hidden">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full h-10 text-sm">
                <SelectValue>
                  {activeTab === "profile" && "Profile"}
                  {activeTab === "security" && "Security"}
                  {activeTab === "notifications" && "Notifications"}
                  {activeTab === "team" && "Team"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="profile">Profile</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="notifications">Notifications</SelectItem>
                <SelectItem value="team">Team</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tabs for larger screens */}
          <div className="hidden xs:block w-full">
            <div className="border-b border-border">
              <TabsList className="h-auto bg-transparent p-0 w-full justify-start overflow-x-auto scrollbar-hide">
                <div className="flex space-x-1 min-w-max">
                  <TabsTrigger 
                    value="profile" 
                    className="px-4 sm:px-6 py-3 text-sm font-medium transition-all tap-target whitespace-nowrap
                             border-b-2 border-transparent rounded-t-lg rounded-b-none
                             hover:bg-muted/50 hover:text-foreground
                             data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none
                             data-[state=inactive]:text-muted-foreground"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger 
                    value="security" 
                    className="px-4 sm:px-6 py-3 text-sm font-medium transition-all tap-target whitespace-nowrap
                             border-b-2 border-transparent rounded-t-lg rounded-b-none
                             hover:bg-muted/50 hover:text-foreground
                             data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none
                             data-[state=inactive]:text-muted-foreground"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notifications" 
                    className="px-4 sm:px-6 py-3 text-sm font-medium transition-all tap-target whitespace-nowrap
                             border-b-2 border-transparent rounded-t-lg rounded-b-none
                             hover:bg-muted/50 hover:text-foreground
                             data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none
                             data-[state=inactive]:text-muted-foreground"
                  >
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger 
                    value="team" 
                    className="px-4 sm:px-6 py-3 text-sm font-medium transition-all tap-target whitespace-nowrap
                             border-b-2 border-transparent rounded-t-lg rounded-b-none
                             hover:bg-muted/50 hover:text-foreground
                             data-[state=active]:border-primary data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-none
                             data-[state=inactive]:text-muted-foreground"
                  >
                    Team
                  </TabsTrigger>
                </div>
              </TabsList>
            </div>
          </div>

        <TabsContent value="profile" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* User Profile */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <User className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                User Profile
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Manage your personal information and preferences</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4 space-y-3 xs:space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                <div className="space-y-1 xs:space-y-2">
                  <Label htmlFor="name" className="text-xs xs:text-sm">Full Name</Label>
                  <Input
                    id="name"
                    value={userProfile.name}
                    onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })}
                    className="h-9 xs:h-10 text-sm tap-target"
                  />
                </div>
                <div className="space-y-1 xs:space-y-2">
                  <Label htmlFor="email" className="text-xs xs:text-sm">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={userProfile.email}
                    onChange={(e) => setUserProfile({ ...userProfile, email: e.target.value })}
                    className="h-9 xs:h-10 text-sm tap-target"
                  />
                </div>
                <div className="space-y-1 xs:space-y-2">
                  <Label htmlFor="role" className="text-xs xs:text-sm">Role</Label>
                  <Select
                    value={userProfile.role}
                    onValueChange={(value) => setUserProfile({ ...userProfile, role: value })}
                  >
                    <SelectTrigger className="h-9 xs:h-10 text-sm tap-target">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Crisis Analyst">Crisis Analyst</SelectItem>
                      <SelectItem value="Verification Specialist">Verification Specialist</SelectItem>
                      <SelectItem value="Research Director">Research Director</SelectItem>
                      <SelectItem value="Technical Lead">Technical Lead</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1 xs:space-y-2">
                  <Label htmlFor="department" className="text-xs xs:text-sm">Department</Label>
                  <Input
                    id="department"
                    value={userProfile.department}
                    onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })}
                    className="h-9 xs:h-10 text-sm tap-target"
                  />
                </div>
                <div className="space-y-1 xs:space-y-2">
                  <Label htmlFor="phone" className="text-xs xs:text-sm">Phone Number</Label>
                  <Input
                    id="phone"
                    value={userProfile.phone}
                    onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    className="h-9 xs:h-10 text-sm tap-target"
                  />
                </div>
                <div className="space-y-1 xs:space-y-2">
                  <Label htmlFor="timezone" className="text-xs xs:text-sm">Timezone</Label>
                  <Select
                    value={userProfile.timezone}
                    onValueChange={(value) => setUserProfile({ ...userProfile, timezone: value })}
                  >
                    <SelectTrigger className="h-9 xs:h-10 text-sm tap-target">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UTC-8">Pacific Time (UTC-8)</SelectItem>
                      <SelectItem value="UTC-5">Eastern Time (UTC-5)</SelectItem>
                      <SelectItem value="UTC+0">UTC</SelectItem>
                      <SelectItem value="UTC+1">Central European Time (UTC+1)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-3 xs:pt-4">
                <Button className="h-8 xs:h-9 text-xs xs:text-sm tap-target">
                  <Save className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" className="h-8 xs:h-9 text-xs xs:text-sm tap-target">Cancel</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Security Settings */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Shield className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Security Settings
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Manage your account security and authentication</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4 space-y-3 xs:space-y-4">
              {/* Password Change */}
              <div className="space-y-4">
                <h3 className="text-sm xs:text-lg font-semibold text-card-foreground">Change Password</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="current-password" className="text-xs xs:text-sm">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        className="h-9 xs:h-10 text-sm tap-target"
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 tap-target"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="new-password" className="text-xs xs:text-sm">New Password</Label>
                    <Input id="new-password" type="password" placeholder="Enter new password" className="h-9 xs:h-10 text-sm tap-target" />
                  </div>
                </div>
                <Button className="h-8 xs:h-9 text-xs xs:text-sm tap-target">
                  <Lock className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                  Update Password
                </Button>
              </div>

              {/* Two-Factor Authentication */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-sm xs:text-lg font-semibold text-card-foreground">Two-Factor Authentication</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-card-foreground">Enable 2FA</p>
                    <p className="text-xs xs:text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })
                    }
                    className="tap-target"
                  />
                </div>
              </div>

              {/* Session Management */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-sm xs:text-lg font-semibold text-card-foreground">Session Management</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="session-timeout" className="text-xs xs:text-sm">Session Timeout</Label>
                    <Select
                      value={securitySettings.sessionTimeout}
                      onValueChange={(value) => setSecuritySettings({ ...securitySettings, sessionTimeout: value })}
                    >
                      <SelectTrigger className="h-9 xs:h-10 text-sm tap-target">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="4h">4 hours</SelectItem>
                        <SelectItem value="8h">8 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-card-foreground">IP Whitelist</p>
                      <p className="text-xs xs:text-sm text-muted-foreground">Restrict access to approved IPs</p>
                    </div>
                    <Switch
                      checked={securitySettings.ipWhitelist}
                      onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, ipWhitelist: checked })}
                      className="tap-target"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Notification Settings */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Bell className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Configure how you receive alerts and notifications</CardDescription>
            </CardHeader>
            <CardContent className="px-3 xs:px-4 pb-3 xs:pb-4 space-y-3 xs:space-y-4">
              {/* Notification Channels */}
              <div className="space-y-4">
                <h3 className="text-sm xs:text-lg font-semibold text-card-foreground">Notification Channels</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">Email Notifications</p>
                        <p className="text-xs xs:text-sm text-muted-foreground">Receive alerts via email</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.email}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                      className="tap-target"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">SMS Notifications</p>
                        <p className="text-xs xs:text-sm text-muted-foreground">Receive critical alerts via SMS</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.sms}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                      className="tap-target"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-card-foreground">Push Notifications</p>
                        <p className="text-xs xs:text-sm text-muted-foreground">Browser and mobile push notifications</p>
                      </div>
                    </div>
                    <Switch
                      checked={notifications.push}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                      className="tap-target"
                    />
                  </div>
                </div>
              </div>

              {/* Alert Preferences */}
              <div className="space-y-4 pt-6 border-t border-border">
                <h3 className="text-sm xs:text-lg font-semibold text-card-foreground">Alert Preferences</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="alert-frequency" className="text-xs xs:text-sm">Alert Frequency</Label>
                    <Select defaultValue="immediate">
                      <SelectTrigger className="h-9 xs:h-10 text-sm tap-target">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="immediate">Immediate</SelectItem>
                        <SelectItem value="hourly">Hourly Digest</SelectItem>
                        <SelectItem value="daily">Daily Summary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1 xs:space-y-2">
                    <Label htmlFor="severity-threshold" className="text-xs xs:text-sm">Minimum Severity</Label>
                    <Select defaultValue="medium">
                      <SelectTrigger className="h-9 xs:h-10 text-sm tap-target">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-3 xs:space-y-4 sm:space-y-6 mt-0">
          {/* Team Management */}
          <Card className="bg-card shadow-sm">
            <CardHeader className="px-3 xs:px-4 py-3 xs:py-4">
              <CardTitle className="flex items-center gap-2 text-sm xs:text-base text-card-foreground">
                <Users className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                Team Management
                <Badge className="bg-primary text-primary-foreground text-xs xs:text-sm">{teamMembers.length} members</Badge>
              </CardTitle>
              <CardDescription className="text-xs xs:text-sm">Manage team members and their access permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 xs:space-y-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-3 xs:p-4 rounded-lg bg-muted/50 border border-border gap-3 sm:gap-0"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 xs:w-10 xs:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 xs:w-5 xs:h-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-card-foreground text-sm xs:text-base truncate">{member.name}</p>
                        <p className="text-xs xs:text-sm text-muted-foreground truncate">{member.email}</p>
                        <p className="text-xs text-muted-foreground">
                          Last active: {new Date(member.lastActive).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                      <Badge variant="outline" className="text-xs xs:text-sm">{member.role}</Badge>
                      <Badge
                        className={member.status === "active" ? "bg-green-500 text-white text-xs xs:text-sm" : "bg-gray-500 text-white text-xs xs:text-sm"}
                      >
                        {member.status}
                      </Badge>
                      <Button size="sm" variant="outline" className="h-8 xs:h-9 text-xs xs:text-sm tap-target">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 pt-3 xs:pt-4 border-t border-border">
                <Button className="h-8 xs:h-9 text-xs xs:text-sm tap-target">
                  <Users className="w-3 h-3 xs:w-4 xs:h-4 mr-1 xs:mr-2" />
                  Add Team Member
                </Button>
                <Button variant="outline" className="h-8 xs:h-9 text-xs xs:text-sm tap-target">Manage Roles</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}
