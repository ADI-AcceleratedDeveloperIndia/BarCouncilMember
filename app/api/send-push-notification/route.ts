import { NextRequest, NextResponse } from "next/server";
import { google } from "googleapis";
import { candidateConfig } from "@/config/candidate.config";

// Firebase project configuration
const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || candidateConfig.firebaseConfig?.projectId || "";
const serverKey = process.env.FIREBASE_SERVER_KEY || "";

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  },
  scopes: ["https://www.googleapis.com/auth/spreadsheets"],
});

const sheets = google.sheets({ version: "v4", auth });

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
    if (!serverKey) {
      throw new Error("FIREBASE_SERVER_KEY not configured");
    }

    // Use FCM Legacy API (simpler, works with server key)
    const fcmUrl = "https://fcm.googleapis.com/fcm/send";

    const payload = {
      to: token,
      notification: {
        title: title,
        body: body,
        icon: "/A-logo.png",
        badge: "/A-logo.png",
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

    const response = await fetch(fcmUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `key=${serverKey}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `HTTP ${response.status}`);
    }

    const result = await response.json();
    
    // Check if message was sent successfully
    if (result.success === 1 || result.message_id) {
      return true;
    }
    
    return false;
  } catch (error: any) {
    console.error(`Error sending FCM notification to token:`, error.message);
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

    if (!serverKey) {
      return NextResponse.json(
        {
          error: "FIREBASE_SERVER_KEY not configured",
          message: "Please add FIREBASE_SERVER_KEY to Vercel environment variables. Get it from Firebase Console → Project Settings → Cloud Messaging → Server Key",
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

    const sendPromises = targetTokens.map(async (token, index) => {
      const success = await sendFCMNotification(token, title, messageBody);
      if (success) {
        successCount++;
      } else {
        failureCount++;
        failedTokens.push(token);
      }
    });

    await Promise.all(sendPromises);

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
