import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { upsertCrmContact, isMissingCrmSchemaError } from "@/lib/crm/contacts";
import { manychatCrmEventSchema } from "@/lib/schemas";
import { createServiceClient } from "@/lib/supabase/service";

export const runtime = "nodejs";

function secureEqual(left: string, right: string) {
  const leftHash = createHash("sha256").update(left).digest();
  const rightHash = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftHash, rightHash);
}

function bearerToken(request: Request) {
  const authorization = request.headers.get("authorization") ?? "";
  return authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length).trim()
    : "";
}

function eventKey(input: {
  eventId?: string;
  subscriberId: string;
  eventType: string;
  occurredAt: string;
  flowId?: string;
  selectedOption?: string;
}) {
  if (input.eventId) {
    return `manychat:${input.subscriberId}:${input.eventId}`;
  }
  // Si el flujo no tiene un identificador propio, el minuto evita duplicados
  // causados por reintentos HTTP sin impedir una interacción futura equivalente.
  const minute = input.occurredAt.slice(0, 16);
  return `manychat:${createHash("sha256")
    .update(
      [
        input.subscriberId,
        input.eventType,
        minute,
        input.flowId ?? "",
        input.selectedOption ?? "",
      ].join("|"),
    )
    .digest("hex")}`;
}

export async function POST(request: Request) {
  const configuredSecret = process.env.MANYCHAT_WEBHOOK_SECRET?.trim();
  if (!configuredSecret || configuredSecret.length < 32) {
    return NextResponse.json(
      { error: "Integración ManyChat no configurada" },
      { status: 503 },
    );
  }

  const token = bearerToken(request);
  if (!token || !secureEqual(token, configuredSecret)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > 16_384) {
    return NextResponse.json({ error: "Solicitud demasiado grande" }, { status: 413 });
  }

  try {
    const parsed = manychatCrmEventSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Evento ManyChat inválido" },
        { status: 400 },
      );
    }

    const data = parsed.data;
    const occurredAt = data.occurredAt ?? new Date().toISOString();
    const supabase = createServiceClient();

    // Evita registrar un contacto sin trazabilidad si la migración todavía no
    // fue aplicada en el proyecto Supabase del ambiente.
    const { error: readinessError } = await supabase
      .from("crm_contact_origins")
      .select("id")
      .limit(1);
    if (readinessError) {
      return NextResponse.json(
        { error: "Integración ManyChat pendiente de migración" },
        { status: isMissingCrmSchemaError(readinessError) ? 503 : 500 },
      );
    }

    let courseId: string | null = null;
    let courseTitle = data.courseInterest ?? null;
    if (data.courseSlug) {
      const { data: course } = await supabase
        .from("courses")
        .select("id, title")
        .eq("slug", data.courseSlug)
        .maybeSingle();
      courseId = course?.id ?? null;
      courseTitle = course?.title ?? courseTitle;
    }

    const result = await upsertCrmContact(supabase, {
      fullName: data.fullName ?? "Contacto ManyChat",
      phone: data.phone,
      countryCode: data.countryCode,
      email: data.email || null,
      message: `Interacción registrada desde ManyChat (${data.eventType}).`,
      sourceDetail: "manychat",
      originType: "manychat",
      channel: data.channel,
      externalContactId: data.subscriberId,
      campaignName: data.campaignName,
      flowId: data.flowId,
      flowName: data.flowName,
      serviceInterest: courseTitle,
      courseId,
      leadStatus: "nuevo",
      waConsent: data.whatsappConsent,
      marketingConsent: data.marketingConsent,
      occurredAt,
    });

    if (!result.originSaved) {
      return NextResponse.json(
        { error: "No se pudo registrar la procedencia" },
        { status: 503 },
      );
    }

    const key = eventKey({
      eventId: data.eventId,
      subscriberId: data.subscriberId,
      eventType: data.eventType,
      occurredAt,
      flowId: data.flowId,
      selectedOption: data.selectedOption,
    });
    const { error: eventError } = await supabase
      .from("crm_contact_events")
      .upsert(
        {
          lead_id: result.lead.id,
          event_key: key,
          origin_type: "manychat",
          event_type: data.eventType,
          channel: data.channel,
          campaign_name: data.campaignName ?? null,
          flow_id: data.flowId ?? null,
          flow_name: data.flowName ?? null,
          selected_option: data.selectedOption ?? null,
          occurred_at: occurredAt,
        },
        { onConflict: "event_key", ignoreDuplicates: true },
      );
    if (eventError) {
      return NextResponse.json(
        { error: "No se pudo registrar la actividad" },
        { status: 500 },
      );
    }

    if (courseId) {
      const { error: interestError } = await supabase
        .from("contact_course_interests")
        .upsert(
          {
            lead_id: result.lead.id,
            course_id: courseId,
            relationship: "interes",
          },
          { onConflict: "lead_id,course_id", ignoreDuplicates: true },
        );
      if (interestError && !isMissingCrmSchemaError(interestError)) {
        return NextResponse.json(
          { error: "No se pudo asociar el curso" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json(
      {
        ok: true,
        contactId: result.lead.id,
        created: result.created,
      },
      { status: result.created ? 201 : 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message === "Número de teléfono inválido") {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: "Error procesando el evento" }, { status: 500 });
  }
}
