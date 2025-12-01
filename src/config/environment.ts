// Simple API Configuration
// Just change this one URL to point to your backend
// export const BASE_URL = 'https://apiwellness.shrawantravels.com/api';
// export const UPLOADS_BASE_URL = 'https://apiwellness.shrawantravels.com/uploads';
export const BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://192.168.29.190:5000/api";
export const UPLOADS_BASE_URL =
  process.env.EXPO_PUBLIC_UPLOADS_BASE_URL ??
  "http://192.168.29.190:5000/uploads";

export const GOOGLE_ANDROID_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? "";
export const GOOGLE_IOS_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";
export const GOOGLE_WEB_CLIENT_ID =
  process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "";

export const RAZORPAY_KEY_ID =
  process.env.EXPO_PUBLIC_RAZORPAY_KEY_ID ?? "";

console.log(`🔗 API Base URL: ${BASE_URL}`);
