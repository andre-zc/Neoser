import type { SupabaseClient } from "@supabase/supabase-js";
import { normalizePhoneIdentity } from "@/lib/country-dial-codes";

export type CrmOriginType = "website" | "manychat";

export type CrmContactInput = {
  fullName: string;
  phone: string;
  countryCode?: string | null;
  country?: string | null;
  email?: string | null;
  message: string;
  sourceDetail: string;
  originType: CrmOriginType;
  channel?: string;
  externalContactId?: string | null;
  campaignName?: string | null;
  flowId?: string | null;
  flowName?: string | null;
  identityDocument?: string | null;
  profession?: string | null;
  workplace?: string | null;
  courseId?: string | null;
  serviceInterest?: string | null;
  leadStatus?: string;
  waConsent?: boolean;
  marketingConsent?: boolean;
  utmSource?: string | null;
  utmMedium?: string | null;
  utmCampaign?: string | null;
  utmContent?: string | null;
  gclid?: string | null;
  landingPath?: string | null;
  occurredAt?: string;
};

type ContactLeadRow = Record<string, unknown> & {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  message: string;
  source: string;
  lead_status: string;
  created_at: string;
};

export type UpsertCrmContactResult = {
  lead: ContactLeadRow;
  created: boolean;
  phoneE164: string;
  originSaved: boolean;
  legacySchema: boolean;
};

const STATUS_WEIGHT: Record<string, number> = {
  perdido: 0,
  nuevo: 1,
  contactado: 2,
  interesado: 3,
  propuesta_enviada: 4,
  inscrito: 5,
};

function cleanOptional(value?: string | null) {
  const cleaned = value?.trim();
  return cleaned ? cleaned : null;
}

function isPlaceholderName(value: unknown) {
  if (typeof value !== "string") return true;
  const normalized = value.trim().toLocaleLowerCase("es");
  return (
    !normalized ||
    normalized === "contacto manychat" ||
    normalized === "suscriptor manychat" ||
    /^\+?[0-9\s-]+$/.test(normalized)
  );
}

function dataQuality(row: ContactLeadRow) {
  const fields = [
    row.email,
    row.identity_document,
    row.country_code,
    row.profession,
    row.workplace,
    row.course_id,
    row.service_interest,
  ];
  return fields.filter(Boolean).length + (isPlaceholderName(row.full_name) ? 0 : 2);
}

function selectCanonicalLead(rows: ContactLeadRow[]) {
  return [...rows].sort((a, b) => {
    const status =
      (STATUS_WEIGHT[b.lead_status] ?? 0) - (STATUS_WEIGHT[a.lead_status] ?? 0);
    if (status) return status;
    const quality = dataQuality(b) - dataQuality(a);
    if (quality) return quality;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  })[0];
}

export function isMissingCrmSchemaError(error: { code?: string | null; message?: string | null } | null) {
  if (!error) return false;
  return (
    error.code === "42P01" ||
    error.code === "42703" ||
    error.code === "PGRST204" ||
    error.code === "PGRST205" ||
    Boolean(error.message?.includes("phone_e164")) ||
    Boolean(error.message?.includes("crm_contact_origins"))
  );
}

function advancedStatus(current: string, incoming: string) {
  // Una persona archivada que vuelve a escribir se reactiva como nueva.
  if (current === "perdido" && incoming === "nuevo") return "nuevo";
  return (STATUS_WEIGHT[incoming] ?? 0) > (STATUS_WEIGHT[current] ?? 0)
    ? incoming
    : current;
}

async function saveOrigin(
  supabase: SupabaseClient,
  leadId: string,
  input: CrmContactInput,
  occurredAt: string,
) {
  const sourceDetail = cleanOptional(input.sourceDetail) ?? "web";
  const channel = cleanOptional(input.channel) ?? (input.originType === "manychat" ? "whatsapp" : "website");
  const externalContactId = cleanOptional(input.externalContactId);

  if (externalContactId) {
    const { data: existingExternal, error: externalError } = await supabase
      .from("crm_contact_origins")
      .select("id, lead_id")
      .eq("origin_type", input.originType)
      .eq("channel", channel)
      .eq("external_contact_id", externalContactId)
      .maybeSingle();

    if (externalError && !isMissingCrmSchemaError(externalError)) {
      throw new Error("No se pudo consultar la procedencia del contacto");
    }
    if (existingExternal) {
      if (existingExternal.lead_id !== leadId) {
        // La misma persona pudo haberse registrado antes por web y después en
        // ManyChat. Se conserva una sola fila de procedencia por canal.
        const { data: targetOrigin } = await supabase
          .from("crm_contact_origins")
          .select("id")
          .eq("lead_id", leadId)
          .eq("origin_type", input.originType)
          .eq("source_detail", sourceDetail)
          .eq("channel", channel)
          .maybeSingle();
        if (targetOrigin && targetOrigin.id !== existingExternal.id) {
          const { error: deleteError } = await supabase
            .from("crm_contact_origins")
            .delete()
            .eq("id", targetOrigin.id);
          if (deleteError) {
            throw new Error("No se pudo consolidar la procedencia del contacto");
          }
        }
      }
      const { error } = await supabase
        .from("crm_contact_origins")
        .update({
          lead_id: leadId,
          source_detail: sourceDetail,
          campaign_name: cleanOptional(input.campaignName),
          flow_id: cleanOptional(input.flowId),
          flow_name: cleanOptional(input.flowName),
          last_seen_at: occurredAt,
        })
        .eq("id", existingExternal.id);
      if (error) throw new Error("No se pudo actualizar la procedencia del contacto");
      return true;
    }
  }

  const { error } = await supabase.from("crm_contact_origins").upsert(
    {
      lead_id: leadId,
      origin_type: input.originType,
      source_detail: sourceDetail,
      channel,
      external_contact_id: externalContactId,
      campaign_name: cleanOptional(input.campaignName),
      flow_id: cleanOptional(input.flowId),
      flow_name: cleanOptional(input.flowName),
      last_seen_at: occurredAt,
    },
    { onConflict: "lead_id,origin_type,source_detail,channel" },
  );

  if (error && isMissingCrmSchemaError(error)) return false;
  if (error) throw new Error("No se pudo guardar la procedencia del contacto");
  return true;
}

async function insertUsingLegacySchema(
  supabase: SupabaseClient,
  input: CrmContactInput,
  phoneE164: string,
  normalizedCountryCode: string | null,
  normalizedCountryName: string | null,
) {
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from("contact_leads")
    .insert({
      full_name: input.fullName.trim(),
      email: cleanOptional(input.email),
      phone: phoneE164,
      message: input.message.trim(),
      source: input.sourceDetail,
      identity_document: cleanOptional(input.identityDocument),
      country_code: normalizedCountryCode ?? cleanOptional(input.countryCode),
      country: normalizedCountryName ?? cleanOptional(input.country),
      profession: cleanOptional(input.profession),
      workplace: cleanOptional(input.workplace),
      course_id: cleanOptional(input.courseId),
      service_interest: cleanOptional(input.serviceInterest),
      lead_status: input.leadStatus ?? "nuevo",
      wa_consent: input.waConsent ?? false,
      wa_consent_at: input.waConsent ? now : null,
      marketing_consent: input.marketingConsent ?? false,
      marketing_consent_at: input.marketingConsent ? now : null,
      utm_source: cleanOptional(input.utmSource),
      utm_medium: cleanOptional(input.utmMedium),
      utm_campaign: cleanOptional(input.utmCampaign),
      utm_content: cleanOptional(input.utmContent),
      gclid: cleanOptional(input.gclid),
      landing_path: cleanOptional(input.landingPath),
    })
    .select("*")
    .single();

  if (error || !data) throw new Error("No se pudo registrar el contacto");
  return data as ContactLeadRow;
}

/**
 * Inserta o actualiza la ficha canónica según el teléfono E.164.
 * Los datos afirmativos (consentimiento, inscripción) nunca se degradan y los
 * campos completos del checkout rellenan los vacíos de un contacto de campaña.
 */
export async function upsertCrmContact(
  supabase: SupabaseClient,
  input: CrmContactInput,
): Promise<UpsertCrmContactResult> {
  const normalized = normalizePhoneIdentity(
    input.phone,
    input.countryCode,
    null,
  );
  if (!normalized) throw new Error("Número de teléfono inválido");

  const occurredAt = input.occurredAt ?? new Date().toISOString();
  let linkedManychatLeadId: string | null = null;
  if (input.originType === "manychat" && cleanOptional(input.externalContactId)) {
    const { data: linkedOrigin, error: linkedOriginError } = await supabase
      .from("crm_contact_origins")
      .select("lead_id")
      .eq("origin_type", "manychat")
      .eq("channel", cleanOptional(input.channel) ?? "whatsapp")
      .eq("external_contact_id", cleanOptional(input.externalContactId)!)
      .maybeSingle();
    if (linkedOriginError && !isMissingCrmSchemaError(linkedOriginError)) {
      throw new Error("No se pudo buscar la identidad de ManyChat");
    }
    linkedManychatLeadId = linkedOrigin?.lead_id ?? null;
  }

  const { data: rows, error: findError } = await supabase
    .from("contact_leads")
    .select("*")
    .eq("phone_e164", normalized.e164)
    .order("created_at", { ascending: true });

  if (findError && isMissingCrmSchemaError(findError)) {
    const lead = await insertUsingLegacySchema(
      supabase,
      input,
      normalized.e164,
      normalized.countryCode,
      normalized.countryName,
    );
    return {
      lead,
      created: true,
      phoneE164: normalized.e164,
      originSaved: false,
      legacySchema: true,
    };
  }
  if (findError) throw new Error("No se pudo buscar el contacto");

  const existingRows = (rows ?? []) as ContactLeadRow[];
  if (
    linkedManychatLeadId &&
    !existingRows.some((lead) => lead.id === linkedManychatLeadId)
  ) {
    const { data: linkedLead, error: linkedLeadError } = await supabase
      .from("contact_leads")
      .select("*")
      .eq("id", linkedManychatLeadId)
      .maybeSingle();
    if (linkedLeadError) throw new Error("No se pudo recuperar el contacto de ManyChat");
    if (linkedLead) existingRows.push(linkedLead as ContactLeadRow);
  }
  const current = existingRows.length ? selectCanonicalLead(existingRows) : null;
  const incomingStatus = input.leadStatus ?? "nuevo";
  const currentStatus = current?.lead_status ?? "nuevo";
  const nextStatus = advancedStatus(currentStatus, incomingStatus);
  const now = new Date().toISOString();

  let lead: ContactLeadRow;
  let created = false;

  if (current) {
    const updates: Record<string, unknown> = {
      phone: normalized.e164,
      phone_e164: normalized.e164,
      last_activity_at: occurredAt,
      lead_status: nextStatus,
      wa_consent: Boolean(current.wa_consent) || Boolean(input.waConsent),
      marketing_consent:
        Boolean(current.marketing_consent) || Boolean(input.marketingConsent),
    };

    if (nextStatus !== currentStatus) updates.status_updated_at = occurredAt;
    if (!current.wa_consent_at && input.waConsent) updates.wa_consent_at = now;
    if (!current.marketing_consent_at && input.marketingConsent) {
      updates.marketing_consent_at = now;
    }
    if (isPlaceholderName(current.full_name) && !isPlaceholderName(input.fullName)) {
      updates.full_name = input.fullName.trim();
    }

    const fillIfEmpty: Array<[string, string | null | undefined]> = [
      ["email", input.email],
      ["identity_document", input.identityDocument],
      ["country_code", normalized.countryCode ?? input.countryCode],
      ["country", normalized.countryName ?? input.country],
      ["profession", input.profession],
      ["workplace", input.workplace],
      ["course_id", input.courseId],
      ["service_interest", input.serviceInterest],
      ["utm_source", input.utmSource],
      ["utm_medium", input.utmMedium],
      ["utm_campaign", input.utmCampaign],
      ["utm_content", input.utmContent],
      ["gclid", input.gclid],
      ["landing_path", input.landingPath],
    ];
    for (const [column, value] of fillIfEmpty) {
      if (!current[column] && cleanOptional(value)) updates[column] = cleanOptional(value);
    }

    const { data, error } = await supabase
      .from("contact_leads")
      .update(updates)
      .eq("id", current.id)
      .select("*")
      .single();
    if (error || !data) throw new Error("No se pudo actualizar el contacto");
    lead = data as ContactLeadRow;
  } else {
    const { data, error } = await supabase
      .from("contact_leads")
      .insert({
        full_name: input.fullName.trim(),
        email: cleanOptional(input.email),
        phone: normalized.e164,
        phone_e164: normalized.e164,
        message: input.message.trim(),
        source: input.sourceDetail,
        identity_document: cleanOptional(input.identityDocument),
        country_code: normalized.countryCode ?? cleanOptional(input.countryCode),
        country: normalized.countryName ?? cleanOptional(input.country),
        profession: cleanOptional(input.profession),
        workplace: cleanOptional(input.workplace),
        course_id: cleanOptional(input.courseId),
        service_interest: cleanOptional(input.serviceInterest),
        lead_status: incomingStatus,
        status_updated_at: occurredAt,
        last_activity_at: occurredAt,
        wa_consent: input.waConsent ?? false,
        wa_consent_at: input.waConsent ? now : null,
        marketing_consent: input.marketingConsent ?? false,
        marketing_consent_at: input.marketingConsent ? now : null,
        utm_source: cleanOptional(input.utmSource),
        utm_medium: cleanOptional(input.utmMedium),
        utm_campaign: cleanOptional(input.utmCampaign),
        utm_content: cleanOptional(input.utmContent),
        gclid: cleanOptional(input.gclid),
        landing_path: cleanOptional(input.landingPath),
      })
      .select("*")
      .single();
    if (error || !data) throw new Error("No se pudo registrar el contacto");
    lead = data as ContactLeadRow;
    created = true;
  }

  if (existingRows.length > 1) {
    const { error: identityError } = await supabase
      .from("contact_leads")
      .update({
        phone: normalized.e164,
        phone_e164: normalized.e164,
        last_activity_at: occurredAt,
      })
      .in(
        "id",
        existingRows.map((row) => row.id),
      );
    if (identityError) throw new Error("No se pudo consolidar la identidad telefónica");
  }

  const originSaved = await saveOrigin(supabase, lead.id, input, occurredAt);
  return {
    lead,
    created,
    phoneE164: normalized.e164,
    originSaved,
    legacySchema: false,
  };
}
