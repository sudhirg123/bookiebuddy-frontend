# Fix: redirect_uri_mismatch Error

## The Problem

**Error:** `Error 400: redirect_uri_mismatch`

This means Firebase is sending a redirect URI to Google that doesn't match what's configured in your OAuth client settings.

## Solution: Check Which Redirect URI Firebase Is Using

Firebase Auth with `signInWithRedirect` uses a specific redirect URI format. You need to add **exactly** what Firebase is sending.

### Step 1: Find the Actual Redirect URI

When you click "Sign in with Google", check the Network tab in DevTools:
1. Open DevTools → **Network** tab
2. Enable **Preserve log**
3. Click "Sign in with Google"
4. Look for the request to `accounts.google.com`
5. Check the URL - it will have a `redirect_uri` parameter
6. **Copy that exact redirect_uri value**

Alternatively, check the browser URL when Google redirects you back - that's the redirect URI being used.

### Step 2: Common Firebase Redirect URIs

Firebase typically uses one of these formats:

```
http://localhost:4200/__/auth/handler
http://localhost:4200
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler
```

### Step 3: Add to Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: **my-bookie-buddy-353fe**
3. **APIs & Services** → **Credentials**
4. Find your **OAuth 2.0 Client ID** (Web client)
5. Click to **edit** it
6. Under **Authorized redirect URIs**, make sure you have:

```
http://localhost:4200/__/auth/handler
http://localhost:4200
```

**Important:**
- Must be **exact match** (no trailing slashes)
- Use `http://` not `https://` for localhost
- Check for typos (localhost vs localhost)

### Step 4: Use Firebase-Generated OAuth Client

Firebase may have created its own OAuth client. Check:

1. **Firebase Console** → **Project Settings** → **Your apps**
2. Look for OAuth client info
3. In **Google Cloud Console**, look for a client with name containing "Firebase" or your project name
4. **Edit that client** (not a manually created one)

Firebase uses its own OAuth client for Auth, so you need to configure **that specific client**, not a manually created one.

### Step 5: Check All OAuth Clients

You might have multiple OAuth clients:

1. In Google Cloud Console → **Credentials**
2. List all **OAuth 2.0 Client IDs**
3. For **each one**, check:
   - Which one does Firebase use?
   - Add redirect URIs to **all** of them to be safe
   - Or identify the Firebase one and only configure that

### Step 6: Verify Configuration

After adding redirect URIs:

1. **Wait 5-10 minutes** for changes to propagate
2. **Clear browser cache/cookies**
3. Try login again
4. If still fails, check Network tab for the exact `redirect_uri` being sent

## Debugging: Find Exact Redirect URI

To see what Firebase is actually sending:

1. Open DevTools → **Network** tab
2. Enable **Preserve log**
3. Click "Sign in with Google"
4. Find request to `accounts.google.com/o/oauth2/v2/auth`
5. Click on it
6. Look at **Request URL** - it will have `redirect_uri=` parameter
7. **Copy that exact value**
8. Make sure **exactly that value** is in your OAuth client redirect URIs

## Common Issues

### Issue 1: Wrong OAuth Client
- Firebase uses a specific OAuth client
- Make sure you're editing the **Firebase-generated** client, not a manually created one

### Issue 2: Port Mismatch
- Using port 4200? Make sure redirect URI has `:4200`
- Check your dev server is actually on 4200

### Issue 3: Trailing Slash
- `http://localhost:4200/` ❌ (has trailing slash)
- `http://localhost:4200` ✅ (no trailing slash)

### Issue 4: HTTP vs HTTPS
- For localhost, use `http://` not `https://`
- Production would use `https://`

## Quick Fix Checklist

- [ ] Added `http://localhost:4200/__/auth/handler` to redirect URIs
- [ ] Added `http://localhost:4200` to redirect URIs
- [ ] Using the **correct OAuth client** (Firebase-generated one)
- [ ] No trailing slashes
- [ ] Using `http://` not `https://` for localhost
- [ ] Waited 5-10 minutes after saving
- [ ] Cleared browser cache
- [ ] Checked Network tab for exact redirect_uri being sent

## Still Not Working?

1. **Check Firebase Console** → Project Settings → Your apps → OAuth client ID
2. **Note that Client ID**
3. **Go to Google Cloud Console** → Credentials
4. **Find the OAuth client with matching Client ID**
5. **Edit that specific client** and add redirect URIs
6. Make sure you're not editing a different/old OAuth client

