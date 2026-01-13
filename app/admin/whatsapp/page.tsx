"use client";

import { useState } from "react";
import { candidateConfig } from "@/config/candidate.config";
import AdminProtection from "@/components/AdminProtection";

function WhatsAppBulkSender() {
  const [contacts, setContacts] = useState<string[]>([]);
  const [message, setMessage] = useState(
    `Dear Advocate, please cast your first preferential vote for ${candidateConfig.name} in the Telangana State Bar Council elections. Click here: `
  );
  const [websiteUrl, setWebsiteUrl] = useState(
    typeof window !== "undefined" ? window.location.origin : ""
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split("\n").filter((line) => line.trim());
      
      // Try to extract phone numbers from CSV
      const phoneNumbers: string[] = [];
      lines.forEach((line) => {
        // CSV format: might have Name,Phone,Email etc.
        const parts = line.split(",");
        parts.forEach((part) => {
          const trimmed = part.trim().replace(/"/g, "");
          // Check if it looks like a phone number (10 digits, may have +91 or 0 prefix)
          const phoneMatch = trimmed.match(/(\+91|0)?(\d{10})/);
          if (phoneMatch) {
            let phone = phoneMatch[2]; // Get the 10 digits
            // Remove leading 0 if present
            if (phone.startsWith("0")) {
              phone = phone.substring(1);
            }
            // Add +91 prefix
            phoneNumbers.push(`+91${phone}`);
          }
        });
      });
      
      setContacts([...new Set(phoneNumbers)]); // Remove duplicates
    };
    reader.readAsText(file);
  };

  const generateWhatsAppLinks = () => {
    const url = `${websiteUrl}?vote=true`;
    const fullMessage = encodeURIComponent(`${message}${url}`);
    
    return contacts.map((phone) => {
      // Remove + from phone number for WhatsApp link
      const cleanPhone = phone.replace(/\+/g, "");
      return `https://wa.me/${cleanPhone}?text=${fullMessage}`;
    });
  };

  const copyAllLinks = () => {
    const links = generateWhatsAppLinks();
    const linksText = links.join("\n");
    navigator.clipboard.writeText(linksText);
    alert(`Copied ${links.length} WhatsApp links to clipboard!`);
  };

  const downloadLinks = () => {
    const links = generateWhatsAppLinks();
    const linksText = links.join("\n");
    const blob = new Blob([linksText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "whatsapp-links.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const openAllLinks = () => {
    const links = generateWhatsAppLinks();
    // Open first 10 links (to avoid browser blocking)
    links.slice(0, 10).forEach((link, index) => {
      setTimeout(() => {
        window.open(link, "_blank");
      }, index * 1000);
    });
    alert(`Opening first 10 links. For bulk sending, use the copy/download feature and use a WhatsApp automation tool.`);
  };

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gold mb-8 gold-text-shimmer">
          WhatsApp Bulk Sender
        </h1>

        <div className="space-y-6">
          {/* Website URL */}
          <div>
            <label className="block text-gold mb-2 font-semibold">
              Website URL (with ?vote=true parameter):
            </label>
            <input
              type="text"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border-2 border-gold text-white rounded focus:outline-none focus:border-yellow-400"
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-gold mb-2 font-semibold">
              Message:
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full px-4 py-2 bg-gray-900 border-2 border-gold text-white rounded focus:outline-none focus:border-yellow-400"
              placeholder="Enter your message..."
            />
          </div>

          {/* CSV Upload */}
          <div>
            <label className="block text-gold mb-2 font-semibold">
              Upload CSV File with Contacts:
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="w-full px-4 py-2 bg-gray-900 border-2 border-gold text-white rounded file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gold file:text-black hover:file:bg-yellow-400"
            />
            <p className="text-gray-400 text-sm mt-2">
              CSV should contain phone numbers. The tool will extract 10-digit phone numbers automatically.
            </p>
          </div>

          {/* Manual Phone Entry */}
          <div>
            <label className="block text-gold mb-2 font-semibold">
              Or Enter Phone Numbers Manually (one per line):
            </label>
            <textarea
              value={contacts.join("\n")}
              onChange={(e) => {
                const lines = e.target.value.split("\n").filter((line) => line.trim());
                setContacts(lines);
              }}
              rows={6}
              className="w-full px-4 py-2 bg-gray-900 border-2 border-gold text-white rounded focus:outline-none focus:border-yellow-400"
              placeholder="+919876543210&#10;+919876543211&#10;..."
            />
          </div>

          {/* Stats */}
          {contacts.length > 0 && (
            <div className="bg-gray-900 p-4 rounded border-2 border-gold">
              <p className="text-gold font-semibold">
                {contacts.length} contact(s) loaded
              </p>
            </div>
          )}

          {/* Actions */}
          {contacts.length > 0 && (
            <div className="flex flex-wrap gap-4">
              <button
                onClick={copyAllLinks}
                className="px-6 py-3 bg-gold text-black font-bold rounded hover:bg-yellow-400 gold-glow-hover"
              >
                Copy All Links
              </button>
              <button
                onClick={downloadLinks}
                className="px-6 py-3 bg-gold text-black font-bold rounded hover:bg-yellow-400 gold-glow-hover"
              >
                Download Links File
              </button>
              <button
                onClick={openAllLinks}
                className="px-6 py-3 bg-gray-700 text-white font-bold rounded hover:bg-gray-600"
              >
                Open First 10 (Test)
              </button>
            </div>
          )}

          {/* Instructions */}
          <div className="bg-gray-900 p-6 rounded border-2 border-gold mt-8">
            <h2 className="text-xl font-bold text-gold mb-4">Instructions:</h2>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Upload your CSV file or enter phone numbers manually</li>
              <li>Customize the message if needed</li>
              <li>Click &quot;Copy All Links&quot; or &quot;Download Links File&quot;</li>
              <li>
                For bulk sending, use WhatsApp Business API or automation tools like:
                <ul className="list-disc list-inside ml-6 mt-2">
                  <li>WhatsApp Web with browser automation (Selenium, Puppeteer)</li>
                  <li>WhatsApp Business API (requires approval)</li>
                  <li>Third-party tools like ChatAPI, Twilio, etc.</li>
                </ul>
              </li>
              <li>
                The links will automatically open WhatsApp with the message pre-filled
              </li>
              <li>
                When users click the link, they will see the preferential vote modal first
              </li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function ProtectedWhatsAppBulkSender() {
  return (
    <AdminProtection>
      <WhatsAppBulkSender />
    </AdminProtection>
  );
}

