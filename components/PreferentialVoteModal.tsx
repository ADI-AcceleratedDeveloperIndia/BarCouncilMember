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
      <div className="relative bg-black border border-gold sm:border-2 md:border-4 rounded-lg p-2 sm:p-3 md:p-6 max-w-2xl w-full max-h-[98vh] sm:max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
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
        <div className="text-center pt-6 sm:pt-8 md:pt-10">
          <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gold mb-2 sm:mb-3 md:mb-4 gold-text-shimmer px-1 sm:px-2 leading-tight">
            {modalLanguage === "en"
              ? "Submit Your Preferential Choice (Mock Process)"
              : "మీ ప్రిఫరెన్షియల్ ఎంపికను నమోదు చేయండి (మాక్ ప్రక్రియ)"}
          </h2>

          <p className="text-white text-[11px] sm:text-xs md:text-sm lg:text-base mb-2 sm:mb-3 md:mb-4 px-1 sm:px-2 leading-snug sm:leading-relaxed">
            {modalLanguage === "en"
              ? "Dear Advocate, This website is only to understand the preference of advocates. This website is made in such a way that we DO NOT collect your name, mobile number, your device IP, or any personal identity. Please select any one preference from 1 to 24, based on your choice."
              : "ప్రియమైన న్యాయవాది గారికి, న్యాయవాదుల అభిప్రాయాన్ని తెలుసుకోవడానికి ఈ వెబ్‌సైట్ రూపొందించబడింది. ఈ వెబ్‌సైట్ ఏ విధంగా రూపొందించబడింది అంటే మీ పేరు, మీ మొబైల్ నంబర్, మీ డివైస్ IP లేదా మీ గుర్తింపుకు సంబంధించిన ఏ సమాచారం కూడా సేకరించబడదు. దయచేసి, 1 నుండి 24 మధ్యలో మీకు ఇష్టమైన ఏదైనా ఒక ప్రాధాన్యతను ఎంచుకోండి."}
          </p>

          {/* Helper Text */}
          <p className="text-gold text-[10px] sm:text-xs md:text-sm mb-2 sm:mb-3 px-1 sm:px-2 italic leading-snug">
            {modalLanguage === "en"
              ? "If you are unable to give first preference, you may choose any other preference (2, 3, 4… or even 24)."
              : "మొదటి ప్రాధాన్యత ఇవ్వలేని పరిస్థితిలో, ఇతర ప్రాధాన్యత (2, 3, 4… లేదా 24) ఎంచుకోవచ్చు."}
          </p>

          {/* Preferential Order Selection */}
          <div className="mb-2 sm:mb-3 md:mb-4">
            
            {/* Display area for typed text - Always reserve space, smaller on mobile */}
            <div className="mb-1.5 sm:mb-2 md:mb-3 h-[1.8rem] sm:h-[2.2rem] md:h-[2.5rem] lg:h-[3rem] flex items-center justify-center">
              {displayedText ? (
                <p className="text-gold text-sm sm:text-base md:text-lg lg:text-xl font-bold gold-text-shimmer">
                  {displayedText}
                  <span className="animate-pulse">|</span>
                </p>
              ) : (
                <span className="text-transparent text-sm sm:text-base md:text-lg lg:text-xl font-bold">
                  &nbsp;
                </span>
              )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-1 sm:gap-1.5 md:gap-2 max-h-[25vh] sm:max-h-[30vh] md:max-h-[35vh] overflow-y-auto p-1 sm:p-2 md:p-3 bg-gray-900 rounded-lg">
              {Array.from({ length: 24 }, (_, i) => i + 1).map((order) => (
                <button
                  key={order}
                  onClick={() => setSelectedOrder(order)}
                  onMouseEnter={() => setHoveredOrder(order)}
                  onMouseLeave={() => setHoveredOrder(null)}
                  className={`px-1 py-1.5 sm:px-2 sm:py-2 md:px-3 md:py-2 rounded font-semibold text-xs sm:text-sm md:text-base transition-all touch-manipulation min-h-[36px] sm:min-h-[40px] md:min-h-[44px] ${
                    selectedOrder === order
                      ? "bg-gold text-black border border-gold sm:border-2 gold-glow scale-105"
                      : "bg-gray-800 text-white border border-gray-600 sm:border-2 hover:border-gold hover:text-gold active:border-gold active:text-gold active:scale-95"
                  }`}
                >
                  {order}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button - Proportional sizing */}
          <button
            onClick={handleSubmit}
            disabled={selectedOrder === null || isSubmitting}
            className={`w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2.5 md:px-8 md:py-3 rounded-lg font-bold text-xs sm:text-sm md:text-base lg:text-lg transition-all touch-manipulation min-h-[40px] sm:min-h-[44px] md:min-h-[48px] ${
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

