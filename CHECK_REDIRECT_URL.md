# Critical: Check Redirect URL After Google Login

## The Problem

After selecting your Google account, when Google redirects you back, check the **exact URL** in your browser's address bar.

## What to Check

### Step 1: After Selecting Account

1. Click "Sign in with Google"
2. Select your account
3. **BEFORE the page loads**, look at the address bar
4. **Copy the exact URL** you see

### Step 2: Expected URLs

The URL should be one of these formats:

**Option 1 (Localhost):**
```
http://localhost:4200/__/auth/handler?code=XXXXX&state=XXXXX
```

**Option 2 (Firebase Hosting):**
```
https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler?code=XXXXX&state=XXXXX
```

**Option 3 (Simple Redirect):**
```
http://localhost:4200?code=XXXXX&state=XXXXX
```

### Step 3: What If URL Has NO Parameters?

If the URL is just:
```
http://localhost:4200/login
```
or
```
https://my-bookie-buddy-353fe.firebaseapp.com
```

**WITHOUT** `?code=...&state=...` parameters, then:
- ❌ **Redirect URI mismatch** - Google is redirecting to wrong URL
- ❌ The redirect URI in OAuth client doesn't match what Firebase is sending
- ❌ Need to check OAuth client configuration again

### Step 4: What If URL Goes to Different Domain?

If the URL goes to something like:
- `https://accounts.google.com/...`
- `https://google.com/...`
- Any domain other than `localhost:4200` or `my-bookie-buddy-353fe.firebaseapp.com`

Then there's a redirect configuration issue.

## Quick Test

1. Open DevTools → **Network** tab → Enable **Preserve log**
2. Click "Sign in with Google"
3. Select account
4. **IMMEDIATELY check the address bar** - what URL do you see?
5. **Copy that exact URL** and share it

The URL should contain `?code=` or `?state=` parameters.

## If URL Has No Auth Params

This means:
1. Google accepted the OAuth request
2. You selected an account
3. But Google redirected to a URL that doesn't have the auth code
4. This = Redirect URI mismatch

**Fix:** Make sure OAuth client has EXACT redirect URIs:
- `http://localhost:4200/__/auth/handler`
- `http://localhost:4200`
- `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler`
- `https://my-bookie-buddy-353fe.firebaseapp.com`

**All must be exact matches - no typos, no trailing slashes!**

