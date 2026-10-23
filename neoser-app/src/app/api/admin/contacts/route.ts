import { NextResponse } from "next/server";
import { normalizePhoneIdentity } from "@/lib/country-dial-codes";
import { upsertCrmContact } from "@/lib/crm/contacts";
import { manualCrmContactSchema } from "@/lib/schemas";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/service";

type DuplicateRow = {
  id: string;
  full_name: string;
  phone: string;
  phone_e164: string | null;
  country_code: string | null;
};

async function findDuplicatePhone(phoneE164: string) {
  const service = createServiceClient();
  const { data: exact, error: exactError } = await service
    .from("contact_leads")
    .select("id, full_name, phone, phone_e164, country_code")
    .eq("phone_e164", phoneE164)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (exactError) throw new Error("No se pudo comprobar el teléfono");
  if (exact) return exact as DuplicateRow;

  // Compatibilidad con registros anteriores que todavía no tuvieran E.164.
  const { data: legacy, error: legacyError } = await service
    .from("contact_leads")
    .select("id, full_name, phone, phone_e164, country_code")
    .is("phone_e164", null)
    .limit(1000);
  if (legacyError) throw new Error("No se pudo comprobar el teléfono");
  return (
    ((legacy ?? []) as DuplicateRow[]).find(
      (lead) =>
        normalizePhoneIdentity(lead.phone, lead.country_code, null)?.e164 ===
        phoneE164,
    ) ?? null
  );
}

function duplicateResponse(lead: DuplicateRow) {
  return NextResponse.json(
    {
      error: "Este número ya pertenece a un contacto del CRM.",
      existingContact: {
        id: lead.id,
        fullName: lead.full_name,
        phone: lead.phone_e164 ?? lead.phone,
      },
    },
    { status: 409 },
  );
}

export async function POST(request: Request) {
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

    const parsed = manualCrmContactSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Revisa los datos ingresados", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const normalized = normalizePhoneIdentity(
      parsed.data.phone,
      parsed.data.countryCode,
      null,
    );
    if (!normalized) {
      return NextResponse.json(
        { error: "Ingresa un número de teléfono válido" },
        { status: 400 },
      );
    }

    const duplicate = await findDuplicatePhone(normalized.e164);
    if (duplicate) return duplicateResponse(duplicate);

    const leadStatus = parsed.data.courses.some(
      (course) => course.relationship === "inscrito",
    )
      ? "inscrito"
      : parsed.data.leadStatus;
    const service = createServiceClient();
    const result = await upsertCrmContact(service, {
      fullName: parsed.data.fullName,
      email: parsed.data.email || null,
      phone: parsed.data.phone,
      countryCode: parsed.data.countryCode,
      message: "Contacto añadido manualmente por el equipo NeoSer.",
      sourceDetail: "registro_manual",
      originType: "manual",
      channel: "crm_admin",
      identityDocument: parsed.data.identityDocument || null,
      profession: parsed.data.profession || null,
      workplace: parsed.data.workplace || null,
      serviceInterest: parsed.data.serviceInterest || null,
      leadStatus,
      waConsent: parsed.data.waConsent,
      marketingConsent: parsed.data.marketingConsent,
    });

    // Otra solicitud pudo registrar el mismo número entre la comprobación y
    // el upsert. En ese caso se informa la ficha canónica y no se duplica.
    if (!result.created) {
      return duplicateResponse({
        id: result.lead.id,
        full_name: result.lead.full_name,
        phone: result.phoneE164,
        phone_e164: result.phoneE164,
        country_code: null,
      });
    }

    const leadId = result.lead.id;
    if (parsed.data.courses.length) {
      const { error } = await service.from("contact_course_interests").upsert(
        parsed.data.courses.map((course) => ({
          lead_id: leadId,
          course_id: course.courseId,
          relationship: course.relationship,
        })),
        { onConflict: "lead_id,course_id" },
      );
      if (error) throw new Error("No se pudieron asociar los cursos");
    }

    const updates: Record<string, string | null> = {};
    if (parsed.data.nextFollowupAt !== undefined) {
      updates.next_followup_at = parsed.data.nextFollowupAt;
    }
    if (Object.keys(updates).length) {
      const { error } = await service
        .from("contact_leads")
        .update(updates)
        .eq("id", leadId);
      if (error) throw new Error("No se pudo guardar el seguimiento");
    }

    if (parsed.data.note) {
      const { error } = await service.from("lead_notes").insert({
        lead_id: leadId,
        author_id: user.id,
        body: parsed.data.note,
      });
      if (error) throw new Error("No se pudo guardar la nota");
    }

    return NextResponse.json(
      { ok: true, contactId: leadId, phoneE164: result.phoneE164 },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Solicitud inválida" }, { status: 400 });
    }
    return NextResponse.json(
      {
        error:
          error instanceof Error &&
          [
            "No se pudieron asociar los cursos",
            "No se pudo guardar el seguimiento",
            "No se pudo guardar la nota",
          ].includes(error.message)
            ? `${error.message}. La ficha fue creada; ábrela para completar ese dato.`
            : "No se pudo crear el contacto. Verifica que la migración del CRM esté aplicada.",
      },
      { status: 500 },
    );
  }
}
