# Fix Popup Authentication for Tomorrow

## Problem
Popup works in standalone HTML test but fails in Angular. User sees account selection screen twice.

## Root Cause
Angular dev server (Vite) likely adds COOP (Cross-Origin-Opener-Policy) headers that block popup communication.

## Solution to Try Tomorrow

1. **Configure Vite to remove COOP headers** - Add to `angular.json` serve configuration:
   ```json
   "serve": {
     "options": {
       "headers": {
         "Cross-Origin-Opener-Policy": "unsafe-none"
       }
     }
   }
   ```

2. **Or use `ng serve --host 0.0.0.0`** with custom headers disabled

3. **Or deploy to Firebase Hosting** and test there (same origin, popup will work)

## Current Status
- Standalone HTML popup: ✅ Works
- Angular popup: ❌ Fails (COOP blocking)
- Redirect: ❌ Cross-origin IndexedDB sync issue

## Next Steps
1. Configure Angular dev server headers
2. OR use Firebase Hosting for testing
3. OR use Firebase Emulator Suite

