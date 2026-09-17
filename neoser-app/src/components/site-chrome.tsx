"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { WhatsappFab, RegistrateFab } from "@/components/whatsapp-button";

/**
 * Chrome global (footer + FABs). En landings de campaña `/lp/*` se oculta
 * para no sacar a la visitante del recorrido de conversión.
 */
export function SiteChrome() {
  const pathname = usePathname();
  if (pathname?.startsWith("/lp")) return null;

  return (
    <>
      <SiteFooter />
      <WhatsappFab />
      <RegistrateFab />
    </>
  );
}
