# OAuth Authorized JavaScript Origins Configuration

## What It's For

**Authorized JavaScript origins** tells Google which website origins are allowed to initiate OAuth requests from JavaScript. This is different from redirect URIs.

## Configuration for Localhost Development

In your OAuth 2.0 Client ID settings, under **Authorized JavaScript origins**, add:

```
http://localhost:4200
```

**Important:**
- No trailing slash (`/`)
- Use `http://` not `https://` for localhost
- Port number must match your dev server (4200 for Angular default)

## Complete OAuth Configuration

### Authorized JavaScript origins:
```
http://localhost:4200
```

### Authorized redirect URIs:
```
http://localhost:4200/__/auth/handler
http://localhost:4200
```

## For Production (Later)

When you deploy, you'll need to add your production domain:

### Authorized JavaScript origins:
```
http://localhost:4200
https://yourdomain.com
https://www.yourdomain.com
```

### Authorized redirect URIs:
```
http://localhost:4200/__/auth/handler
http://localhost:4200
https://yourdomain.com/__/auth/handler
https://yourdomain.com
https://www.yourdomain.com/__/auth/handler
https://www.yourdomain.com
```

## Quick Summary

- **Authorized JavaScript origins:** Where the OAuth request starts from
  - For localhost: `http://localhost:4200`
  
- **Authorized redirect URIs:** Where Google redirects back after auth
  - For Firebase: `http://localhost:4200/__/auth/handler`
  - Also add: `http://localhost:4200`

## Both Fields Are Required

You need **both** fields configured:
1. ✅ **Authorized JavaScript origins:** `http://localhost:4200`
2. ✅ **Authorized redirect URIs:** `http://localhost:4200/__/auth/handler` and `http://localhost:4200`

Without the JavaScript origins, you'll get errors when trying to initiate the OAuth flow.
Without the redirect URIs, you'll get the "Access blocked" error.

