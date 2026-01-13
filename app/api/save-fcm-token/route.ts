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
    console.log(`📊 Checking if sheet "${sheetName}" exists...`);
    
    // Check if sheet exists
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    });

    const sheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === sheetName
    );

    if (!sheetExists) {
      console.log(`📝 Sheet "${sheetName}" not found, attempting to create...`);
      
      try {
        // Create the sheet
        const createResponse = await sheets.spreadsheets.batchUpdate({
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

        console.log(`✅ Sheet "${sheetName}" created successfully`);

        // Wait a moment for sheet to be ready
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:C1`,
          valueInputOption: "RAW",
          requestBody: {
            values: [["Timestamp", "FCM Token", "Status"]],
          },
        });

        console.log(`✅ Headers added to "${sheetName}"`);
      } catch (createError: any) {
        // If creation fails, provide helpful message
        console.error("❌ Failed to create sheet automatically:", createError);
        throw new Error(
          `Could not create "${sheetName}" sheet automatically. Please create it manually: 1) Click "+" at bottom to add new sheet, 2) Rename to "Push Notification Subscribers", 3) Add headers in row 1: Timestamp | FCM Token | Status. Error: ${createError.message}`
        );
      }
    } else {
      console.log(`✅ Sheet "${sheetName}" already exists`);
      
      // Verify headers exist
      try {
        const headers = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: `${sheetName}!A1:C1`,
        });
        
        if (!headers.data.values || headers.data.values.length === 0) {
          console.log(`📝 Headers missing, adding them...`);
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${sheetName}!A1:C1`,
            valueInputOption: "RAW",
            requestBody: {
              values: [["Timestamp", "FCM Token", "Status"]],
            },
          });
          console.log(`✅ Headers added`);
        }
      } catch (headerError) {
        console.warn("⚠️  Could not verify/add headers:", headerError);
      }
    }
  } catch (error: any) {
    console.error("❌ Error ensuring sheet exists:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
    });
    
    // If it's a permissions error, provide helpful message
    if (error.code === 403 || error.message?.includes("permission")) {
      throw new Error(
        `Permission denied. Please share the Google Sheet with the service account email: ${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || "your-service-account@...iam.gserviceaccount.com"} with Editor access.`
      );
    }
    
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
    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Push Notification Subscribers!A:C",
        valueInputOption: "RAW",
        requestBody: {
          values: [[timestamp, token, "Active"]],
        },
      });
    } catch (appendError: any) {
      console.error("❌ Error appending to sheet:", appendError);
      // Try with exact sheet name match (case-sensitive)
      if (appendError.message?.includes("Unable to parse range")) {
        // Sheet name might have different case or spaces
        throw new Error(
          `Sheet name mismatch. Please verify the sheet tab is named exactly "Push Notification Subscribers" (case-sensitive, no extra spaces). Error: ${appendError.message}`
        );
      }
      throw appendError;
    }

    console.log("✅ FCM token saved successfully to Google Sheets");
    return NextResponse.json({ success: true, message: "Token saved successfully" });
  } catch (error: any) {
    console.error("❌ Error saving FCM token:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
    });
    
    // Provide more specific error messages
    let errorMessage = error.message || "Unknown error";
    let errorDetails = "";
    
    if (error.code === 403 || error.message?.includes("permission") || error.message?.includes("403")) {
      errorMessage = "Permission denied";
      errorDetails = `The Google Sheets service account (${process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL}) does not have access to the Google Sheet. Please share the sheet with this email address with Editor permission.`;
    } else if (error.code === 404 || error.message?.includes("not found")) {
      errorMessage = "Google Sheet not found";
      errorDetails = `Could not find the Google Sheet. Please verify the Sheet ID is correct: ${candidateConfig.googleSheetId}`;
    } else if (error.message?.includes("invalid_grant") || error.message?.includes("unauthorized")) {
      errorMessage = "Authentication failed";
      errorDetails = "The Google Sheets service account credentials are invalid. Please check GOOGLE_SERVICE_ACCOUNT_EMAIL and GOOGLE_PRIVATE_KEY in Vercel.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails || error.message || "Unknown error",
        serviceAccountEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        sheetId: candidateConfig.googleSheetId,
      },
      { status: 500 }
    );
  }
}
