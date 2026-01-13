# Firebase Push Notification Setup Guide

## Quick Start (Automated)

### Prerequisites
1. Google Account (same one you use for Google Sheets/Cloud)
2. Node.js installed

### One-Time Setup (First Time Only)

1. **Authenticate with Firebase** (one-time):
   ```bash
   npx firebase-tools login
   ```
   This opens a browser - log in with your Google account.

2. **For Each New Client**, run:
   ```bash
   node scripts/setup-firebase.js <client-name>
   ```
   
   Example:
   ```bash
   node scripts/setup-firebase.js client1
   ```

### What the Script Does Automatically

✅ Creates Firebase project  
✅ Generates VAPID keys (public + private)  
✅ Saves keys to `firebase-keys/` folder  
✅ Updates `config/candidate.config.ts` with project ID and public key  
✅ Creates `.env.example` file  

### Manual Steps (After Running Script)

1. **Add VAPID Public Key to Firebase Console:**
   - Go to: `https://console.firebase.google.com/project/YOUR_PROJECT_ID/settings/cloudmessaging`
   - Scroll to "Web configuration"
   - Click "Generate key pair" or paste your public key
   - The script will show you the public key in the output

2. **Add Private Key to Environment Variables:**
   - Create `.env.local` file (if not exists)
   - Add:
     ```
     FIREBASE_VAPID_PRIVATE_KEY=your_private_key_here
     FIREBASE_PROJECT_ID=your_project_id_here
     ```
   - The script saves keys to `firebase-keys/` folder - copy from there

3. **Add to Vercel Environment Variables:**
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add:
     - `FIREBASE_VAPID_PRIVATE_KEY` = (private key from script output)
     - `FIREBASE_PROJECT_ID` = (project ID from script output)

## Manual Setup (If Script Doesn't Work)

### Step 1: Create Firebase Project

1. Go to: https://console.firebase.google.com
2. Click "Add project"
3. Enter project name: `Bar Council - Client Name`
4. Disable Google Analytics (optional)
5. Click "Create project"

### Step 2: Enable Cloud Messaging

1. In Firebase Console, go to: Project Settings → Cloud Messaging
2. Scroll to "Web configuration"
3. Click "Generate key pair" to create VAPID keys
4. Copy the **Public Key** (you'll need this)

### Step 3: Get Project ID

1. In Firebase Console, go to: Project Settings → General
2. Copy the **Project ID**

### Step 4: Update Config

Add to `config/candidate.config.ts`:
```typescript
firebaseConfig: {
  projectId: "your-project-id",
  vapidKey: "your-public-vapid-key",
},
```

### Step 5: Environment Variables

Create `.env.local`:
```
FIREBASE_VAPID_PRIVATE_KEY=your-private-vapid-key
FIREBASE_PROJECT_ID=your-project-id
```

## Multiple Clients Setup

### One Firebase Account → Multiple Projects

You can create **unlimited projects** in one Firebase account:

```
Your Firebase Account
├── Bar Council - Client 1 (Project ID: barcouncil-client1)
├── Bar Council - Client 2 (Project ID: barcouncil-client2)
├── Bar Council - Client 3 (Project ID: barcouncil-client3)
└── ... (unlimited)
```

Each client gets:
- ✅ Separate Firebase project
- ✅ Separate VAPID keys
- ✅ Complete isolation
- ✅ Free tier applies per project (FCM is free anyway)

### Running Setup for Multiple Clients

```bash
# Client 1
node scripts/setup-firebase.js client1

# Client 2
node scripts/setup-firebase.js client2

# Client 3
node scripts/setup-firebase.js client3
```

Each will create a separate project and save keys separately.

## Pricing

**Firebase Cloud Messaging (FCM) is 100% FREE:**
- ✅ Unlimited users
- ✅ Unlimited notifications
- ✅ No per-user charges
- ✅ No per-notification charges
- ✅ Works for 35,000+ users at $0 cost

## Troubleshooting

### "Firebase CLI not authenticated"
```bash
npx firebase-tools login
```

### "Project already exists"
The script will use the existing project. If you want a new one, use a different client name.

### "Permission denied"
Make sure you're logged in with the correct Google account that has Firebase access.

### Keys Not Working
1. Verify VAPID public key is added in Firebase Console
2. Verify private key is in `.env.local` and Vercel
3. Make sure project ID matches in config and environment variables
4. Deploy to Vercel (push notifications only work on HTTPS)

## Security Notes

⚠️ **Keep Private Keys Secure:**
- Never commit `.env.local` to Git
- Never commit `firebase-keys/` folder to Git
- Add to `.gitignore`:
  ```
  .env.local
  firebase-keys/
  ```

## Testing

Push notifications only work on **HTTPS** (production):
- ✅ Works on: `https://yourdomain.com`
- ❌ Doesn't work on: `http://localhost:3000`

For testing:
1. Deploy to Vercel
2. Test on the live HTTPS URL
3. Or use Vercel preview URLs (they use HTTPS)

## Support

If the automated script fails:
1. Check the error message
2. Try manual setup (see "Manual Setup" section above)
3. Verify Firebase CLI is authenticated: `npx firebase-tools login:list`
