# Firebase Authentication Troubleshooting Guide

## Issue: "Login failed" after selecting Google account

### Step 1: Check Browser Console
Open Developer Tools (F12) → Console tab and look for the actual Firebase error code. The improved error handler will now show specific error messages.

### Step 2: Add Authorized Domains in Firebase

**This is the most common cause!**

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-bookie-buddy-353fe`
3. Navigate to **Authentication** → **Settings** → **Authorized domains**

**Important:** `localhost` should already be there by default! If you're getting "Invalid domain: must be a top private domain" error:

- **Don't manually add `localhost`** - it's automatically included for development
- If `localhost` is missing, try adding it as: `localhost:4200` (with port)
- Or use `127.0.0.1` instead (IP address format)

4. Add these domains if needed:
   - `127.0.0.1` (if localhost doesn't work)
   - `localhost:4200` (if you're using port 4200)
   - Your production domain (when deploying)

**Note:** If you see "Invalid domain" error, it means:
- `localhost` should already be there (check the list - it might be there already)
- You might be trying to add a domain that's not allowed
- For development, Firebase usually includes `localhost` automatically

### Step 3: Verify Google Sign-In is Enabled

1. In Firebase Console → **Authentication** → **Sign-in method**
2. Click on **Google** provider
3. Ensure it's **Enabled**
4. Ensure **Project support email** is set
5. Click **Save**

### Step 4: Configure OAuth Consent Screen ⚠️

**Important:** You CANNOT add `localhost` to OAuth consent screen authorized domains - that section is only for production domains. Firebase handles `localhost` automatically for development.

However, the OAuth consent screen still needs to be properly configured:

#### Option A: Via Firebase Console (Easier)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-bookie-buddy-353fe`
3. Navigate to **Authentication** → **Settings** tab
4. Look for **OAuth consent screen** section or a link to configure it
5. Click on it to configure

#### Option B: Via Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **Select the correct project** in the top dropdown (look for `my-bookie-buddy-353fe`)
3. In the left sidebar (☰ menu), navigate to **APIs & Services** → **OAuth consent screen**
4. Ensure these are ALL configured:

**Required Settings:**
- ✅ **User Type**: Must be set to either "Internal" or "External"
  - If External: App needs to be published or you need to add test users
  - If Internal: Only works for Google Workspace users
- ✅ **App name**: Must be filled in (e.g., "BookieBuddy")
- ✅ **User support email**: Must be set (your email)
- ✅ **Developer contact information**: Must be set (your email)
- ✅ **Scopes**: Should include (usually auto-added):
  - `../auth/userinfo.email`
  - `../auth/userinfo.profile`
  - `openid`

**About Authorized Domains:**
- The "Authorized domains" section is for PRODUCTION domains only
- `localhost` CANNOT be added here (you'll get "invalid domain" error)
- Firebase automatically handles `localhost` for development
- Your production domain (`my-bookie-buddy-353fe.firebaseapp.com`) should already be there

**If User Type is "External":**
- You may need to add test users
- Go to "Test users" section
- Add your Google account email as a test user
- OR publish the app (requires verification)

**Important - If you see "not configured to use secure OAuth flows" warning:**
- Complete ALL required fields (app name, support email, developer contact)
- This warning won't block development but should be fixed
- See `OAUTH_SECURITY_FIX.md` for detailed steps

**If User Type is "Internal":**
- Only works if you're using Google Workspace
- For personal Gmail accounts, use "External"

### Step 5: Verify Firebase API Restrictions (Optional - Usually Not Needed)

**Note:** This step is usually not necessary for basic setup. Only check this if you've restricted your API key.

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
   - You may need to link your Firebase project to Google Cloud first
   - Or access it directly: Look for a "Project settings" gear icon in Firebase Console → General tab → Your apps section
2. In Google Cloud Console, make sure you've selected the correct project in the top dropdown
3. In the left sidebar, find **APIs & Services** → **Credentials**
   - If you don't see this menu, you may not have access or the project isn't linked to Google Cloud
   - For basic development, you can skip this step - API restrictions are usually not the issue
4. If you can see Credentials, find your Firebase API key (starts with `AIzaSy...`)
5. Click to edit it
6. Check **API restrictions**:
   - Should allow **Firebase Authentication API** OR
   - Set to **Don't restrict key** (for development)

### Step 6: Check Error Codes

After improving the error handler, you'll see specific error codes:

- **`auth/unauthorized-domain`**: Add `localhost` to authorized domains (see Step 2)
- **`auth/operation-not-allowed`**: Enable Google sign-in in Firebase (see Step 3)
- **`auth/popup-closed-by-user`**: User closed the popup (not an error)
- **`auth/popup-blocked`**: Browser blocked the popup (allow popups)
- **`auth/network-request-failed`**: Network/connectivity issue

### Quick Fix Checklist (Most Important First!)

**Start with these - they fix 95% of issues:**

- [ ] `localhost` added to Firebase authorized domains (Step 2) ⚠️ **MOST COMMON FIX**
- [ ] Google sign-in method enabled in Firebase (Step 3)
- [ ] Browser console shows specific error code (check after trying to log in)
- [ ] Tried in incognito/private window (to rule out cache issues)

**Advanced (usually not needed):**

- [ ] OAuth consent screen configured (Step 4 - only if Step 2 & 3 don't work)
- [ ] API key restrictions checked (Step 5 - rarely the issue)

### Testing After Fixes

1. Clear browser cache or use incognito mode
2. Try signing in again
3. Check browser console for specific error code
4. Share the error code if issues persist

