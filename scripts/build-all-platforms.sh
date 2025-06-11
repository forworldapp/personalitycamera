#!/bin/bash

# Multi-platform build script for Personality AI
# Builds for Web, Android, and iOS

set -e

echo "🚀 Starting multi-platform build process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_step() {
    echo -e "${BLUE}📦 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check prerequisites
check_prerequisites() {
    print_step "Checking prerequisites..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if Android Studio is available (for Android build)
    if [ "$1" = "android" ] || [ "$1" = "all" ]; then
        if ! command -v ./android/gradlew &> /dev/null; then
            print_warning "Android Gradle wrapper not found. Android build may fail."
        fi
    fi
    
    # Check if Xcode is available (for iOS build)
    if [ "$1" = "ios" ] || [ "$1" = "all" ]; then
        if ! command -v xcodebuild &> /dev/null; then
            print_warning "Xcode command line tools not found. iOS build may fail."
        fi
    fi
    
    print_success "Prerequisites check completed"
}

# Install dependencies
install_dependencies() {
    print_step "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
}

# Build web application
build_web() {
    print_step "Building web application..."
    npm run build
    print_success "Web build completed"
}

# Sync with Capacitor
sync_capacitor() {
    print_step "Syncing with Capacitor..."
    npx cap sync
    print_success "Capacitor sync completed"
}

# Build for Android
build_android() {
    print_step "Building Android APK..."
    
    if [ ! -d "android" ]; then
        print_error "Android platform not found. Run 'npx cap add android' first."
        return 1
    fi
    
    cd android
    
    # Build debug APK
    if ./gradlew assembleDebug; then
        print_success "Android debug APK built successfully"
        print_step "APK location: android/app/build/outputs/apk/debug/app-debug.apk"
    else
        print_error "Android debug build failed"
        cd ..
        return 1
    fi
    
    # Build release APK if keystore exists
    if [ -f "../personality-ai-release-key.keystore" ]; then
        print_step "Building release APK..."
        if ./gradlew assembleRelease; then
            print_success "Android release APK built successfully"
            print_step "APK location: android/app/build/outputs/apk/release/app-release.apk"
        else
            print_warning "Android release build failed (check keystore configuration)"
        fi
    else
        print_warning "Release keystore not found. Only debug APK built."
        print_step "To build release APK, create keystore: keytool -genkey -v -keystore personality-ai-release-key.keystore -alias personality-ai -keyalg RSA -keysize 2048 -validity 10000"
    fi
    
    cd ..
}

# Build for iOS
build_ios() {
    print_step "Building iOS app..."
    
    if [ ! -d "ios" ]; then
        print_error "iOS platform not found. Run 'npx cap add ios' first."
        return 1
    fi
    
    # Open Xcode project
    if command -v xed &> /dev/null; then
        print_step "Opening Xcode project..."
        npx cap open ios
        print_warning "Please build and archive in Xcode manually:"
        print_step "1. Select 'Any iOS Device' as target"
        print_step "2. Product > Archive"
        print_step "3. Distribute App > App Store Connect"
    else
        print_warning "Xcode not found. Manual build required on macOS."
    fi
}

# Generate build info
generate_build_info() {
    print_step "Generating build information..."
    
    cat > build-info.json << EOF
{
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "version": "1.0.0",
  "buildNumber": "$(date +%Y%m%d%H%M)",
  "platforms": {
    "web": {
      "status": "completed",
      "outputDir": "dist/"
    },
    "android": {
      "status": "$([ -f "android/app/build/outputs/apk/debug/app-debug.apk" ] && echo "completed" || echo "pending")",
      "debugApk": "android/app/build/outputs/apk/debug/app-debug.apk",
      "releaseApk": "android/app/build/outputs/apk/release/app-release.apk"
    },
    "ios": {
      "status": "requires_xcode",
      "projectPath": "ios/App.xcworkspace"
    }
  },
  "nextSteps": [
    "Test apps on actual devices",
    "Upload to Google Play Console",
    "Upload to App Store Connect",
    "Submit for review"
  ]
}
EOF
    
    print_success "Build info generated: build-info.json"
}

# Main build function
main() {
    local platform=${1:-all}
    
    echo "🎯 Building for platform: $platform"
    
    check_prerequisites $platform
    install_dependencies
    build_web
    sync_capacitor
    
    case $platform in
        "android")
            build_android
            ;;
        "ios")
            build_ios
            ;;
        "all")
            build_android
            build_ios
            ;;
        "web")
            print_success "Web-only build completed"
            ;;
        *)
            print_error "Unknown platform: $platform"
            print_step "Usage: $0 [web|android|ios|all]"
            exit 1
            ;;
    esac
    
    generate_build_info
    
    print_success "🎉 Build process completed!"
    print_step "Check build-info.json for details"
}

# Run main function with arguments
main "$@"