# Redirect Authentication Troubleshooting

## Issue: Redirect Authentication Not Working

After clicking "Sign in with Google", you're redirected to Google, select an account, but then return to the login page instead of being authenticated.

## Possible Causes

### 1. Firebase Authorized Domains
Make sure `localhost` is added to Firebase authorized domains:
- Go to [Firebase Console](https://console.firebase.google.com/)
- Select your project
- Go to **Authentication** → **Settings** → **Authorized domains**
- Add `localhost` if not present

### 2. OAuth Redirect URI Configuration
The redirect URI must match exactly:
- In Google Cloud Console, check OAuth 2.0 Client IDs
- The redirect URI should be: `http://localhost:4200` (for development)
- Or: `https://your-firebase-auth-domain.firebaseapp.com/__/auth/handler`

### 3. URL Parameters Not Preserved
When Google redirects back, check the URL:
- Should have query parameters like `?code=...&state=...`
- If URL has no params, redirect URI might be wrong
- Check browser console for `hasCode`, `hasState` in logs

### 4. getRedirectResult Timing
`getRedirectResult` must be called:
- On page load (in constructor)
- Before any navigation
- Must complete before other auth checks

## Debugging Steps

1. **Check URL when returning from Google:**
   - Look at browser address bar
   - Should have `?code=...` or `?error=...` parameters
   - Copy the full URL and check logs

2. **Check Console Logs:**
   - Look for `[AuthService] URL contains auth params:`
   - Should show `hasCode: true` if redirect worked
   - If `hasCode: false`, redirect URI is wrong

3. **Check Network Tab:**
   - Look for requests to `identitytoolkit.googleapis.com`
   - Check response status codes
   - Look for error messages

4. **Verify Firebase Config:**
   - `authDomain` in environment.ts should match Firebase project
   - Usually: `your-project.firebaseapp.com`

## Quick Fix

If redirect still doesn't work, check:
1. Firebase Console → Authentication → Settings → Authorized domains → Add `localhost`
2. Google Cloud Console → APIs & Services → Credentials → OAuth 2.0 Client ID → Authorized redirect URIs
3. Make sure you're accessing via `http://localhost:4200` (not IP address)

