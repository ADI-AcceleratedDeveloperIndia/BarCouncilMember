"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function AdminProtection({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user is authenticated
      const authenticated = sessionStorage.getItem("adminAuthenticated") === "true";
      
      if (!authenticated && pathname?.startsWith("/admin")) {
        // Redirect to login if not authenticated
        router.push("/admin");
      } else {
        setIsAuthenticated(true);
      }
      setIsChecking(false);
    }
  }, [router, pathname]);

  // Show nothing while checking
  if (isChecking) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gold">Loading...</div>
      </div>
    );
  }

  // Show children if authenticated, otherwise redirect will happen
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
