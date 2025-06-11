import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.personalityai.app',
  appName: 'Personality AI',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https',
    iosScheme: 'capacitor'
  },
  plugins: {
    App: {
      launchShowDuration: 2000
    },
    StatusBar: {
      style: 'LIGHT_CONTENT',
      backgroundColor: '#8b5cf6',
      overlaysWebView: false
    },
    Keyboard: {
      resize: 'ionic'
    },
    Camera: {
      iosPermissions: {
        cameraDescription: "얼굴 분석을 위해 카메라 접근 권한이 필요합니다."
      }
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  },
  ios: {
    scheme: 'PersonalityAI',
    contentInset: 'automatic',
    scrollEnabled: true,
    backgroundColor: '#8b5cf6'
  }
};

export default config;
