# 🔍 Debug: Push Notifications Not Showing

## ✅ Admin Shows Success, But No Notification Received

If the admin dashboard shows "Successfully sent: 1" but you don't receive the notification, follow these steps:

---

## 🔍 Step 1: Check Browser Console

1. **Open your website** in the browser
2. **Open Developer Tools** (F12 or Right-click → Inspect)
3. **Go to Console tab**
4. **Send a test notification** from admin panel
5. **Look for these messages:**

### ✅ Good Signs (Should See):
```
Message received: {notification: {...}, data: {...}}
```

### ❌ Bad Signs (Errors):
- `Service Worker registration failed`
- `Firebase: Error (messaging/invalid-vapid-key)`
- `Failed to receive message`
- No console messages at all

---

## 🔍 Step 2: Check Service Worker Status

1. **Open Developer Tools** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Click "Service Workers"** in the left sidebar
4. **Check:**
   - [ ] Service worker is **registered** and **activated**
   - [ ] Status shows **"activated and is running"**
   - [ ] No errors in the service worker

### If Service Worker Has Errors:
- Check the **Console** for service worker errors
- Look for Firebase initialization errors
- Service worker might need to be updated

---

## 🔍 Step 3: Check Notification Permission

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Type this command:**
   ```javascript
   Notification.permission
   ```
4. **Should return:** `"granted"`

### If Not Granted:
- Go to browser settings
- Find site permissions
- Enable notifications
- Or reset and allow again

---

## 🔍 Step 4: Check FCM Token

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Type this command:**
   ```javascript
   localStorage.getItem('fcmToken')
   ```
4. **Should return:** A long token string

### If No Token:
- The token might not be saved
- Check browser console for token generation errors
- Try resetting permissions and allowing again

---

## 🔍 Step 5: Test Notification Manually

1. **Open Developer Tools** (F12)
2. **Go to Console tab**
3. **Type this command:**
   ```javascript
   new Notification("Test", { body: "This is a test notification", icon: "/A-logo.png" })
   ```
4. **Should show:** A notification popup

### If This Works:
- Browser notifications are working
- Issue is with FCM/Firebase setup

### If This Doesn't Work:
- Browser/OS is blocking notifications
- Check OS notification settings
- Check browser notification settings

---

## 🔍 Step 6: Check if App is in Foreground

**Important:** When the app is open (foreground), notifications are handled differently:

1. **If website is open and active:**
   - Notifications are handled by `onMessage` in `notificationManager.ts`
   - Should show browser notification popup
   - Check console for "Message received" log

2. **If website is closed or in background:**
   - Notifications are handled by service worker
   - Should show system notification
   - Check service worker logs

### Test Both Scenarios:
- **Test 1:** Keep website open → Send notification → Should see popup
- **Test 2:** Close website tab → Send notification → Should see system notification

---

## 🔧 Common Fixes

### Fix 1: Reset Notification Permission

1. **Chrome:**
   - Click lock icon in address bar
   - Click "Site settings"
   - Find "Notifications"
   - Change to "Ask" or "Allow"
   - Reload page

2. **Safari:**
   - Safari → Preferences → Websites → Notifications
   - Find your site
   - Change to "Allow"
   - Reload page

3. **Firefox:**
   - Click lock icon in address bar
   - Click "More Information"
   - Go to "Permissions" tab
   - Find "Notifications"
   - Change to "Ask" or "Allow"
   - Reload page

### Fix 2: Clear Service Worker

1. **Open Developer Tools** (F12)
2. **Go to Application tab** (Chrome) or **Storage tab** (Firefox)
3. **Click "Service Workers"**
4. **Click "Unregister"** next to your service worker
5. **Reload page** (service worker will re-register)

### Fix 3: Clear Browser Cache

1. **Open Developer Tools** (F12)
2. **Right-click the refresh button**
3. **Select "Empty Cache and Hard Reload"**
4. **Or:** Clear browser cache manually

### Fix 4: Check OS Notification Settings

**Windows:**
- Settings → System → Notifications
- Make sure browser notifications are enabled

**Mac:**
- System Preferences → Notifications
- Find your browser (Chrome/Safari)
- Make sure notifications are enabled

**Android:**
- Settings → Apps → Your Browser
- Notifications → Enable

**iOS:**
- Settings → Notifications → Your Browser
- Enable notifications

---

## 🧪 Step-by-Step Test

### Test 1: Check Console When Sending
1. Open website
2. Open Console (F12)
3. Send notification from admin
4. **Look for:** "Message received" in console
5. **Check:** Notification popup appears

### Test 2: Check Service Worker
1. Open website
2. Open Application tab (F12)
3. Go to Service Workers
4. Send notification from admin
5. **Check:** Service worker receives message
6. **Check:** System notification appears

### Test 3: Test with Tab Closed
1. Open website
2. **Close the tab** (but keep browser open)
3. Send notification from admin
4. **Check:** System notification appears
5. **Check:** Clicking notification opens website

---

## 🚨 If Still Not Working

### Check These:

1. **Firebase Config in Service Worker:**
   - Service worker might have placeholder Firebase config
   - Check `public/firebase-messaging-sw.js`
   - Should have real Firebase config values

2. **VAPID Key:**
   - Check if `NEXT_PUBLIC_FIREBASE_VAPID_KEY` is correct in Vercel
   - Should match Firebase Console → Cloud Messaging → Web Push certificates

3. **FCM Token:**
   - Check if token in Google Sheets matches token in browser
   - Token might be expired or invalid
   - Try generating a new token

4. **Browser Compatibility:**
   - Chrome/Edge: ✅ Full support
   - Firefox: ✅ Full support
   - Safari: ✅ iOS 16.4+, macOS
   - Opera: ✅ Full support

---

## 📝 Quick Checklist

- [ ] Browser console shows "Message received" when sending
- [ ] Service worker is registered and active
- [ ] `Notification.permission === "granted"`
- [ ] FCM token exists in `localStorage`
- [ ] OS notifications are enabled
- [ ] Browser notifications are enabled for the site
- [ ] Test notification works manually
- [ ] Firebase config is correct in service worker

---

## 💡 Pro Tip

**Try this first:**
1. Disable notifications for the site
2. Reload page
3. Re-enable notifications when prompted
4. Send test notification again

This resets the notification subscription and often fixes issues.
