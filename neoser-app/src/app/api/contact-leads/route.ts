import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";
import { contactLeadSchema } from "@/lib/schemas";
import { syncLeadToHubspot } from "@/lib/hubspot";
import { syncLeadToBrevo } from "@/lib/brevo";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Auth check: admin only
    const { data: { user } } = await supabase.auth.getUser();
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

    const url = request.nextUrl;
    const status = url.searchParams.get("status");
    const source = url.searchParams.get("source");

    let query = supabase
      .from("contact_leads")
      .select("*")
      .order("created_at", { ascending: false });

    if (status) {
      query = query.eq("lead_status", status);
    }
    if (source) {
      query = query.eq("source", source);
    }

    const { data: leads, error } = await query;
    if (error) {
      return NextResponse.json({ error: "Error al obtener leads" }, { status: 500 });
    }

    const leadIds = (leads ?? []).map((lead) => lead.id);
    const [{ data: savedInterests }, { data: enrollments }] = leadIds.length
      ? await Promise.all([
          supabase
            .from("contact_course_interests")
            .select("lead_id, course_id, relationship")
            .in("lead_id", leadIds),
          supabase
            .from("enrollments")
            .select("lead_id, course_id, status")
            .in("lead_id", leadIds),
        ])
      : [{ data: [] }, { data: [] }];

    type Relationship = "interes" | "inscrito";
    type CourseLink = {
      lead_id: string;
      course_id: string;
      relationship: Relationship;
    };

    const links = new Map<string, CourseLink>();
    const keepStrongestRelationship = (link: CourseLink) => {
      const key = `${link.lead_id}:${link.course_id}`;
      const current = links.get(key);
      if (!current || link.relationship === "inscrito") links.set(key, link);
    };

    for (const item of savedInterests ?? []) {
      keepStrongestRelationship(item as CourseLink);
    }
    for (const item of enrollments ?? []) {
      if (!item.lead_id) continue;
      keepStrongestRelationship({
        lead_id: item.lead_id,
        course_id: item.course_id,
        relationship: item.status === "paid" ? "inscrito" : "interes",
      });
    }
    for (const lead of leads ?? []) {
      if (!lead.course_id) continue;
      keepStrongestRelationship({
        lead_id: lead.id,
        course_id: lead.course_id,
        relationship: lead.lead_status === "inscrito" ? "inscrito" : "interes",
      });
    }

    const courseIds = [...new Set([...links.values()].map((item) => item.course_id))];
    const { data: courses } = courseIds.length
      ? await supabase
          .from("courses")
          .select("id, title, slug")
          .in("id", courseIds)
      : { data: [] };
    const coursesById = new Map((courses ?? []).map((course) => [course.id, course]));

    return NextResponse.json(
      (leads ?? []).map((lead) => ({
        ...lead,
        courses: [...links.values()]
          .filter((item) => item.lead_id === lead.id)
          .map((item) => {
            const course = coursesById.get(item.course_id);
            return {
              id: item.course_id,
              title: course?.title ?? lead.service_interest ?? "Curso",
              slug: course?.slug ?? null,
              relationship: item.relationship,
            };
          }),
      })),
    );
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = contactLeadSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();
    const { data: lead, error } = await supabase
      .from("contact_leads")
      .insert({
        full_name: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        message: parsed.data.message,
        source: parsed.data.source,
        wa_consent: parsed.data.waConsent,
        wa_consent_at: parsed.data.waConsent
          ? new Date().toISOString()
          : null,
        marketing_consent: parsed.data.marketingConsent ?? false,
        // Fecha del consentimiento: evidencia ante una fiscalizacion.
        marketing_consent_at: parsed.data.marketingConsent
          ? new Date().toISOString()
          : null,
        service_interest: parsed.data.serviceInterest ?? null,
      })
      .select("id")
      .single();

    if (error || !lead) {
      return NextResponse.json({ error: "No se pudo registrar el lead" }, { status: 500 });
    }

    // Optional CRM sync: do not fail lead capture if HubSpot is unavailable.
    try {
      await syncLeadToHubspot({
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        phone: parsed.data.phone,
        message: parsed.data.message,
        source: parsed.data.source,
        waConsent: parsed.data.waConsent,
        serviceInterest: parsed.data.serviceInterest,
      });
    } catch (syncError) {
      console.error("HubSpot sync failed:", syncError);
    }

    // Sync a Brevo (no-bloqueante)
    if (parsed.data.email) {
      try {
        await syncLeadToBrevo({
          email: parsed.data.email,
          fullName: parsed.data.fullName,
          phone: parsed.data.phone,
          source: parsed.data.source,
          serviceInterest: parsed.data.serviceInterest,
          marketingConsent: parsed.data.marketingConsent,
        });
      } catch (error) {
        console.error("Brevo lead sync failed:", error);
      }
    }

    return NextResponse.json({ ok: true, leadId: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
