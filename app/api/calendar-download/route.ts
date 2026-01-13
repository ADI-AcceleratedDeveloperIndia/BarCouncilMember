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
  const sheetName = "Calendar Downloads";

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
          values: [["Timestamp", "Action", "Permission Granted"]],
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
    const { action, permissionGranted } = body;

    // Ensure sheet exists
    await ensureSheetExists();

    // Get current IST time
    const now = new Date();
    const istTime = new Date(now.getTime() + 5.5 * 60 * 60 * 1000);
    const timestamp = istTime.toISOString().replace("T", " ").substring(0, 19);

    // Append data to sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: candidateConfig.googleSheetId,
      range: "Calendar Downloads!A:C",
      valueInputOption: "RAW",
      requestBody: {
        values: [[timestamp, action, permissionGranted ? "Yes" : "No"]],
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error logging calendar download:", error);
    return NextResponse.json(
      { error: "Failed to log calendar download" },
      { status: 500 }
    );
  }
}
