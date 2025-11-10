# Fix: "Your app is not configured to use secure OAuth flows"

## What This Warning Means

This warning appears when your OAuth consent screen is missing required security configurations. It's usually safe to ignore for development, but should be fixed before production.

## How to Fix

### Step 1: Complete OAuth Consent Screen Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project: `my-bookie-buddy-353fe`
3. Navigate to **APIs & Services** → **OAuth consent screen**

### Step 2: Fill in ALL Required Fields

**Required Information:**
- ✅ **App name**: Your app name (e.g., "BookieBuddy")
- ✅ **User support email**: Your email address
- ✅ **Developer contact information**: Your email address
- ✅ **App domain** (optional but recommended):
  - Application home page: `https://my-bookie-buddy-353fe.firebaseapp.com`
  - Application privacy policy link: (can use Firebase hosting URL later)
  - Application terms of service link: (can use Firebase hosting URL later)

### Step 3: Configure Authorized Redirect URIs

1. In OAuth consent screen, find **"Authorized redirect URIs"** section
2. Ensure these are added:
   - `https://my-bookie-buddy-353fe.firebaseapp.com/__/auth/handler`
   - `http://localhost:4200/__/auth/handler` (for local development)

**Note:** Firebase usually configures these automatically, but check to make sure they're there.

### Step 4: Complete Publishing Checklist (For Production)

If you're preparing for production:

1. **Add Logo** (optional but recommended)
2. **Privacy Policy URL**: Required for production
3. **Terms of Service URL**: Required for production
4. **Application home page**: Your app's URL

### Step 5: Save and Wait

1. Click **Save** or **Update** at the bottom
2. Wait 2-3 minutes for changes to propagate
3. The warning should disappear

## Quick Fix for Development

**If you just want to proceed with development:**

1. Make sure User Type is "External"
2. Add yourself as a Test User
3. Fill in at minimum:
   - App name
   - User support email
   - Developer contact email
4. Save

The warning won't prevent you from testing, but it should be addressed before going to production.

## Alternative: Use Firebase Hosting URLs

For quick setup, you can use placeholder URLs:
- Privacy Policy: `https://my-bookie-buddy-353fe.firebaseapp.com/privacy`
- Terms: `https://my-bookie-buddy-353fe.firebaseapp.com/terms`

You can create these pages later when ready for production.

