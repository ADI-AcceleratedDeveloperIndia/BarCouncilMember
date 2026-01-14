import { NextRequest, NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
let firebaseAdminInitialized = false;

function initializeFirebaseAdmin() {
  if (firebaseAdminInitialized || admin.apps.length > 0) {
    firebaseAdminInitialized = true;
    return;
  }

  try {
    let serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT;
    
    if (!serviceAccountJson) {
      console.error("FIREBASE_SERVICE_ACCOUNT not found");
      return;
    }

    serviceAccountJson = serviceAccountJson.trim();
    if (
      (serviceAccountJson.startsWith('"') && serviceAccountJson.endsWith('"')) ||
      (serviceAccountJson.startsWith("'") && serviceAccountJson.endsWith("'"))
    ) {
      serviceAccountJson = serviceAccountJson.slice(1, -1);
      serviceAccountJson = serviceAccountJson.replace(/\\"/g, '"').replace(/\\'/g, "'");
    }

    const serviceAccount = JSON.parse(serviceAccountJson);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    firebaseAdminInitialized = true;
    console.log("✅ Firebase Admin initialized for test");
  } catch (error: any) {
    console.error("❌ Firebase init error:", error.message);
  }
}

initializeFirebaseAdmin();

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return NextResponse.json({
      error: "Please provide token parameter",
      example: "/api/test-notification?token=YOUR_FCM_TOKEN"
    });
  }

  if (!firebaseAdminInitialized || !admin.apps.length) {
    return NextResponse.json({
      error: "Firebase Admin SDK not initialized",
      check: "FIREBASE_SERVICE_ACCOUNT environment variable"
    });
  }

  try {
    const message = {
      token: token,
      notification: {
        title: "Test Notification",
        body: "This is a test from the API",
      },
      webpush: {
        notification: {
          title: "Test Notification",
          body: "This is a test from the API",
        },
        fcmOptions: {
          link: "/",
        },
      },
    };

    const response = await admin.messaging().send(message);
    
    return NextResponse.json({
      success: true,
      message: "Notification sent successfully!",
      firebaseResponse: response,
      tokenUsed: token.substring(0, 30) + "..."
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.code,
      errorDetails: error.errorInfo || null,
      tokenUsed: token.substring(0, 30) + "...",
      hint: getErrorHint(error.code)
    });
  }
}

function getErrorHint(errorCode: string): string {
  switch (errorCode) {
    case "messaging/invalid-registration-token":
      return "Token is invalid. User needs to re-subscribe.";
    case "messaging/registration-token-not-registered":
      return "Token expired or user unsubscribed. Remove from database.";
    case "messaging/invalid-argument":
      return "Invalid message format or token format.";
    case "messaging/authentication-error":
      return "Firebase service account credentials are wrong.";
    case "messaging/mismatched-credential":
      return "Token was created with a DIFFERENT Firebase project! Check VAPID key and project ID match.";
    default:
      return "Unknown error. Check Firebase console for more details.";
  }
}
