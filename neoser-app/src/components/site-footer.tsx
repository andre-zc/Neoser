import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import { LEGAL, RUTAS_LEGALES } from "@/lib/legal";

/**
 * Footer compartido de todo el sitio.
 *
 * Antes el footer vivía solo dentro de la home, así que las páginas internas
 * (servicios, cursos, checkout, legales) quedaban sin datos de contacto ni
 * enlaces legales. Culqi revisa el sitio completo y exige que la información
 * legal y de contacto esté disponible en todas las URLs, no solo en el inicio.
 */

const SOCIAL = [
  {
    href: "https://www.instagram.com/neoserper",
    label: "Instagram de NeoSer",
    path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z",
    size: 16,
  },
  {
    href: "https://www.facebook.com/NeoSerPeru",
    label: "Facebook de NeoSer",
    path: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0 0 3.604 0 8.05 0 12.067 2.928 15.396 6.75 16v-5.624H4.718V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.822-.604 6.75-3.934 6.75-7.951z",
    size: 16,
  },
  {
    href: "https://www.tiktok.com/@neoserperu",
    label: "TikTok de NeoSer",
    path: "M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0z",
    size: 14,
  },
];

export function SiteFooter() {
  return (
    <footer className="footer py-16">
      <div className="container-main">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <Image
              src="/assets/logo-white.png"
              alt="NeoSer"
              width={320}
              height={128}
              className="footer-logo mb-4"
            />
            <p className="text-sm leading-relaxed opacity-70">
              Centro de maternidad y medicina humanizada en Chiclayo.
              Acompañamos cada etapa de tu maternidad con calidez y
              profesionalismo.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="transition hover:text-pink">
                  Inicio
                </Link>
              </li>
              <li>
                <Link href="/servicios" className="transition hover:text-pink">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/cursos" className="transition hover:text-pink">
                  Cursos
                </Link>
              </li>
              <li>
                <Link href="/#nosotros" className="transition hover:text-pink">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link href="/#contacto" className="transition hover:text-pink">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Legal</h4>
            <ul className="space-y-2 text-sm">
              {RUTAS_LEGALES.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="transition hover:text-pink">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/libro-de-reclamaciones"
              className="mt-4 inline-flex items-center gap-2 rounded-lg border border-white/25 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/15"
            >
              <span aria-hidden>📘</span> Libro de Reclamaciones
            </Link>
          </div>

          <div>
            <h4 className="mb-4 font-semibold text-white">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-pink" />
                <span>{LEGAL.direccionCorta}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0 text-pink" />
                <a
                  href={`tel:${LEGAL.telefonoLink}`}
                  className="transition hover:text-pink"
                >
                  {LEGAL.telefono}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0 text-pink" />
                <a
                  href={`mailto:${LEGAL.email}`}
                  className="transition hover:text-pink"
                >
                  {LEGAL.email}
                </a>
              </li>
            </ul>
            <div className="mt-4 flex gap-3">
              {SOCIAL.map((s) => (
                <a
                  key={s.href}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 transition-colors hover:bg-pink"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={s.size}
                    height={s.size}
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    aria-hidden="true"
                  >
                    <path d={s.path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Datos del titular — requisito de identificación del comercio */}
        <div className="footer-divider mt-10 flex flex-col items-center gap-2 pt-8 text-center">
          <p className="text-sm font-semibold text-white/90">
            {LEGAL.razonSocial}
          </p>
          <p className="text-xs opacity-70">
            RUC {LEGAL.ruc} · {LEGAL.direccion}
          </p>
          <p className="text-xs opacity-70">
            {LEGAL.horario} · {LEGAL.telefono} · {LEGAL.email}
          </p>
          <p className="mt-2 text-sm opacity-60">
            &copy; 2026 NeoSer — Maternidad y Medicina Humanizada. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
