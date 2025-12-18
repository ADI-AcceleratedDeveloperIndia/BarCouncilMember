"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navigation() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navItems = {
    en: {
      home: "Home",
      vision: "Vision",
      mission: "Mission",
      contact: "Contact",
    },
    te: {
      home: "హోమ్",
      vision: "దృష్టికోణం",
      mission: "లక్ష్యం",
      contact: "సంప్రదింపు",
    },
  };

  // Use default language during SSR to prevent hydration mismatch
  const currentLanguage = mounted ? language : "en";
  const items = navItems[currentLanguage];

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-black border-b border-gold/20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-center gap-6 md:gap-8">
          <Link
            href="/"
            className={`text-sm md:text-base font-semibold transition ${
              pathname === "/"
                ? "text-gold border-b-2 border-gold pb-1"
                : "text-white hover:text-gold"
            }`}
          >
            {items.home}
          </Link>
          <span className="text-gold">|</span>
          <Link
            href="/vision"
            className={`text-sm md:text-base font-semibold transition ${
              pathname === "/vision"
                ? "text-gold border-b-2 border-gold pb-1"
                : "text-white hover:text-gold"
            }`}
          >
            {items.vision}
          </Link>
          <span className="text-gold">|</span>
          <Link
            href="/mission"
            className={`text-sm md:text-base font-semibold transition ${
              pathname === "/mission"
                ? "text-gold border-b-2 border-gold pb-1"
                : "text-white hover:text-gold"
            }`}
          >
            {items.mission}
          </Link>
          <span className="text-gold">|</span>
          <Link
            href="/contact"
            className={`text-sm md:text-base font-semibold transition ${
              pathname === "/contact"
                ? "text-gold border-b-2 border-gold pb-1"
                : "text-white hover:text-gold"
            }`}
          >
            {items.contact}
          </Link>
        </div>
      </div>
    </nav>
  );
}

