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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body; // "opened" or "closed_without_vote"

    if (!action || (action !== "opened" && action !== "closed_without_vote")) {
      return NextResponse.json(
        { success: false, error: "Invalid action" },
        { status: 400 }
      );
    }

    // Check if Google Sheets is configured
    const isSheetsConfigured = Boolean(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
        process.env.GOOGLE_PRIVATE_KEY &&
        candidateConfig.googleSheetId &&
        candidateConfig.googleSheetId !== "YOUR_GOOGLE_SHEET_ID"
    );

    if (!isSheetsConfigured) {
      console.warn("Google Sheets not configured for preferential vote tracking");
      return NextResponse.json({
        success: false,
        error: "Sheets not configured",
      }, { status: 500 });
    }

    try {
      const sheets = await getSheetsClient();

      // Check if "Preferential Vote Tracking" sheet exists, create if not
      try {
        await sheets.spreadsheets.values.get({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Preferential Vote Tracking!A1:B1",
        });
      } catch (checkError: any) {
        // Sheet doesn't exist, create it
        if (checkError.message?.includes("Unable to parse range") || checkError.code === 400) {
          console.log("Creating 'Preferential Vote Tracking' sheet...");
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: candidateConfig.googleSheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: "Preferential Vote Tracking",
                    },
                  },
                },
              ],
            },
          });
          
          // Add headers
          await sheets.spreadsheets.values.update({
            spreadsheetId: candidateConfig.googleSheetId,
            range: "Preferential Vote Tracking!A1:B1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: [["Timestamp", "Action"]],
            },
          });
          console.log("Created 'Preferential Vote Tracking' sheet with headers");
        } else {
          throw checkError;
        }
      }

      // Log the action
      const values = [
        [
          new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          action === "opened" ? "Modal Opened" : "Closed Without Vote",
        ],
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Preferential Vote Tracking!A:B",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      console.log(`Successfully logged preferential vote tracking: ${action}`);
    } catch (error: any) {
      console.error("Error saving tracking to Google Sheets:", error);
      return NextResponse.json({
        success: false,
        error: error.message || "Failed to save to Google Sheets",
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing tracking:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process tracking" },
      { status: 500 }
    );
  }
}

