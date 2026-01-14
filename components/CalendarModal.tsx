"use client";

import { useState, useEffect } from "react";
import { Language } from "@/types";
import { requestPushPermission, downloadPDF } from "@/lib/notificationManager";

interface CalendarModalProps {
  language: Language;
  onClose: () => void;
  onPermissionHandled: () => void;
}

export default function CalendarModal({
  language,
  onClose,
  onPermissionHandled,
}: CalendarModalProps) {
  const [modalLanguage, setModalLanguage] = useState<Language>(language);

  const handleDownload = () => {
    // Download PDF immediately - don't wait for anything
    downloadPDF();
    
    // Track download immediately (don't wait for permission)
    // Use sendBeacon for more reliable tracking (works even if user navigates away)
    const trackingData = { 
      action: "downloaded",
      permissionGranted: false // Will be updated later if permission is granted
    };
    
    if (navigator.sendBeacon) {
      // Use sendBeacon with FormData for more reliable tracking
      const formData = new FormData();
      formData.append("data", JSON.stringify(trackingData));
      navigator.sendBeacon("/api/calendar-download", formData);
    } else {
      // Fallback to fetch with keepalive
      fetch("/api/calendar-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingData),
        keepalive: true, // Keep request alive even if page unloads
      }).catch((error) => {
        console.error("Error tracking download:", error);
      });
    }
    
    // Close modal immediately
    onPermissionHandled();
    
    // Request push permission in background (completely async)
    // Update tracking with permission status if granted
    setTimeout(() => {
      requestPushPermission()
        .then((permissionGranted) => {
          // Update tracking with permission status (optional - download already tracked)
          if (permissionGranted) {
            const updateData = { 
              action: "downloaded",
              permissionGranted: true
            };
            
            if (navigator.sendBeacon) {
              const formData = new FormData();
              formData.append("data", JSON.stringify(updateData));
              navigator.sendBeacon("/api/calendar-download", formData);
            } else {
              fetch("/api/calendar-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
                keepalive: true,
              }).catch((error) => {
                console.error("Error updating permission status:", error);
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error requesting permission:", error);
        });
    }, 100);
  };

  const handleClose = () => {
    // Track that user closed without downloading immediately
    // Use sendBeacon for more reliable tracking
    const trackingData = { 
      action: "closed_without_download",
      permissionGranted: false // Will be updated later if permission is granted
    };
    
    if (navigator.sendBeacon) {
      // Use sendBeacon with FormData for more reliable tracking
      const formData = new FormData();
      formData.append("data", JSON.stringify(trackingData));
      navigator.sendBeacon("/api/calendar-download", formData);
    } else {
      // Fallback to fetch with keepalive
      fetch("/api/calendar-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(trackingData),
        keepalive: true, // Keep request alive even if page unloads
      }).catch((error) => {
        console.error("Error tracking close:", error);
      });
    }
    
    // Close immediately
    onPermissionHandled();
    
    // Request push permission in background (completely async)
    // Update tracking with permission status if granted
    setTimeout(() => {
      requestPushPermission()
        .then((permissionGranted) => {
          // Update tracking with permission status (optional - close already tracked)
          if (permissionGranted) {
            const updateData = { 
              action: "closed_without_download",
              permissionGranted: true
            };
            
            if (navigator.sendBeacon) {
              const formData = new FormData();
              formData.append("data", JSON.stringify(updateData));
              navigator.sendBeacon("/api/calendar-download", formData);
            } else {
              fetch("/api/calendar-download", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updateData),
                keepalive: true,
              }).catch((error) => {
                console.error("Error updating permission status:", error);
              });
            }
          }
        })
        .catch((error) => {
          console.error("Error requesting permission:", error);
        });
    }, 100);
  };

  const content = {
    en: {
      title: "Free 2026 Court Calendar",
      description: "Download your free 2026 Court Calendar PDF. Stay updated with important court dates and holidays.",
      downloadButton: "Download PDF",
      closeButton: "Close",
      requestingPermission: "Setting up notifications...",
    },
    te: {
      title: "ఉచిత 2026 కోర్ట్ క్యాలెండర్",
      description: "మీ ఉచిత 2026 కోర్ట్ క్యాలెండర్ PDFని డౌన్‌లోడ్ చేయండి. ముఖ్యమైన కోర్ట్ తేదీలు మరియు సెలవులతో నవీకరించబడండి.",
      downloadButton: "PDF డౌన్‌లోడ్ చేయండి",
      closeButton: "మూసివేయి",
      requestingPermission: "నోటిఫికేషన్‌లను సెటప్ చేస్తున్నాము...",
    },
  };

  const t = content[modalLanguage];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-95 p-4">
      <div className="relative bg-black border-2 border-gold rounded-lg p-4 sm:p-6 max-w-md w-full shadow-2xl gold-glow">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gold hover:text-yellow-400 text-3xl sm:text-4xl font-bold transition-colors w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center touch-manipulation"
          aria-label={t.closeButton}
        >
          ×
        </button>

        {/* Language Toggle */}
        <div className="absolute top-2 left-2 sm:top-4 sm:left-4">
          <button
            onClick={() => setModalLanguage(modalLanguage === "en" ? "te" : "en")}
            className="bg-black border border-gold text-gold px-2 py-1 sm:px-3 sm:py-1.5 rounded text-xs sm:text-sm font-semibold hover:bg-gold hover:text-black transition-colors touch-manipulation"
          >
            {modalLanguage === "en" ? "EN | తె" : "EN | తె"}
          </button>
        </div>

        {/* Content */}
        <div className="text-center pt-8 sm:pt-10">
          {/* Calendar Icon/Title */}
          <div className="mb-4 sm:mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gold bg-gold/10 mb-4 gold-glow">
              <svg
                className="w-8 h-8 sm:w-10 sm:h-10 text-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gold gold-text-shimmer mb-2">
              {t.title}
            </h2>
          </div>

          {/* Description */}
          <p className="text-white text-sm sm:text-base mb-6 sm:mb-8 leading-relaxed px-2">
            {t.description}
          </p>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="w-full px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all touch-manipulation bg-gold text-black hover:bg-yellow-400 gold-glow-hover active:scale-95"
          >
            {t.downloadButton}
          </button>

          {/* Info Text */}
          <p className="text-gold/70 text-xs sm:text-sm mt-4 italic">
            {modalLanguage === "en"
              ? "You'll receive important election updates via push notifications"
              : "పుష్ నోటిఫికేషన్‌ల ద్వారా ముఖ్యమైన ఎన్నికల నవీకరణలను మీరు స్వీకరిస్తారు"}
          </p>
        </div>
      </div>
    </div>
  );
}
