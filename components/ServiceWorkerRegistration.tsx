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

          // Handle service worker updates silently
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New service worker is ready, activate it silently
                  newWorker.postMessage({ type: "SKIP_WAITING" });
                  // Reload page to use new service worker (optional - can be removed if you want silent updates)
                  // window.location.reload();
                }
              });
            }
          });

          // Check for updates periodically (every hour)
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  return null; // This component doesn't render anything
}
