import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { contactCourseInterestSchema } from "@/lib/schemas";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return profile?.role === "admin";
}
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: leadId } = await params;
    const parsedLeadId = z.string().uuid().safeParse(leadId);
    const payload = contactCourseInterestSchema.safeParse(await request.json());
    if (!parsedLeadId.success || !payload.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!(await requireAdmin(supabase))) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { data, error } = await supabase
      .from("contact_course_interests")
      .upsert(
        {
          lead_id: parsedLeadId.data,
          course_id: payload.data.courseId,
          relationship: payload.data.relationship,
        },
        { onConflict: "lead_id,course_id" },
      )
      .select("lead_id, course_id, relationship")
      .single();

    if (error) {
      return NextResponse.json(
        { error: "No se pudo guardar el curso" },
        { status: 500 },
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id: leadId } = await params;
    const parsedLeadId = z.string().uuid().safeParse(leadId);
    const parsedCourseId = z
      .string()
      .uuid()
      .safeParse(request.nextUrl.searchParams.get("courseId"));
    if (!parsedLeadId.success || !parsedCourseId.success) {
      return NextResponse.json({ error: "Datos inválidos" }, { status: 400 });
    }

    const supabase = await createClient();
    if (!(await requireAdmin(supabase))) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const { error } = await supabase
      .from("contact_course_interests")
      .delete()
      .eq("lead_id", parsedLeadId.data)
      .eq("course_id", parsedCourseId.data);

    if (error) {
      return NextResponse.json(
        { error: "No se pudo retirar el curso" },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
