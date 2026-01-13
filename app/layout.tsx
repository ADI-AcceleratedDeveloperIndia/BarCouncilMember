import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/LanguageContext";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";

export const metadata: Metadata = {
  title: "Telangana State Bar Council - Member Election",
  description: "Support for Member – Telangana State Bar Council",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <ServiceWorkerRegistration />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
