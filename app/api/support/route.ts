import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Initialize Google Sheets API
async function getSheetsClient() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (privateKey) {
    // Remove quotes if present
    if (
      (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
      (privateKey.startsWith("'") && privateKey.endsWith("'"))
    ) {
      privateKey = privateKey.slice(1, -1);
    }
    // Replace literal \n with actual newlines
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export async function GET() {
  return NextResponse.json({
    emailSet: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    privateKeySet: !!process.env.GOOGLE_PRIVATE_KEY,
    sheetIdSet: !!candidateConfig.googleSheetId,
    sheetIdValid: candidateConfig.googleSheetId !== "YOUR_GOOGLE_SHEET_ID",
    nodeEnv: process.env.NODE_ENV,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if Google Sheets is configured
    const isSheetsConfigured = Boolean(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
        process.env.GOOGLE_PRIVATE_KEY &&
        candidateConfig.googleSheetId &&
        candidateConfig.googleSheetId !== "YOUR_GOOGLE_SHEET_ID"
    );

    if (!isSheetsConfigured) {
      const missing = [];
      if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL) missing.push("EMAIL");
      if (!process.env.GOOGLE_PRIVATE_KEY) missing.push("PRIVATE_KEY");
      if (!candidateConfig.googleSheetId || candidateConfig.googleSheetId === "YOUR_GOOGLE_SHEET_ID") missing.push("SHEET_ID");
      
      console.warn("Google Sheets not configured. Missing:", missing.join(", "));
      return NextResponse.json({ 
        success: false, 
        error: "Sheets not configured", 
        missing 
      }, { status: 500 });
    }

    // Handle image download logging
    if (body.action === "download") {
      // If it's NOT a Strong Support (anonymous), log it to Quick Support sheet
      if (body.supportType !== "Strong Support") {
        try {
          const sheets = await getSheetsClient();
          const values = [
            [
              new Date().toLocaleString("en-IN"),
              "Quick Support",
              "No Details",
              "Image Generated",
              "Image Downloaded",
            ],
          ];

          await sheets.spreadsheets.values.append({
            spreadsheetId: candidateConfig.googleSheetId,
            range: "Quick Support!A:E",
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
          });
          console.log("Successfully logged anonymous download to Quick Support");
        } catch (error: any) {
          console.error("Error logging anonymous download to Quick Support:", error);
          return NextResponse.json({ success: false, error: error.message }, { status: 500 });
        }
        return NextResponse.json({ success: true, message: "Anonymous download logged to Quick Support" });
      }

      try {
        const sheets = await getSheetsClient();
        const values = [
          [
            new Date().toLocaleString("en-IN"),
            body.supportType,
            body.name || "Anonymous",
            body.enrollmentNumber || "N/A",
            body.district || "N/A",
            body.barAssociation || "N/A",
            body.mobileNumber || "N/A",
            body.customMessage || "N/A",
            body.language === "te" ? "Telugu" : "English",
            "Image Downloaded",
            body.format || "PNG",
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Followers!A:K",
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        });
        console.log("Successfully logged to Followers sheet");
      } catch (error: any) {
        console.error("Error logging follower:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
      }

      return NextResponse.json({ success: true });
    }

    // Handle support submissions
    const {
      supportType,
      detailsProvided,
      name,
      enrollmentNumber,
      district,
      barAssociation,
      mobileNumber,
      customMessage,
      language,
    } = body;

    try {
      const sheets = await getSheetsClient();

      if (supportType === "Quick Support") {
        const values = [
          [
            new Date().toLocaleString("en-IN"),
            supportType,
            detailsProvided === "Yes" ? "Details Added" : "No Details",
            "Image Generated",
            "Not Downloaded Yet",
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Quick Support!A:E",
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        });
        console.log("Successfully logged to Quick Support sheet");
      } else if (supportType === "Strong Support") {
        const values = [
          [
            new Date().toLocaleString("en-IN"),
            supportType,
            name || "",
            enrollmentNumber || "",
            district || "",
            barAssociation || "",
            mobileNumber || "",
            customMessage || "",
            language === "te" ? "Telugu" : "English",
            "Image Generated",
            "Not Downloaded Yet",
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Strong Support!A:K",
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        });
        console.log("Successfully logged to Strong Support sheet");
      }
    } catch (error: any) {
      console.error("Error saving to Google Sheets:", error);
      return NextResponse.json({
        success: false,
        error: error.message || "Failed to save to Google Sheets",
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting support:", error);
    // Still return success to not break user flow
    return NextResponse.json({ success: true, error: "Failed to log support" });
  }
}

