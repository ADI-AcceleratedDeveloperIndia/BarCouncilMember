"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import LanguageToggle from "@/components/LanguageToggle";
import Footer from "@/components/Footer";
import SupportButton from "@/components/SupportButton";
import SupportModal from "@/components/SupportModal";
import { SupportType } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Mission() {
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
      heading: "లక్ష్యం",
      body: [
        "ఈ ఎన్నికల్లో పోటీ చేస్తున్నది",
        "ఏదో హోదా కోసం కాదు.",
        "",
        "న్యాయవాదుల జీవితాన్ని సులభతరం చేసే విధంగా",
        "నిజాయితీగా పని చేయాలన్నదే నా లక్ష్యం.",
        "",
        "ప్రత్యేకంగా —",
        "• సమస్యలో ఉన్న న్యాయవాదికి అండగా నిలబడటం",
        "• వృత్తిలోకి కొత్తగా అడుగుపెట్టిన యువ న్యాయవాదులను దారి చూపించడం",
        "• బార్ కౌన్సిల్ పనితీరులో స్పష్టత, బాధ్యత తీసుకురావడం",
        "",
        "ఇవే నా ముందున్న ప్రధాన బాధ్యతలు.",
      ],
    },
    en: {
      heading: "Mission",
      body: [
        "I am contesting this election not for status or position.",
        "",
        "My mission is to work sincerely to make professional life",
        "more secure and dignified for advocates.",
        "",
        "This includes standing with advocates in genuine difficulties,",
        "guiding young entrants to the profession,",
        "and bringing clarity and accountability",
        "to the functioning of the Bar Council.",
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

