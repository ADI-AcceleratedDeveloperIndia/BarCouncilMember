"use client";

import { useState } from "react";
import Image from "next/image";
import { candidateConfig } from "@/config/candidate.config";
import { Language, SupportType } from "@/types";
import { getContent } from "@/lib/content";
import SupportForm from "./SupportForm";
import { generateSupportImage } from "@/lib/imageGenerator";

interface SupportModalProps {
  language: Language;
  onClose: () => void;
  onSupportSubmit: (
    supportType: SupportType,
    formData?: {
      name: string;
      enrollmentNumber: string;
      district: string;
      barAssociation: string;
      mobileNumber: string;
      customMessage: string;
    }
  ) => Promise<void>;
}

type SupportStep = "quick" | "add-details" | "form" | "image";

export default function SupportModal({
  language,
  onClose,
  onSupportSubmit,
}: SupportModalProps) {
  const [step, setStep] = useState<SupportStep>("quick");
  const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
  const [imageDownloaded, setImageDownloaded] = useState(false);
  const [supportType, setSupportType] = useState<SupportType>("Quick Support");
  const [supporterDetails, setSupporterDetails] = useState<{
    name?: string;
    enrollmentNumber?: string;
    district?: string;
    barAssociation?: string;
    mobileNumber?: string;
    customMessage?: string;
  }>({});
  const content = getContent(language);

  const handleQuickSupport = async () => {
    setSupportType("Quick Support");
    // Removed immediate onSupportSubmit call
    setStep("add-details");
  };

  const handleSkip = async () => {
    // Log Quick Support only when they actually skip details
    await onSupportSubmit("Quick Support");
    
    const imageUrl = await generateSupportImage({
      candidateName: candidateConfig.name,
      candidatePhoto: candidateConfig.photo,
      language,
      // No supporter details for quick support
    });
    setImageDataUrl(imageUrl);
    setStep("image");
  };

  const handleAddDetails = () => {
    setStep("form");
  };

  const handleFormSubmit = async (formData: {
    name: string;
    enrollmentNumber: string;
    district: string;
    barAssociation: string;
    mobileNumber: string;
    customMessage: string;
  }) => {
    setSupportType("Strong Support");
    setSupporterDetails({
      name: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
      district: formData.district,
      barAssociation: formData.barAssociation,
      mobileNumber: formData.mobileNumber,
      customMessage: formData.customMessage,
    });
    await onSupportSubmit("Strong Support", {
      name: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
      district: formData.district,
      barAssociation: formData.barAssociation,
      mobileNumber: formData.mobileNumber,
      customMessage: formData.customMessage,
    });
    const imageUrl = await generateSupportImage({
      candidateName: candidateConfig.name,
      candidatePhoto: candidateConfig.photo,
      language,
      supporterName: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
      district: formData.district,
      barAssociation: formData.barAssociation,
      mobileNumber: formData.mobileNumber,
      customMessage: formData.customMessage,
    });
    setImageDataUrl(imageUrl);
    setStep("image");
  };

  const handleDownload = async () => {
    if (!imageDataUrl) return;

    const link = document.createElement("a");
    link.href = imageDataUrl;
    link.download = `support-card.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (!imageDownloaded) {
      setImageDownloaded(true);
      // Log download event
      await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "download",
          supportType,
          name: supporterDetails.name || "Anonymous",
          enrollmentNumber: supporterDetails.enrollmentNumber || "N/A",
          district: supporterDetails.district || "N/A",
          barAssociation: supporterDetails.barAssociation || "N/A",
          mobileNumber: supporterDetails.mobileNumber || "N/A",
          customMessage: supporterDetails.customMessage || "N/A",
          format: "png",
          language,
        }),
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-black border-2 border-gold rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gold text-2xl"
          >
            ×
          </button>

          {step === "quick" && (
            <div className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {content.support.quickSupport.title}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) handleQuickSupport();
                      }}
                      className="peer sr-only"
                    />
                    <div className="w-12 h-12 bg-black border-2 border-gold rounded peer-checked:gold-shimmer transition-all flex items-center justify-center gold-glow">
                      <svg
                        className="w-8 h-8 text-black scale-0 peer-checked:scale-100 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={4}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <span className="text-white text-xl md:text-2xl font-semibold group-hover:text-gold transition">
                    {language === "en" ? "I Support" : "నేను మద్దతు ఇస్తున్నాను"}
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === "add-details" && (
            <div className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {language === "en"
                  ? "Would you like to add your details?"
                  : "మీ వివరాలను జోడించాలనుకుంటున్నారా?"}
              </h2>
              <div className="flex flex-col gap-6 max-w-md mx-auto items-center">
                <button
                  onClick={handleAddDetails}
                  className="w-full gold-shimmer text-black px-6 py-4 rounded-lg font-bold text-xl transition-all gold-glow-hover"
                >
                  {content.support.quickSupport.addDetails}
                </button>
                <button
                  onClick={handleSkip}
                  className="text-white/60 hover:text-gold underline underline-offset-4 transition text-lg"
                >
                  {content.support.quickSupport.skip}
                </button>
              </div>
            </div>
          )}

          {step === "form" && (
            <SupportForm
              language={language}
              onSubmit={handleFormSubmit}
              onCancel={() => setStep("add-details")}
            />
          )}

          {step === "image" && imageDataUrl && (
            <div className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {language === "en"
                  ? "Your Support Card"
                  : "మీ మద్దతు కార్డ్"}
              </h2>
              <div className="mb-6">
                <img
                  src={imageDataUrl}
                  alt="Support Card"
                  className="max-w-full h-auto border-2 border-gold rounded"
                />
              </div>
              <div className="flex justify-center">
                <button
                  onClick={handleDownload}
                  className="gold-shimmer text-black px-8 py-3 rounded font-bold transition-all text-lg gold-glow-hover"
                >
                  {language === "en" ? "Download PNG" : "PNG డౌన్‌లోడ్ చేయండి"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

