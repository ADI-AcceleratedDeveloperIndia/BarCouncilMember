"use client";

import { useState } from "react";
import { candidateConfig } from "@/config/candidate.config";
import { Language } from "@/types";

interface PreferentialVoteModalProps {
  language: Language;
  onClose: () => void;
  onVoteSubmit: (preferentialOrder: number) => Promise<void>;
}

export default function PreferentialVoteModal({
  language,
  onClose,
  onVoteSubmit,
}: PreferentialVoteModalProps) {
  const [selectedOrder, setSelectedOrder] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-2 sm:p-4">
      <div className="relative bg-black border-2 sm:border-4 border-gold rounded-lg p-4 sm:p-6 md:p-8 max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Close Button - Larger and easier to tap on mobile */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gold hover:text-yellow-400 text-4xl sm:text-3xl font-bold transition-colors w-10 h-10 sm:w-8 sm:h-8 flex items-center justify-center touch-manipulation"
          aria-label="Close"
        >
          ×
        </button>

        {/* Content */}
        <div className="text-center pt-2 sm:pt-0">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-gold mb-3 sm:mb-4 md:mb-6 gold-text-shimmer px-2 sm:px-0">
            {language === "en"
              ? "Cast Your Preferential Vote"
              : "మీ ప్రాధాన్యత ఓటు వేయండి"}
          </h2>

          <p className="text-white text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 md:mb-8 px-2 sm:px-0 leading-relaxed">
            {language === "en"
              ? `Dear Advocate, please cast your first preferential vote for ${candidateConfig.name} in the Telangana State Bar Council elections.`
              : `ప్రియ న్యాయవాదులారా, తెలంగాణ రాష్ట్ర బార్ కౌన్సిల్ ఎన్నికల్లో ${candidateConfig.name} కి మీ మొదటి ప్రాధాన్యత ఓటు వేయండి.`}
          </p>

          {/* Preferential Order Selection */}
          <div className="mb-4 sm:mb-6 md:mb-8">
            <label className="block text-gold text-base sm:text-lg md:text-xl font-semibold mb-3 sm:mb-4 px-2 sm:px-0">
              {language === "en"
                ? "Select Preferential Order (1-24):"
                : "ప్రాధాన్యత క్రమాన్ని ఎంచుకోండి (1-24):"}
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-3 max-h-[40vh] sm:max-h-60 overflow-y-auto p-2 sm:p-4 bg-gray-900 rounded-lg">
              {Array.from({ length: 24 }, (_, i) => i + 1).map((order) => (
                <button
                  key={order}
                  onClick={() => setSelectedOrder(order)}
                  className={`px-2 py-2.5 sm:px-3 sm:py-2.5 md:px-4 md:py-2 rounded font-semibold text-sm sm:text-base transition-all touch-manipulation min-h-[44px] sm:min-h-[40px] ${
                    selectedOrder === order
                      ? "bg-gold text-black border-2 border-gold gold-glow scale-105"
                      : "bg-gray-800 text-white border-2 border-gray-600 active:border-gold active:text-gold active:scale-95"
                  }`}
                >
                  {order}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button - Larger touch target on mobile */}
          <button
            onClick={handleSubmit}
            disabled={selectedOrder === null || isSubmitting}
            className={`w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-3 md:py-3 rounded-lg font-bold text-base sm:text-lg transition-all touch-manipulation min-h-[48px] sm:min-h-[44px] ${
              selectedOrder === null || isSubmitting
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gold text-black active:bg-yellow-400 gold-glow-hover active:scale-95"
            }`}
          >
            {isSubmitting
              ? language === "en"
                ? "Submitting..."
                : "సమర్పిస్తున్నాము..."
              : language === "en"
              ? "Submit"
              : "సమర్పించండి"}
          </button>
        </div>
      </div>
    </div>
  );
}

