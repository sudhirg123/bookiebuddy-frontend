# Firebase Redirect URI Configuration Fix

## Problem

After clicking "Sign in with Google", you're redirected to Google and select an account, but when redirected back:
- URL has **no auth parameters** (`?code=...&state=...`)
- `getRedirectResult` returns `hasResult: false`
- You see the login page again

## Root Cause

Firebase redirect authentication uses a specific redirect URI that must match what's configured in:
1. **Firebase Console** → Authentication → Settings
2. **Google Cloud Console** → OAuth 2.0 Client IDs

## Solution: Configure Redirect URIs

### Step 1: Firebase Console Settings

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `my-bookie-buddy-353fe`
3. Go to **Authentication** → **Settings** → **Authorized domains**
4. Make sure `localhost` is listed
5. Note: `localhost` is added automatically, but verify it's there

### Step 2: Google Cloud Console - OAuth Redirect URIs

**This is the critical step!**

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `my-bookie-buddy-353fe` (or your project)
3. Go to **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (should be "Web client" type)
5. Click to edit it
6. Under **Authorized redirect URIs**, add these **exact** URLs:

   ```
   http://localhost:4200/__/auth/handler
   http://localhost:4200
   ```

   **Important:** Firebase uses `/__/auth/handler` as the default redirect endpoint!

7. Click **Save**

### Step 3: Verify Firebase Auth Domain

In your `environment.ts`, check that `authDomain` matches:
```typescript
authDomain: "my-bookie-buddy-353fe.firebaseapp.com"
```

This should match your Firebase project's auth domain.

### Step 4: Test the Flow

1. Clear browser cache/cookies for localhost
2. Enable "Preserve log" in DevTools (Console and Network tabs)
3. Click "Sign in with Google"
4. Select your account
5. **Check the URL when redirected back:**
   - Should be: `http://localhost:4200/__/auth/handler?code=...&state=...`
   - OR: `http://localhost:4200?code=...&state=...`
   - Should **NOT** be just `http://localhost:4200/login` with no params

## Common Issues

### Issue 1: Redirect URI Not Added
**Symptom:** URL has no `?code=...` when returning
**Fix:** Add `http://localhost:4200/__/auth/handler` to OAuth redirect URIs

### Issue 2: Wrong Port
**Symptom:** Redirect goes to wrong URL
**Fix:** Make sure redirect URI uses port 4200 (or your dev server port)

### Issue 3: HTTP vs HTTPS
**Symptom:** Redirect fails
**Fix:** Use `http://` for localhost (not `https://`)

### Issue 4: Extra Slash or Path
**Symptom:** Redirect doesn't match
**Fix:** Exact match required - `http://localhost:4200/__/auth/handler` (no trailing slash)

## Verify Configuration

After adding redirect URIs, verify:

1. **In Google Cloud Console:**
   - OAuth Client → Authorized redirect URIs should have:
     - `http://localhost:4200/__/auth/handler`
     - `http://localhost:4200`

2. **In Firebase Console:**
   - Authentication → Settings → Authorized domains should have:
     - `localhost`

3. **In your app:**
   - When redirect returns, check URL in address bar
   - Should have `?code=...` parameter

## Testing Checklist

- [ ] `http://localhost:4200/__/auth/handler` added to OAuth redirect URIs
- [ ] `localhost` in Firebase authorized domains
- [ ] Preserve log enabled in DevTools
- [ ] Check URL when returning from Google (should have `?code=...`)
- [ ] Check console logs for `URL contains auth params: true`

## Still Not Working?

If redirect URI is configured but still not working:

1. **Wait 5-10 minutes** - OAuth changes can take time to propagate
2. **Clear browser cache** - Old redirects might be cached
3. **Try incognito mode** - Rules out extensions/cache
4. **Check Network tab** - Look for errors in redirect requests
5. **Check Firebase logs** - Firebase Console → Functions → Logs (if using)

