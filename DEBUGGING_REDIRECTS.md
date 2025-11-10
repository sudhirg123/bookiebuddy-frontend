# Debugging OAuth Redirects - Preserving Network Logs

## The Problem

When `signInWithRedirect` happens, the browser navigates to Google's OAuth page, then redirects back to your app. This causes:
- Network tab to reset (shows "Failed to load response" for old requests)
- Console logs from before redirect to be lost
- Difficult to debug what happened during redirect

## Solution 1: Preserve Log (Chrome/Edge DevTools)

### Steps:
1. **Open DevTools** (F12)
2. Go to **Console** tab
3. Click the **Settings** icon (gear) in the top-right of Console
4. Check **"Preserve log"** option
   - This keeps console logs across page navigations/redirects
5. Go to **Network** tab
6. Check **"Preserve log"** checkbox at the top
   - This keeps network requests across redirects
7. **Clear** both Console and Network tabs before testing
8. Try login - logs will now persist across redirects

## Solution 2: Network Tab Settings (Chrome/Edge)

### Additional Network Tab Options:
1. **Network** tab → **Settings** (gear icon)
2. Enable:
   - **"Preserve log"** - Keep requests after navigation
   - **"Disable cache"** - Always fetch fresh requests
   - **"Record network log"** - Save network activity

## Solution 3: Check Redirect URL in Address Bar

**Most Important:** When Google redirects back, check the URL:

1. After selecting account, you'll be redirected back
2. **Look at the address bar** - the URL should have parameters:
   ```
   http://localhost:4200/login?code=xxxxx&state=xxxxx
   ```
   OR
   ```
   http://localhost:4200/__/auth/handler?code=xxxxx&state=xxxxx
   ```

3. **If URL has no parameters** (`http://localhost:4200/login`), the redirect URI is wrong

## Solution 4: Manual URL Inspection

If network logs are lost, you can still debug:

1. **Copy the full URL** when you return from Google (from address bar)
2. Paste it in the console logs check:
   ```javascript
   const url = new URL(window.location.href);
   console.log('Has code:', url.searchParams.has('code'));
   console.log('Has state:', url.searchParams.has('state'));
   console.log('Has error:', url.searchParams.has('error'));
   console.log('Full URL:', window.location.href);
   ```

## Solution 5: Use Network Recording

1. **Network** tab → Click **Record** (red circle)
2. Start login flow
3. After redirect, check the recording
4. Look for:
   - `accounts.google.com` requests
   - `identitytoolkit.googleapis.com` requests
   - Check response status codes and bodies

## Solution 6: Check Browser Console Before Redirect

Before clicking login, open console and check:
1. Network tab is open with "Preserve log" enabled
2. Console has "Preserve log" enabled
3. Clear both tabs
4. Click login - watch the redirect happen
5. After redirect, check both tabs for errors

## What to Look For

### Good Signs:
- URL has `?code=...&state=...` when returning
- Network shows successful request to `identitytoolkit.googleapis.com`
- Console shows `[AuthService] getRedirectResult returned: {hasResult: true}`

### Bad Signs:
- URL has no query parameters when returning
- URL has `?error=...` parameter
- Network shows 400/401 errors
- Console shows `{hasResult: false}`

## Quick Checklist

Before debugging:
- [ ] Preserve log enabled in Console
- [ ] Preserve log enabled in Network
- [ ] Network tab set to "All" (not "XHR" or "JS")
- [ ] Console cleared before test
- [ ] Network cleared before test
- [ ] Note the exact URL when returning from Google

## Alternative: Check Firebase Auth State Directly

If redirect seems to work but `getRedirectResult` fails, check auth state:

```javascript
// In browser console after redirect
import { getAuth } from 'firebase/auth';
const auth = getAuth();
console.log('Current user:', auth.currentUser);
```

If `currentUser` exists but `getRedirectResult` fails, there might be a timing issue.

