import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Helper function to parse private key (handles quotes and newlines)
function parsePrivateKey(privateKey: string | undefined): string | undefined {
  if (!privateKey) return undefined;
  
  // Remove quotes if present
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }
  
  // Replace literal \n with actual newlines
  privateKey = privateKey.replace(/\\n/g, "\n");
  
  return privateKey;
}

// Initialize Google Sheets API
function getSheetsClient() {
  const privateKey = parsePrivateKey(process.env.GOOGLE_PRIVATE_KEY);
  
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({ version: "v4", auth });
}

const sheets = getSheetsClient();

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
    // Handle both JSON and FormData (from sendBeacon) requests
    let body: any;
    const contentType = request.headers.get("content-type");
    
    if (contentType?.includes("application/json")) {
      body = await request.json();
    } else if (contentType?.includes("multipart/form-data")) {
      // Handle FormData from sendBeacon
      const formData = await request.formData();
      const dataString = formData.get("data") as string;
      body = JSON.parse(dataString);
    } else {
      // Fallback: try to parse as JSON
      try {
        body = await request.json();
      } catch {
        // If that fails, try FormData
        const formData = await request.formData();
        const dataString = formData.get("data") as string;
        body = JSON.parse(dataString);
      }
    }
    
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
