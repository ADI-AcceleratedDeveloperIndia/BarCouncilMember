"use client";

import { useEffect, useState } from "react";
import { getDebugLogs, clearDebugLogs } from "@/lib/notificationManager";

export default function DebugPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [permissionStatus, setPermissionStatus] = useState<string>("checking...");
  const [fcmToken, setFcmToken] = useState<string>("none");

  const refreshLogs = () => {
    setLogs(getDebugLogs());
    
    // Check permission status
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermissionStatus(Notification.permission);
    } else {
      setPermissionStatus("Not supported");
    }
    
    // Check FCM token
    const token = localStorage.getItem("fcmToken");
    setFcmToken(token ? token.substring(0, 30) + "..." : "none");
  };

  useEffect(() => {
    refreshLogs();
    // Auto-refresh every 2 seconds
    const interval = setInterval(refreshLogs, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClearLogs = () => {
    clearDebugLogs();
    setLogs([]);
  };

  const handleClearAll = () => {
    clearDebugLogs();
    localStorage.removeItem("fcmToken");
    localStorage.removeItem("calendarModalHandled");
    localStorage.removeItem("preferentialVoteSubmitted");
    setLogs([]);
    setFcmToken("none");
    alert("All data cleared! Refresh the main page to test again.");
  };

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <h1 className="text-2xl font-bold text-gold mb-4">🔧 Debug Panel</h1>
      
      {/* Status */}
      <div className="bg-gray-900 border border-gold rounded-lg p-4 mb-4">
        <h2 className="text-lg font-bold text-gold mb-2">Status</h2>
        <p><strong>Notification Permission:</strong> 
          <span className={permissionStatus === "granted" ? "text-green-400" : "text-red-400"}>
            {" "}{permissionStatus}
          </span>
        </p>
        <p><strong>FCM Token:</strong> 
          <span className={fcmToken !== "none" ? "text-green-400" : "text-red-400"}>
            {" "}{fcmToken}
          </span>
        </p>
        <p><strong>Service Worker:</strong> 
          <span className="text-yellow-400">
            {" "}{typeof navigator !== "undefined" && "serviceWorker" in navigator ? "Supported" : "Not supported"}
          </span>
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-2 mb-4 flex-wrap">
        <button
          onClick={refreshLogs}
          className="bg-gold text-black px-4 py-2 rounded font-bold"
        >
          🔄 Refresh
        </button>
        <button
          onClick={handleClearLogs}
          className="bg-gray-700 text-white px-4 py-2 rounded font-bold"
        >
          🗑️ Clear Logs
        </button>
        <button
          onClick={handleClearAll}
          className="bg-red-700 text-white px-4 py-2 rounded font-bold"
        >
          ⚠️ Clear All & Reset
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="bg-blue-700 text-white px-4 py-2 rounded font-bold"
        >
          🏠 Go to Home
        </button>
      </div>

      {/* Logs */}
      <div className="bg-gray-900 border border-gold rounded-lg p-4">
        <h2 className="text-lg font-bold text-gold mb-2">Debug Logs ({logs.length})</h2>
        {logs.length === 0 ? (
          <p className="text-gray-400">No logs yet. Go to home page, click Download PDF, and allow notifications.</p>
        ) : (
          <div className="space-y-1 text-sm font-mono">
            {logs.map((log, index) => (
              <div 
                key={index} 
                className={`p-1 rounded ${
                  log.includes("✅") ? "bg-green-900/30 text-green-400" :
                  log.includes("❌") ? "bg-red-900/30 text-red-400" :
                  log.includes("⚠️") ? "bg-yellow-900/30 text-yellow-400" :
                  log.includes("⏳") ? "bg-blue-900/30 text-blue-400" :
                  "text-gray-300"
                }`}
              >
                {log}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-gray-900 border border-gold rounded-lg p-4">
        <h2 className="text-lg font-bold text-gold mb-2">How to Test</h2>
        <ol className="list-decimal list-inside space-y-2 text-gray-300">
          <li>Click &quot;Clear All &amp; Reset&quot; button above</li>
          <li>Click &quot;Go to Home&quot; button</li>
          <li>You should see the Calendar modal</li>
          <li>Click &quot;Download PDF&quot;</li>
          <li>Allow notifications when prompted</li>
          <li>Come back to this page and click &quot;Refresh&quot;</li>
          <li>Check the logs for any errors</li>
        </ol>
      </div>
    </div>
  );
}
