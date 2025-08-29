"use client";

import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle, NotificationType } from '@capacitor/haptics';
import { Share } from '@capacitor/share';
import { Clipboard } from '@capacitor/clipboard';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Preferences } from '@capacitor/preferences';
import { Device } from '@capacitor/device';
import { Network } from '@capacitor/network';
import { SplashScreen } from '@capacitor/splash-screen';
import { Toast } from '@capacitor/toast';
import { ActionSheet } from '@capacitor/action-sheet';
import { Browser } from '@capacitor/browser';

// Check if running on mobile platform
export const isMobilePlatform = () => {
  return Capacitor.isNativePlatform();
};

export const getPlatform = () => {
  return Capacitor.getPlatform();
};

// Haptic Feedback
export const triggerHapticFeedback = async (style: ImpactStyle = ImpactStyle.Medium) => {
  if (isMobilePlatform()) {
    try {
      await Haptics.impact({ style });
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }
};

export const triggerNotificationHaptic = async () => {
  if (isMobilePlatform()) {
    try {
      await Haptics.notification({ type: NotificationType.Success });
    } catch (error) {
      console.warn('Notification haptic not available:', error);
    }
  }
};

// Share functionality
export const shareContent = async (title: string, text: string, url?: string) => {
  if (isMobilePlatform()) {
    try {
      await Share.share({
        title,
        text,
        url,
        dialogTitle: 'Share Verification'
      });
      return true;
    } catch (error) {
      console.error('Share failed:', error);
      return false;
    }
  } else {
    // Fallback for web
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        return true;
      } catch (error) {
        console.warn('Web share failed:', error);
      }
    }
    
    // Copy to clipboard as fallback
    try {
      await navigator.clipboard.writeText(url || text);
      showToast('Link copied to clipboard');
      return true;
    } catch (error) {
      console.error('Clipboard write failed:', error);
      return false;
    }
  }
};

// Clipboard operations
export const copyToClipboard = async (text: string) => {
  if (isMobilePlatform()) {
    try {
      await Clipboard.write({ string: text });
      await showToast('Copied to clipboard');
      await triggerHapticFeedback(ImpactStyle.Light);
      return true;
    } catch (error) {
      console.error('Clipboard write failed:', error);
      return false;
    }
  } else {
    try {
      await navigator.clipboard.writeText(text);
      await showToast('Copied to clipboard');
      return true;
    } catch (error) {
      console.error('Clipboard write failed:', error);
      return false;
    }
  }
};

export const readFromClipboard = async () => {
  if (isMobilePlatform()) {
    try {
      const result = await Clipboard.read();
      return result.value;
    } catch (error) {
      console.error('Clipboard read failed:', error);
      return '';
    }
  } else {
    try {
      return await navigator.clipboard.readText();
    } catch (error) {
      console.error('Clipboard read failed:', error);
      return '';
    }
  }
};

// Status Bar
export const setStatusBarStyle = async (style: Style = Style.Dark) => {
  if (isMobilePlatform()) {
    try {
      await StatusBar.setStyle({ style });
    } catch (error) {
      console.warn('Status bar style not available:', error);
    }
  }
};

export const hideStatusBar = async () => {
  if (isMobilePlatform()) {
    try {
      await StatusBar.hide();
    } catch (error) {
      console.warn('Status bar hide not available:', error);
    }
  }
};

export const showStatusBar = async () => {
  if (isMobilePlatform()) {
    try {
      await StatusBar.show();
    } catch (error) {
      console.warn('Status bar show not available:', error);
    }
  }
};

// Camera functionality
export const takePicture = async () => {
  if (isMobilePlatform()) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });
      return image.webPath;
    } catch (error) {
      console.error('Camera access failed:', error);
      return null;
    }
  }
  return null;
};

export const selectImage = async () => {
  if (isMobilePlatform()) {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });
      return image.webPath;
    } catch (error) {
      console.error('Photo selection failed:', error);
      return null;
    }
  }
  return null;
};

// File System operations
export const saveFile = async (filename: string, data: string) => {
  if (isMobilePlatform()) {
    try {
      await Filesystem.writeFile({
        path: filename,
        data,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      await showToast('File saved successfully');
      return true;
    } catch (error) {
      console.error('File save failed:', error);
      await showToast('Failed to save file');
      return false;
    }
  }
  return false;
};

export const readFile = async (filename: string) => {
  if (isMobilePlatform()) {
    try {
      const result = await Filesystem.readFile({
        path: filename,
        directory: Directory.Documents,
        encoding: Encoding.UTF8
      });
      return result.data as string;
    } catch (error) {
      console.error('File read failed:', error);
      return null;
    }
  }
  return null;
};

// Preferences (Local Storage)
export const setPreference = async (key: string, value: string) => {
  if (isMobilePlatform()) {
    try {
      await Preferences.set({ key, value });
      return true;
    } catch (error) {
      console.error('Preference set failed:', error);
      return false;
    }
  } else {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      console.error('LocalStorage set failed:', error);
      return false;
    }
  }
};

export const getPreference = async (key: string) => {
  if (isMobilePlatform()) {
    try {
      const result = await Preferences.get({ key });
      return result.value;
    } catch (error) {
      console.error('Preference get failed:', error);
      return null;
    }
  } else {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('LocalStorage get failed:', error);
      return null;
    }
  }
};

export const removePreference = async (key: string) => {
  if (isMobilePlatform()) {
    try {
      await Preferences.remove({ key });
      return true;
    } catch (error) {
      console.error('Preference remove failed:', error);
      return false;
    }
  } else {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error('LocalStorage remove failed:', error);
      return false;
    }
  }
};

// Device Information
export const getDeviceInfo = async () => {
  if (isMobilePlatform()) {
    try {
      const info = await Device.getInfo();
      return info;
    } catch (error) {
      console.error('Device info failed:', error);
      return null;
    }
  }
  return null;
};

// Network Status
export const getNetworkStatus = async () => {
  if (isMobilePlatform()) {
    try {
      const status = await Network.getStatus();
      return status;
    } catch (error) {
      console.error('Network status failed:', error);
      return null;
    }
  }
  return null;
};

export const addNetworkListener = (callback: (status: any) => void) => {
  if (isMobilePlatform()) {
    return Network.addListener('networkStatusChange', callback);
  }
  return { remove: () => {} };
};

// Splash Screen
export const hideSplashScreen = async () => {
  if (isMobilePlatform()) {
    try {
      await SplashScreen.hide();
    } catch (error) {
      console.warn('Splash screen hide not available:', error);
    }
  }
};

// Toast Messages
export const showToast = async (text: string, duration: 'short' | 'long' = 'short') => {
  if (isMobilePlatform()) {
    try {
      await Toast.show({
        text,
        duration: duration
      });
    } catch (error) {
      console.warn('Toast not available:', error);
    }
  } else {
    // Fallback for web - you could integrate with your existing toast system
    console.log('Toast:', text);
  }
};

// Action Sheet
export const showActionSheet = async (title: string, options: string[]) => {
  if (isMobilePlatform()) {
    try {
      const result = await ActionSheet.showActions({
        title,
        options: options.map(text => ({ title: text }))
      });
      return result.index;
    } catch (error) {
      console.error('Action sheet failed:', error);
      return -1;
    }
  }
  return -1;
};

// Browser
export const openUrl = async (url: string) => {
  if (isMobilePlatform()) {
    try {
      await Browser.open({ url });
    } catch (error) {
      console.error('Browser open failed:', error);
      window.open(url, '_blank');
    }
  } else {
    window.open(url, '_blank');
  }
};

// App State
export const addAppStateListener = (callback: (state: any) => void) => {
  if (isMobilePlatform()) {
    return App.addListener('appStateChange', callback);
  }
  return { remove: () => {} };
};

export const addBackButtonListener = (callback: () => void) => {
  if (isMobilePlatform()) {
    return App.addListener('backButton', callback);
  }
  return { remove: () => {} };
};
