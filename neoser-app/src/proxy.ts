import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response =
    pathname === "/login" ||
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
      ? await updateSession(request)
      : NextResponse.next();

  // Evita indexar el dominio de staging sin duplicar middleware en Next.js 16.
  const host = request.headers.get("host") || "";
  if (host.endsWith(".vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
