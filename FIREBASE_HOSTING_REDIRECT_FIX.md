# Fix: Firebase Using Hosting Domain Instead of Localhost

## The Problem

Your curl request shows:
- **Origin:** `https://my-bookie-buddy-353fe.firebaseapp.com`
- But your app runs on: `http://localhost:4200`

Firebase Auth is using your **Firebase hosting domain** for redirects instead of localhost.

## Solution: Add Firebase Hosting Domain to OAuth Client

Firebase Auth redirects can go to either:
1. Your localhost (for development)
2. Your Firebase hosting domain (for production/testing)

You need to add **both** to your OAuth client.

## Step-by-Step Fix

### 1. Go to Google Cloud Console

1. [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **my-bookie-buddy-353fe**
3. **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (Web client - likely Firebase-generated)
5. Click to **edit** it

### 2. Add Both Localhost AND Firebase Hosting Domain

**Authorized redirect URIs** - Add ALL of these:
```
http://localhost:4200/__/auth/handler
http://localhost:4200
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler
https://my-bookie-buddy-353fe.firebaseapp.com
```

**Authorized JavaScript origins** - Add ALL of these:
```
http://localhost:4200
https://my-bookie-buddy-353fe.firebaseapp.com
```

### 3. Save and Wait

1. Click **SAVE**
2. Wait **5-10 minutes** for changes to propagate
3. Clear browser cache/cookies
4. Try login again

## Why This Happens

Firebase Auth uses the `authDomain` from your config for redirects. When it can't determine the localhost origin correctly, it falls back to the Firebase hosting domain.

## Alternative: Force Localhost Redirect

If you want to force Firebase to use localhost, you can configure the redirect URL, but the easier solution is to just add both domains to the OAuth client.

## Complete OAuth Configuration

For development, your OAuth client should have:

**Authorized JavaScript origins:**
```
http://localhost:4200
https://my-bookie-buddy-353fe.firebaseapp.com
```

**Authorized redirect URIs:**
```
http://localhost:4200/__/auth/handler
http://localhost:4200
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler
https://my-bookie-buddy-353fe.firebaseapp.com
```

This covers both localhost development AND Firebase hosting.

## Verify It's Working

After adding the Firebase hosting domain URIs:

1. Wait 5-10 minutes
2. Clear browser cache
3. Try login
4. The redirect should work whether Firebase uses localhost or the hosting domain

