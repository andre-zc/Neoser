"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { captureCampaignAttribution } from "@/lib/analytics/attribution";
import { isProductionAnalyticsHost } from "@/lib/analytics/ga4";

export function SiteAnalytics({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    captureCampaignAttribution();
  }, [pathname]);

  useEffect(() => {
    if (!measurementId || !isProductionAnalyticsHost()) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function gtag(...args: unknown[]) {
        window.dataLayer?.push(args);
      };

    if (!document.getElementById("neoser-ga4")) {
      const script = document.createElement("script");
      script.id = "neoser-ga4";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
        measurementId,
      )}`;
      document.head.appendChild(script);
    }

    if (!initialized.current) {
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        anonymize_ip: true,
        send_page_view: false,
      });
      initialized.current = true;
    }

    window.gtag("event", "page_view", {
      page_location: window.location.href,
      page_path: `${window.location.pathname}${window.location.search}`,
      page_title: document.title,
    });
  }, [measurementId, pathname]);

  return null;
}
