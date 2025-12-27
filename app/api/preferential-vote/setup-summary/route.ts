import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Initialize Google Sheets API
async function getSheetsClient() {
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (privateKey) {
    if (
      (privateKey.startsWith('"') && privateKey.endsWith('"')) ||
      (privateKey.startsWith("'") && privateKey.endsWith("'"))
    ) {
      privateKey = privateKey.slice(1, -1);
    }
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
    const sheets = await getSheetsClient();

    // Check if summary sheet exists
    let summarySheetExists = false;
    try {
      await sheets.spreadsheets.values.get({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Preferential Votes Summary!A1",
      });
      summarySheetExists = true;
    } catch (error: any) {
      // Sheet doesn't exist, will create it
    }

    if (!summarySheetExists) {
      // Create summary sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: candidateConfig.googleSheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: "Preferential Votes Summary",
                },
              },
            },
          ],
        },
      });

      // Add headers
      const headers = [
        ["Preferential Order", "Count", "Percentage", "Status"],
      ];

      await sheets.spreadsheets.values.update({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Preferential Votes Summary!A1:D1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: headers },
      });

      // Add formulas for each order (1-24)
      const formulas: any[][] = [];
      for (let order = 1; order <= 24; order++) {
        formulas.push([
          order,
          `=COUNTIF('Preferential Votes'!B:B, ${order})`,
          `=IF(SUM(B:B)=0, 0, (B${order + 1}/SUM(B:B))*100)`,
          `=IF(B${order + 1}>0, "Active", "")`,
        ]);
      }

      await sheets.spreadsheets.values.update({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Preferential Votes Summary!A2:D25",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: formulas },
      });

      // Add total row
      await sheets.spreadsheets.values.update({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Preferential Votes Summary!A26:D26",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [["TOTAL", "=SUM(B2:B25)", "100%", ""]],
        },
      });

      console.log("Created 'Preferential Votes Summary' sheet with formulas");
    }

    return NextResponse.json({ success: true, message: "Summary sheet ready" });
  } catch (error: any) {
    console.error("Error setting up summary sheet:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

