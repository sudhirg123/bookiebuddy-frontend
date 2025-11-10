# Network Tab Debugging Guide

## Critical: Check Network Tab

The logs show you're landing on `localhost:4200/login` with no auth params. This means either:
1. Google is redirecting to the wrong URL
2. The redirect is happening but not visible

## Steps to Debug:

1. **Open Network Tab** → Check "Preserve log" checkbox
2. **Clear Network tab** (trash icon)
3. **Clear Console**
4. **Click "Sign in with Google"**
5. **Watch Network tab** while selecting account

## What to Look For:

### Step 1: OAuth Request
Find the request to Google (usually `accounts.google.com/o/oauth2/v2/auth`):
- Check the **Request URL** or **Query String Parameters**
- Find `redirect_uri` parameter
- **What value does it have?** Copy it exactly

### Step 2: Google's Redirect Response
After selecting account, find the **redirect response** from Google:
- Look for status code **302** or **307** (redirects)
- Check **Response Headers** → Find `Location` header
- **What URL is in the Location header?** Copy it exactly
- This tells us where Google is redirecting to

### Step 3: Final Destination
After all redirects complete:
- What URL appears in the address bar?
- Is it `firebaseapp.com/__/auth/handler?code=...`?
- Or is it `localhost:4200/login` directly?

## Expected Flow:

1. `localhost:4200/login` → Click sign in
2. Browser navigates to: `https://accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler&...`
3. You select account
4. Google sends **302 redirect** to: `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler?code=XXXXX&state=YYYYY`
5. Browser loads `firebaseapp.com/__/auth/handler`
6. Firebase processes auth there
7. Firebase sends **302 redirect** to: `http://localhost:4200/login`
8. **BUT auth state should be available via `onAuthStateChanged`**

## What We Need:

Please share:
1. The `redirect_uri` value from the OAuth request (Step 1)
2. The `Location` header from Google's redirect response (Step 2)
3. Screenshot of Network tab showing the redirect chain
4. The exact URL in address bar when you first return

## Important:

If Google redirects directly to `localhost:4200/login` (skipping Firebase), that means:
- Redirect URI in OAuth request is wrong
- OR OAuth client doesn't have the correct redirect URI configured

