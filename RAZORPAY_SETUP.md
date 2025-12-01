# Razorpay Setup Instructions

## Issue
The error "Cannot read property 'open' of null" occurs because `react-native-razorpay` requires native modules that need to be properly linked and the app needs to be rebuilt.

## Solution

### Step 1: Clean the build
```bash
cd app
npx expo prebuild --clean
```

### Step 2: Rebuild the Android app
```bash
# For Android
npx expo run:android

# OR if you want to build a development client
eas build --profile development --platform android
```

### Step 3: Test on a physical device or emulator
- **Important**: Razorpay may not work properly in Expo Go
- You need to use a development build or production build
- Test on a physical device for best results

## Alternative: If you're using Expo Go

If you're currently using Expo Go, you **must** switch to a development build:

1. Build a development client:
   ```bash
   eas build --profile development --platform android
   ```

2. Install the development build on your device

3. Start the dev server:
   ```bash
   npx expo start --dev-client
   ```

## Verification

After rebuilding, the Razorpay checkout should open properly. The error handling in `paymentService.ts` will now show a clearer error message if the module is still not available.

## Notes

- The Razorpay repository has been added to `android/build.gradle`
- The payment service now includes null checks for better error handling
- Make sure you're not running in Expo Go - use a development or production build

