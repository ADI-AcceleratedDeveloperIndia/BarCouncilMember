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
      mobileNumber: string;
      customMessage: string;
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

          <div className="space-y-4 text-lg md:text-xl text-white leading-relaxed text-center mb-12">
            {currentContent.body.map((paragraph, index) => (
              <p key={index} className={paragraph === "" ? "mb-6" : ""}>
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex justify-center">
            <a
              href="https://wa.me/919505009699"
              target="_blank"
              rel="noopener noreferrer"
              className="gold-shimmer text-black px-10 py-4 rounded-full font-bold text-xl flex items-center gap-3 gold-glow-hover transition-all"
            >
              <svg 
                className="w-8 h-8" 
                fill="currentColor" 
                viewBox="0 0 24 24"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.631 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {language === "en" ? "Message on WhatsApp" : "వాట్సాప్ ద్వారా సందేశం పంపండి"}
            </a>
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

