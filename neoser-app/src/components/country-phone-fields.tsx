import { COUNTRY_DIAL_OPTIONS } from "@/lib/country-dial-codes";

type CountryPhoneFieldsProps = {
  inputClassName: string;
  placeholder?: string;
};

/** Selector explícito para que un teléfono local pueda convertirse a E.164. */
export function CountryPhoneFields({
  inputClassName,
  placeholder = "WhatsApp / teléfono *",
}: CountryPhoneFieldsProps) {
  return (
    <div className="grid grid-cols-[minmax(112px,0.4fr)_minmax(0,1fr)] gap-2">
      <label>
        <span className="sr-only">País del número</span>
        <select
          name="countryCode"
          defaultValue="PE"
          aria-label="País del número"
          className={inputClassName}
        >
          {COUNTRY_DIAL_OPTIONS.map((country) => (
            <option key={country.code} value={country.code}>
              +{country.dialCode} · {country.code}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span className="sr-only">Número de WhatsApp o teléfono</span>
        <input
          name="phone"
          required
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={placeholder}
          className={inputClassName}
        />
      </label>
    </div>
  );
}
