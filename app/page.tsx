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
import CalendarModal from "@/components/CalendarModal";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState(false);
  const [showPreferentialModal, setShowPreferentialModal] = useState(false);
  const [showSiteContent, setShowSiteContent] = useState(false);

  // Modal flow: Calendar Modal → Preferential Vote Modal → Site Content
  useEffect(() => {
    // Dev helper: Expose function to clear localStorage for testing
    if (typeof window !== "undefined") {
      (window as any).clearAllStorage = () => {
        localStorage.removeItem("preferentialVoteSubmitted");
        localStorage.removeItem("calendarModalHandled");
        console.log("✅ All storage cleared! Refresh the page to see modals again.");
      };
      console.log("💡 Dev Helper: Run clearAllStorage() in console to reset and test modals again");
    }
    
    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const voteParam = urlParams.get("vote");
    const clearParam = urlParams.get("clear");
    
    // If ?clear=true, clear localStorage and reload
    if (clearParam === "true") {
      localStorage.removeItem("preferentialVoteSubmitted");
      localStorage.removeItem("calendarModalHandled");
      console.log("✅ Cleared all storage via URL parameter");
      urlParams.delete("clear");
      const newUrl = window.location.pathname + (urlParams.toString() ? "?" + urlParams.toString() : "");
      window.history.replaceState({}, "", newUrl);
      window.location.reload();
      return;
    }
    
    // Check if user has already handled calendar modal
    const calendarHandled = localStorage.getItem("calendarModalHandled");
    const hasVoted = localStorage.getItem("preferentialVoteSubmitted") === "voted";
    
    // Stage 1: Show Calendar Modal first (if not handled)
    if (!calendarHandled) {
      console.log("✅ Showing calendar modal");
      setShowCalendarModal(true);
      setShowSiteContent(false);
      return;
    }
    
    // Stage 2: After calendar modal, show Preferential Vote Modal (if not voted)
    if (calendarHandled && !hasVoted) {
      const hasSeenVoteModal = localStorage.getItem("preferentialVoteSubmitted");
      const shouldShowVote = voteParam === "true" || (!hasSeenVoteModal && voteParam !== "false");
      
      if (shouldShowVote) {
        console.log("✅ Showing preferential vote modal");
        setShowPreferentialModal(true);
        setShowSiteContent(false);
        
        // Track that modal was opened
        fetch("/api/preferential-vote-track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "opened" }),
        }).catch((error) => {
          console.error("Error tracking modal open:", error);
        });
        return;
      }
    }
    
    // Stage 3: Show full site content (after both modals are handled)
    if (calendarHandled && (hasVoted || voteParam === "false")) {
      console.log("✅ Showing full site content");
      setShowSiteContent(true);
    }
  }, []);

  // Handle calendar modal completion
  const handleCalendarModalComplete = () => {
    localStorage.setItem("calendarModalHandled", "true");
    setShowCalendarModal(false);
    
    // After calendar modal, check if we should show vote modal
    const hasVoted = localStorage.getItem("preferentialVoteSubmitted") === "voted";
    const urlParams = new URLSearchParams(window.location.search);
    const voteParam = urlParams.get("vote");
    const hasSeenVoteModal = localStorage.getItem("preferentialVoteSubmitted");
    const shouldShowVote = voteParam === "true" || (!hasSeenVoteModal && voteParam !== "false");
    
    if (!hasVoted && shouldShowVote) {
      setShowPreferentialModal(true);
    } else {
      setShowSiteContent(true);
    }
  };

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
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || "Failed to submit vote";
        // Check if it's a rate limit error
        const isRateLimit = response.status === 429 || response.status === 403 || 
                           errorMessage.includes("rate limit") || 
                           errorMessage.includes("quota");
        throw new Error(isRateLimit ? "rate limit" : errorMessage);
      }
    } catch (error: any) {
      console.error("Error submitting preferential vote:", error);
      throw error;
    }
  };

  // Handle vote submission completion
  const handleVoteComplete = () => {
    setShowPreferentialModal(false);
    setShowSiteContent(true);
  };

  return (
    <main className="min-h-screen bg-black">
      {/* Show site content only after modals are handled */}
      {showSiteContent && (
        <>
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
        </>
      )}

      {/* Calendar Modal - Stage 1 */}
      {showCalendarModal && (
        <CalendarModal
          language={language}
          onClose={handleCalendarModalComplete}
          onPermissionHandled={handleCalendarModalComplete}
        />
      )}

      {/* Support Modal - Always available */}
      {showSupportModal && (
        <SupportModal
          language={language}
          onClose={() => setShowSupportModal(false)}
          onSupportSubmit={handleSupportSubmit}
        />
      )}

      {/* Preferential Vote Modal - Stage 2 */}
      {showPreferentialModal && (
        <PreferentialVoteModal
          language={language}
          onClose={() => {
            setShowPreferentialModal(false);
            setShowSiteContent(true);
            // Track that modal was closed without voting
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
          onVoteSubmit={async (preferentialOrder) => {
            await handlePreferentialVoteSubmit(preferentialOrder);
            handleVoteComplete();
          }}
        />
      )}
    </main>
  );
}
