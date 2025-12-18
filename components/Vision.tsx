"use client";

import { Language, LayoutVariant } from "@/types";
import { getContent } from "@/lib/content";

interface VisionProps {
  language: Language;
  layoutVariant: LayoutVariant;
}

export default function Vision({ language, layoutVariant }: VisionProps) {
  const content = getContent(language);

  const layoutClasses = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const alignmentClass = layoutClasses[layoutVariant];

  return (
    <section className="py-16 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
        <h2
          className={`text-3xl md:text-4xl font-bold text-white mb-12 border-b-2 border-gold pb-2 ${
            layoutVariant === "center"
              ? "inline-block"
              : layoutVariant === "left"
              ? "inline-block"
              : "inline-block ml-auto"
          } ${alignmentClass}`}
        >
          {content.vision.title}
        </h2>

        <ul className={`space-y-4 mt-8 ${alignmentClass}`}>
          {content.vision.bullets.map((bullet, index) => (
            <li
              key={index}
              className={`text-lg md:text-xl text-white flex items-start gap-3 ${
                layoutVariant === "right" ? "flex-row-reverse" : ""
              }`}
            >
              <span className="text-gold mt-1">•</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

