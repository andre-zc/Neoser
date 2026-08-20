/**
 * POST /api/complaint-book — Hoja de Reclamación del Libro de Reclamaciones.
 *
 * Obligatorio por el Código de Protección y Defensa del Consumidor (Ley 29571).
 * Culqi además exige que esté INTEGRADO en la web: por eso se persiste en
 * Supabase y se envía constancia por correo, sin depender de servicios externos.
 *
 * Al registrar la hoja:
 *   1. Se guarda con número correlativo (lo genera la BD).
 *   2. Se envía constancia al consumidor (exigido por el reglamento).
 *   3. Se avisa internamente a NeoSer con el plazo legal de respuesta.
 */

import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { complaintBookSchema } from "@/lib/schemas";
import { PLAZO_RECLAMO_DIAS_HABILES } from "@/lib/legal";
import {
  sendEmail,
  buildComplaintAckEmail,
  buildComplaintInternalEmail,
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = complaintBookSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const d = parsed.data;

    // Si es menor de edad, el reglamento exige identificar al padre/tutor.
    if (d.isMinor && !d.guardianName?.trim()) {
      return NextResponse.json(
        {
          error:
            "Para consumidores menores de edad debe indicarse el nombre del padre, madre o tutor.",
        },
        { status: 400 },
      );
    }

    const supabase = createServiceClient();

    const { data: row, error } = await supabase
      .from("complaint_book")
      .insert({
        full_name: d.fullName,
        document_type: d.documentType,
        document_number: d.documentNumber,
        address: d.address,
        phone: d.phone,
        email: d.email,
        is_minor: d.isMinor,
        guardian_name: d.guardianName ?? null,
        item_type: d.itemType,
        item_description: d.itemDescription,
        claimed_amount: d.claimedAmount ?? null,
        complaint_type: d.complaintType,
        detail: d.detail,
        consumer_request: d.consumerRequest,
        status: "pendiente",
      })
      .select("id, correlativo, created_at")
      .single();

    if (error || !row) {
      console.error("Complaint book insert failed:", error?.message);
      return NextResponse.json(
        { error: "No se pudo registrar la hoja de reclamación" },
        { status: 500 },
      );
    }

    const emailInput = {
      correlativo: row.correlativo as number,
      fullName: d.fullName,
      documentType: d.documentType,
      documentNumber: d.documentNumber,
      address: d.address,
      phone: d.phone,
      email: d.email,
      itemType: d.itemType,
      itemDescription: d.itemDescription,
      claimedAmount: d.claimedAmount ?? null,
      complaintType: d.complaintType,
      detail: d.detail,
      consumerRequest: d.consumerRequest,
      createdAt: row.created_at as string,
      plazoDias: PLAZO_RECLAMO_DIAS_HABILES,
    };

    // Constancia al consumidor (no-bloqueante: la hoja ya quedó registrada).
    try {
      const { subject, html } = buildComplaintAckEmail(emailInput);
      await sendEmail({ to: d.email, subject, html });
    } catch (err) {
      console.error("Complaint ack email failed:", err);
    }

    // Aviso interno con el plazo legal (no-bloqueante).
    try {
      const to =
        process.env.COMPLAINTS_NOTIFY_EMAIL ||
        process.env.COORDINATION_NOTIFY_EMAIL ||
        process.env.EMAIL_FROM ||
        "neoser.admin@gmail.com";
      const { subject, html } = buildComplaintInternalEmail(emailInput);
      await sendEmail({ to, subject, html });
    } catch (err) {
      console.error("Complaint internal email failed:", err);
    }

    return NextResponse.json(
      { ok: true, correlativo: row.correlativo, id: row.id },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
