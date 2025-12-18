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
      className="fixed bottom-24 right-6 z-50 bg-gold text-black px-6 py-3 rounded font-semibold text-lg shadow-lg hover:bg-gold/90 transition border-2 border-gold"
    >
      {content.support.button}
    </button>
  );
}

