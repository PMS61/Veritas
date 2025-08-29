"use client";

import React, { useState, useEffect } from 'react';
import { PublicLayout } from '@/components/public-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Smartphone,
  Bell,
  Shield,
  Database,
  Wifi,
  Battery,
  Download,
  Upload,
  Trash2,
  RefreshCw,
  Info,
  Moon,
  Sun,
  Vibrate,
  Camera,
  Mic,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { OfflineMode } from '@/components/offline-mode';
import { useMobile, useDeviceInfo, useNetworkStatus } from '@/components/mobile-provider';
import { 
  getPreference,
  setPreference,
  triggerHapticFeedback,
  showToast,
  getDeviceInfo,
  setStatusBarStyle
} from '@/lib/mobile-services';
import { ImpactStyle } from '@capacitor/haptics';
import { Style } from '@capacitor/status-bar';

interface AppSettings {
  notifications: boolean;
  hapticFeedback: boolean;
  offlineMode: boolean;
  autoSync: boolean;
  dataUsage: 'low' | 'medium' | 'high';
  theme: 'light' | 'dark' | 'system';
  statusBarStyle: 'light' | 'dark' | 'auto';
  cameraPermission: boolean;
  locationPermission: boolean;
  storagePermission: boolean;
}

export default function MobileSettingsPage() {
  const { isMobile, platform } = useMobile();
  const { deviceInfo } = useDeviceInfo();
  const { networkStatus, isOnline } = useNetworkStatus();
  
  const [settings, setSettings] = useState<AppSettings>({
    notifications: true,
    hapticFeedback: true,
    offlineMode: true,
    autoSync: true,
    dataUsage: 'medium',
    theme: 'system',
    statusBarStyle: 'auto',
    cameraPermission: false,
    locationPermission: false,
    storagePermission: false
  });

  const [isLoading, setIsLoading] = useState(false);
  const [storageUsed, setStorageUsed] = useState('0 MB');

  useEffect(() => {
    loadSettings();
    checkPermissions();
    calculateStorageUsed();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await getPreference('app_settings');
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  const saveSettings = async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    
    try {
      await setPreference('app_settings', JSON.stringify(updatedSettings));
      await triggerHapticFeedback(ImpactStyle.Light);
    } catch (error) {
      console.error('Failed to save settings:', error);
      await showToast('Failed to save settings');
    }
  };

  const checkPermissions = async () => {
    if (isMobile) {
      // In a real app, you would check actual permissions here
      // For demo purposes, we'll use mock values
      setSettings(prev => ({
        ...prev,
        cameraPermission: true,
        locationPermission: false,
        storagePermission: true
      }));
    }
  };

  const calculateStorageUsed = async () => {
    try {
      // In a real app, calculate actual storage usage
      const mockUsage = Math.floor(Math.random() * 100) + 20;
      setStorageUsed(`${mockUsage} MB`);
    } catch (error) {
      console.error('Failed to calculate storage:', error);
    }
  };

  const handleToggle = async (key: keyof AppSettings, value: boolean) => {
    await saveSettings({ [key]: value });
    
    // Apply specific settings
    switch (key) {
      case 'hapticFeedback':
        if (value) {
          await triggerHapticFeedback(ImpactStyle.Medium);
        }
        break;
      case 'statusBarStyle':
        if (isMobile && value) {
          await setStatusBarStyle(Style.Dark);
        }
        break;
    }
  };

  const handleSelectChange = async (key: keyof AppSettings, value: string) => {
    await saveSettings({ [key]: value });
  };

  const clearCache = async () => {
    setIsLoading(true);
    await triggerHapticFeedback(ImpactStyle.Medium);
    
    try {
      // Simulate cache clearing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      await showToast('Cache cleared successfully');
      await calculateStorageUsed();
    } catch (error) {
      console.error('Failed to clear cache:', error);
      await showToast('Failed to clear cache');
    } finally {
      setIsLoading(false);
    }
  };

  const resetSettings = async () => {
    setIsLoading(true);
    await triggerHapticFeedback(ImpactStyle.Heavy);
    
    try {
      const defaultSettings: AppSettings = {
        notifications: true,
        hapticFeedback: true,
        offlineMode: true,
        autoSync: true,
        dataUsage: 'medium',
        theme: 'system',
        statusBarStyle: 'auto',
        cameraPermission: false,
        locationPermission: false,
        storagePermission: false
      };
      
      await setPreference('app_settings', JSON.stringify(defaultSettings));
      setSettings(defaultSettings);
      
      await showToast('Settings reset to defaults');
    } catch (error) {
      console.error('Failed to reset settings:', error);
      await showToast('Failed to reset settings');
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = async () => {
    await triggerHapticFeedback(ImpactStyle.Medium);
    await showToast('Export feature coming soon');
  };

  if (!isMobile) {
    return (
      <PublicLayout>
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Smartphone className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Mobile Settings</h3>
              <p className="text-muted-foreground">
                This page is optimized for mobile devices. Please access it from a mobile device to see all features.
              </p>
            </CardContent>
          </Card>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="mobile-container py-4 space-y-6 pb-safe-bottom">
        {/* Header */}
        <div className="text-center">
          <Settings className="w-8 h-8 mx-auto text-primary mb-2" />
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your Veritas experience
          </p>
        </div>

        {/* Device Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Device Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium">Platform</p>
                <p className="text-muted-foreground capitalize">{platform}</p>
              </div>
              <div>
                <p className="font-medium">Model</p>
                <p className="text-muted-foreground">{deviceInfo?.model || 'Unknown'}</p>
              </div>
              <div>
                <p className="font-medium">OS Version</p>
                <p className="text-muted-foreground">{deviceInfo?.osVersion || 'Unknown'}</p>
              </div>
              <div>
                <p className="font-medium">Connection</p>
                <div className="flex items-center gap-1">
                  <Wifi className={`w-3 h-3 ${isOnline ? 'text-green-500' : 'text-red-500'}`} />
                  <span className="text-muted-foreground">
                    {networkStatus?.connectionType || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Push Notifications</Label>
                <p className="text-xs text-muted-foreground">
                  Receive updates about verifications
                </p>
              </div>
              <Switch
                checked={settings.notifications}
                onCheckedChange={(value) => handleToggle('notifications', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium flex items-center gap-1">
                  <Vibrate className="w-3 h-3" />
                  Haptic Feedback
                </Label>
                <p className="text-xs text-muted-foreground">
                  Feel vibrations for interactions
                </p>
              </div>
              <Switch
                checked={settings.hapticFeedback}
                onCheckedChange={(value) => handleToggle('hapticFeedback', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Theme</Label>
                <p className="text-xs text-muted-foreground">
                  App appearance
                </p>
              </div>
              <Select 
                value={settings.theme} 
                onValueChange={(value) => handleSelectChange('theme', value)}
              >
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">Data Usage</Label>
                <p className="text-xs text-muted-foreground">
                  Control data consumption
                </p>
              </div>
              <Select 
                value={settings.dataUsage} 
                onValueChange={(value) => handleSelectChange('dataUsage', value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Permissions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Permissions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                <div>
                  <Label className="text-sm font-medium">Camera</Label>
                  <p className="text-xs text-muted-foreground">For evidence capture</p>
                </div>
              </div>
              <Badge variant={settings.cameraPermission ? 'default' : 'secondary'}>
                {settings.cameraPermission ? 'Granted' : 'Denied'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <div>
                  <Label className="text-sm font-medium">Location</Label>
                  <p className="text-xs text-muted-foreground">For location-based reports</p>
                </div>
              </div>
              <Badge variant={settings.locationPermission ? 'default' : 'secondary'}>
                {settings.locationPermission ? 'Granted' : 'Denied'}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <div>
                  <Label className="text-sm font-medium">Storage</Label>
                  <p className="text-xs text-muted-foreground">For offline content</p>
                </div>
              </div>
              <Badge variant={settings.storagePermission ? 'default' : 'secondary'}>
                {settings.storagePermission ? 'Granted' : 'Denied'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Offline Mode */}
        <OfflineMode />

        {/* Storage Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Database className="w-4 h-4" />
              Storage Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Storage Used</p>
                <p className="text-xs text-muted-foreground">App data and cache</p>
              </div>
              <Badge variant="outline">{storageUsed}</Badge>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={clearCache}
                disabled={isLoading}
                variant="outline"
                size="sm"
                className="flex-1 tap-target"
              >
                <Trash2 className="w-3 h-3 mr-2" />
                Clear Cache
              </Button>
              
              <Button
                onClick={exportData}
                variant="outline"
                size="sm"
                className="flex-1 tap-target"
              >
                <Download className="w-3 h-3 mr-2" />
                Export Data
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="w-4 h-4" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>App Version</span>
              <span className="text-muted-foreground">1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Build Number</span>
              <span className="text-muted-foreground">2024.1</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Last Updated</span>
              <span className="text-muted-foreground">Today</span>
            </div>
          </CardContent>
        </Card>

        {/* Reset Settings */}
        <Card>
          <CardContent className="pt-6">
            <Alert>
              <AlertTriangle className="w-4 h-4" />
              <AlertDescription>
                Reset all settings to their default values. This action cannot be undone.
              </AlertDescription>
            </Alert>
            
            <Button
              onClick={resetSettings}
              disabled={isLoading}
              variant="destructive"
              size="sm"
              className="w-full mt-4 tap-target"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Reset All Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicLayout>
  );
}
