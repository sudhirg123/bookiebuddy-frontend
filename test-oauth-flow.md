# Testing OAuth Flow

## Critical Question

**When you click "Sign in with Google" and select your account, what EXACT URL appears in your browser's address bar?**

Please check:
1. After clicking "Sign in with Google" → what URL do you see?
2. After selecting your Google account → what URL appears?
3. Copy the EXACT URL from the address bar (include all parameters)

## Expected Flow

1. You click "Sign in with Google" on `localhost:4200/login`
2. Browser redirects to Google: `https://accounts.google.com/o/oauth2/auth?...&redirect_uri=https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler&...`
3. You select account
4. **Google should redirect to**: `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler?code=...&state=...`
5. **Firebase should then redirect to**: `http://localhost:4200/login` (or `/books`)

## What to Check

If you see `localhost:4200/login` with NO parameters, it means:
- Google might not be redirecting correctly
- Or Firebase isn't processing the redirect properly
- Or there's a redirect URI mismatch

## Debug Steps

1. Open Network tab → Enable "Preserve log"
2. Clear console
3. Click "Sign in with Google"
4. Watch the Network tab:
   - Find request to `accounts.google.com/o/oauth2/v2/auth`
   - Check the `redirect_uri` parameter
   - After selecting account, find the redirect response
   - Check what URL Google redirects to

## Checking OAuth Client Configuration

In Google Cloud Console:
1. Go to APIs & Services → Credentials
2. Find your OAuth 2.0 Client ID (the one Firebase uses)
3. Check "Authorized redirect URIs":
   - Must include: `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler`
   - Must NOT include: `http://localhost:4200/login` (this would be wrong)
   - Can include: `http://localhost:4200/__/auth/handler` (for local development)

