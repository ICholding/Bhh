import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'cloud.icholding.bhh',
  appName: 'Blessed Hope Healthcare',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
