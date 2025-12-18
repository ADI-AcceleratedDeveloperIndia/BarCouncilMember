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
  }>({});
  const content = getContent(language);

  const handleQuickSupport = async () => {
    setSupportType("Quick Support");
    await onSupportSubmit("Quick Support");
    setStep("add-details");
  };

  const handleSkip = async () => {
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
    customMessage: string;
  }) => {
    setSupportType("Detailed Support");
    setSupporterDetails({
      name: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
    });
    await onSupportSubmit("Detailed Support", {
      name: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
      district: formData.district,
      barAssociation: formData.barAssociation,
    });
    const imageUrl = await generateSupportImage({
      candidateName: candidateConfig.name,
      candidatePhoto: candidateConfig.photo,
      language,
      supporterName: formData.name,
      enrollmentNumber: formData.enrollmentNumber,
      district: formData.district,
      barAssociation: formData.barAssociation,
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
          name: supporterDetails.name || "",
          enrollmentNumber: supporterDetails.enrollmentNumber || "",
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
              <button
                onClick={handleQuickSupport}
                className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gold text-black text-4xl md:text-5xl font-bold hover:bg-gold/90 transition mb-8"
              >
                ✓
              </button>
            </div>
          )}

          {step === "add-details" && (
            <div className="text-center py-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-8">
                {language === "en"
                  ? "Would you like to add your details?"
                  : "మీ వివరాలను జోడించాలనుకుంటున్నారా?"}
              </h2>
              <div className="flex flex-col gap-4 max-w-md mx-auto">
                <button
                  onClick={handleAddDetails}
                  className="bg-gold text-black px-6 py-3 rounded font-semibold hover:bg-gold/90 transition"
                >
                  {content.support.quickSupport.addDetails}
                </button>
                <button
                  onClick={handleSkip}
                  className="border-2 border-gold text-white px-6 py-3 rounded font-semibold hover:bg-gold/10 transition"
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
                  className="bg-gold text-black px-8 py-3 rounded font-semibold hover:bg-gold/90 transition text-lg"
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

