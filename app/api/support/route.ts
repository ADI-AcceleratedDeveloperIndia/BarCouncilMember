import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Initialize Google Sheets API
async function getSheetsClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  return sheets;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Check if Google Sheets is configured
    const isSheetsConfigured =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      candidateConfig.googleSheetId !== "YOUR_GOOGLE_SHEET_ID";

    if (!isSheetsConfigured) {
      // Return success even without sheets (for testing/development)
      // Data won't be logged, but user experience continues
      console.warn("Google Sheets not configured. Support logged but not saved.");
      return NextResponse.json({ success: true, warning: "Sheets not configured" });
    }

    // Handle image download logging
    if (body.action === "download") {
      try {
        const sheets = await getSheetsClient();
        const values = [
          [
            new Date().toISOString(),
            body.supportType || "Unknown",
            body.name || "",
            body.enrollmentNumber || "",
            body.format || "",
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Image Downloads!A:E",
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        });
      } catch (error) {
        console.error("Error logging image download:", error);
        // Continue even if logging fails
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
      language,
    } = body;

    try {
      const sheets = await getSheetsClient();

      if (supportType === "Quick Support") {
        const values = [
          [
            new Date().toISOString(),
            supportType,
            detailsProvided,
            "Yes", // Image Generated
            "No", // Image Downloaded (will be updated on download)
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Quick Support!A:E",
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        });
      } else if (supportType === "Detailed Support") {
        const values = [
          [
            new Date().toISOString(),
            supportType,
            name,
            enrollmentNumber,
            district,
            barAssociation || "",
            language,
            "Yes", // Image Generated
            "No", // Image Downloaded
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Detailed Support!A:I",
          valueInputOption: "USER_ENTERED",
          requestBody: { values },
        });
      }
    } catch (error) {
      console.error("Error saving to Google Sheets:", error);
      // Return success to not break user experience
      // Data just won't be logged
      return NextResponse.json({
        success: true,
        warning: "Support recorded but not saved to sheets",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error submitting support:", error);
    // Still return success to not break user flow
    return NextResponse.json({ success: true, error: "Failed to log support" });
  }
}

