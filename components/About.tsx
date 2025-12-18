"use client";

import { Language, LayoutVariant } from "@/types";
import { getContent } from "@/lib/content";

interface AboutProps {
  language: Language;
  layoutVariant: LayoutVariant;
}

export default function About({ language, layoutVariant }: AboutProps) {
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
        <div className={alignmentClass}>
          <h2
            className={`text-3xl md:text-4xl font-bold text-white mb-6 border-b-2 border-gold pb-2 ${
              layoutVariant === "center"
                ? "inline-block"
                : layoutVariant === "left"
                ? "inline-block"
                : "inline-block ml-auto"
            }`}
          >
            {content.about.title}
          </h2>
          <p className="text-lg md:text-xl text-white mt-6 leading-relaxed">
            {content.about.text}
          </p>
        </div>
      </div>
    </section>
  );
}

