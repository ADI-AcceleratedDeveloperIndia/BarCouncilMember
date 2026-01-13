import { NextRequest, NextResponse } from "next/server";
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

async function ensureSheetExists() {
  const spreadsheetId = candidateConfig.googleSheetId;
  const sheetName = "Push Notification Subscribers";

  try {
    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === sheetName
    );

    if (!sheetExists) {
      // Create the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetName,
                },
              },
            },
          ],
        },
      });

      // Add headers
      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: `${sheetName}!A1`,
        valueInputOption: "RAW",
        requestBody: {
          values: [["Timestamp", "FCM Token", "Status"]],
        },
      });
    }
  } catch (error) {
    console.error("Error ensuring sheet exists:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      console.error("❌ FCM token missing in request");
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    console.log("📝 Saving FCM token to Google Sheets...");

    // Ensure sheet exists
    await ensureSheetExists();
    console.log("✅ Sheet 'Push Notification Subscribers' exists");

    // Check if token already exists (avoid duplicates)
    try {
      const existingTokens = await sheets.spreadsheets.values.get({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Push Notification Subscribers!B2:B",
      });

      const rows = existingTokens.data.values || [];
      const tokenExists = rows.some((row) => row[0]?.toString().trim() === token);

      if (tokenExists) {
        console.log("ℹ️  FCM token already exists in sheet, skipping duplicate");
        return NextResponse.json({ success: true, message: "Token already exists" });
      }
    } catch (error) {
      console.warn("⚠️  Could not check for existing token, proceeding to add:", error);
    }

    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const timestamp = istTime.toISOString().replace("T", " ").substring(0, 19);

    // Append data to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: candidateConfig.googleSheetId,
      range: "Push Notification Subscribers!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[timestamp, token, "Active"]],
      },
    });

    console.log("✅ FCM token saved successfully to Google Sheets");
    return NextResponse.json({ success: true, message: "Token saved successfully" });
  } catch (error: any) {
    console.error("❌ Error saving FCM token:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      stack: error.stack,
    });
    return NextResponse.json(
      { 
        error: "Failed to save FCM token",
        details: error.message || "Unknown error"
      },
      { status: 500 }
    );
  }
}
