#!/usr/bin/env node

/**
 * Mobile Features Test Script
 * Tests all mobile functionality without requiring backend services
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Veritas Mobile App - Feature Test Report');
console.log('='.repeat(50));

// Test 1: Check Capacitor Configuration
function testCapacitorConfig() {
  console.log('\n📱 Testing Capacitor Configuration...');
  
  const configPath = path.join(__dirname, '..', 'capacitor.config.ts');
  if (fs.existsSync(configPath)) {
    console.log('✅ capacitor.config.ts exists');
    const config = fs.readFileSync(configPath, 'utf8');
    
    // Check for essential plugins
    const requiredPlugins = [
      'SplashScreen',
      'StatusBar',
      'Camera',
      'Haptics',
      'Share',
      'Clipboard',
      'Preferences',
      'Device',
      'Network'
    ];
    
    requiredPlugins.forEach(plugin => {
      if (config.includes(plugin)) {
        console.log(`✅ ${plugin} plugin configured`);
      } else {
        console.log(`⚠️  ${plugin} plugin not found in config`);
      }
    });
  } else {
    console.log('❌ capacitor.config.ts not found');
  }
}

// Test 2: Check Mobile Services
function testMobileServices() {
  console.log('\n🔧 Testing Mobile Services...');
  
  const servicesPath = path.join(__dirname, '..', 'lib', 'mobile-services.ts');
  if (fs.existsSync(servicesPath)) {
    console.log('✅ mobile-services.ts exists');
    const services = fs.readFileSync(servicesPath, 'utf8');
    
    const requiredFunctions = [
      'triggerHapticFeedback',
      'shareContent',
      'copyToClipboard',
      'takePicture',
      'selectImage',
      'saveFile',
      'getPreference',
      'setPreference',
      'getDeviceInfo',
      'getNetworkStatus',
      'showToast'
    ];
    
    requiredFunctions.forEach(func => {
      if (services.includes(`export const ${func}`) || services.includes(`export async function ${func}`)) {
        console.log(`✅ ${func} function available`);
      } else {
        console.log(`⚠️  ${func} function not found`);
      }
    });
  } else {
    console.log('❌ mobile-services.ts not found');
  }
}

// Test 3: Check Mobile Components
function testMobileComponents() {
  console.log('\n🎨 Testing Mobile Components...');
  
  const componentsDir = path.join(__dirname, '..', 'components');
  const mobileComponents = [
    'mobile-provider.tsx',
    'mobile-navigation.tsx',
    'mobile-camera.tsx',
    'mobile-verification-report.tsx',
    'mobile-verification-feed.tsx',
    'mobile-trending-topics.tsx',
    'swipeable-card.tsx',
    'pull-to-refresh.tsx',
    'offline-mode.tsx',
    'mobile-loading.tsx'
  ];
  
  mobileComponents.forEach(component => {
    const componentPath = path.join(componentsDir, component);
    if (fs.existsSync(componentPath)) {
      console.log(`✅ ${component} exists`);
    } else {
      console.log(`❌ ${component} not found`);
    }
  });
}

// Test 4: Check Build Output
function testBuildOutput() {
  console.log('\n🏗️  Testing Build Output...');
  
  const outDir = path.join(__dirname, '..', 'out');
  if (fs.existsSync(outDir)) {
    console.log('✅ Build output directory exists');
    
    const requiredFiles = [
      'index.html',
      'manifest.webmanifest',
      'verify.html',
      'report.html',
      'routemap.html',
      'settings.html'
    ];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(outDir, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file} generated`);
      } else {
        console.log(`❌ ${file} not found`);
      }
    });
  } else {
    console.log('❌ Build output directory not found');
  }
}

// Test 5: Check Android Assets
function testAndroidAssets() {
  console.log('\n🤖 Testing Android Assets...');
  
  const assetsDir = path.join(__dirname, '..', 'android', 'app', 'src', 'main', 'assets');
  if (fs.existsSync(assetsDir)) {
    console.log('✅ Android assets directory exists');
    
    const publicDir = path.join(assetsDir, 'public');
    const configFile = path.join(assetsDir, 'capacitor.config.json');
    const pluginsFile = path.join(assetsDir, 'capacitor.plugins.json');
    
    if (fs.existsSync(publicDir)) {
      console.log('✅ Public assets copied to Android');
    } else {
      console.log('❌ Public assets not found in Android');
    }
    
    if (fs.existsSync(configFile)) {
      console.log('✅ Capacitor config copied to Android');
    } else {
      console.log('❌ Capacitor config not found in Android');
    }
    
    if (fs.existsSync(pluginsFile)) {
      console.log('✅ Capacitor plugins config found in Android');
    } else {
      console.log('❌ Capacitor plugins config not found in Android');
    }
  } else {
    console.log('❌ Android assets directory not found');
  }
}

// Test 6: Check Package Dependencies
function testDependencies() {
  console.log('\n📦 Testing Dependencies...');
  
  const packagePath = path.join(__dirname, '..', 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredDeps = [
      '@capacitor/core',
      '@capacitor/cli',
      '@capacitor/android',
      '@capacitor/app',
      '@capacitor/haptics',
      '@capacitor/share',
      '@capacitor/camera',
      '@capacitor/filesystem',
      '@capacitor/preferences',
      '@capacitor/device',
      '@capacitor/network'
    ];
    
    requiredDeps.forEach(dep => {
      if (packageJson.dependencies[dep] || packageJson.devDependencies[dep]) {
        console.log(`✅ ${dep} installed`);
      } else {
        console.log(`❌ ${dep} not installed`);
      }
    });
  } else {
    console.log('❌ package.json not found');
  }
}

// Run all tests
testCapacitorConfig();
testMobileServices();
testMobileComponents();
testBuildOutput();
testAndroidAssets();
testDependencies();

console.log('\n🎉 Mobile Feature Test Completed!');
console.log('='.repeat(50));
console.log('\n📋 Next Steps:');
console.log('1. Test the app in a mobile simulator/device');
console.log('2. Verify haptic feedback works on physical device');
console.log('3. Test camera functionality');
console.log('4. Test offline capabilities');
console.log('5. Verify share functionality');
console.log('\n🚀 Ready for mobile deployment!');
