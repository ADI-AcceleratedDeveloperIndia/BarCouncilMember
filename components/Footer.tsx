"use client";

import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-6 px-4 bg-black border-t border-gold/20">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-white text-sm flex items-center justify-center gap-2">
          <span>Built by</span>
          <Link
            href="https://aideveloperindia.store"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center hover:opacity-80 transition"
          >
            <Image
              src="/A-logo.png"
              alt="A-logo"
              width={24}
              height={24}
              className="mx-1"
            />
            <span className="text-gold">AI Developer India</span>
          </Link>
        </p>
      </div>
    </footer>
  );
}

