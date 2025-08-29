"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  isMobilePlatform, 
  getPlatform, 
  getNetworkStatus, 
  addNetworkListener,
  addAppStateListener,
  addBackButtonListener,
  hideSplashScreen,
  setStatusBarStyle,
  getDeviceInfo
} from '@/lib/mobile-services';
import { Style } from '@capacitor/status-bar';

interface NetworkStatus {
  connected: boolean;
  connectionType: string;
}

interface DeviceInfo {
  platform: string;
  model: string;
  operatingSystem: string;
  osVersion: string;
  manufacturer: string;
  isVirtual: boolean;
}

interface MobileContextType {
  isMobile: boolean;
  platform: string;
  networkStatus: NetworkStatus | null;
  deviceInfo: DeviceInfo | null;
  isAppInForeground: boolean;
  isOnline: boolean;
  initializeMobile: () => Promise<(() => void) | undefined>;
}

const MobileContext = createContext<MobileContextType | undefined>(undefined);

interface MobileProviderProps {
  children: ReactNode;
}

export function MobileProvider({ children }: MobileProviderProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [platform, setPlatform] = useState('web');
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus | null>(null);
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);
  const [isAppInForeground, setIsAppInForeground] = useState(true);
  const [isOnline, setIsOnline] = useState(true);

  const initializeMobile = async () => {
    const mobile = isMobilePlatform();
    setIsMobile(mobile);
    setPlatform(getPlatform());

    if (mobile) {
      // Hide splash screen
      await hideSplashScreen();
      
      // Set status bar style
      await setStatusBarStyle(Style.Dark);

      // Get device info
      try {
        const info = await getDeviceInfo();
        if (info) {
          setDeviceInfo(info as DeviceInfo);
        }
      } catch (error) {
        console.warn('Could not get device info:', error);
      }

      // Get initial network status
      try {
        const status = await getNetworkStatus();
        if (status) {
          setNetworkStatus({
            connected: status.connected,
            connectionType: status.connectionType
          });
          setIsOnline(status.connected);
        }
      } catch (error) {
        console.warn('Could not get network status:', error);
      }

      // Listen for network changes
      const networkListener = await addNetworkListener((status) => {
        setNetworkStatus({
          connected: status.connected,
          connectionType: status.connectionType
        });
        setIsOnline(status.connected);
      });

      // Listen for app state changes
      const appStateListener = await addAppStateListener((state) => {
        setIsAppInForeground(state.isActive);
      });

      // Listen for back button on Android
      const backButtonListener = await addBackButtonListener(() => {
        // Handle back button press
        // You can implement custom back button behavior here
        window.history.back();
      });

      // Cleanup function
      return () => {
        networkListener.remove();
        appStateListener.remove();
        backButtonListener.remove();
      };
    } else {
      // Web fallback for network status
      setIsOnline(navigator.onLine);
      
      const handleOnlineStatus = () => setIsOnline(navigator.onLine);
      window.addEventListener('online', handleOnlineStatus);
      window.addEventListener('offline', handleOnlineStatus);

      return () => {
        window.removeEventListener('online', handleOnlineStatus);
        window.removeEventListener('offline', handleOnlineStatus);
      };
    }
  };

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    initializeMobile().then((cleanupFn) => {
      cleanup = cleanupFn;
    });

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, []);

  const value: MobileContextType = {
    isMobile,
    platform,
    networkStatus,
    deviceInfo,
    isAppInForeground,
    isOnline,
    initializeMobile
  };

  return (
    <MobileContext.Provider value={value}>
      {children}
    </MobileContext.Provider>
  );
}

export const useMobile = () => {
  const context = useContext(MobileContext);
  if (context === undefined) {
    throw new Error('useMobile must be used within a MobileProvider');
  }
  return context;
};

// Hook for checking if app is mobile
export const useIsMobileApp = () => {
  const { isMobile } = useMobile();
  return isMobile;
};

// Hook for network status
export const useNetworkStatus = () => {
  const { networkStatus, isOnline } = useMobile();
  return { networkStatus, isOnline };
};

// Hook for device info
export const useDeviceInfo = () => {
  const { deviceInfo, platform } = useMobile();
  return { deviceInfo, platform };
};
