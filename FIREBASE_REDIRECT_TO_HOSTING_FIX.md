# Fix: Firebase Using Hosting Domain Instead of Localhost

## The Problem

Your curl request shows:
```
"continueUri":"https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler"
```

Firebase Auth is using your **Firebase hosting domain** (`firebaseapp.com`) instead of `localhost` for redirects.

## Why This Happens

Firebase Auth uses the `authDomain` from your config (`my-bookie-buddy-353fe.firebaseapp.com`) to construct redirect URLs. For development, you need localhost redirects.

## Solution Options

### Option 1: Configure OAuth Client for Firebase Hosting Domain (Quick Fix)

Add the Firebase hosting domain redirect URIs to your OAuth client:

1. **Google Cloud Console** → **APIs & Services** → **Credentials**
2. Edit your **OAuth 2.0 Client ID**
3. **Authorized redirect URIs** - Add:
   ```
   https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler
   https://my-bookie-buddy-353fe.firebaseapp.com
   ```
4. **Authorized JavaScript origins** - Add:
   ```
   https://my-bookie-buddy-353fe.firebaseapp.com
   ```
5. Save and wait 5-10 minutes

**This should work immediately** - when Google redirects to the Firebase hosting domain, Firebase will handle it and redirect back to your localhost app.

### Option 2: Configure Firebase to Use Localhost (Better for Dev)

We can configure Firebase Auth to explicitly use localhost for redirects in development.

## Testing

After adding Firebase hosting domain URIs:

1. Click "Sign in with Google"
2. Google should redirect to `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler`
3. Firebase processes the auth
4. Firebase then redirects back to your localhost app
5. You should be authenticated

## Important

The Firebase hosting domain (`firebaseapp.com`) is a special Firebase endpoint that:
- Processes OAuth callbacks
- Handles the auth code exchange
- Then redirects to your app

So even though you're developing on localhost, Firebase uses its hosting domain as an intermediary.

## Verify Configuration

Make sure your OAuth client has **both**:
- Localhost URIs (for direct localhost redirects, if any)
- Firebase hosting domain URIs (for Firebase's handler)

```
Authorized redirect URIs:
  http://localhost:4200/__/auth/handler
  http://localhost:4200
  https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler
  https://my-bookie-buddy-353fe.firebaseapp.com

Authorized JavaScript origins:
  http://localhost:4200
  https://my-bookie-buddy-353fe.firebaseapp.com
```

