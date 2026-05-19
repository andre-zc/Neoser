import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { guestEnrollmentSchema } from "@/lib/schemas";
import { createIzipayPayment } from "@/lib/payments/izipay";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = guestEnrollmentSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { courseId, guestName, guestEmail, guestPhone, notes, utmSource } =
      parsed.data;

    // Fetch course para amount + title
    const supabase = createServiceClient();
    const { data: course, error: courseError } = await supabase
      .from("courses")
      .select("id, title, price, currency, slug, is_published")
      .eq("id", courseId)
      .single();

    if (courseError || !course || !course.is_published) {
      return NextResponse.json(
        { error: "Curso no disponible" },
        { status: 404 },
      );
    }

    const orderReference = `enroll_${crypto.randomUUID()}`;
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const intent = await createIzipayPayment({
      orderReference,
      amount: Number(course.price),
      currency: "PEN",
      customerEmail: guestEmail,
      customerName: guestName,
      customerPhone: guestPhone,
      description: `Inscripción: ${course.title}`,
      successUrl: `${baseUrl}/checkout/success?orderRef=${orderReference}`,
      failureUrl: `${baseUrl}/checkout/failure?orderRef=${orderReference}`,
      metadata: {
        courseId: course.id,
        guestName,
        guestEmail,
        guestPhone,
        notes,
        utmSource,
      },
    });

    return NextResponse.json({
      checkoutUrl: intent.checkoutUrl,
      orderReference: intent.orderReference,
      provider: intent.provider,
    });
  } catch {
    return NextResponse.json(
      { error: "Error inesperado al crear el pago" },
      { status: 500 },
    );
  }
}
