import { NextRequest, NextResponse } from "next/server";
import { normalizePhoneIdentity } from "@/lib/country-dial-codes";
import { isMissingCrmSchemaError, upsertCrmContact } from "@/lib/crm/contacts";
import { contactLeadSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { syncLeadToHubspot } from "@/lib/hubspot";
import { syncLeadToBrevo } from "@/lib/brevo";

type Relationship = "interes" | "inscrito";

type RawLead = Record<string, unknown> & {
  id: string;
  full_name: string;
  email: string | null;
  phone: string;
  phone_e164?: string | null;
  message: string;
  source: string;
  lead_status: string;
  status_updated_at: string;
  next_followup_at: string | null;
  created_at: string;
  last_activity_at?: string | null;
};

type OriginRow = {
  id: string;
  lead_id: string;
  origin_type: "website" | "manychat" | "manual";
  source_detail: string;
  channel: string;
  external_contact_id: string | null;
  campaign_name: string | null;
  flow_id: string | null;
  flow_name: string | null;
  first_seen_at: string;
  last_seen_at: string;
};

type EventRow = {
  id: string;
  lead_id: string;
  event_type: string;
  channel: string;
  campaign_name: string | null;
  flow_id: string | null;
  flow_name: string | null;
  selected_option: string | null;
  occurred_at: string;
};

type CourseLink = {
  lead_id: string;
  course_id: string;
  relationship: Relationship;
};

const STATUS_WEIGHT: Record<string, number> = {
  perdido: 0,
  nuevo: 1,
  contactado: 2,
  interesado: 3,
  propuesta_enviada: 4,
  inscrito: 5,
};

function qualityScore(lead: RawLead) {
  return [
    lead.email,
    lead.identity_document,
    lead.country_code,
    lead.profession,
    lead.workplace,
    lead.course_id,
    lead.service_interest,
  ].filter(Boolean).length;
}

function canonicalLead(leads: RawLead[]) {
  return [...leads].sort((a, b) => {
    const status =
      (STATUS_WEIGHT[b.lead_status] ?? 0) - (STATUS_WEIGHT[a.lead_status] ?? 0);
    if (status) return status;
    const quality = qualityScore(b) - qualityScore(a);
    if (quality) return quality;
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  })[0];
}

function firstText(leads: RawLead[], field: string) {
  for (const lead of leads) {
    const value = lead[field];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
}

function bestName(leads: RawLead[]) {
  const names = leads
    .map((lead) => lead.full_name?.trim())
    .filter(Boolean) as string[];
  return (
    names.find(
      (name) =>
        !/^\+?[0-9\s-]+$/.test(name) &&
        !["contacto manychat", "suscriptor manychat"].includes(
          name.toLocaleLowerCase("es"),
        ),
    ) ?? names[0] ?? "Contacto"
  );
}

function oldestIso(values: Array<string | null | undefined>) {
  return values.filter(Boolean).sort()[0] ?? null;
}

function newestIso(values: Array<string | null | undefined>) {
  return values.filter(Boolean).sort().at(-1) ?? null;
}

function originKey(origin: OriginRow) {
  return `${origin.origin_type}:${origin.source_detail}:${origin.channel}`;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "No autenticado" }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile?.role !== "admin") {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { data: leadData, error } = await supabase
      .from("contact_leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      return NextResponse.json({ error: "Error al obtener contactos" }, { status: 500 });
    }

    const leads = (leadData ?? []) as RawLead[];
    const leadIds = leads.map((lead) => lead.id);
    const empty = { data: [] as unknown[], error: null };
    const [interestResult, enrollmentResult, originResult, eventResult] = leadIds.length
      ? await Promise.all([
          supabase
            .from("contact_course_interests")
            .select("lead_id, course_id, relationship")
            .in("lead_id", leadIds),
          supabase
            .from("enrollments")
            .select("lead_id, course_id, status")
            .in("lead_id", leadIds),
          supabase
            .from("crm_contact_origins")
            .select(
              "id, lead_id, origin_type, source_detail, channel, external_contact_id, campaign_name, flow_id, flow_name, first_seen_at, last_seen_at",
            )
            .in("lead_id", leadIds),
          supabase
            .from("crm_contact_events")
            .select(
              "id, lead_id, event_type, channel, campaign_name, flow_id, flow_name, selected_option, occurred_at",
            )
            .in("lead_id", leadIds)
            .order("occurred_at", { ascending: false })
            .limit(1000),
        ])
      : [empty, empty, empty, empty];

    const links = new Map<string, CourseLink>();
    const keepStrongestRelationship = (link: CourseLink) => {
      const key = `${link.lead_id}:${link.course_id}`;
      const current = links.get(key);
      if (!current || link.relationship === "inscrito") links.set(key, link);
    };

    for (const item of interestResult.data ?? []) {
      keepStrongestRelationship(item as CourseLink);
    }
    for (const item of enrollmentResult.data ?? []) {
      const enrollment = item as {
        lead_id: string | null;
        course_id: string;
        status: string;
      };
      if (!enrollment.lead_id) continue;
      keepStrongestRelationship({
        lead_id: enrollment.lead_id,
        course_id: enrollment.course_id,
        relationship: enrollment.status === "paid" ? "inscrito" : "interes",
      });
    }
    for (const lead of leads) {
      const courseId = typeof lead.course_id === "string" ? lead.course_id : null;
      if (!courseId) continue;
      keepStrongestRelationship({
        lead_id: lead.id,
        course_id: courseId,
        relationship: lead.lead_status === "inscrito" ? "inscrito" : "interes",
      });
    }

    const courseIds = [...new Set([...links.values()].map((item) => item.course_id))];
    const { data: courses } = courseIds.length
      ? await supabase.from("courses").select("id, title, slug").in("id", courseIds)
      : { data: [] };
    const coursesById = new Map(
      (courses ?? []).map((course) => [course.id, course]),
    );

    let origins = (originResult.data ?? []) as OriginRow[];
    if (originResult.error && !isMissingCrmSchemaError(originResult.error)) {
      return NextResponse.json({ error: "Error al obtener procedencias" }, { status: 500 });
    }
    if (originResult.error && isMissingCrmSchemaError(originResult.error)) {
      origins = leads.map((lead) => ({
        id: `legacy:${lead.id}`,
        lead_id: lead.id,
        origin_type: "website",
        source_detail: lead.source || "web",
        channel: "website",
        external_contact_id: null,
        campaign_name: null,
        flow_id: null,
        flow_name: null,
        first_seen_at: lead.created_at,
        last_seen_at: lead.last_activity_at ?? lead.created_at,
      }));
    }
    if (eventResult.error && !isMissingCrmSchemaError(eventResult.error)) {
      return NextResponse.json({ error: "Error al obtener actividad" }, { status: 500 });
    }
    const events = eventResult.error ? [] : ((eventResult.data ?? []) as EventRow[]);

    const groups = new Map<string, RawLead[]>();
    for (const lead of leads) {
      const normalized =
        lead.phone_e164 ??
        normalizePhoneIdentity(
          lead.phone,
          typeof lead.country_code === "string" ? lead.country_code : null,
          null,
        )?.e164;
      const key = normalized ? `phone:${normalized}` : `lead:${lead.id}`;
      groups.set(key, [...(groups.get(key) ?? []), lead]);
    }

    const merged = [...groups.values()].map((group) => {
      const canonical = canonicalLead(group);
      const ordered = [canonical, ...group.filter((lead) => lead.id !== canonical.id)];
      const memberIds = new Set(group.map((lead) => lead.id));
      const groupOrigins = new Map<string, OriginRow>();
      for (const origin of origins.filter((item) => memberIds.has(item.lead_id))) {
        const key = originKey(origin);
        const current = groupOrigins.get(key);
        if (!current || origin.last_seen_at > current.last_seen_at) {
          groupOrigins.set(key, origin);
        }
      }

      const groupCourses = new Map<
        string,
        { id: string; title: string; slug: string | null; relationship: Relationship }
      >();
      for (const link of links.values()) {
        if (!memberIds.has(link.lead_id)) continue;
        const current = groupCourses.get(link.course_id);
        const course = coursesById.get(link.course_id);
        if (!current || link.relationship === "inscrito") {
          groupCourses.set(link.course_id, {
            id: link.course_id,
            title:
              course?.title ??
              firstText(ordered, "service_interest") ??
              "Curso",
            slug: course?.slug ?? null,
            relationship: link.relationship,
          });
        }
      }

      const strongestStatus = [...group]
        .sort(
          (a, b) =>
            (STATUS_WEIGHT[b.lead_status] ?? 0) -
            (STATUS_WEIGHT[a.lead_status] ?? 0),
        )[0].lead_status;
      const phoneE164 =
        firstText(ordered, "phone_e164") ??
        normalizePhoneIdentity(
          canonical.phone,
          firstText(ordered, "country_code"),
          null,
        )?.e164 ??
        canonical.phone;

      return {
        ...canonical,
        id: canonical.id,
        merged_lead_ids: [...memberIds],
        full_name: bestName(ordered),
        email: firstText(ordered, "email"),
        phone: phoneE164,
        phone_e164: phoneE164,
        identity_document: firstText(ordered, "identity_document"),
        country_code: firstText(ordered, "country_code"),
        country: firstText(ordered, "country"),
        profession: firstText(ordered, "profession"),
        workplace: firstText(ordered, "workplace"),
        service_interest: firstText(ordered, "service_interest"),
        lead_status: strongestStatus,
        status_updated_at:
          newestIso(group.map((lead) => lead.status_updated_at)) ??
          canonical.status_updated_at,
        last_activity_at:
          newestIso(
            group.map((lead) => lead.last_activity_at ?? lead.created_at),
          ) ?? canonical.created_at,
        created_at: oldestIso(group.map((lead) => lead.created_at)) ?? canonical.created_at,
        wa_consent: group.some((lead) => Boolean(lead.wa_consent)),
        wa_consent_at: oldestIso(
          group.map((lead) =>
            typeof lead.wa_consent_at === "string" ? lead.wa_consent_at : null,
          ),
        ),
        marketing_consent: group.some((lead) => Boolean(lead.marketing_consent)),
        origins: [...groupOrigins.values()].sort((a, b) =>
          b.last_seen_at.localeCompare(a.last_seen_at),
        ),
        manychat_events: events
          .filter((event) => memberIds.has(event.lead_id))
          .sort((a, b) => b.occurred_at.localeCompare(a.occurred_at))
          .slice(0, 20),
        courses: [...groupCourses.values()],
      };
    });

    const status = request.nextUrl.searchParams.get("status");
    const source = request.nextUrl.searchParams.get("source");
    const filtered = merged.filter((lead) => {
      if (status && lead.lead_status !== status) return false;
      if (
        source &&
        !lead.origins.some(
          (origin) =>
            origin.origin_type === source || origin.source_detail === source,
        )
      ) {
        return false;
      }
      return true;
    });

    return NextResponse.json(filtered);
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const parsed = contactLeadSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos inválidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const result = await upsertCrmContact(supabase, {
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
      countryCode: parsed.data.countryCode,
      message: parsed.data.message,
      sourceDetail: parsed.data.source,
      originType: "website",
      channel: "website",
      waConsent: parsed.data.waConsent,
      marketingConsent: parsed.data.marketingConsent,
      serviceInterest: parsed.data.serviceInterest,
      leadStatus: "nuevo",
    });

    // Las integraciones existentes siguen sin bloquear la captura principal.
    try {
      await syncLeadToHubspot({
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: result.phoneE164,
        message: parsed.data.message,
        source: parsed.data.source,
        waConsent: parsed.data.waConsent,
        serviceInterest: parsed.data.serviceInterest,
      });
    } catch {
      console.error("[crm] sincronización HubSpot no disponible");
    }

    if (parsed.data.email) {
      try {
        await syncLeadToBrevo({
          email: parsed.data.email,
          fullName: parsed.data.fullName,
          phone: result.phoneE164,
          source: parsed.data.source,
          serviceInterest: parsed.data.serviceInterest,
          marketingConsent: parsed.data.marketingConsent,
        });
      } catch {
        console.error("[crm] sincronización de correo no disponible");
      }
    }

    return NextResponse.json(
      {
        ok: true,
        leadId: result.lead.id,
        merged: !result.created,
      },
      { status: result.created ? 201 : 200 },
    );
  } catch (error) {
    if (error instanceof Error && error.message === "Número de teléfono inválido") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
