import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.personalityai.app',
  appName: 'Personality AI',
  webDir: 'dist/public',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    App: {
      launchShowDuration: 2000
    },
    StatusBar: {
      style: 'DEFAULT',
      backgroundColor: '#8b5cf6'
    },
    Keyboard: {
      resize: 'body'
    }
  },
  android: {
    allowMixedContent: true,
    captureInput: true
  }
};

export default config;
