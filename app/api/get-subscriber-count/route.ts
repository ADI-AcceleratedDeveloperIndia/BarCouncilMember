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

    // Read count from cell D1 (where user will add COUNT formula - doesn't interfere with Timestamp column)
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!D1`, // Read from D1 where COUNT formula should be
    });

    const values = response.data.values || [];
    const countValue = values[0]?.[0];
    
    // Parse the count (handle if it's a number or string)
    const count = countValue ? parseInt(countValue.toString(), 10) : 0;
    
    console.log("📊 Count from sheet A1:", count);
    
    return NextResponse.json({ 
      count: isNaN(count) ? 0 : count,
      source: "sheet_formula",
      debug: {
        sheetName,
        cell: "D1",
        rawValue: countValue,
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
