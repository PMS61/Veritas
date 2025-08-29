"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  WifiOff,
  Wifi,
  Download,
  Upload,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  Trash2
} from 'lucide-react';
import { useNetworkStatus } from '@/components/mobile-provider';
import { 
  showToast, 
  triggerHapticFeedback,
  getPreference,
  setPreference,
  saveFile,
  readFile
} from '@/lib/mobile-services';
import { ImpactStyle } from '@capacitor/haptics';
import { cn } from '@/lib/utils';

interface OfflineItem {
  id: string;
  type: 'report' | 'verification' | 'article' | 'image';
  title: string;
  data: any;
  timestamp: Date;
  size: string;
  status: 'pending' | 'synced' | 'failed';
}

interface OfflineModeProps {
  className?: string;
}

export function OfflineMode({ className }: OfflineModeProps) {
  const { isOnline, networkStatus } = useNetworkStatus();
  const [offlineItems, setOfflineItems] = useState<OfflineItem[]>([]);
  const [storageUsed, setStorageUsed] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Load offline items from storage
  useEffect(() => {
    loadOfflineItems();
  }, []);

  const loadOfflineItems = async () => {
    try {
      const stored = await getPreference('offline_items');
      if (stored) {
        const items = JSON.parse(stored) as OfflineItem[];
        setOfflineItems(items);
        calculateStorageUsed(items);
      }
    } catch (error) {
      console.error('Failed to load offline items:', error);
    }
  };

  const calculateStorageUsed = (items: OfflineItem[]) => {
    const totalSize = items.reduce((acc, item) => {
      const sizeNum = parseFloat(item.size.replace(/[^\d.]/g, ''));
      const unit = item.size.includes('MB') ? 1024 : 1;
      return acc + (sizeNum * unit);
    }, 0);
    setStorageUsed(totalSize);
  };

  const saveOfflineItems = async (items: OfflineItem[]) => {
    try {
      await setPreference('offline_items', JSON.stringify(items));
      setOfflineItems(items);
      calculateStorageUsed(items);
    } catch (error) {
      console.error('Failed to save offline items:', error);
    }
  };

  const addOfflineItem = async (item: Omit<OfflineItem, 'id' | 'timestamp'>) => {
    const newItem: OfflineItem = {
      ...item,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    const updatedItems = [...offlineItems, newItem];
    await saveOfflineItems(updatedItems);
    await showToast(`${item.type} saved offline`);
    await triggerHapticFeedback(ImpactStyle.Light);
  };

  const removeOfflineItem = async (id: string) => {
    const updatedItems = offlineItems.filter(item => item.id !== id);
    await saveOfflineItems(updatedItems);
    await showToast('Item removed');
    await triggerHapticFeedback(ImpactStyle.Light);
  };

  const syncAllItems = async () => {
    if (!isOnline) {
      await showToast('Cannot sync while offline');
      return;
    }

    setIsSyncing(true);
    await triggerHapticFeedback(ImpactStyle.Medium);

    try {
      // Simulate syncing process
      for (let i = 0; i < offlineItems.length; i++) {
        const item = offlineItems[i];
        if (item.status === 'pending') {
          // Simulate network request
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Update item status
          const updatedItems = [...offlineItems];
          updatedItems[i] = { ...item, status: 'synced' };
          setOfflineItems(updatedItems);
        }
      }

      await saveOfflineItems(offlineItems.map(item => ({
        ...item,
        status: item.status === 'pending' ? 'synced' : item.status
      })));

      await showToast('All items synced successfully');
      await triggerHapticFeedback(ImpactStyle.Heavy);
    } catch (error) {
      console.error('Sync failed:', error);
      await showToast('Some items failed to sync');
    } finally {
      setIsSyncing(false);
    }
  };

  const clearSyncedItems = async () => {
    const pendingItems = offlineItems.filter(item => item.status !== 'synced');
    await saveOfflineItems(pendingItems);
    await showToast('Synced items cleared');
    await triggerHapticFeedback(ImpactStyle.Light);
  };

  const exportOfflineData = async () => {
    try {
      const exportData = {
        items: offlineItems,
        exportedAt: new Date().toISOString(),
        totalItems: offlineItems.length,
        storageUsed: `${storageUsed.toFixed(2)} KB`
      };

      const fileName = `veritas_offline_backup_${new Date().toISOString().split('T')[0]}.json`;
      const success = await saveFile(fileName, JSON.stringify(exportData, null, 2));
      
      if (success) {
        await triggerHapticFeedback(ImpactStyle.Medium);
      }
    } catch (error) {
      console.error('Export failed:', error);
      await showToast('Failed to export offline data');
    }
  };

  const getStatusIcon = (status: OfflineItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-3 h-3" />;
      case 'synced':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'failed':
        return <AlertTriangle className="w-3 h-3 text-red-500" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const getTypeIcon = (type: OfflineItem['type']) => {
    switch (type) {
      case 'report':
        return <Database className="w-4 h-4" />;
      case 'verification':
        return <CheckCircle className="w-4 h-4" />;
      case 'article':
        return <Download className="w-4 h-4" />;
      case 'image':
        return <Download className="w-4 h-4" />;
      default:
        return <Database className="w-4 h-4" />;
    }
  };

  const pendingCount = offlineItems.filter(item => item.status === 'pending').length;
  const syncedCount = offlineItems.filter(item => item.status === 'synced').length;
  const failedCount = offlineItems.filter(item => item.status === 'failed').length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Network Status */}
      <Alert className={isOnline ? "border-green-200 bg-green-50" : "border-orange-200 bg-orange-50"}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <Wifi className="w-4 h-4 text-green-600" />
          ) : (
            <WifiOff className="w-4 h-4 text-orange-600" />
          )}
          <AlertDescription>
            {isOnline ? (
              <span className="text-green-700">
                Connected - {networkStatus?.connectionType || 'Unknown'}
              </span>
            ) : (
              <span className="text-orange-700">
                Offline mode active. Data will sync when connected.
              </span>
            )}
          </AlertDescription>
        </div>
      </Alert>

      {/* Offline Summary */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Offline Storage</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="tap-target"
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{pendingCount}</div>
              <div className="text-xs text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{syncedCount}</div>
              <div className="text-xs text-muted-foreground">Synced</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{failedCount}</div>
              <div className="text-xs text-muted-foreground">Failed</div>
            </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <span>Storage Used:</span>
            <Badge variant="outline">{storageUsed.toFixed(2)} KB</Badge>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              onClick={syncAllItems}
              disabled={!isOnline || isSyncing || pendingCount === 0}
              size="sm"
              className="flex-1 tap-target"
            >
              {isSyncing ? (
                <RefreshCw className="w-3 h-3 mr-2 animate-spin" />
              ) : (
                <Upload className="w-3 h-3 mr-2" />
              )}
              {isSyncing ? 'Syncing...' : 'Sync All'}
            </Button>
            
            <Button
              onClick={exportOfflineData}
              variant="outline"
              size="sm"
              className="tap-target"
              disabled={offlineItems.length === 0}
            >
              <Download className="w-3 h-3 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Items List */}
      {showDetails && offlineItems.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Offline Items</CardTitle>
              {syncedCount > 0 && (
                <Button
                  onClick={clearSyncedItems}
                  variant="ghost"
                  size="sm"
                  className="tap-target text-muted-foreground"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Clear Synced
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {offlineItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2 rounded-lg border"
                >
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    {getStatusIcon(item.status)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.title}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{item.type}</span>
                      <span>•</span>
                      <span>{item.size}</span>
                      <span>•</span>
                      <span>{item.timestamp.toLocaleDateString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => removeOfflineItem(item.id)}
                    variant="ghost"
                    size="icon"
                    className="w-6 h-6 tap-target"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {showDetails && offlineItems.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Database className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">
              No offline items yet. Content will be saved here when you're offline.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Hook for managing offline storage
export function useOfflineStorage() {
  const [items, setItems] = useState<OfflineItem[]>([]);

  const addItem = async (item: Omit<OfflineItem, 'id' | 'timestamp'>) => {
    const newItem: OfflineItem = {
      ...item,
      id: `offline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };
    
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    await setPreference('offline_items', JSON.stringify(updatedItems));
    return newItem.id;
  };

  const removeItem = async (id: string) => {
    const updatedItems = items.filter(item => item.id !== id);
    setItems(updatedItems);
    await setPreference('offline_items', JSON.stringify(updatedItems));
  };

  const updateItemStatus = async (id: string, status: OfflineItem['status']) => {
    const updatedItems = items.map(item =>
      item.id === id ? { ...item, status } : item
    );
    setItems(updatedItems);
    await setPreference('offline_items', JSON.stringify(updatedItems));
  };

  const loadItems = async () => {
    try {
      const stored = await getPreference('offline_items');
      if (stored) {
        const parsedItems = JSON.parse(stored) as OfflineItem[];
        setItems(parsedItems);
        return parsedItems;
      }
    } catch (error) {
      console.error('Failed to load offline items:', error);
    }
    return [];
  };

  return {
    items,
    addItem,
    removeItem,
    updateItemStatus,
    loadItems
  };
}
