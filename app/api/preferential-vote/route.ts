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

// Setup summary sheet with formulas
async function setupSummarySheet(sheets: any) {
  try {
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
    await sheets.spreadsheets.values.update({
      spreadsheetId: candidateConfig.googleSheetId,
      range: "Preferential Votes Summary!A1:C1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["Preferential Order", "Count", "Percentage"]],
      },
    });

    // Add formulas for each order (1-24)
    const formulas: any[][] = [];
    for (let order = 1; order <= 24; order++) {
      const rowNum = order + 1; // Row number (2-25)
      formulas.push([
        order,
        `=COUNTIF('Preferential Votes'!B:B, ${order})`,
        `=IF(SUM(B2:B25)=0, 0, ROUND((B${rowNum}/SUM(B2:B25))*100, 2))`,
      ]);
    }

    await sheets.spreadsheets.values.update({
      spreadsheetId: candidateConfig.googleSheetId,
      range: "Preferential Votes Summary!A2:C25",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: formulas },
    });

    // Add total row
    await sheets.spreadsheets.values.update({
      spreadsheetId: candidateConfig.googleSheetId,
      range: "Preferential Votes Summary!A26:C26",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [["TOTAL", "=SUM(B2:B25)", "100%"]],
      },
    });

    console.log("Created 'Preferential Votes Summary' sheet with formulas");
  } catch (error: any) {
    console.error("Error creating summary sheet:", error);
    // Don't throw - summary sheet is optional
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { preferentialOrder } = body;

    if (!preferentialOrder || preferentialOrder < 1 || preferentialOrder > 24) {
      return NextResponse.json(
        { success: false, error: "Invalid preferential order" },
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
      console.warn("Google Sheets not configured for preferential votes");
      return NextResponse.json({
        success: false,
        error: "Sheets not configured",
      }, { status: 500 });
    }

    try {
      const sheets = await getSheetsClient();

      // First, check if "Preferential Votes" sheet exists, create if not
      try {
        // Try to read the sheet to check if it exists
        await sheets.spreadsheets.values.get({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Preferential Votes!A1:B1",
        });
      } catch (checkError: any) {
        // Sheet doesn't exist, create it
        if (checkError.message?.includes("Unable to parse range") || checkError.code === 400) {
          console.log("Creating 'Preferential Votes' sheet...");
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId: candidateConfig.googleSheetId,
            requestBody: {
              requests: [
                {
                  addSheet: {
                    properties: {
                      title: "Preferential Votes",
                    },
                  },
                },
              ],
            },
          });
          
          // Add headers
          await sheets.spreadsheets.values.update({
            spreadsheetId: candidateConfig.googleSheetId,
            range: "Preferential Votes!A1:B1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: [["Timestamp", "Preferential Order"]],
            },
          });
          console.log("Created 'Preferential Votes' sheet with headers");
          
          // Also create summary sheet
          await setupSummarySheet(sheets);
        } else {
          throw checkError;
        }
      }
      
      // Check if summary sheet exists, create if not
      try {
        await sheets.spreadsheets.values.get({
          spreadsheetId: candidateConfig.googleSheetId,
          range: "Preferential Votes Summary!A1",
        });
      } catch (summaryError: any) {
        // Summary sheet doesn't exist, create it
        if (summaryError.message?.includes("Unable to parse range") || summaryError.code === 400) {
          await setupSummarySheet(sheets);
        }
      }

      // Log to "Preferential Votes" sheet
      // Sheet structure: Timestamp | Preferential Order
      const values = [
        [
          new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          preferentialOrder,
        ],
      ];

      await sheets.spreadsheets.values.append({
        spreadsheetId: candidateConfig.googleSheetId,
        range: "Preferential Votes!A:B",
        valueInputOption: "USER_ENTERED",
        requestBody: { values },
      });

      console.log(`Successfully logged preferential vote: Order ${preferentialOrder}`);

      // Also log "Voted" to Preferential Vote Tracking sheet
      try {
        // Get all sheets to check for existing or conflicted sheets (same logic as tracking route)
        const spreadsheet = await sheets.spreadsheets.get({
          spreadsheetId: candidateConfig.googleSheetId,
        });

        const sheetTitles = spreadsheet.data.sheets?.map((sheet) => sheet.properties?.title) || [];
        const exactSheetName = "Preferential Vote Tracking";
        const conflictedSheet = sheetTitles.find((title) => 
          title?.includes("Preferential Vote Tracking") && title !== exactSheetName
        );

        // Check if exact sheet exists
        let sheetExists = sheetTitles.includes(exactSheetName);
        let sheetNameToUse = exactSheetName;

        // If conflicted sheet exists, delete it (regardless of whether exact sheet exists)
        if (conflictedSheet) {
          console.log(`Found conflicted sheet: ${conflictedSheet}, deleting it...`);
          const conflictedSheetId = spreadsheet.data.sheets?.find(
            (s) => s.properties?.title === conflictedSheet
          )?.properties?.sheetId;

          if (conflictedSheetId !== undefined) {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: candidateConfig.googleSheetId,
              requestBody: {
                requests: [
                  {
                    deleteSheet: {
                      sheetId: conflictedSheetId,
                    },
                  },
                ],
              },
            });
            console.log(`Deleted conflicted sheet: ${conflictedSheet}`);
            // Refresh sheet list after deletion
            const updatedSpreadsheet = await sheets.spreadsheets.get({
              spreadsheetId: candidateConfig.googleSheetId,
            });
            const updatedSheetTitles = updatedSpreadsheet.data.sheets?.map((sheet) => sheet.properties?.title) || [];
            sheetExists = updatedSheetTitles.includes(exactSheetName);
          }
        }

        // Check if sheet exists, create if not
        if (!sheetExists) {
          try {
            await sheets.spreadsheets.values.get({
              spreadsheetId: candidateConfig.googleSheetId,
              range: `${exactSheetName}!A1:B1`,
            });
            sheetExists = true;
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
                          title: exactSheetName,
                        },
                      },
                    },
                  ],
                });
              
              // Add headers
              await sheets.spreadsheets.values.update({
                spreadsheetId: candidateConfig.googleSheetId,
                range: `${exactSheetName}!A1:B1`,
                valueInputOption: "USER_ENTERED",
                requestBody: {
                  values: [["Timestamp", "Action"]],
                },
              });
              console.log("Created 'Preferential Vote Tracking' sheet with headers");
              sheetExists = true;
            } else {
              throw checkError;
            }
          }
        }

        // Log "Voted" action
        const trackingValues = [
          [
            new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            "Voted",
          ],
        ];

        await sheets.spreadsheets.values.append({
          spreadsheetId: candidateConfig.googleSheetId,
          range: `${sheetNameToUse}!A:B`,
          valueInputOption: "USER_ENTERED",
          requestBody: { values: trackingValues },
        });

        console.log(`✅ Successfully logged "Voted" to Preferential Vote Tracking sheet`);
      } catch (trackingError: any) {
        // Don't fail the vote if tracking fails, but log the error clearly
        console.error("❌ Error logging 'Voted' to tracking sheet:", trackingError);
        console.error("Error details:", {
          message: trackingError.message,
          code: trackingError.code,
          response: trackingError.response?.data,
        });
      }
    } catch (error: any) {
      console.error("Error saving preferential vote to Google Sheets:", error);
      return NextResponse.json({
        success: false,
        error: error.message || "Failed to save to Google Sheets",
      }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing preferential vote:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process vote" },
      { status: 500 }
    );
  }
}

