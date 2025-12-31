"use client";

import { useState, useEffect } from "react";
import { candidateConfig } from "@/config/candidate.config";
import { Language } from "@/types";

interface PreferentialVoteModalProps {
  language: Language;
  onClose: () => void;
  onVoteSubmit: (preferentialOrder: number) => Promise<void>;
}

// Function to convert number to words (1-24)
const numberToWords = (num: number): string => {
  const ones = [
    "", "ONE", "TWO", "THREE", "FOUR", "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
    "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN", "FIFTEEN", "SIXTEEN",
    "SEVENTEEN", "EIGHTEEN", "NINETEEN"
  ];
  const tens = ["", "", "TWENTY", "THIRTY", "FORTY", "FIFTY"];

  if (num === 0) return "ZERO";
  if (num < 20) return ones[num];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    return one === 0 ? tens[ten] : `${tens[ten]} ${ones[one]}`;
  }
  return "";
};

export default function PreferentialVoteModal({
  language,
  onClose,
  onVoteSubmit,
}: PreferentialVoteModalProps) {
  const [modalLanguage, setModalLanguage] = useState<Language>("en"); // Default to English
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredOrder, setHoveredOrder] = useState<number | null>(null);
  const [displayedText, setDisplayedText] = useState<string>("");

  // Typing animation effect
  useEffect(() => {
    if (hoveredOrder === null) {
      setDisplayedText("");
      return;
    }

    const fullText = numberToWords(hoveredOrder);
    setDisplayedText("");
    let currentIndex = 0;

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, 50); // Adjust speed here (lower = faster)

    return () => clearInterval(typingInterval);
  }, [hoveredOrder]);

  const handleSubmit = async () => {
    if (selectedOrder === null) return;
    
    setIsSubmitting(true);
    try {
      await onVoteSubmit(selectedOrder);
      onClose();
    } catch (error) {
      console.error("Error submitting vote:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-1 sm:p-2 md:p-4">
      <div className="relative bg-black border border-gold sm:border-2 md:border-4 rounded-lg p-1.5 sm:p-2 md:p-3 max-w-2xl w-full max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close Button - Smaller on mobile */}
        <button
          onClick={onClose}
          className="absolute top-1 right-1 sm:top-2 sm:right-2 md:top-4 md:right-4 text-gold hover:text-yellow-400 text-2xl sm:text-3xl md:text-4xl font-bold transition-colors w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 flex items-center justify-center touch-manipulation z-10"
          aria-label="Close"
        >
          ×
        </button>

        {/* Language Toggle Button - Smaller and positioned to not overlap */}
        <div className="absolute top-1 left-1 sm:top-2 sm:left-2 md:top-4 md:left-4 z-10">
          <button
            onClick={() => setModalLanguage(modalLanguage === "en" ? "te" : "en")}
            className="bg-black border border-gold text-gold px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 rounded text-[10px] sm:text-xs md:text-sm font-semibold hover:bg-gold hover:text-black transition-colors touch-manipulation"
          >
            {modalLanguage === "en" ? "EN | తె" : "EN | తె"}
          </button>
        </div>

        {/* Content */}
        <div className="text-center pt-8 sm:pt-10 md:pt-12 flex-1 flex flex-col overflow-hidden">
          {/* Name of the Contestant and Photo Section - Smaller */}
          <div className="flex items-center justify-between mb-1.5 sm:mb-2 md:mb-2.5 px-3 sm:px-4 md:px-5 border-b border-gold pb-1 sm:pb-1.5">
            <div className="flex-1 text-left pr-2 sm:pr-3">
              <p className="text-[9px] sm:text-[10px] md:text-xs text-gold mb-0.5 font-semibold">
                {modalLanguage === "en" ? "Name of the Contestant" : "పోటీదారి పేరు"}
              </p>
              <h3 className="text-[10px] sm:text-xs md:text-sm font-bold text-gold break-words leading-tight">
                {candidateConfig.name}
              </h3>
            </div>
            <div className="flex-shrink-0 ml-2 sm:ml-3">
              <img
                src="/candidate/modelPhoto.png"
                alt={candidateConfig.name}
                className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full border border-gold object-cover"
              />
            </div>
          </div>

          {/* Contesting Statement - Smaller */}
          <p className="text-gold text-[9px] sm:text-[10px] md:text-xs mb-1.5 sm:mb-2 md:mb-2.5 px-1 sm:px-1.5 font-semibold italic leading-tight">
            {modalLanguage === "en"
              ? "I am contesting for Telangana Bar Council Member Elections."
              : "నేను తెలంగాణ బార్ కౌన్సిల్ సభ్యుడి ఎన్నికలకు పోటీ చేస్తున్నాను."}
          </p>

          <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-bold text-gold mb-1 sm:mb-1.5 md:mb-2 gold-text-shimmer px-1 sm:px-1.5 leading-tight">
            {modalLanguage === "en"
              ? "Submit Your Preferential Choice (Mock Process)"
              : "మీ ప్రిఫరెన్షియల్ ఎంపికను నమోదు చేయండి (మాక్ ప్రక్రియ)"}
          </h2>

          <p className="text-white text-[9px] sm:text-[10px] md:text-xs mb-1.5 sm:mb-2 md:mb-2.5 px-1 sm:px-1.5 leading-tight">
            {modalLanguage === "en"
              ? "Dear Advocate, This website is only to understand the preference of advocates. This website is made in such a way that we DO NOT collect your name, mobile number, your device IP, or any personal identity."
              : "ప్రియమైన న్యాయవాది గారికి, న్యాయవాదుల అభిప్రాయాన్ని తెలుసుకోవడానికి ఈ వెబ్‌సైట్ రూపొందించబడింది. ఈ వెబ్‌సైట్ ఏ విధంగా రూపొందించబడింది అంటే మీ పేరు, మీ మొబైల్ నంబర్, మీ డివైస్ IP లేదా మీ గుర్తింపుకు సంబంధించిన ఏ సమాచారం కూడా సేకరించబడదు."}
          </p>

          {/* Helper Text - Smaller */}
          <p className="text-gold text-[9px] sm:text-[10px] md:text-xs mb-1 sm:mb-1.5 md:mb-2 px-1 sm:px-1.5 italic leading-tight">
            {modalLanguage === "en"
              ? "If you are unable to give first preference, you may choose any other preference (2, 3, 4… or even 24)."
              : "మొదటి ప్రాధాన్యత ఇవ్వలేని పరిస్థితిలో, ఇతర ప్రాధాన్యత (2, 3, 4… లేదా 24) ఎంచుకోవచ్చు."}
          </p>

          {/* Preferential Order Selection - More compact */}
          <div className="mb-1 sm:mb-1.5 md:mb-2">
            {/* Display area for typed text - Smaller reserved space */}
            <div className="mb-1 sm:mb-1.5 h-[1.2rem] sm:h-[1.4rem] md:h-[1.6rem] flex items-center justify-center flex-shrink-0">
              {displayedText ? (
                <p className="text-gold text-[10px] sm:text-xs md:text-sm font-bold gold-text-shimmer">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </p>
              ) : (
                <span className="text-transparent text-[10px] sm:text-xs md:text-sm font-bold">
                  &nbsp;
                </span>
              )}
            </div>

            {/* Number grid - More compact, no scroll needed - 4 rows of 6 = 24 */}
            <div className="grid grid-cols-6 gap-0.5 sm:gap-1 md:gap-1.5 p-0.5 sm:p-1 md:p-1.5 bg-gray-900 rounded-lg">
              {Array.from({ length: 24 }, (_, i) => i + 1).map((order) => (
                <button
                  key={order}
                  onClick={() => setSelectedOrder(order)}
                  onMouseEnter={() => setHoveredOrder(order)}
                  onMouseLeave={() => setHoveredOrder(null)}
                  className={`px-0.5 py-1 sm:px-1 sm:py-1.5 md:px-1.5 md:py-2 rounded font-semibold text-[10px] sm:text-xs md:text-sm transition-all touch-manipulation min-h-[28px] sm:min-h-[32px] md:min-h-[36px] ${
                    selectedOrder === order
                      ? "bg-gold text-black border border-gold gold-glow scale-105"
                      : "bg-gray-800 text-white border border-gray-600 hover:border-gold hover:text-gold active:border-gold active:text-gold active:scale-95"
                  }`}
                >
                  {order}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button - Smaller and compact */}
          <button
            onClick={handleSubmit}
            disabled={selectedOrder === null || isSubmitting}
            className={`w-full px-2 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-lg font-bold text-[10px] sm:text-xs md:text-sm transition-all touch-manipulation min-h-[32px] sm:min-h-[36px] md:min-h-[40px] flex-shrink-0 ${
              selectedOrder === null || isSubmitting
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gold text-black active:bg-yellow-400 gold-glow-hover active:scale-95"
            }`}
          >
            {isSubmitting
              ? modalLanguage === "en"
                ? "Submitting..."
                : "సమర్పిస్తున్నాము..."
              : modalLanguage === "en"
              ? "Submit Preference"
              : "ప్రాధాన్యత సబ్మిట్ చేయండి"}
          </button>
        </div>
      </div>
    </div>
  );
}

