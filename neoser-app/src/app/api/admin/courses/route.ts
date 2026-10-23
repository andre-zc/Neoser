import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
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

    const { data, error } = await supabase
      .from("courses")
      .select("id, title, slug, is_published")
      .order("title", { ascending: true });
    if (error) {
      return NextResponse.json(
        { error: "No se pudieron cargar los cursos" },
        { status: 500 },
      );
    }

    return NextResponse.json({ items: data ?? [] });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
