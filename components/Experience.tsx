"use client";

import { Language, LayoutVariant } from "@/types";
import { getContent } from "@/lib/content";

interface ExperienceProps {
  language: Language;
  layoutVariant: LayoutVariant;
}

export default function Experience({
  language,
  layoutVariant,
}: ExperienceProps) {
  const content = getContent(language);

  const layoutClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const alignmentClass = layoutClasses[layoutVariant];

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-6xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold text-white mb-12 border-b-2 border-gold pb-2 ${
            layoutVariant === "center"
              ? "inline-block"
              : layoutVariant === "left"
              ? "inline-block"
              : "inline-block ml-auto"
          } ${alignmentClass}`}
        >
          {content.experience.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="border-2 gold-border-glow p-6 bg-black rounded-lg transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-bold gold-text-shimmer mb-2">
              {content.experience.years}
            </h3>
            <p className="text-white text-lg">—</p>
          </div>

          <div className="border-2 gold-border-glow p-6 bg-black rounded-lg transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-bold gold-text-shimmer mb-2">
              {content.experience.courts}
            </h3>
            <p className="text-white text-lg">—</p>
          </div>

          <div className="border-2 gold-border-glow p-6 bg-black rounded-lg transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-xl font-bold gold-text-shimmer mb-2">
              {content.experience.service}
            </h3>
            <p className="text-white text-lg">—</p>
          </div>
        </div>
      </div>
    </section>
  );
}

