"use client";

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { candidateConfig } from "@/config/candidate.config";

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "your-api-key",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || `${candidateConfig.firebaseConfig?.projectId || "your-project"}.firebaseapp.com`,
  projectId: candidateConfig.firebaseConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id",
  storageBucket: `${candidateConfig.firebaseConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "your-project-id"}.appspot.com`,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "your-sender-id",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "your-app-id",
};

// Initialize Firebase (only once)
let app: FirebaseApp | undefined;
if (typeof window !== "undefined") {
  if (getApps().length === 0) {
    try {
      app = initializeApp(firebaseConfig);
      console.log("✅ Firebase initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Firebase:", error);
    }
  } else {
    app = getApps()[0];
    console.log("✅ Using existing Firebase app");
  }
}

// VAPID key from config
const vapidKey = candidateConfig.firebaseConfig?.vapidKey || process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || "";

/**
 * Request push notification permission
 * Returns true if granted, false if denied, null if not supported
 */
export async function requestPushPermission(): Promise<boolean> {
  if (typeof window === "undefined") {
    return false;
  }

  // Check if browser supports notifications
  if (!("Notification" in window)) {
    console.warn("This browser does not support notifications");
    return false;
  }

  // Check if service worker is supported
  if (!("serviceWorker" in navigator)) {
    console.warn("This browser does not support service workers");
    return false;
  }

  // Check if already granted
  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    await subscribeToPushNotifications();
    return true;
  }

  // Check if already denied
  if (Notification.permission === "denied") {
    console.warn("Notification permission was previously denied");
    return false;
  }

  try {
    // Request permission
    const permission = await Notification.requestPermission();
    
    if (permission === "granted") {
      console.log("Notification permission granted");
      await subscribeToPushNotifications();
      return true;
    } else {
      console.log("Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
}

/**
 * Subscribe to push notifications using Firebase Cloud Messaging
 */
async function subscribeToPushNotifications(): Promise<void> {
  console.log("📱 Starting push notification subscription...");
  
  if (typeof window === "undefined") {
    console.error("❌ Window is undefined");
    return;
  }
  
  if (!app) {
    console.error("❌ Firebase app is not initialized");
    // Try to initialize again
    if (getApps().length > 0) {
      app = getApps()[0];
      console.log("✅ Retrieved existing Firebase app");
    } else {
      console.error("❌ No Firebase apps available");
      return;
    }
  }

  try {
    console.log("⏳ Waiting for service worker...");
    // Register service worker
    const registration = await navigator.serviceWorker.ready;
    console.log("✅ Service worker ready");
    
    // Get FCM token
    console.log("⏳ Getting FCM token...");
    const messaging = getMessaging(app);
    const token = await getToken(messaging, {
      vapidKey: vapidKey,
      serviceWorkerRegistration: registration,
    });

    if (token) {
      console.log("✅ FCM Token obtained:", token.substring(0, 30) + "...");
      
      // Save token to localStorage
      localStorage.setItem("fcmToken", token);
      
      // Send token to server (required - for server-side notifications)
      console.log("⏳ Saving FCM token to server...");
      try {
        const response = await fetch("/api/save-fcm-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log("✅ FCM token saved to Google Sheets successfully!", data);
        } else {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error || errorData.details || response.statusText;
          console.error("❌ Failed to save FCM token:", errorMessage);
          console.error("Full error response:", errorData);
        }
      } catch (error) {
        console.error("❌ Network error saving FCM token:", error);
      }

      // Listen for foreground messages
      onMessage(messaging, (payload) => {
        console.log("📨 Message received:", payload);
        
        // Show notification even when app is in foreground
        if (Notification.permission === "granted") {
          new Notification(payload.notification?.title || "New Update", {
            body: payload.notification?.body || "",
          });
        }
      });
    } else {
      console.warn("⚠️ No FCM token available - this usually means VAPID key is wrong or service worker issue");
    }
  } catch (error: any) {
    console.error("❌ Error subscribing to push notifications:", error);
    console.error("   Error message:", error.message);
    console.error("   Error code:", error.code);
  }
}

/**
 * Download the 2026 Court Calendar PDF
 */
export function downloadPDF(): void {
  if (typeof window === "undefined") {
    return;
  }

  const pdfUrl = "/calendar2026.pdf";
  
  // Try direct download first (works on desktop)
  try {
    const link = document.createElement("a");
    link.href = pdfUrl;
    link.download = "2026-Court-Calendar.pdf";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    
    // Clean up after a short delay
    setTimeout(() => {
      document.body.removeChild(link);
    }, 100);
  } catch (error) {
    console.error("Error downloading PDF:", error);
    // Fallback: open in new tab (works on mobile)
    window.open(pdfUrl, "_blank");
  }
}

/**
 * Check if push notifications are supported
 */
export function isPushNotificationSupported(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return "Notification" in window && "serviceWorker" in navigator;
}

/**
 * Get current notification permission status
 */
export function getNotificationPermission(): NotificationPermission | null {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return null;
  }
  return Notification.permission;
}
