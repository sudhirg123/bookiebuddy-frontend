# OAuth Consent Screen Configuration Fix

## Problem: "Invalid domain: must be a top private domain"

**You cannot add `localhost` to OAuth consent screen authorized domains!** This is expected behavior - that section is only for production domains.

## What to Do Instead:

### 1. Complete OAuth Consent Screen Setup

The OAuth consent screen needs to be fully configured, even though you can't add `localhost`:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `my-bookie-buddy-353fe`
3. Navigate to **APIs & Services** → **OAuth consent screen**

### 2. Check User Type

**If User Type is "External"** (most common for personal projects):

- ✅ **App name**: Fill in (e.g., "BookieBuddy")
- ✅ **User support email**: Your email
- ✅ **Developer contact**: Your email
- ✅ **Publishing status**: Should be "Testing" (for development)
- ⚠️ **Test users**: You MUST add your Google account email here!
  - Scroll to "Test users" section
  - Click "Add users"
  - Add your Gmail address
  - Save

**If User Type is "Internal"**:
- Only works with Google Workspace accounts
- Not suitable for personal Gmail accounts

### 3. Why localhost Works Without Being Added

- Firebase automatically handles `localhost` for development
- The OAuth consent screen authorized domains are for production only
- Your production domain (`my-bookie-buddy-353fe.firebaseapp.com`) is already there

### 4. The Real Fix

**Most likely issue**: You need to add yourself as a **Test User**!

1. In OAuth consent screen, scroll to **"Test users"** section
2. Click **"Add users"**
3. Enter your Gmail address (the one you're trying to sign in with)
4. Click **Add**
5. Save changes
6. Try logging in again

This is usually the missing piece when OAuth consent screen is configured but login still fails.

