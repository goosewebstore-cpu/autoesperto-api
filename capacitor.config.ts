import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'it.autoesperto.app',
  appName: 'AutoEsperto',
  webDir: 'apps/web/out',
  server: {
    androidScheme: 'https',
    url: 'https://autoesperto.it',
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0B1120',
      showSpinner: true,
      spinnerColor: '#2563EB',
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0B1120',
    },
  },
};

export default config;
