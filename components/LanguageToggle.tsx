"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 border border-gold px-4 py-2 rounded bg-black">
      <button
        onClick={() => setLanguage("en")}
        className={`px-3 py-1 transition ${
          language === "en"
            ? "bg-gold text-black font-semibold"
            : "text-white hover:text-gold"
        }`}
      >
        English
      </button>
      <span className="text-gold">|</span>
      <button
        onClick={() => setLanguage("te")}
        className={`px-3 py-1 transition ${
          language === "te"
            ? "bg-gold text-black font-semibold"
            : "text-white hover:text-gold"
        }`}
      >
        తెలుగు
      </button>
    </div>
  );
}

