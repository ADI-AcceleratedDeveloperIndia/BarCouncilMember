// Service Worker for Firebase Cloud Messaging (FCM)
// This file must be in the /public folder

// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

// Firebase configuration will be set dynamically
// For now, use placeholder values - these will be replaced when Firebase is configured
const firebaseConfig = {
  apiKey: "AIzaSyDummyKeyForServiceWorker",
  authDomain: "placeholder.firebaseapp.com",
  projectId: "placeholder-project",
  storageBucket: "placeholder-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Retrieve Firebase Messaging object
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Received background message ", payload);

  const notificationTitle = payload.notification?.title || "New Update";
  const notificationOptions = {
    body: payload.notification?.body || "",
    icon: payload.notification?.icon || "/A-logo.png",
    badge: "/A-logo.png",
    tag: "election-update",
    requireInteraction: false,
    data: payload.data || {},
  };

  return self.registration.showNotification(notificationTitle, notificationOptions);
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
