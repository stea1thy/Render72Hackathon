"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function TabTitleSync() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;

    if (pathname === "/") {
      document.title = "Nexus Fest '26";
    } else if (pathname === "/events") {
      document.title = "Events • Nexus Fest '26";
    } else if (pathname === "/passes" || pathname === "/dashboard") {
      document.title = "My Passes • Nexus Fest '26";
    } else if (pathname === "/schedule") {
      document.title = "Schedule • Nexus Fest '26";
    }
  }, [pathname]);

  return null;
}
