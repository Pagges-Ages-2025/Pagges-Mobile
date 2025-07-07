#!/bin/bash

# Build script for Pagges Mobile Android APK
echo "🚀 Building Pagges Mobile Android APK..."

# Set environment variable
export EXPO_PUBLIC_API_URL="http://ec2-3-18-254-39.us-east-2.compute.amazonaws.com"

# Build the APK using EAS
echo "📱 Building APK with EAS..."
npx eas build --platform android --profile preview

echo "✅ Build completed! Check your EAS dashboard for the APK download link." 