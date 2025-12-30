"use client";

import { useState, useEffect } from "react";
import { candidateConfig } from "@/config/candidate.config";
import { SupportType } from "@/types";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Vision from "@/components/Vision";
import SupportButton from "@/components/SupportButton";
import SupportModal from "@/components/SupportModal";
import PreferentialVoteModal from "@/components/PreferentialVoteModal";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showPreferentialModal, setShowPreferentialModal] = useState(false);

  // Check if modal should be shown on mount
  useEffect(() => {
    // Dev helper: Expose function to clear localStorage for testing
    if (typeof window !== "undefined") {
      (window as any).clearPreferentialVoteStorage = () => {
        localStorage.removeItem("preferentialVoteSubmitted");
        console.log("✅ Preferential vote storage cleared! Refresh the page to see the modal again.");
      };
      console.log("💡 Dev Helper: Run clearPreferentialVoteStorage() in console to reset and test the modal again");
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const voteParam = urlParams.get("vote");
    const clearParam = urlParams.get("clear");
    
    // If ?clear=true, clear localStorage and reload
    if (clearParam === "true") {
      localStorage.removeItem("preferentialVoteSubmitted");
      console.log("✅ Cleared preferential vote storage via URL parameter");
      // Remove the clear parameter and reload
      urlParams.delete("clear");
      const newUrl = window.location.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");
      window.history.replaceState({}, "", newUrl);
      // Reload to show modal
      window.location.reload();
      return;
    }
    
    // Check if user has already seen/submitted the modal
    const hasSeenModal = localStorage.getItem("preferentialVoteSubmitted");
    
    console.log("🔍 Modal Check:", {
      hasSeenModal,
      voteParam,
      shouldShow: voteParam === "true" || (!hasSeenModal && voteParam !== "false")
    });
    
    // Show modal if:
    // 1. URL has ?vote=true parameter (for WhatsApp links - always show, even if voted before), OR
    // 2. User hasn't seen it before (first visit) and no explicit ?vote=false
    if (voteParam === "true" || (!hasSeenModal && voteParam !== "false")) {
      console.log("✅ Showing preferential vote modal");
      setShowPreferentialModal(true);
      
      // Track that modal was opened
      fetch("/api/preferential-vote-track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "opened" }),
      }).catch((error) => {
        console.error("Error tracking modal open:", error);
      });
    } else {
      console.log("❌ Not showing modal - user has already seen/voted");
    }
  }, []);

  const handleSupportSubmit = async (
    supportType: SupportType,
    formData?: {
      name: string;
      enrollmentNumber: string;
      district: string;
      barAssociation: string;
      mobileNumber: string;
      customMessage?: string;
    }
  ) => {
    try {
      const payload: any = {
        supportType,
        detailsProvided: formData ? "Yes" : "No",
        language,
        imageGenerated: "Yes",
        imageDownloaded: "No",
      };

      if (formData) {
        payload.name = formData.name;
        payload.enrollmentNumber = formData.enrollmentNumber;
        payload.district = formData.district;
        payload.barAssociation = formData.barAssociation;
        payload.mobileNumber = formData.mobileNumber;
        payload.customMessage = formData.customMessage;
      }

      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch (error) {
      console.error("Error submitting support:", error);
    }
  };

  const handlePreferentialVoteSubmit = async (preferentialOrder: number) => {
    try {
      const response = await fetch("/api/preferential-vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferentialOrder }),
      });

      if (response.ok) {
        // Mark as voted in localStorage
        localStorage.setItem("preferentialVoteSubmitted", "voted");
        // Close modal
        setShowPreferentialModal(false);
      } else {
        throw new Error("Failed to submit vote");
      }
    } catch (error) {
      console.error("Error submitting preferential vote:", error);
      throw error;
    }
  };

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      {/* Fixed Language Toggle - Top Right */}
      <div className="fixed top-20 right-4 z-50">
        <LanguageToggle />
      </div>

      <Hero
        language={language}
        layoutVariant={candidateConfig.layoutVariant}
      />

      <About
        language={language}
        layoutVariant={candidateConfig.layoutVariant}
      />

      <Experience
        language={language}
        layoutVariant={candidateConfig.layoutVariant}
      />

      <Vision
        language={language}
        layoutVariant={candidateConfig.layoutVariant}
      />

      <div className="pb-32">
        <SupportButton
          language={language}
          onClick={() => setShowSupportModal(true)}
        />
      </div>

      <Footer />

      {showSupportModal && (
        <SupportModal
          language={language}
          onClose={() => setShowSupportModal(false)}
          onSupportSubmit={handleSupportSubmit}
        />
      )}

      {showPreferentialModal && (
        <PreferentialVoteModal
          language={language}
          onClose={() => {
            setShowPreferentialModal(false);
            // Track that modal was closed without voting
            // Only track if user hasn't voted (localStorage check)
            const hasVoted = localStorage.getItem("preferentialVoteSubmitted") === "voted";
            if (!hasVoted) {
              fetch("/api/preferential-vote-track", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "closed_without_vote" }),
              }).catch((error) => {
                console.error("Error tracking modal close:", error);
              });
            }
          }}
          onVoteSubmit={handlePreferentialVoteSubmit}
        />
      )}
    </main>
  );
}
