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
  const [isRequestingPermission, setIsRequestingPermission] = useState(false);
  const [modalLanguage, setModalLanguage] = useState<Language>(language);

  const handleDownload = async () => {
    setIsRequestingPermission(true);
    try {
      // Request push permission first
      const permissionGranted = await requestPushPermission();
      
      // Start PDF download
      downloadPDF();
      
      // Track download event
      try {
        await fetch("/api/calendar-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "downloaded",
            permissionGranted 
          }),
        });
      } catch (error) {
        console.error("Error tracking download:", error);
      }
      
      // Close modal after a brief delay to show download started
      setTimeout(() => {
        onPermissionHandled();
      }, 500);
    } catch (error) {
      console.error("Error requesting permission:", error);
      // Still allow download even if permission fails
      downloadPDF();
      onPermissionHandled();
    } finally {
      setIsRequestingPermission(false);
    }
  };

  const handleClose = async () => {
    // Intercept close - request permission first
    setIsRequestingPermission(true);
    try {
      await requestPushPermission();
      
      // Track that user closed without downloading
      try {
        await fetch("/api/calendar-download", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            action: "closed_without_download",
            permissionGranted: true 
          }),
        });
      } catch (error) {
        console.error("Error tracking close:", error);
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
    } finally {
      setIsRequestingPermission(false);
      onPermissionHandled();
    }
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
          disabled={isRequestingPermission}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gold hover:text-yellow-400 text-3xl sm:text-4xl font-bold transition-colors w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center touch-manipulation disabled:opacity-50"
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
            disabled={isRequestingPermission}
            className={`w-full px-6 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg transition-all touch-manipulation ${
              isRequestingPermission
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gold text-black hover:bg-yellow-400 gold-glow-hover active:scale-95"
            }`}
          >
            {isRequestingPermission ? t.requestingPermission : t.downloadButton}
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
