# 🚀 BookieBuddy Setup Guide

This guide will walk you through the configuration steps needed to start your BookieBuddy app.

## ✅ What's Already Done

- ✅ Dependencies installed and version conflicts resolved
- ✅ Project structure is complete
- ✅ All services and components are in place
- ✅ Google Books API URL is configured (no API key needed for basic usage)

## 🔧 What You Need to Configure

### 1. Firebase Authentication (Google Auth) - **REQUIRED**

Firebase Authentication is required for users to sign in with their Google accounts.

#### Step-by-Step Setup:

1. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Click "Add project" or select an existing project
   - Follow the setup wizard

2. **Enable Google Sign-In**
   - In your Firebase project, go to **Authentication** → **Sign-in method**
   - Click on **Google** provider
   - Enable it and click **Save**
   - Configure support email (required)

3. **Get Firebase Web App Credentials**
   - In Firebase Console, click the gear icon ⚙️ next to "Project Overview"
   - Select **Project settings**
   - Scroll down to **Your apps** section
   - Click the **Web** icon (`</>`) to add a web app if you haven't already
   - Register your app with a nickname (e.g., "BookieBuddy Web")
   - Copy the Firebase configuration object

4. **Update Environment Files**
   - Open `src/app/environments/environment.ts` (for development)
   - Open `src/app/environments/environment.prod.ts` (for production)
   - Replace the empty Firebase config with your credentials:
   ```typescript
   firebase: {
     apiKey: 'YOUR_API_KEY_HERE',
     authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_PROJECT_ID.appspot.com',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID'
   }
   ```

   **⚠️ Important:** Use the same config in both files, or use different Firebase projects for dev/prod.

#### Example of what your `environment.ts` should look like:
```typescript
export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC...',
    authDomain: 'bookiebuddy-12345.firebaseapp.com',
    projectId: 'bookiebuddy-12345',
    storageBucket: 'bookiebuddy-12345.appspot.com',
    messagingSenderId: '123456789012',
    appId: '1:123456789012:web:abcdef1234567890'
  },
  googleBooksApiUrl: 'https://www.googleapis.com/books/v1/volumes',
  // ... rest of config
};
```

### 2. Google Books API - **OPTIONAL (Already Configured)**

The Google Books API is already configured and **doesn't require an API key** for basic usage. The current setup will work out of the box.

However, if you need higher rate limits or advanced features, you can:
1. Get a Google Cloud API key from [Google Cloud Console](https://console.cloud.google.com/)
2. Enable the "Books API" in your project
3. Update the `GoogleBooksService` to include the API key in requests (modification needed)

For now, **you can skip this step** - the app will work with the public API.

## 🎯 Quick Start Checklist

- [ ] Create Firebase project
- [ ] Enable Google Sign-In in Firebase
- [ ] Get Firebase web app credentials
- [ ] Update `src/app/environments/environment.ts` with Firebase config
- [ ] Update `src/app/environments/environment.prod.ts` with Firebase config
- [ ] Start the app with `npm start`

## 🚀 Starting the App

Once you've configured Firebase:

```bash
npm start
```

The app will be available at **http://localhost:4200**

## 🧪 Testing the Setup

1. **Test Google Auth:**
   - Navigate to the login page
   - Click "Sign in with Google"
   - You should be redirected to Google's sign-in page
   - After authentication, you'll be redirected back to the app

2. **Test Google Books Search:**
   - After logging in, try adding a book
   - The search should autocomplete with book suggestions from Google Books API

## ⚠️ Troubleshooting

### Firebase Auth Not Working?
- ✅ Verify all Firebase config values are correct (no typos, no missing quotes)
- ✅ Check that Google Sign-In is enabled in Firebase Console
- ✅ Make sure you're using the correct Firebase project
- ✅ Check browser console for any error messages

### Google Books API Issues?
- The API is public and should work without configuration
- If you see rate limit errors, consider getting an API key
- Check browser network tab to see API responses

### Port Already in Use?
```bash
# Use a different port
ng serve --port 4201
```

## 📚 Additional Resources

- [Firebase Authentication Documentation](https://firebase.google.com/docs/auth)
- [Google Books API Documentation](https://developers.google.com/books/docs/v1/using)
- [Angular Firebase Documentation](https://github.com/angular/angularfire)

## 🎉 You're Ready!

Once Firebase is configured, your app is ready to use! All other features (book management, dashboard, search) will work with localStorage until you connect a backend.

