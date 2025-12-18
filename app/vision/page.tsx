"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import SupportButton from "@/components/SupportButton";
import SupportModal from "@/components/SupportModal";
import { SupportType } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Vision() {
  const { language } = useLanguage();
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleSupportSubmit = async (
    supportType: SupportType,
    formData?: {
      name: string;
      enrollmentNumber: string;
      district: string;
      barAssociation: string;
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
      heading: "దృష్టికోణం",
      body: [
        "న్యాయవాదుల మాట వింటూ,",
        "వారి సమస్యలను చిన్నవిగా తీసుకోకుండా,",
        "సమయానికి స్పందించే",
        "బలమైన బార్ కౌన్సిల్ అవసరం అని నేను నమ్ముతున్నాను.",
        "",
        "బార్ కౌన్సిల్ అంటే కేవలం నియమాలు చెప్పే సంస్థ కాదు.",
        "న్యాయవాదులకు నమ్మకం కలిగించే వేదికగా",
        "పని చేయాలి అన్నదే నా దృష్టి.",
      ],
    },
    en: {
      heading: "Vision",
      body: [
        "I believe the Bar Council must be strong, responsive,",
        "and attentive to the voices of advocates.",
        "",
        "It should not remain only as a regulatory body,",
        "but function as an institution that advocates",
        "can genuinely trust and rely upon.",
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

