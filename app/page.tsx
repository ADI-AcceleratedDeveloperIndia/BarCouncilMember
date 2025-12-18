"use client";

import { useState } from "react";
import { candidateConfig } from "@/config/candidate.config";
import { SupportType } from "@/types";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Experience from "@/components/Experience";
import Vision from "@/components/Vision";
import SupportButton from "@/components/SupportButton";
import SupportModal from "@/components/SupportModal";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { language } = useLanguage();
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleSupportSubmit = async (
    supportType: SupportType,
    formData?: {
      name: string;
      enrollmentNumber: string;
      district: string;
      barAssociation: string;
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
    </main>
  );
}
