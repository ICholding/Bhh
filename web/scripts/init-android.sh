#!/bin/bash
# This script initializes Android Capacitor setup for the BHH app.
# Make sure to run: chmod +x scripts/init-android.sh before first use.
set -e

echo "🔧 Initializing Android Capacitor setup..."

cd web

# Ensure dependencies are installed
npm install

# Add Android platform (only if not already added)
if [ ! -d "android" ]; then
  echo "📱 Adding Android platform..."
  npx cap add android
else
  echo "✓ Android platform already exists"
fi

# Sync web assets
echo "📦 Building and syncing web assets..."
npm run build
npx cap sync android

echo "✅ Android setup complete!"
echo "   To build APK: cd web/android && ./gradlew assembleDebug"

