export type GaItem = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function isProductionAnalyticsHost(hostname = window.location.hostname) {
  return hostname === "neoser.pe" || hostname === "www.neoser.pe";
}

export function sendGaEvent(
  eventName: string,
  parameters: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost()) return;
  window.gtag?.("event", eventName, parameters);
}

export function sendGaEventOnce(
  key: string,
  eventName: string,
  parameters: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost()) return;

  const storageKey = `neoser_ga4_${key}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Si sessionStorage está bloqueado, GA4 puede deduplicar purchase por ID.
  }
  sendGaEvent(eventName, parameters);
}
