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
  if (nationalDigits.startsWith(country.dialCode)) {
    nationalDigits = nationalDigits.slice(country.dialCode.length);
  }

  const completeNumber = `${country.dialCode}${nationalDigits}`;
  if (nationalDigits.length < 6 || completeNumber.length > 15) return null;

  return `+${completeNumber}`;
}
