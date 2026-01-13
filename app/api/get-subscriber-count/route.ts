import { NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

export async function GET() {
  try {
    const spreadsheetId = candidateConfig.googleSheetId;
    const sheetName = "Push Notification Subscribers";

    // Read all tokens from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!B2:B`, // Column B (FCM Token), starting from row 2
    });

    const rows = response.data.values || [];
    let count = 0;

    rows.forEach((row) => {
      const token = row[0]?.toString().trim();
      if (token && token.length > 50) {
        // FCM tokens are long strings, filter out empty/short values
        count++;
      }
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting subscriber count:", error);
    return NextResponse.json({ count: 0, error: "Failed to get count" });
  }
}
