"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function getCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  return { email, password };
}

export async function login(formData: FormData) {
  const { email, password } = getCredentials(formData);
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const errorCode =
      error.code === "email_not_confirmed"
        ? "email_not_confirmed"
        : "invalid_credentials";
    redirect(`/login?error=${errorCode}`);
  }

  redirect("/admin");
}
