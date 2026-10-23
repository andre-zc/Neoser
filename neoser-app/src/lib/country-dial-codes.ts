export const COUNTRY_DIAL_OPTIONS = [
  { code: "PE", name: "Perú", dialCode: "51" },
  { code: "CR", name: "Costa Rica", dialCode: "506" },
  { code: "EC", name: "Ecuador", dialCode: "593" },
  { code: "CO", name: "Colombia", dialCode: "57" },
  { code: "CL", name: "Chile", dialCode: "56" },
  { code: "AR", name: "Argentina", dialCode: "54" },
  { code: "BO", name: "Bolivia", dialCode: "591" },
  { code: "MX", name: "México", dialCode: "52" },
  { code: "PA", name: "Panamá", dialCode: "507" },
  { code: "GT", name: "Guatemala", dialCode: "502" },
  { code: "SV", name: "El Salvador", dialCode: "503" },
  { code: "HN", name: "Honduras", dialCode: "504" },
  { code: "NI", name: "Nicaragua", dialCode: "505" },
  { code: "VE", name: "Venezuela", dialCode: "58" },
  { code: "PY", name: "Paraguay", dialCode: "595" },
  { code: "UY", name: "Uruguay", dialCode: "598" },
  { code: "US", name: "Estados Unidos", dialCode: "1" },
  { code: "CA", name: "Canadá", dialCode: "1" },
  { code: "DO", name: "República Dominicana", dialCode: "1" },
  { code: "ES", name: "España", dialCode: "34" },
] as const;

export type CountryCode = (typeof COUNTRY_DIAL_OPTIONS)[number]["code"];

export const COUNTRY_CODES = COUNTRY_DIAL_OPTIONS.map(
  (country) => country.code,
) as [CountryCode, ...CountryCode[]];

export function getCountryDialOption(code: string) {
  return COUNTRY_DIAL_OPTIONS.find((country) => country.code === code);
}

/**
 * Construye un número E.164 a partir del país elegido y el número nacional.
 * El prefijo visible no depende de texto ingresado por la persona.
 */
export function normalizeInternationalPhone(
  countryCode: string,
  rawPhone: string,
) {
  const country = getCountryDialOption(countryCode);
  if (!country) return null;

  let nationalDigits = rawPhone.replace(/\D/g, "");
  if (
    nationalDigits.startsWith(country.dialCode) &&
    nationalDigits.length - country.dialCode.length >= 6
  ) {
    nationalDigits = nationalDigits.slice(country.dialCode.length);
  }

  const completeNumber = `${country.dialCode}${nationalDigits}`;
  if (nationalDigits.length < 6 || completeNumber.length > 15) return null;

  return `+${completeNumber}`;
}

export type NormalizedPhoneIdentity = {
  e164: string;
  countryCode: CountryCode | null;
  countryName: string | null;
};

function inferCountryFromInternationalDigits(
  digits: string,
  preferredCountryCode?: string | null,
) {
  const preferred = preferredCountryCode
    ? getCountryDialOption(preferredCountryCode)
    : undefined;
  if (preferred && digits.startsWith(preferred.dialCode)) return preferred;

  // Se prueban primero los prefijos más largos (por ejemplo 506 antes que 5).
  return [...COUNTRY_DIAL_OPTIONS]
    .sort((a, b) => b.dialCode.length - a.dialCode.length)
    .find((country) => digits.startsWith(country.dialCode));
}

/**
 * Devuelve una identidad telefónica comparable entre formularios y APIs.
 *
 * - `932713071` + país PE => `+51932713071`
 * - `+51932713071` o `0051932713071` conservan el prefijo explícito.
 * - Un número internacional sin `+` se reconoce solo cuando no parece un
 *   móvil peruano local y comienza con un prefijo soportado.
 *
 * Los países del plan +1 (EE. UU., Canadá y R. Dominicana) comparten prefijo;
 * para distinguirlos hace falta que el origen también envíe `countryCode`.
 */
export function normalizePhoneIdentity(
  rawPhone: string,
  countryCode?: string | null,
  defaultCountryCode: string | null = "PE",
): NormalizedPhoneIdentity | null {
  const raw = rawPhone.trim();
  if (!raw) return null;

  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  const hasExplicitInternationalPrefix = raw.startsWith("+") || raw.startsWith("00");
  const explicitDigits = raw.startsWith("00")
    ? raw.slice(2).replace(/\D/g, "")
    : digits;

  if (hasExplicitInternationalPrefix) {
    if (explicitDigits.length < 7 || explicitDigits.length > 15 || explicitDigits.startsWith("0")) {
      return null;
    }
    const inferred = inferCountryFromInternationalDigits(
      explicitDigits,
      countryCode,
    );
    return {
      e164: `+${explicitDigits}`,
      countryCode: inferred?.code ?? null,
      countryName: inferred?.name ?? null,
    };
  }

  const selectedCountry = countryCode
    ? getCountryDialOption(countryCode)
    : undefined;
  if (countryCode && !selectedCountry) return null;

  if (selectedCountry) {
    const e164 = normalizeInternationalPhone(selectedCountry.code, raw);
    if (!e164) return null;
    return {
      e164,
      countryCode: selectedCountry.code,
      countryName: selectedCountry.name,
    };
  }

  // Regla histórica NeoSer: la mayoría de formularios anteriores guardaban
  // móviles peruanos de nueve dígitos sin selector de país.
  if (digits.length === 9 && digits.startsWith("9")) {
    const peru = getCountryDialOption("PE")!;
    return {
      e164: `+${peru.dialCode}${digits}`,
      countryCode: peru.code,
      countryName: peru.name,
    };
  }

  const inferredInternational =
    digits.length >= 9
      ? inferCountryFromInternationalDigits(digits)
      : undefined;
  if (
    inferredInternational &&
    digits.length > inferredInternational.dialCode.length + 5 &&
    digits.length <= 15
  ) {
    return {
      e164: `+${digits}`,
      countryCode: inferredInternational.code,
      countryName: inferredInternational.name,
    };
  }

  if (defaultCountryCode) {
    const fallback = getCountryDialOption(defaultCountryCode);
    const e164 = fallback
      ? normalizeInternationalPhone(fallback.code, raw)
      : null;
    if (fallback && e164) {
      return {
        e164,
        countryCode: fallback.code,
        countryName: fallback.name,
      };
    }
  }

  return null;
}
