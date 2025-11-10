# Finding Firebase OAuth Client ID

## Step-by-Step Instructions

### Method 1: Firebase Console (Project Settings)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **my-bookie-buddy-353fe**
3. Click the **Gear icon (⚙️)** in the top left (next to "Project Overview")
4. Click **Project settings**
5. Scroll down to the **Your apps** section
6. Look for your web app (or create one if you don't have one)
7. In the app configuration, you'll see:
   - **App ID**
   - **Web API Key**
   - But OAuth Client ID might not be directly visible here

### Method 2: Google Cloud Console (More Reliable)

Firebase Auth uses Google Cloud OAuth clients. To find them:

1. **In Firebase Console:**
   - Go to **Project Settings** (gear icon)
   - Scroll to bottom
   - Click **"Users and permissions"** or look for a link to **Google Cloud Console**

2. **OR go directly to Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Make sure you're in the correct project (top dropdown)
   - Select: **my-bookie-buddy-353fe**

3. **Navigate to OAuth Clients:**
   - Left sidebar: **APIs & Services** → **Credentials**
   - You'll see a list of **OAuth 2.0 Client IDs**

4. **Look for Firebase-related clients:**
   - Client names might be:
     - `Web client (auto created by Google Service)`
     - `Firebase Auth (my-bookie-buddy-353fe)`
     - Or just `Web client`
   - There might be multiple - look for ones created automatically

### Method 3: Check Which Client Firebase Is Using

Since Firebase Auth with redirect uses a specific client, you need to find which one:

1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Look at all **OAuth 2.0 Client IDs**
3. **Firebase typically uses:**
   - A client with type **"Web application"** or **"Web client"**
   - Usually one that was auto-created
   - Might have "Firebase" in the name or description

### Method 4: Check by Testing (Network Tab)

1. Open your app in browser
2. Open DevTools → **Network** tab
3. Enable **Preserve log**
4. Click "Sign in with Google"
5. Look for request to `accounts.google.com`
6. Check the `client_id` parameter in the URL
7. Go to Google Cloud Console → Credentials
8. Find the OAuth client with that **Client ID**

## What You Need to Configure

Once you find the OAuth client Firebase is using:

1. **Click to edit** that OAuth client
2. Under **Authorized redirect URIs**, add:
   ```
   http://localhost:4200/__/auth/handler
   http://localhost:4200
   ```
3. Under **Authorized JavaScript origins**, add:
   ```
   http://localhost:4200
   ```
4. Click **SAVE**

## Quick Navigation Path

**Firebase Console:**
```
Firebase Console
  → Select Project (my-bookie-buddy-353fe)
  → ⚙️ Project Settings
  → Scroll to "Your apps"
```

**Google Cloud Console (Recommended):**
```
Google Cloud Console
  → Select Project (my-bookie-buddy-353fe)
  → APIs & Services (left sidebar)
  → Credentials
  → OAuth 2.0 Client IDs (section)
```

## Important Notes

- **Firebase might have multiple OAuth clients** - you need the one being used for Auth
- **If unsure, add URIs to all Web-type OAuth clients** in the project
- **The client might be auto-created** when you enable Google Sign-in in Firebase
- **Client ID format**: Usually looks like `xxxxx.apps.googleusercontent.com`

## Alternative: Check Firebase Authentication Settings

1. Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Check if there's any OAuth client info shown there
4. Might link to Google Cloud Console credentials

