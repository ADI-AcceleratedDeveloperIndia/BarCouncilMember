"use client";

import Image from "next/image";
import { candidateConfig } from "@/config/candidate.config";
import { Language, LayoutVariant } from "@/types";
import { getContent } from "@/lib/content";

interface HeroProps {
  language: Language;
  layoutVariant: LayoutVariant;
}

export default function Hero({
  language,
  layoutVariant,
}: HeroProps) {
  const content = getContent(language);

  // Layout variant styles
  const isCenter = layoutVariant === "center";
  const isLeft = layoutVariant === "left";
  const isRight = layoutVariant === "right";

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-black">
      <div
        className={`flex gap-8 w-full max-w-6xl ${
          isCenter
            ? "flex-col items-center"
            : isLeft
            ? "flex-col md:flex-row items-center md:items-start"
            : "flex-col md:flex-row-reverse items-center md:items-start"
        }`}
      >
        <div
          className={`flex flex-col gap-6 ${
            isCenter ? "items-center w-full" : "flex-1"
          }`}
        >
          <div
            className={`relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-gold overflow-hidden bg-white/10 gold-glow ${
              isCenter ? "mx-auto" : ""
            }`}
          >
            <Image
              src={candidateConfig.photo}
              alt="Advocate Photo"
              fill
              sizes="(max-width: 768px) 192px, 256px"
              className="object-cover"
              priority
            />
          </div>
        </div>

        <div
          className={`flex-1 ${
            isCenter
              ? "text-center"
              : isLeft
              ? "text-left"
              : "text-right"
          }`}
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-4 gold-text-shimmer">
            {candidateConfig.name}
          </h1>
          <div
            className={`h-1.5 w-48 gold-shimmer mb-6 ${
              isCenter
                ? "mx-auto"
                : isLeft
                ? "ml-0"
                : "ml-auto"
            }`}
          ></div>
          <p className="text-lg md:text-xl text-white">
            {content.hero.designation}
          </p>
        </div>
      </div>
    </section>
  );
}

