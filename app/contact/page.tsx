"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import SupportButton from "@/components/SupportButton";
import SupportModal from "@/components/SupportModal";
import { SupportType } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Contact() {
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

  const content = {
    te: {
      heading: "సంప్రదింపు",
      body: [
        "సోదర, సోదరీ న్యాయవాదుల మాట వినడం నాకు చాలా ముఖ్యం.",
        "మీ సమస్యలు, అభిప్రాయాలు, సూచనలు",
        "నాకు తెలియజేయడానికి సంకోచించకండి.",
        "",
        "WhatsApp లేదా సోషల్ మీడియా ద్వారా",
        "నన్ను నేరుగా సంప్రదించవచ్చు.",
        "",
        "మీ మద్దతే నాకు బలం.",
      ],
    },
    en: {
      heading: "Contact",
      body: [
        "Listening to fellow advocates is important to me.",
        "Your concerns, opinions, and suggestions are always welcome.",
        "",
        "You may reach out to me directly through WhatsApp",
        "or connect via social media.",
        "",
        "Your support gives me strength.",
      ],
    },
  };

  const currentContent = content[language];

  return (
    <main className="min-h-screen bg-black">
      <Navigation />
      
      {/* Fixed Language Toggle - Top Right */}
      <div className="fixed top-20 right-4 z-50">
        <LanguageToggle />
      </div>

      <section className="pt-32 pb-16 px-4 bg-black">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 border-b-2 border-gold inline-block pb-4">
              {currentContent.heading}
            </h1>
          </div>

          <div className="space-y-4 text-lg md:text-xl text-white leading-relaxed text-center">
            {currentContent.body.map((paragraph, index) => (
              <p key={index} className={paragraph === "" ? "mb-6" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

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

