# Verify You're Editing the Correct OAuth Client

## The Problem

Even if redirect URIs are configured, you might be editing the **wrong OAuth client**. Firebase might be using a different OAuth client than the one you're editing.

## How to Find the Correct OAuth Client

### Method 1: Check Network Request

1. Open DevTools → **Network** tab
2. Enable **Preserve log**
3. Click "Sign in with Google"
4. Find the request to `accounts.google.com/o/oauth2/v2/auth`
5. Click on it
6. Check the **Request URL** or **Payload**
7. Look for `client_id` parameter
8. **Copy that Client ID**

Then:
1. Go to **Google Cloud Console** → **Credentials**
2. Find the **OAuth 2.0 Client ID** that matches that Client ID
3. **That's the one you need to edit**

### Method 2: Check Firebase Console

1. Firebase Console → **Project Settings** (gear icon)
2. Scroll to **Your apps**
3. Look for any OAuth client information
4. Note any Client ID shown there

### Method 3: Check All OAuth Clients

1. Google Cloud Console → **Credentials**
2. List **all** OAuth 2.0 Client IDs
3. For **each Web client**, check:
   - Does it have the redirect URIs?
   - Which one looks like it's Firebase-generated? (might say "Firebase" or be auto-created)
4. **Add redirect URIs to ALL Web clients** to be safe

## Verify Exact Redirect URI Match

The redirect URI must match **exactly**:

✅ Correct:
```
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler
```

❌ Wrong (common mistakes):
```
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler/  (trailing slash)
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler?param=value  (extra params)
http://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler  (http instead of https)
```

## Double-Check Format

Make sure in your OAuth client:
- **No trailing slashes** (except on domain-only URIs)
- **Correct protocol** (https for firebaseapp.com, http for localhost)
- **Exact path** (`/__/auth/handler` not `/__auth/handler` or `/auth/handler`)
- **No extra spaces** or special characters

## Quick Test

1. Copy the exact `continueUri` from the curl request: `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler`
2. Go to OAuth client → Authorized redirect URIs
3. **Copy-paste** that exact string
4. Make sure it's in the list exactly as shown (no variations)
5. Save

## Still Not Working?

If redirect URIs are correct but still failing:

1. **Wait 10-15 minutes** - OAuth changes can take time to propagate globally
2. **Clear browser cache/cookies** - Old redirects might be cached
3. **Try incognito mode** - Rules out browser extensions
4. **Check if there are multiple OAuth clients** - Firebase might have created one automatically
5. **Verify the Client ID** in the Network request matches the OAuth client you're editing

