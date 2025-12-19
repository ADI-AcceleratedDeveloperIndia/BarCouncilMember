"use client";

import { Language } from "@/types";
import { getContent } from "@/lib/content";

interface SupportButtonProps {
  language: Language;
  onClick: () => void;
}

export default function SupportButton({
  language,
  onClick,
}: SupportButtonProps) {
  const content = getContent(language);

  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-6 z-50 gold-shimmer text-black px-6 py-3 rounded font-bold text-lg shadow-lg gold-glow-hover transition-all duration-300 border-2 border-white/20"
    >
      {content.support.button}
    </button>
  );
}

