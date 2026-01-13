"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple password check - any password works for now
    if (password.trim().length > 0) {
      // Store in sessionStorage to maintain session
      if (typeof window !== "undefined") {
        sessionStorage.setItem("adminAuthenticated", "true");
      }
      // Redirect to admin dashboard or push notifications page
      router.push("/admin/push-notifications");
    } else {
      setError("Please enter a password");
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 border-2 border-gold rounded-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gold gold-text-shimmer mb-2 text-center">
          Admin Login
        </h1>
        <p className="text-gray-400 text-center mb-6">
          Enter password to access admin panel
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gold font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              className="w-full px-4 py-3 bg-black border border-gold rounded text-white focus:outline-none focus:ring-2 focus:ring-gold"
              placeholder="Enter admin password"
              autoFocus
            />
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gold text-black font-bold rounded-lg hover:bg-yellow-400 gold-glow-hover active:scale-95 transition-all"
          >
            Login
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            Admin Pages:
          </p>
          <div className="mt-2 space-y-1">
            <a
              href="/admin/push-notifications"
              className="text-gold hover:text-yellow-400 text-sm block"
            >
              Push Notifications
            </a>
            <a
              href="/admin/whatsapp"
              className="text-gold hover:text-yellow-400 text-sm block"
            >
              WhatsApp Bulk Sender
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
