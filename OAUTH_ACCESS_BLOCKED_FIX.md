# Fix: "Access blocked: project's request is invalid"

## What This Error Means

This error occurs when Google OAuth rejects the authentication request because:
1. **Redirect URI is missing** or not authorized
2. **Redirect URI doesn't match** what's configured in Google Cloud Console
3. **OAuth Client ID is misconfigured**
4. **OAuth Consent Screen is incomplete**

## Solution: Configure OAuth Redirect URIs

### Step 1: Find Your OAuth Client ID

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **my-bookie-buddy-353fe** (or your project)
3. Go to **APIs & Services** → **Credentials**
4. Find the **OAuth 2.0 Client IDs** section
5. Look for a client ID with type "Web application" or "Web client"
6. Note the **Client ID** number

### Step 2: Add Redirect URIs

1. Click on your **Web client** OAuth 2.0 Client ID to edit it
2. Under **Authorized redirect URIs**, you should see a list (might be empty)
3. Click **+ ADD URI** for each of these:
   ```
   http://localhost:4200/__/auth/handler
   http://localhost:4200
   ```
4. **Important:** 
   - Use exact URLs (no trailing slashes)
   - Use `http://` not `https://` for localhost
   - Port must match your dev server (4200)
5. Click **SAVE**

### Step 3: Verify OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Make sure it's configured:
   - **User Type:** External (for testing) or Internal (for workspace users)
   - **App name:** Enter a name (e.g., "BookieBuddy")
   - **Support email:** Your email
   - **Developer contact:** Your email
3. Under **Scopes**, make sure basic scopes are added
4. If using External user type:
   - Go to **Test users** tab
   - Add your email as a test user
5. Click **SAVE AND CONTINUE** through all steps

### Step 4: Check Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **my-bookie-buddy-353fe**
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Verify `localhost` is listed (it should be automatic)

### Step 5: Verify the OAuth Client Matches Firebase

**Important:** Firebase uses a specific OAuth Client ID. Make sure you're editing the right one:

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click on your web app (or create one if missing)
4. Note the **Web API Key** and **App ID**
5. In Google Cloud Console, the OAuth Client ID used by Firebase should match

### Common Issues

#### Issue 1: Multiple OAuth Clients
Firebase may have created its own OAuth client. To find it:
1. Google Cloud Console → **APIs & Services** → **Credentials**
2. Look for client names like "Firebase Auth (PROJECT_NAME)" or similar
3. Edit that client and add the redirect URIs

#### Issue 2: Wrong Project
Make sure you're in the correct Google Cloud project that matches your Firebase project.

#### Issue 3: OAuth Consent Screen Not Published
- For **Internal** users: Should work immediately
- For **External** users: Must add test users, or publish the app

### Step 6: Wait and Test

1. **Wait 5-10 minutes** after making changes (Google propagates changes)
2. **Clear browser cache** for localhost
3. **Try login again**

### Verification Checklist

Before testing, verify:
- [ ] Redirect URI `http://localhost:4200/__/auth/handler` is in OAuth Client
- [ ] Redirect URI `http://localhost:4200` is in OAuth Client  
- [ ] OAuth Consent Screen is configured (app name, email, scopes)
- [ ] If External user type: Test user added
- [ ] Firebase Authorized domains includes `localhost`
- [ ] Waiting 5-10 minutes after changes

### Still Not Working?

1. **Check the exact error message** - it might give more details
2. **Check Network tab** - look for the failed OAuth request URL
3. **Try incognito mode** - rules out browser cache issues
4. **Check Google Cloud Console logs** - APIs & Services → Logs
5. **Verify Firebase Auth is enabled** - Firebase Console → Authentication → Sign-in method → Google

