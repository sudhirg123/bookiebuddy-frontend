# Fix: Firebase auth/network-request-failed Error

## What This Error Means

`auth/network-request-failed` indicates that your app cannot connect to Firebase Authentication servers. This is usually a network, firewall, or configuration issue.

## Quick Fixes (Try These First)

### 1. Check Your Internet Connection
- Ensure you have an active internet connection
- Try accessing other websites to verify connectivity
- Check if Firebase is accessible: Visit [Firebase Console](https://console.firebase.google.com/)

### 2. Check Browser Console for More Details
- Open Developer Tools (F12)
- Go to **Console** tab
- Go to **Network** tab
- Try logging in again
- Look for failed network requests (they'll be in red)
- Check if requests to `*.googleapis.com` or `*.firebaseapp.com` are being blocked

### 3. Check Browser Extensions
- **Ad blockers** or privacy extensions can block Firebase requests
- Try disabling extensions (especially uBlock Origin, Privacy Badger, etc.)
- Try logging in in **Incognito/Private mode** (extensions usually disabled)

### 4. Check Firewall/Antivirus
- Firewall or antivirus software might be blocking Firebase connections
- Temporarily disable to test
- Add exceptions for:
  - `*.googleapis.com`
  - `*.firebaseapp.com`
  - `*.firebaseio.com`

### 5. Check CORS Settings
- Ensure you're accessing via `http://localhost:4200` (not `127.0.0.1:4200`)
- Try accessing via `http://localhost:4200` instead of IP address
- Clear browser cache and cookies

### 6. Verify Firebase Configuration
- Double-check your `environment.ts` file has correct Firebase config
- Ensure `apiKey`, `authDomain`, `projectId` are all correct
- Verify the Firebase project is active in Firebase Console

### 7. Try Different Browser
- Test in Chrome, Firefox, or Safari
- Some browsers have stricter security policies

### 8. Check if Firebase Services Are Down
- Visit [Firebase Status](https://status.firebase.google.com/)
- Check if there are any ongoing incidents

## Advanced Troubleshooting

### Check Network Requests
1. Open Developer Tools → **Network** tab
2. Filter by "XHR" or "Fetch"
3. Try logging in
4. Look for requests to:
   - `https://identitytoolkit.googleapis.com/...`
   - `https://securetoken.googleapis.com/...`
5. Check if they're failing with:
   - CORS errors
   - Timeout errors
   - Connection refused

### Common Causes:

**CORS Errors:**
- Request is being blocked by browser security
- Check browser console for CORS messages
- Solution: Ensure you're using `localhost` (not IP address)

**Timeout Errors:**
- Slow internet connection
- Solution: Check your internet speed, try again

**Connection Refused:**
- Firewall blocking
- Solution: Check firewall settings

### Test Firebase Connection Directly

Open browser console and run:
```javascript
fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithIdp?key=YOUR_API_KEY', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({})
}).then(r => console.log('Connected:', r.status))
  .catch(e => console.error('Failed:', e));
```

Replace `YOUR_API_KEY` with your actual Firebase API key.

## Most Likely Solutions

1. **Disable browser extensions** (especially ad blockers)
2. **Try incognito mode**
3. **Check firewall/antivirus** isn't blocking Firebase
4. **Verify internet connection** is stable
5. **Clear browser cache** and try again

## If Nothing Works

1. Check if the error happens immediately or after selecting Google account
   - Immediate: Network/CORS issue
   - After Google: OAuth redirect issue

2. Share the full error from browser console (Network tab shows more details)

3. Try deploying to a real domain (sometimes localhost has restrictions)

