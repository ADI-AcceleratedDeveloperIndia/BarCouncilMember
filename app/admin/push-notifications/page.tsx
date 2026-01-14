"use client";

import { useState, useEffect } from "react";
import { candidateConfig } from "@/config/candidate.config";
import AdminProtection from "@/components/AdminProtection";

function PushNotificationSender() {
  const [title, setTitle] = useState("Important Bar Council News");
  const [message, setMessage] = useState("Sl.No.15 Ashok Goud Ponnam - write ONE");
  const [sendToAll, setSendToAll] = useState(true);
  const [customTokens, setCustomTokens] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    successCount?: number;
    failureCount?: number;
    totalTokens?: number;
    failedTokens?: string[];
  } | null>(null);

  // Fetch subscriber count on mount (reads from sheet cell A1)
  useEffect(() => {
    fetchSubscriberCount();
    // Refresh count every 10 seconds
    const interval = setInterval(fetchSubscriberCount, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchSubscriberCount = async () => {
    try {
      const response = await fetch("/api/get-subscriber-count");
      const data = await response.json();
      setSubscriberCount(data.count || 0);
    } catch (error) {
      console.error("Error fetching subscriber count:", error);
      // Don't set to 0 on error, keep previous value
    }
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Please enter both title and message");
      return;
    }

    setIsSending(true);
    setResult(null);

    try {
      const payload: any = {
        title: title.trim(),
        body: message.trim(),
        sendToAll: sendToAll,
      };

      if (!sendToAll && customTokens.trim()) {
        // Parse tokens (one per line or comma-separated)
        const tokens = customTokens
          .split(/[,\n]/)
          .map((t) => t.trim())
          .filter((t) => t.length > 50);
        payload.tokens = tokens;
      }

      const response = await fetch("/api/send-push-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: data.success,
          message: data.message,
          successCount: data.successCount,
          failureCount: data.failureCount,
          totalTokens: data.totalTokens,
          failedTokens: data.failedTokens,
        });
      } else {
        setResult({
          success: false,
          message: data.error || "Failed to send notification",
        });
      }
    } catch (error: any) {
      setResult({
        success: false,
        message: error.message || "Error sending notification",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gold gold-text-shimmer mb-2">
              Send Push Notifications
            </h1>
            <p className="text-gray-400">
              Send push notifications to all subscribers or specific users
            </p>
          </div>
          <div className="bg-gold/20 border border-gold rounded-lg px-4 py-3 text-center">
            <div className="text-2xl sm:text-3xl font-bold text-gold">
              {subscriberCount !== null ? subscriberCount : "..."}
            </div>
            <div className="text-xs sm:text-sm text-gray-300 mt-1">
              Subscribers
            </div>
          </div>
        </div>

        {/* Notification Form */}
        <div className="bg-gray-900 border border-gold rounded-lg p-6 mb-6">
          <div className="mb-6">
            <label className="block text-gold font-semibold mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 bg-black border border-gold rounded text-white focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Enter notification title"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gold font-semibold mb-2">
              Notification Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-black border border-gold rounded text-white focus:outline-none focus:ring-2 focus:ring-gold resize-none"
              placeholder="Enter notification message"
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center text-gold font-semibold mb-2">
              <input
                type="checkbox"
                checked={sendToAll}
                onChange={(e) => setSendToAll(e.target.checked)}
                className="mr-2 w-4 h-4"
              />
              Send to All Subscribers
            </label>
            <p className="text-sm text-gray-400 mt-1">
              {sendToAll
                ? "Will send to all FCM tokens stored in Google Sheets"
                : "Enter specific FCM tokens below"}
            </p>
          </div>

          {!sendToAll && (
            <div className="mb-6">
              <label className="block text-gold font-semibold mb-2">
                FCM Tokens (one per line or comma-separated)
              </label>
              <textarea
                value={customTokens}
                onChange={(e) => setCustomTokens(e.target.value)}
                rows={6}
                className="w-full px-4 py-2 bg-black border border-gold rounded text-white focus:outline-none focus:ring-2 focus:ring-gold font-mono text-sm resize-none"
                placeholder="Paste FCM tokens here, one per line or comma-separated"
              />
              <p className="text-xs text-gray-400 mt-2">
                Get tokens from Google Sheets → &quot;Push Notification Subscribers&quot; → Column B
              </p>
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={isSending}
            className={`w-full px-6 py-3 rounded-lg font-bold text-lg transition-all ${
              isSending
                ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                : "bg-gold text-black hover:bg-yellow-400 gold-glow-hover active:scale-95"
            }`}
          >
            {isSending ? "Sending..." : "Send Push Notification"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div
            className={`border rounded-lg p-6 ${
              result.success
                ? "bg-green-900/30 border-green-500 text-green-400"
                : "bg-red-900/30 border-red-500 text-red-400"
            }`}
          >
            <h3 className="font-bold text-lg mb-2">
              {result.success ? "✅ Success!" : "❌ Error"}
            </h3>
            <p className="mb-2">{result.message}</p>
            <div className="mt-4 text-sm">
              <p>Successfully sent: {result.successCount || 0}</p>
              <p>Failed: {result.failureCount || 0}</p>
              <p>Total tokens: {result.totalTokens || 0}</p>
              {result.failedTokens && result.failedTokens.length > 0 && (
                <div className="mt-3 pt-3 border-t border-red-700">
                  <p className="font-bold text-red-300 mb-2">Error Details:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    {result.failedTokens.map((failed, index) => (
                      <li key={index} className="break-all">{failed}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-8 bg-gray-900 border border-gold rounded-lg p-6">
          <h2 className="text-xl font-bold text-gold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>
              <strong className="text-gold">Send to All:</strong> Check &quot;Send to All
              Subscribers&quot; to send to everyone who has subscribed to push notifications.
              Tokens are automatically fetched from Google Sheets.
            </li>
            <li>
              <strong className="text-gold">Send to Specific Users:</strong> Uncheck
              &quot;Send to All Subscribers&quot; and paste FCM tokens (one per line or
              comma-separated) in the text area.
            </li>
            <li>
              <strong className="text-gold">Get FCM Tokens:</strong> Go to Google Sheets
              → &quot;Push Notification Subscribers&quot; sheet → Column B contains all FCM tokens.
            </li>
            <li>
              <strong className="text-gold">Test First:</strong> Send a test notification
              to yourself before sending to all subscribers.
            </li>
          </ol>
        </div>

        {/* Firebase Admin Setup Note */}
        <div className="mt-6 bg-yellow-900/30 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-400 text-sm">
            <strong>Note:</strong> Make sure Firebase Admin SDK is properly configured in
            Vercel environment variables. The API route uses FIREBASE_VAPID_PRIVATE_KEY and
            NEXT_PUBLIC_FIREBASE_PROJECT_ID.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProtectedPushNotificationSender() {
  return (
    <AdminProtection>
      <PushNotificationSender />
    </AdminProtection>
  );
}
