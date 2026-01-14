import { NextResponse } from "next/server";
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

export async function GET() {
  try {
    const spreadsheetId = candidateConfig.googleSheetId;
    const sheetName = "Push Notification Subscribers";

    console.log("📊 Getting subscriber count from sheet:", sheetName);
    console.log("📊 Sheet ID:", spreadsheetId);

    // Read all tokens from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!B2:B`, // Column B (FCM Token), starting from row 2
    });

    const rows = response.data.values || [];
    console.log("📊 Rows found:", rows.length);
    
    let count = 0;

    rows.forEach((row, index) => {
      const token = row[0]?.toString().trim();
      console.log(`📊 Row ${index + 2}: token length = ${token?.length || 0}`);
      if (token && token.length > 50) {
        // FCM tokens are long strings, filter out empty/short values
        count++;
      }
    });

    console.log("📊 Final count:", count);
    
    return NextResponse.json({ 
      count,
      debug: {
        sheetName,
        rowsFound: rows.length,
        sheetId: spreadsheetId
      }
    });
  } catch (error: any) {
    console.error("❌ Error getting subscriber count:", error);
    return NextResponse.json({ 
      count: 0, 
      error: error.message || "Failed to get count",
      sheetId: candidateConfig.googleSheetId
    });
  }
}
