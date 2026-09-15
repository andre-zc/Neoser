export type CampaignAttribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  gclid?: string;
  landingPath?: string;
};

const FIRST_TOUCH_KEY = "neoser_campaign_first_touch_v1";
const LAST_TOUCH_KEY = "neoser_campaign_last_touch_v1";
const ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;

type StoredAttribution = {
  capturedAt: number;
  attribution: CampaignAttribution;
};

function clean(value: string | null, maxLength: number) {
  const normalized = value?.trim().slice(0, maxLength);
  return normalized || undefined;
}

function readStored(key: string): CampaignAttribution | null {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return null;
    const parsed = JSON.parse(value) as StoredAttribution;
    if (
      !parsed ||
      typeof parsed.capturedAt !== "number" ||
      Date.now() - parsed.capturedAt > ATTRIBUTION_TTL_MS ||
      !parsed.attribution ||
      typeof parsed.attribution !== "object"
    ) {
      window.localStorage.removeItem(key);
      return null;
    }
    return parsed.attribution;
  } catch {
    return null;
  }
}

/**
 * Guarda atribución de campaña sin datos personales. Conservamos primer y
 * último contacto; el checkout usa el último para los reportes operativos.
 */
export function captureCampaignAttribution() {
  if (typeof window === "undefined") return;

  const params = new URLSearchParams(window.location.search);
  const attribution: CampaignAttribution = {
    utmSource: clean(params.get("utm_source"), 80),
    utmMedium: clean(params.get("utm_medium"), 80),
    utmCampaign: clean(params.get("utm_campaign"), 120),
    utmContent: clean(params.get("utm_content"), 120),
    gclid: clean(params.get("gclid"), 200),
    landingPath: clean(
      `${window.location.pathname}${window.location.search}`,
      300,
    ),
  };

  const hasCampaign = Boolean(
    attribution.utmSource ||
      attribution.utmMedium ||
      attribution.utmCampaign ||
      attribution.utmContent ||
      attribution.gclid,
  );

  if (!hasCampaign) return;

  try {
    const serialized = JSON.stringify({
      capturedAt: Date.now(),
      attribution,
    } satisfies StoredAttribution);
    if (!readStored(FIRST_TOUCH_KEY)) {
      window.localStorage.setItem(FIRST_TOUCH_KEY, serialized);
    }
    window.localStorage.setItem(LAST_TOUCH_KEY, serialized);
  } catch {
    // La navegación y el checkout deben continuar si el navegador bloquea storage.
  }
}

export function getCampaignAttribution(): CampaignAttribution {
  if (typeof window === "undefined") return {};
  return (
    readStored(LAST_TOUCH_KEY) ??
    readStored(FIRST_TOUCH_KEY) ?? {
      landingPath: clean(window.location.pathname, 300),
    }
  );
}
