import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.veritas.app',
  appName: 'Veritas',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 3000,
      backgroundColor: "#000000",
      showSpinner: false,
      androidSpinnerStyle: "large",
      iosSpinnerStyle: "small",
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#000000"
    },
    Camera: {
      permissions: ["camera", "photos"]
    },
    Haptics: {},
    Share: {},
    Clipboard: {},
    Preferences: {},
    Device: {},
    Network: {},
    Filesystem: {
      permissions: ["storage"]
    },
    Toast: {},
    ActionSheet: {},
    Browser: {},
    App: {
      launchUrl: "com.veritas.app"
    }
  }
};

export default config;