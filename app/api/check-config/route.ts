import { NextResponse } from "next/server";
import { candidateConfig } from "@/config/candidate.config";

export async function GET() {
  try {
    // Get service account project ID
    let serviceAccountProjectId = "not set";
    try {
      const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
      if (serviceAccountJson) {
        let cleaned = serviceAccountJson.trim();
        if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
          cleaned = cleaned.slice(1, -1);
          cleaned = cleaned.replace(/\\"/g, '"').replace(/\\'/g, "'");
        }
        const serviceAccount = JSON.parse(cleaned);
        serviceAccountProjectId = serviceAccount.project_id || "not found in JSON";
      }
    } catch (e) {
      serviceAccountProjectId = "error parsing: " + (e as Error).message;
    }

    const tokenProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || candidateConfig.firebaseConfig?.projectId || "not set";
    const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY || candidateConfig.firebaseConfig?.vapidKey || "not set";
    
    const match = tokenProjectId === serviceAccountProjectId;
    
    return NextResponse.json({
      match,
      tokenProjectId,
      serviceAccountProjectId,
      vapidKey: vapidKey.substring(0, 20) + "...",
      message: match 
        ? "✅ Project IDs match! Tokens and service account are from the same project."
        : "❌ PROJECT ID MISMATCH! Tokens won't work with this service account.",
      recommendation: !match 
        ? `Set NEXT_PUBLIC_FIREBASE_PROJECT_ID to "${serviceAccountProjectId}" in Vercel`
        : "Configuration looks good. If tokens still fail, they might be expired or invalid."
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message || "Failed to check config"
    }, { status: 500 });
  }
}
