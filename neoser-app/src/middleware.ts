import { NextResponse, type NextRequest } from "next/server";

/**
 * En dominios *.vercel.app (staging) pedimos a Google no indexar,
 * para que no salga el branding "Vercel" en búsquedas de NeoSer.
 * Producción (neoser.pe) no se toca.
 */
export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const response = NextResponse.next();

  if (host.includes("vercel.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
