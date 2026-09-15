import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";
import { isPaymentQaRawPayload } from "@/lib/payments/payment-qa";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type Cursor = { createdAt: string; id: string };

function secureEquals(left: string, right: string) {
  const leftDigest = createHash("sha256").update(left).digest();
  const rightDigest = createHash("sha256").update(right).digest();
  return timingSafeEqual(leftDigest, rightDigest);
}

function isAuthorized(request: NextRequest) {
  const configuredToken = process.env.REPORTING_API_TOKEN?.trim();
  if (!configuredToken || configuredToken.length < 32) {
    return "not_configured" as const;
  }

  const authorization = request.headers.get("authorization") ?? "";
  const suppliedToken = authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : "";

  return secureEquals(suppliedToken, configuredToken)
    ? ("authorized" as const)
    : ("unauthorized" as const);
}

function encodeCursor(cursor: Cursor) {
  return Buffer.from(JSON.stringify(cursor), "utf8").toString("base64url");
}

function decodeCursor(value: string | null): Cursor | null {
  if (!value || value.length > 300) return null;
  try {
    const parsed = JSON.parse(
      Buffer.from(value, "base64url").toString("utf8"),
    ) as Cursor;
    if (
      !parsed ||
      typeof parsed.createdAt !== "string" ||
      Number.isNaN(Date.parse(parsed.createdAt)) ||
      !/^[0-9a-f-]{36}$/i.test(parsed.id)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function response(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

/**
 * Fuente de datos mínima para Google Sheets. Excluye datos personales, payloads
 * de pasarela y cobros internos de QA.
 */
export async function GET(request: NextRequest) {
  const authorization = isAuthorized(request);
  if (authorization === "not_configured") {
    return response({ error: "Reporte no configurado" }, 503);
  }
  if (authorization !== "authorized") {
    return response({ error: "No autorizado" }, 401);
  }

  const requestedLimit = Number(request.nextUrl.searchParams.get("limit"));
  const limit = Number.isInteger(requestedLimit)
    ? Math.min(Math.max(requestedLimit, 1), 500)
    : 200;
  const cursorParam = request.nextUrl.searchParams.get("cursor");
  const cursor = decodeCursor(cursorParam);
  if (cursorParam && !cursor) {
    return response({ error: "Cursor inválido" }, 400);
  }

  try {
    const supabase = createServiceClient();
    const fetchLimit = Math.min(limit + 50, 550);
    let query = supabase
      .from("payments")
      .select(
        "id, enrollment_id, lead_id, payment_provider, provider_payment_id, amount, currency, status, created_at, paid_at, raw_payload",
      )
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(fetchLimit);

    if (cursor) {
      query = query.or(
        `created_at.lt.${cursor.createdAt},and(created_at.eq.${cursor.createdAt},id.lt.${cursor.id})`,
      );
    }

    const { data, error } = await query;
    if (error) {
      console.error("[reports/commerce] consulta de pagos falló", {
        errorCode: error.code,
      });
      return response({ error: "No se pudo generar el reporte" }, 500);
    }

    const rawRows = data ?? [];
    const paymentRows: typeof rawRows = [];
    let nextCursorRow: (typeof rawRows)[number] | null = null;

    for (const row of rawRows) {
      if (!isPaymentQaRawPayload(row.raw_payload)) paymentRows.push(row);
      if (paymentRows.length === limit) {
        nextCursorRow = row;
        break;
      }
    }

    if (paymentRows.length < limit && rawRows.length === fetchLimit) {
      nextCursorRow = rawRows.at(-1) ?? null;
    }

    const enrollmentIds = paymentRows
      .map((row) => row.enrollment_id)
      .filter((id): id is string => Boolean(id));
    const leadIds = paymentRows
      .map((row) => row.lead_id)
      .filter((id): id is string => Boolean(id));

    const [{ data: enrollments }, { data: leads }] = await Promise.all([
      enrollmentIds.length
        ? supabase
            .from("enrollments")
            .select("id, course_id")
            .in("id", enrollmentIds)
        : Promise.resolve({ data: [] }),
      leadIds.length
        ? supabase
            .from("contact_leads")
            .select(
              "id, utm_source, utm_medium, utm_campaign, utm_content, landing_path",
            )
            .in("id", leadIds)
        : Promise.resolve({ data: [] }),
    ]);

    const courseIds = (enrollments ?? [])
      .map((enrollment) => enrollment.course_id)
      .filter((id): id is string => Boolean(id));
    const { data: courses } = courseIds.length
      ? await supabase
          .from("courses")
          .select("id, title, slug")
          .in("id", courseIds)
      : { data: [] };

    const enrollmentsById = new Map(
      (enrollments ?? []).map((item) => [item.id, item]),
    );
    const leadsById = new Map((leads ?? []).map((item) => [item.id, item]));
    const coursesById = new Map(
      (courses ?? []).map((item) => [item.id, item]),
    );

    const items = paymentRows.slice(0, limit).map((payment) => {
      const enrollment = payment.enrollment_id
        ? enrollmentsById.get(payment.enrollment_id)
        : undefined;
      const course = enrollment?.course_id
        ? coursesById.get(enrollment.course_id)
        : undefined;
      const lead = payment.lead_id
        ? leadsById.get(payment.lead_id)
        : undefined;

      return {
        id: payment.id,
        reference: payment.provider_payment_id,
        provider: payment.payment_provider,
        status: payment.status,
        amount: Number(payment.amount),
        currency: payment.currency,
        createdAt: payment.created_at,
        paidAt: payment.paid_at,
        courseId: course?.id ?? enrollment?.course_id ?? null,
        courseTitle: course?.title ?? "Sin curso asociado",
        courseSlug: course?.slug ?? null,
        utmSource: lead?.utm_source ?? null,
        utmMedium: lead?.utm_medium ?? null,
        utmCampaign: lead?.utm_campaign ?? null,
        utmContent: lead?.utm_content ?? null,
        landingPath: lead?.landing_path ?? null,
      };
    });

    return response({
      generatedAt: new Date().toISOString(),
      items,
      nextCursor: nextCursorRow
        ? encodeCursor({
            createdAt: nextCursorRow.created_at,
            id: nextCursorRow.id,
          })
        : null,
    });
  } catch {
    console.error("[reports/commerce] error inesperado");
    return response({ error: "No se pudo generar el reporte" }, 500);
  }
}
