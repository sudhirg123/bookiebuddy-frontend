# CRITICAL: Debug Steps for OAuth Flow

## What's Happening

You're landing on `localhost:4200/login` with **NO auth parameters**. This means either:
1. Google is redirecting to the wrong URL
2. Firebase processed auth on hosting domain but isn't syncing back
3. There's a redirect URI mismatch that Google is silently ignoring

## Critical Information Needed

**Please do this EXACT test:**

1. **Open Network Tab** → Enable "Preserve log" checkbox
2. **Clear Console**
3. Click "Sign in with Google"
4. **Watch the Network tab closely** while you select your account
5. After selecting account, look for:

### Step 1: Check OAuth Request
- Find the request to `accounts.google.com/o/oauth2/v2/auth` (or similar)
- Check the **Request URL** or **Query String Parameters**
- Find `redirect_uri` parameter
- **Copy the EXACT value**

### Step 2: Check Google's Response
- After selecting account, find the **redirect response** from Google
- Look for response status code (should be 302 or similar)
- Check **Response Headers** → `Location` header
- **What URL does it redirect to?** Copy it exactly

### Step 3: Check Final URL
- After the redirect completes, what URL is in the address bar?
- Is it `firebaseapp.com/__/auth/handler?code=...`?
- Or is it `localhost:4200/login` directly?
- Or something else?

## Expected Flow

1. `localhost:4200/login` → Click sign in
2. Redirects to: `https://accounts.google.com/o/oauth2/v2/auth?...&redirect_uri=https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler&...`
3. You select account
4. Google redirects to: `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler?code=XXXXX&state=YYYYY`
5. Firebase processes it there
6. Firebase redirects to: `http://localhost:4200/login` (or `/books`)
7. **Auth state should be available**

## What We Need

Please share:
1. The `redirect_uri` value from the OAuth request (Step 1)
2. The `Location` header from Google's redirect response (Step 2)
3. The EXACT URL in address bar when you first return (Step 3)
4. Screenshot of Network tab showing the redirect chain (if possible)

## Alternative: Check Browser History

After clicking sign in and selecting account:
1. Click browser back button once
2. What URL do you see?
3. This might show the intermediate Firebase hosting URL

