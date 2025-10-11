# API Configuration Management

This project uses a centralized API configuration system that makes it easy to switch between different environments (development, staging, production).

## 📁 File Structure

```
src/config/
├── environment.ts     # Environment configuration (UPDATE THIS)
└── apiConfig.ts      # API endpoints and URL building
```

## 🔧 How to Change API URL

### Quick Change (Most Common)
**File: `src/config/environment.ts`**

1. **For Development (localhost):**
   ```typescript
   CURRENT_ENV: 'development'
   ```

2. **For Production:**
   ```typescript
   CURRENT_ENV: 'production'
   ```

3. **Update the URLs:**
   ```typescript
   development: {
     API_BASE_URL: 'http://localhost:5000/api',     // Your local backend
     UPLOADS_BASE_URL: 'http://localhost:5000/uploads',
     DEBUG: true,
   },
   
   production: {
     API_BASE_URL: 'https://yourapp.com/api',       // Your production backend
     UPLOADS_BASE_URL: 'https://yourapp.com/uploads',
     DEBUG: false,
   }
   ```

## 🚀 Environment Switching

### For Development
```typescript
// src/config/environment.ts
CURRENT_ENV: 'development'
```

### For Production Deployment
```typescript
// src/config/environment.ts  
CURRENT_ENV: 'production'
```

### For Staging
```typescript
// src/config/environment.ts
CURRENT_ENV: 'staging'
```

## 💡 Benefits

✅ **Single Source of Truth** - Change API URL in one place  
✅ **Environment Management** - Easy switching between dev/staging/prod  
✅ **Type Safety** - TypeScript support for all endpoints  
✅ **Consistent URLs** - All API calls use the same base configuration  
✅ **Easy Deployment** - Just change environment and rebuild  

## 🔍 Usage in Code

The API service automatically uses the configured URLs:

```typescript
// This automatically uses the configured BASE_URL
await apiService.login({ email, password });
await apiService.register(userData);
await apiService.forgotPassword(email);
```

## 🏗️ Adding New Endpoints

Add new endpoints in `src/config/apiConfig.ts`:

```typescript
export const ENDPOINTS = {
  AUTH: { /* existing */ },
  EXPERTS: { /* existing */ },
  // Add new endpoints here
  APPOINTMENTS: {
    LIST: '/appointments',
    CREATE: '/appointments',
    CANCEL: '/appointments/cancel',
  }
};
```

## 🔄 After Making Changes

1. Save the file
2. Restart the development server
3. The app will automatically use the new configuration

---

**Need help?** Check the console logs - they show which environment and API URL is currently being used!