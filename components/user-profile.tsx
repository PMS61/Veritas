"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  User,
  Settings,
  Mail,
  Phone,
  Shield,
  Clock,
  Edit,
  Save,
  Camera,
  Bell,
  Lock,
  Globe
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { updateUserSettings } from "@/actions/user-settings"

export function UserProfile() {
  const { user, refreshProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState("profile")
  const [settingsData, setSettingsData] = useState({
    two_factor_enabled: false,
    session_timeout: "24h",
    ip_whitelist: false,
    audit_logging: true,
    email_notifications: true,
    sms_notifications: false,
    push_notifications: true,
    slack_notifications: false,
  })

  const handleProfileSave = async (formData: FormData) => {
    if (!user) return

    setIsLoading(true)
    setMessage("")

    try {
      const updateData = {
        full_name: formData.get("full_name") as string,
        email: formData.get("email") as string,
        department: formData.get("department") as string,
        phone: formData.get("phone") as string,
        timezone: formData.get("timezone") as string,
        language: formData.get("language") as string,
        avatar_url: formData.get("avatar_url") as string,
      }

      // In a real implementation, you would call the profile update action
      // For now, we'll just show a success message
      setMessage("Profile updated successfully!")
      setIsEditing(false)
      await refreshProfile()
    } catch (error) {
      setMessage("Failed to update profile. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSettingsSave = async () => {
    if (!user) return

    setIsLoading(true)
    setMessage("")

    try {
      const formData = new FormData()
      formData.append('two_factor_enabled', settingsData.two_factor_enabled.toString())
      formData.append('session_timeout', settingsData.session_timeout)
      formData.append('ip_whitelist', settingsData.ip_whitelist.toString())
      formData.append('audit_logging', settingsData.audit_logging.toString())
      formData.append('email_notifications', settingsData.email_notifications.toString())
      formData.append('sms_notifications', settingsData.sms_notifications.toString())
      formData.append('push_notifications', settingsData.push_notifications.toString())
      formData.append('slack_notifications', settingsData.slack_notifications.toString())

      const result = await updateUserSettings(user.id, formData)

      if (result.success) {
        setMessage("Settings updated successfully!")
      } else {
        setMessage(result.error || "Failed to update settings.")
      }
    } catch (error) {
      setMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p>Please log in to access your profile.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Profile</h1>
        <div className="flex items-center gap-2">
          <Badge variant="outline">{user.role}</Badge>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-lg ${
          message.includes("successfully") ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and contact details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={user.avatar_url || undefined} />
                  <AvatarFallback>
                    {user.full_name?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold">{user.full_name || 'User'}</h3>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                  {user.role && (
                    <Badge variant="secondary">{user.role}</Badge>
                  )}
                </div>
              </div>

              {isEditing ? (
                <form onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  handleProfileSave(formData)
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        defaultValue={user.full_name || ''}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        defaultValue={user.email}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        name="department"
                        defaultValue={user.department || ''}
                        placeholder="Enter your department"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={user.phone || ''}
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        name="timezone"
                        defaultValue={user.timezone || 'UTC'}
                        placeholder="Timezone"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language">Language</Label>
                      <Input
                        name="language"
                        defaultValue={user.language || 'en'}
                        placeholder="Language"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="avatar_url">Avatar URL</Label>
                    <Input
                      id="avatar_url"
                      name="avatar_url"
                      type="url"
                      defaultValue={user.avatar_url || ''}
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="w-4 h-4 mr-2" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                      <p className="text-sm">{user.full_name || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                      <p className="text-sm">{user.email}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Department</Label>
                      <p className="text-sm">{user.department || 'Not set'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                      <p className="text-sm">{user.phone || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Timezone</Label>
                      <p className="text-sm">{user.timezone || 'UTC'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-muted-foreground">Language</Label>
                      <p className="text-sm">{user.language || 'en'}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Avatar URL</Label>
                    <p className="text-sm truncate">{user.avatar_url || 'Not set'}</p>
                  </div>

                  <Button onClick={() => setIsEditing(true)} className="w-fit">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security & Privacy Settings</CardTitle>
              <CardDescription>
                Manage your account security and privacy preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Security Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two_factor_enabled">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <Switch
                      id="two_factor_enabled"
                      checked={settingsData.two_factor_enabled}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, two_factor_enabled: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="session_timeout">Session Timeout</Label>
                      <p className="text-sm text-muted-foreground">
                        How long to keep you logged in
                      </p>
                    </div>
                    <Select
                      value={settingsData.session_timeout}
                      onValueChange={(value) =>
                        setSettingsData(prev => ({ ...prev, session_timeout: value }))
                      }
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="30m">30 minutes</SelectItem>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="6h">6 hours</SelectItem>
                        <SelectItem value="12h">12 hours</SelectItem>
                        <SelectItem value="24h">24 hours</SelectItem>
                        <SelectItem value="7d">7 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip_whitelist">IP Whitelist</Label>
                      <p className="text-sm text-muted-foreground">
                        Only allow access from specific IP addresses
                      </p>
                    </div>
                    <Switch
                      id="ip_whitelist"
                      checked={settingsData.ip_whitelist}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, ip_whitelist: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="audit_logging">Audit Logging</Label>
                      <p className="text-sm text-muted-foreground">
                        Log your account activity for security
                      </p>
                    </div>
                    <Switch
                      id="audit_logging"
                      checked={settingsData.audit_logging}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, audit_logging: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-sm font-medium">Notification Settings</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email_notifications">Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive email updates about your account
                      </p>
                    </div>
                    <Switch
                      id="email_notifications"
                      checked={settingsData.email_notifications}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, email_notifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms_notifications">SMS Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive SMS updates for urgent matters
                      </p>
                    </div>
                    <Switch
                      id="sms_notifications"
                      checked={settingsData.sms_notifications}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, sms_notifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push_notifications">Push Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      id="push_notifications"
                      checked={settingsData.push_notifications}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, push_notifications: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="slack_notifications">Slack Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Team collaboration updates
                      </p>
                    </div>
                    <Switch
                      id="slack_notifications"
                      checked={settingsData.slack_notifications}
                      onCheckedChange={(checked) =>
                        setSettingsData(prev => ({ ...prev, slack_notifications: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleSettingsSave} disabled={isLoading}>
                  <Settings className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Settings"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}