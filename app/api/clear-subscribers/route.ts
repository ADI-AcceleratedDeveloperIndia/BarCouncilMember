import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Helper function to parse private key
function parsePrivateKey(privateKey: string | undefined): string | undefined {
  if (!privateKey) return undefined;
  if (
    (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
    (privateKey.startsWith("'") && privateKey.endsWith("'"))
  ) {
    privateKey = privateKey.slice(1, -1);
  }
  privateKey = privateKey.replace(/\\n/g, "\n");
  return privateKey;
}

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

export async function POST(request: NextRequest) {
  try {
    const sheets = getSheetsClient();
    const spreadsheetId = candidateConfig.googleSheetId;
    const sheetName = "Push Notification Subscribers";

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!A:C`,
    });

    const rows = response.data.values || [];
    
    if (rows.length <= 1) {
      return NextResponse.json({ 
        success: true, 
        message: "Sheet is already empty",
        clearedCount: 0
      });
    }

    const lastRow = rows.length;
    
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: `${sheetName}!A2:C${lastRow}`,
    });

    const clearedCount = rows.length - 1;

    return NextResponse.json({ 
      success: true, 
      message: `Cleared ${clearedCount} subscribers`,
      clearedCount
    });
  } catch (error: any) {
    console.error("Error clearing subscribers:", error);
    return NextResponse.json(
      { error: error.message || "Failed to clear subscribers" },
      { status: 500 }
    );
  }
}

// Also support GET for easy browser access
export async function GET(request: NextRequest) {
  return POST(request);
}
