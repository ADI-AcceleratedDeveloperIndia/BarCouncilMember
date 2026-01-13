import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
let firebaseAdminInitialized = false;

function initializeFirebaseAdmin() {
  if (firebaseAdminInitialized) return;

  try {
    let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      console.warn("FIREBASE_SERVICE_ACCOUNT not found, push notifications will not work");
      return;
    }

    // Remove outer quotes if present (common when pasting JSON into Vercel)
    serviceAccountJson = serviceAccountJson.trim();
    if (
      (serviceAccountJson.startsWith('"') && serviceAccountJson.endsWith('"')) ||
      (serviceAccountJson.startsWith("'") && serviceAccountJson.endsWith("'"))
    ) {
      serviceAccountJson = serviceAccountJson.slice(1, -1);
      // Unescape quotes inside the JSON
      serviceAccountJson = serviceAccountJson.replace(/\\"/g, '"').replace(/\\'/g, "'");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    // Validate required fields
    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error("Invalid service account: missing required fields (project_id, private_key, or client_email)");
    }

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      });
      firebaseAdminInitialized = true;
      console.log("✅ Firebase Admin SDK initialized successfully");
      console.log(`   Project ID: ${serviceAccount.project_id}`);
      console.log(`   Client Email: ${serviceAccount.client_email}`);
    }
  } catch (error: any) {
    console.error("❌ Error initializing Firebase Admin SDK:", error.message);
    if (error instanceof SyntaxError) {
      console.error("   This is a JSON parsing error. Check if FIREBASE_SERVICE_ACCOUNT is valid JSON.");
    }
  }
}

// Initialize on module load
initializeFirebaseAdmin();

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

async function getAllFCMTokens(): Promise<string[]> {
  try {
    const spreadsheetId = candidateConfig.googleSheetId;
    const sheetName = "Push Notification Subscribers";

    // Read all tokens from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetName}!B2:B`, // Column B (FCM Token), starting from row 2
    });

    const rows = response.data.values || [];
    const tokens: string[] = [];

    rows.forEach((row) => {
      const token = row[0]?.toString().trim();
      if (token && token.length > 50) {
        // FCM tokens are long strings, filter out empty/short values
        tokens.push(token);
      }
    });

    return tokens;
  } catch (error) {
    console.error("Error reading FCM tokens from Google Sheets:", error);
    return [];
  }
}

async function sendFCMNotification(token: string, title: string, body: string): Promise<boolean> {
  try {
    if (!firebaseAdminInitialized || !admin.apps.length) {
      throw new Error("Firebase Admin SDK not initialized. Please add FIREBASE_SERVICE_ACCOUNT to environment variables.");
    }

    // Use Firebase Admin SDK to send notification
    const message = {
      token: token,
      notification: {
        title: title,
        body: body,
      },
      webpush: {
        notification: {
          title: title,
          body: body,
          icon: "/A-logo.png",
          badge: "/A-logo.png",
        },
        fcmOptions: {
          link: "/",
        },
      },
    };

    const response = await admin.messaging().send(message);
    
    console.log("Successfully sent message:", response);
    return true;
  } catch (error: any) {
    console.error(`Error sending FCM notification to token:`, error.message);
    
    // Check if token is invalid/expired
    if (error.code === "messaging/invalid-registration-token" || 
        error.code === "messaging/registration-token-not-registered") {
      console.log("Token is invalid or expired, should be removed from database");
    }
    
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, body: messageBody, tokens: customTokens, sendToAll } = body;

    if (!title || !messageBody) {
      return NextResponse.json(
        { error: "Title and body are required" },
        { status: 400 }
      );
    }

    if (!firebaseAdminInitialized || !admin.apps.length) {
      return NextResponse.json(
        {
          error: "Firebase Admin SDK not initialized",
          message: "Please add FIREBASE_SERVICE_ACCOUNT to Vercel environment variables. See HOW_TO_CREATE_SERVICE_ACCOUNT.md for instructions.",
        },
        { status: 500 }
      );
    }

    let targetTokens: string[] = [];

    if (sendToAll) {
      // Get all tokens from Google Sheets
      targetTokens = await getAllFCMTokens();
      
      if (targetTokens.length === 0) {
        return NextResponse.json(
          { error: "No FCM tokens found in Google Sheets. Make sure users have subscribed to push notifications." },
          { status: 400 }
        );
      }
    } else if (customTokens && Array.isArray(customTokens)) {
      // Use provided tokens
      targetTokens = customTokens.filter((token) => token && token.length > 50);
    } else {
      return NextResponse.json(
        { error: "Either sendToAll must be true or tokens array must be provided" },
        { status: 400 }
      );
    }

    // Send to all tokens
    let successCount = 0;
    let failureCount = 0;
    const failedTokens: string[] = [];

    // Send in batches to avoid overwhelming the API
    const batchSize = 100;
    for (let i = 0; i < targetTokens.length; i += batchSize) {
      const batch = targetTokens.slice(i, i + batchSize);
      
      const sendPromises = batch.map(async (token) => {
        const success = await sendFCMNotification(token, title, messageBody);
        if (success) {
          successCount++;
        } else {
          failureCount++;
          failedTokens.push(token);
        }
      });

      await Promise.all(sendPromises);
      
      // Small delay between batches to avoid rate limits
      if (i + batchSize < targetTokens.length) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount} notifications successfully`,
      successCount,
      failureCount,
      totalTokens: targetTokens.length,
      failedTokens: failedTokens.length > 0 ? failedTokens.slice(0, 10) : undefined, // Return first 10 failed tokens
    });
  } catch (error: any) {
    console.error("Error sending push notification:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send push notification" },
      { status: 500 }
    );
  }
}
