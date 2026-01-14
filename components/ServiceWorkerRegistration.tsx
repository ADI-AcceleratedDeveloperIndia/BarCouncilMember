"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      // Register service worker
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js", {
          updateViaCache: "none", // Always check for updates
        })
        .then((registration) => {
          console.log("Service Worker registered:", registration);

          // Handle service worker updates silently - no notifications
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed") {
                  // New service worker is ready, activate it silently
                  if (navigator.serviceWorker.controller) {
                    // There's an old service worker, activate new one silently
                    newWorker.postMessage({ type: "SKIP_WAITING" });
                    // Don't reload - let it activate silently in background
                  } else {
                    // First time installation - no action needed
                    console.log("Service Worker installed for the first time");
                  }
                }
              });
            }
          });

          // Listen for controller change (when new service worker takes control)
          navigator.serviceWorker.addEventListener("controllerchange", () => {
            // Service worker updated silently - no notification needed
            console.log("Service Worker updated silently");
          });

          // Check for updates less frequently to reduce update notifications
          // Only check on page load, not periodically
          // setInterval(() => {
          //   registration.update();
          // }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}
