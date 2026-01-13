import { NextResponse } from "next/server";
import { candidateConfig } from "@/config/candidate.config";

export async function GET() {
  // Return Firebase config for service worker
  const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: `${candidateConfig.firebaseConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bar-council-8a238"}.firebaseapp.com`,
    projectId: candidateConfig.firebaseConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bar-council-8a238",
    storageBucket: `${candidateConfig.firebaseConfig?.projectId || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "bar-council-8a238"}.appspot.com`,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  };

  return NextResponse.json(config, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
}
