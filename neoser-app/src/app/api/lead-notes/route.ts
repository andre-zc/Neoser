import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createLeadNoteSchema } from "@/lib/schemas";
import { z } from "zod";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return null;
  return user;
}

type NoteRow = {
  id: string;
  lead_id: string;
  author_id: string;
  body: string;
  created_at: string;
};

async function attachAuthorProfiles(
  supabase: Awaited<ReturnType<typeof createClient>>,
  notes: NoteRow[],
) {
  const authorIds = [...new Set(notes.map((note) => note.author_id))];
  if (!authorIds.length) return [];

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name")
    .in("id", authorIds);
  if (error) throw new Error("No se pudieron obtener los autores");

  const profilesById = new Map(
    (profiles ?? []).map((profile) => [profile.id, profile]),
  );
  return notes.map((note) => ({
    ...note,
    profiles: profilesById.get(note.author_id) ?? null,
  }));
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const user = await requireAdmin(supabase);
    if (!user) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const rawLeadIds =
      request.nextUrl.searchParams.get("leadIds") ??
      request.nextUrl.searchParams.get("leadId") ??
      "";
    const parsedLeadIds = z
      .array(z.string().uuid())
      .min(1)
      .max(25)
      .safeParse(rawLeadIds.split(",").filter(Boolean));
    if (!parsedLeadIds.success) {
      return NextResponse.json({ error: "leadIds inválidos" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("lead_notes")
      .select("id, lead_id, author_id, body, created_at")
      .in("lead_id", parsedLeadIds.data)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: "Error al obtener notas" }, { status: 500 });
    }

    return NextResponse.json(
      await attachAuthorProfiles(supabase, (data ?? []) as NoteRow[]),
    );
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const user = await requireAdmin(supabase);
    if (!user) {
      return NextResponse.json({ error: "Sin permisos" }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = createLeadNoteSchema.safeParse(payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Datos invalidos", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const { data, error } = await supabase
      .from("lead_notes")
      .insert({
        lead_id: parsed.data.leadId,
        author_id: user.id,
        body: parsed.data.body,
      })
      .select("id, lead_id, author_id, body, created_at")
      .single();

    if (error) {
      return NextResponse.json({ error: "No se pudo guardar la nota" }, { status: 500 });
    }

    const [savedNote] = await attachAuthorProfiles(supabase, [data as NoteRow]);
    return NextResponse.json(savedNote, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error inesperado" }, { status: 500 });
  }
}
