// app/providers.tsx
"use client";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check and generate UUID on first app load
    if (!localStorage.getItem("video_userId")) {
      const newUserId = uuidv4();
      localStorage.setItem("video_userId", newUserId);
    }
  }, []);

  return <>{children}</>;
}
