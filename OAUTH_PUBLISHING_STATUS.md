# OAuth Consent Screen Publishing Status

## For Development: Set to "Testing"

In **Google Cloud Console** → **APIs & Services** → **OAuth consent screen**:

### Publishing status: **Testing**

**Why "Testing"?**
- ✅ Allows up to 100 test users
- ✅ No app verification required
- ✅ Faster setup - can use immediately
- ✅ Perfect for development and testing
- ⚠️ Only test users can sign in (must add your email)

### Steps:
1. Set **Publishing status** to **Testing**
2. Go to **Test users** tab
3. Click **+ ADD USERS**
4. Add your Google email address (the one you'll use to test login)
5. Click **ADD**
6. Save changes

## For Production: "In production"

Only change to **In production** when:
- ✅ Your app is ready for public use
- ✅ You've completed app verification (if required)
- ✅ You want anyone with a Google account to sign in
- ⚠️ Requires app verification for sensitive scopes

## Quick Setup Checklist

For development:
- [ ] Publishing status: **Testing**
- [ ] User Type: **External** (or Internal if using Google Workspace)
- [ ] App name: Set to something (e.g., "BookieBuddy")
- [ ] Support email: Your email
- [ ] Developer contact: Your email
- [ ] Scopes: email, profile, openid (basic ones)
- [ ] Test users: Add your email address

## Important Notes

### Testing Mode Limitations:
- Only the emails you add as "Test users" can sign in
- If someone not on the test user list tries to login, they'll see an error
- This is intentional for testing - keeps your app private during development

### Adding Test Users:
1. In OAuth consent screen → **Test users** tab
2. Click **+ ADD USERS**
3. Enter email addresses (one per line or comma-separated)
4. Click **ADD**
5. Wait a few minutes for changes to propagate

### Switching to Production:
When ready:
1. Complete all OAuth consent screen steps
2. Verify your app (if required by Google)
3. Change Publishing status to **In production**
4. Anyone with Google account can then sign in

## Current Recommendation

**For your development setup, use:**
- Publishing status: **Testing**
- Add yourself (and any testers) in the **Test users** section
- This will allow you to test login immediately without verification

