#!/bin/bash
set -e

echo "🔧 Initializing Android Capacitor setup..."

cd web

# Ensure dependencies are installed
npm install

# Initialize Capacitor (if not already done)
if [ ! -f "capacitor.config.ts" ]; then
  npx cap init "Blessed Hope Healthcare" "cloud.icholding.bhh" --web-dir=dist
fi

# Add Android platform
if [ ! -d "android" ]; then
  npx cap add android
fi

# Sync web assets
npm run build
npx cap sync android

echo "✅ Android setup complete!"
echo "   Run: cd web/android && ./gradlew assembleDebug"
