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

    console.log("📊 Getting subscriber count from sheet cell D1:", sheetName);
    console.log("📊 Sheet ID:", spreadsheetId);

    // Try to read count from cell D1 (formula result)
    let count = 0;
    let source = "api_calculation";
    
    try {
      const formulaResponse = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!D1`,
        valueRenderOption: "FORMATTED_VALUE", // Get the calculated value, not the formula
      });

      const formulaValues = formulaResponse.data.values || [];
      const countValue = formulaValues[0]?.[0];
      
      if (countValue) {
        const parsedCount = parseInt(countValue.toString(), 10);
        if (!isNaN(parsedCount)) {
          count = parsedCount;
          source = "sheet_formula";
          console.log("📊 Count from sheet D1 formula:", count);
        }
      }
    } catch (formulaError) {
      console.warn("⚠️  Could not read formula from D1, calculating in API:", formulaError);
    }

    // Fallback: Calculate count from column B if formula didn't work
    if (count === 0 || source === "api_calculation") {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId,
        range: `${sheetName}!B2:B`, // Column B (FCM Token), starting from row 2
      });

      const rows = response.data.values || [];
      
      rows.forEach((row) => {
        const token = row[0]?.toString().trim();
        if (token && token.length > 50) {
          // FCM tokens are long strings, filter out empty/short values
          count++;
        }
      });
      
      console.log("📊 Count calculated from column B:", count);
    }
    
    return NextResponse.json({ 
      count,
      source,
      debug: {
        sheetName,
        cell: "D1",
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
