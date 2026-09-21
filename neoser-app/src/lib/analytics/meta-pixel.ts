import { isProductionAnalyticsHost } from "@/lib/analytics/ga4";

type MetaPixelFunction = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue: unknown[][];
  push: MetaPixelFunction;
  loaded: boolean;
  version: string;
};

declare global {
  interface Window {
    fbq?: MetaPixelFunction;
    _fbq?: MetaPixelFunction;
  }
}

const SCRIPT_ID = "neoser-meta-pixel";
const pendingEvents: Array<{
  eventName: string;
  parameters?: Record<string, unknown>;
}> = [];

function trackMetaEvent(
  eventName: string,
  parameters?: Record<string, unknown>,
) {
  if (parameters) {
    window.fbq?.("track", eventName, parameters);
  } else {
    window.fbq?.("track", eventName);
  }
}

/**
 * Inicializa la cola oficial de Meta Pixel y carga el SDK sin bloquear la UI.
 * El ID del pixel es publico; nunca se colocan tokens ni datos personales aqui.
 */
export function initializeMetaPixel(pixelId: string) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost()) return;

  if (!window.fbq) {
    const pixel = function (...args: unknown[]) {
      if (pixel.callMethod) {
        pixel.callMethod(...args);
      } else {
        pixel.queue.push(args);
      }
    } as MetaPixelFunction;

    pixel.push = pixel;
    pixel.loaded = true;
    pixel.version = "2.0";
    pixel.queue = [];
    window.fbq = pixel;
    window._fbq = pixel;
  }

  if (!document.getElementById(SCRIPT_ID)) {
    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = "https://connect.facebook.net/en_US/fbevents.js";
    document.head.appendChild(script);
  }

  window.fbq("init", pixelId);

  while (pendingEvents.length > 0) {
    const event = pendingEvents.shift();
    if (event) trackMetaEvent(event.eventName, event.parameters);
  }
}

export function sendMetaEvent(
  eventName: string,
  parameters?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost()) return;

  if (!window.fbq) {
    pendingEvents.push({ eventName, parameters });
    return;
  }

  trackMetaEvent(eventName, parameters);
}

export function sendMetaEventOnce(
  key: string,
  eventName: string,
  parameters?: Record<string, unknown>,
) {
  if (typeof window === "undefined" || !isProductionAnalyticsHost()) return;

  const storageKey = `neoser_meta_${key}`;
  try {
    if (window.sessionStorage.getItem(storageKey)) return;
    window.sessionStorage.setItem(storageKey, "1");
  } catch {
    // Si sessionStorage esta bloqueado, el evento se envia sin deduplicacion local.
  }

  sendMetaEvent(eventName, parameters);
}
