// Service Worker for Firebase Cloud Messaging (FCM)
// This file must be in the /public folder

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Firebase configuration - will be fetched from API
let firebaseConfig = null;
let firebaseInitialized = false;

// Flag to track if service worker is ready to show notifications
let isServiceWorkerReady = false;

// Fetch Firebase config from API and initialize
async function initializeFirebase() {
  if (firebaseInitialized) return;

  try {
    // Fetch config from API endpoint
    const response = await fetch("/api/firebase-config");
    const config = await response.json();

    if (config && config.apiKey && config.projectId) {
      firebaseConfig = config;
      
      // Initialize Firebase with real config
      firebase.initializeApp(firebaseConfig);
      firebaseInitialized = true;
      
      console.log("[firebase-messaging-sw.js] Firebase initialized with config:", {
        projectId: config.projectId,
        apiKey: config.apiKey ? config.apiKey.substring(0, 10) + "..." : "missing",
      });
    } else {
      console.error("[firebase-messaging-sw.js] Invalid Firebase config received");
      // Fallback to placeholder (won't work but prevents errors)
      firebaseConfig = {
        apiKey: "AIzaSyDummyKeyForServiceWorker",
        authDomain: "bar-council-8a238.firebaseapp.com",
        projectId: "bar-council-8a238",
        storageBucket: "bar-council-8a238.appspot.com",
        messagingSenderId: "245504696872",
        appId: "1:245504696872:web:9cb7fc104cdd6d6afdcb1d",
      };
      firebase.initializeApp(firebaseConfig);
      firebaseInitialized = true;
    }
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Error fetching Firebase config:", error);
    // Fallback to placeholder
    firebaseConfig = {
      apiKey: "AIzaSyDummyKeyForServiceWorker",
      authDomain: "bar-council-8a238.firebaseapp.com",
      projectId: "bar-council-8a238",
      storageBucket: "bar-council-8a238.appspot.com",
      messagingSenderId: "245504696872",
      appId: "1:245504696872:web:9cb7fc104cdd6d6afdcb1d",
    };
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
  }
}

// Initialize Firebase immediately
initializeFirebase();

// Retrieve Firebase Messaging object (after initialization)
let messaging = null;

// Initialize messaging after Firebase is ready
async function setupMessaging() {
  await initializeFirebase();
  
  if (firebaseInitialized && firebase.messaging) {
    messaging = firebase.messaging();
    
    // Handle background messages - show all push notifications
    messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Received background message ", payload);

      const notificationTitle = payload.notification?.title || payload.data?.title || "New Update";
      const notificationBody = payload.notification?.body || payload.data?.body || "";
      
      // Show all notifications - no filtering
      console.log("[firebase-messaging-sw.js] Showing notification:", notificationTitle);
      
      const notificationOptions = {
        body: notificationBody,
        // No icon or badge - clean notification
        tag: "election-update-" + Date.now(), // Unique tag to allow multiple notifications
        requireInteraction: false,
        data: payload.data || {},
        vibrate: [200, 100, 200],
        timestamp: Date.now(),
      };

      return self.registration.showNotification(notificationTitle, notificationOptions);
    });
    
    console.log("[firebase-messaging-sw.js] Messaging setup complete");
  }
}

// (Moved to bottom to prevent duplicate activation handler)

// Handle service worker updates silently (prevent "website updated" notification)
self.addEventListener("install", (event) => {
  // Skip waiting - activate new service worker immediately without showing notification
  event.waitUntil(self.skipWaiting());
});

// Listen for skip waiting message from main thread
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Setup messaging when service worker activates
self.addEventListener("activate", (event) => {
  console.log("[firebase-messaging-sw.js] Service worker activating...");
  // Take control of all pages immediately (skip waiting)
  event.waitUntil(
    Promise.all([
      self.clients.claim(), // Take control immediately
      setupMessaging().then(() => {
        isServiceWorkerReady = true;
        console.log("[firebase-messaging-sw.js] Service worker ready!");
      }),
    ])
  );
});

// Setup messaging immediately if already activated
setupMessaging().then(() => {
  isServiceWorkerReady = true;
  console.log("[firebase-messaging-sw.js] Messaging setup on load");
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  // Open the app when notification is clicked
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // If app is already open, focus it
      for (const client of clientList) {
        if (client.url === "/" && "focus" in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new window
      if (clients.openWindow) {
        return clients.openWindow("/");
      }
    })
  );
});
