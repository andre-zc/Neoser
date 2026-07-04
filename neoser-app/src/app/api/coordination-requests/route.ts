import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { coordinationRequestSchema } from "@/lib/schemas";
import { syncCoordinationToHubspot } from "@/lib/hubspot";
import { sendEmail, buildCoordinationNotificationEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = coordinationRequestSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const d = parsed.data;
    const supabase = createServiceClient();

    const { data: row, error } = await supabase
      .from("coordination_requests")
      .insert({
        full_name: d.fullName,
        institution: d.institution,
        position: d.position,
        email: d.email,
        phone: d.phone,
        reason: d.reason,
        description: d.description,
        status: "pendiente",
        source: "web_coordinacion",
      })
      .select("id, created_at")
      .single();

    if (error || !row) {
      return NextResponse.json(
        { error: "No se pudo registrar la solicitud" },
        { status: 500 },
      );
    }

    // Sync HubSpot (no-bloqueante): contacto + deal para que Diana lo gestione
    try {
      await syncCoordinationToHubspot({
        fullName: d.fullName,
        email: d.email,
        phone: d.phone,
        institution: d.institution,
        position: d.position,
        reason: d.reason,
        description: d.description,
      });
    } catch (syncError) {
      console.error("HubSpot coordination sync failed:", syncError);
    }

    // Notificación interna al equipo NeoSer (no-bloqueante)
    try {
      const to =
        process.env.COORDINATION_NOTIFY_EMAIL ||
        process.env.EMAIL_FROM ||
        "neoser.admin@gmail.com";
      const { subject, html } = buildCoordinationNotificationEmail({
        fullName: d.fullName,
        institution: d.institution,
        position: d.position,
        email: d.email,
        phone: d.phone,
        reason: d.reason,
        description: d.description,
        createdAt: row.created_at,
      });
      await sendEmail({ to, subject, html });
    } catch (emailError) {
      console.error("Coordination notification email failed:", emailError);
    }

    return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
