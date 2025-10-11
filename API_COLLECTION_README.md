# 🏥 Wellness App - API Collection

## 📋 Overview

This is the **complete and final** Postman collection for the Wellness App API. All unnecessary files have been removed and the API has been thoroughly tested.

## 📦 Collection File
- **File**: `Wellness-App-API-Collection.json`
- **Location**: Root directory of the project

## 🚀 Quick Start

### 1. Import into Postman
1. Open Postman
2. Click "Import"
3. Select the `Wellness-App-API-Collection.json` file
4. The collection will be imported with all endpoints organized

### 2. Set Environment Variables
The collection uses these variables (automatically managed):
- `baseUrl`: http://localhost:3001 (default)
- `authToken`: Automatically saved from login
- `resetToken`: Automatically saved from OTP verification

### 3. Start the Server
```bash
cd backend
npm start
# Server runs on http://localhost:3001
```

## 📚 API Endpoints

### 🔐 Authentication
- **Register User**: Create new account
- **Verify Email OTP**: Verify email with OTP
- **Login User**: Login and get JWT token

### 🔄 Password Reset Flow (Fixed!)
- **Step 1**: Request Password Reset → Sends OTP to email
- **Step 2**: Verify OTP → Returns reset token
- **Step 3**: Reset Password → Uses reset token to change password

### 👤 User Management (Requires Auth)
- **Get Profile**: View user profile
- **Update Profile**: Update user information
- **Change Password**: Change password (authenticated)

### 🏥 Utility
- **Health Check**: Server status
- **API Documentation**: API info

## ✅ Key Features

### Automated Token Management
- JWT tokens automatically saved and used
- Reset tokens automatically captured and applied
- No manual token copying required

### Comprehensive Testing
- Automatic response validation
- Status code checks
- Success/error handling
- Console logging for debugging

### Clear Step-by-Step Process
- Password reset clearly marked as 3 steps
- Descriptive request names and descriptions
- Progress logging in console

## 🔧 Password Reset Process

**IMPORTANT: Must follow exact sequence!**

1. **Request Reset** → User receives OTP via email
2. **Verify OTP** → System returns reset token (auto-saved)
3. **Reset Password** → Uses saved token to change password

❌ **Cannot skip Step 2!** The reset token must be obtained through OTP verification.

## 📝 Usage Notes

### Testing Tips
1. Use real email addresses for OTP testing
2. Check server console for OTP codes during development
3. Reset tokens expire in 10 minutes
4. Each request includes automatic validation

### Example Flow
1. Run "Register User" → Check email for OTP
2. Run "Verify Email OTP" → Use OTP from email
3. Run "Login User" → Token auto-saved
4. Run authenticated endpoints with saved token

### Password Reset Testing
1. Run "Step 1: Request Password Reset"
2. Check email/server logs for OTP
3. Run "Step 2: Verify OTP" with actual OTP
4. Run "Step 3: Reset Password" (token auto-filled)

## 🧹 Cleanup Completed

### Removed Files
- ❌ Old Postman collections (corrected, fixed, v2, etc.)
- ❌ Debug test scripts (token-test.js, debug-test.js, etc.)
- ❌ Temporary files and duplicates

### Cleaned Code
- ❌ Debug console logs removed from production code
- ✅ Clean, production-ready codebase
- ✅ Proper error handling maintained

## 🎯 Final Status

✅ **Password reset issue completely resolved**  
✅ **Single, comprehensive Postman collection**  
✅ **All unnecessary files removed**  
✅ **Production-ready codebase**  
✅ **Automated testing included**  

The API is now ready for production use with a clean, organized structure and comprehensive testing capabilities.