
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.caecf5be424349b4a8e8142d1db4db83',
  appName: 'happy-birthday-buddy',
  webDir: 'dist',
  server: {
    url: 'https://caecf5be-4243-49b4-a8e8-142d1db4db83.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#FF8000",
      sound: "beep.wav",
    }
  }
};

export default config;
