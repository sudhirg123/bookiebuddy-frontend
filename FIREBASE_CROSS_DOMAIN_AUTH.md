# Firebase Auth Cross-Domain Issue

## The Problem

Firebase is sending the correct redirect URI (`https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler`), but:

1. Google redirects to `firebaseapp.com/__/auth/handler?code=...`
2. Firebase processes the auth on `firebaseapp.com`
3. Firebase then redirects back to `localhost:4200/login`
4. **But auth state doesn't persist** - `currentUser` is null on localhost

## Why This Happens

When Firebase processes redirects on its hosting domain (`firebaseapp.com`), the auth state is set there. When it redirects back to localhost, Firebase Auth needs to sync the auth state, but this might not work properly due to:

- IndexedDB/cookie restrictions across domains
- Timing issues (auth state hasn't synced yet)
- Firebase Auth persistence settings

## Solution: Check Firebase Auth Persistence

Firebase Auth uses different persistence modes. For redirect flows, we might need to ensure proper persistence is configured.

## Alternative: Use Popup on Localhost

Since redirect has cross-domain issues with localhost, we could:
1. Use popup for localhost development (if COOP allows)
2. Use redirect only for production (firebaseapp.com domain)

But popup has COOP issues, so we've already switched to redirect.

## Check: What Happens After Firebase Redirects Back?

When Firebase redirects from `firebaseapp.com` back to `localhost:4200/login`:
1. Check if `onAuthStateChanged` fires with a user
2. Check if IndexedDB has auth data (Application tab → Storage → IndexedDB)
3. Check if cookies are set (Application tab → Cookies)

If auth state isn't syncing, we might need to wait longer or check Firebase Auth persistence settings.

