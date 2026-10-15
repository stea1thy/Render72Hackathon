"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            gcTime: 5 * 60 * 1000, // 5 minutes
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#10121a",
            border: "1px solid #00ff66",
            borderRadius: "0px",
            color: "#f4f5f8",
            fontFamily: "var(--font-mono)",
            fontSize: "12px",
            boxShadow: "4px 4px 0px 0px #00ff66",
          },
        }}
      />
    </QueryClientProvider>
  );
}
