# Fix: "Invalid domain: must be a top private domain"

## Quick Solution

**Good news:** `localhost` is usually **already included** in Firebase authorized domains by default!

### Check if localhost is already there:

1. Go to Firebase Console → Authentication → Settings → Authorized domains
2. **Look at the existing list** - you should see:
   - `localhost` (should be there already)
   - `{your-project-id}.firebaseapp.com`
   - `{your-project-id}.web.app`

### If localhost is NOT in the list:

The error "Invalid domain: must be a top private domain" means Firebase won't let you add plain `localhost`. Try these:

#### Option 1: Add with port number
- Add: `localhost:4200` (if your app runs on port 4200)
- Or: `localhost:3000` (if using port 3000)

#### Option 2: Use IP address
- Add: `127.0.0.1`
- Or: `127.0.0.1:4200`

#### Option 3: Use ngrok or similar (for testing)
- Install ngrok: `npm install -g ngrok`
- Run: `ngrok http 4200`
- Use the ngrok URL (e.g., `abc123.ngrok.io`) as authorized domain

### Most Common Fix:

**Just check that `localhost` is already in the list** - Firebase adds it automatically for development. If it's there, you don't need to add it again!

If it's missing and you can't add it, the real issue might be:
1. OAuth consent screen not configured
2. Google sign-in not enabled
3. Browser cache issues

Try these instead.

