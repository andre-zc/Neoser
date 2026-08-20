import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { LEGAL, RUTAS_LEGALES } from "@/lib/legal";

/**
 * Contenedor común de las páginas legales.
 *
 * Mantiene una sola estructura visual (encabezado, tipografía, navegación
 * entre documentos y datos del titular) para que Términos, Privacidad,
 * Devoluciones y el Libro de Reclamaciones se vean como un mismo bloque legal.
 */
export function LegalShell({
  title,
  intro,
  children,
  currentPath,
}: {
  title: string;
  intro?: string;
  children: React.ReactNode;
  currentPath: string;
}) {
  return (
    <main className="min-h-screen bg-cream">
      <SiteHeader />

      <section className="bg-white pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-main">
          <p className="section-tag mb-2">Información legal</p>
          <h1 className="text-3xl font-bold text-navy md:text-4xl">{title}</h1>
          {intro && (
            <p className="mt-4 max-w-3xl leading-relaxed text-gray-500">
              {intro}
            </p>
          )}
          <p className="mt-4 text-sm text-gray-400">
            Última actualización: {LEGAL.actualizado}
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container-main">
          {/* Navegación entre documentos legales */}
          <nav className="mb-10 flex flex-wrap gap-2">
            {RUTAS_LEGALES.map((r) => {
              const active = r.href === currentPath;
              return (
                <Link
                  key={r.href}
                  href={r.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    active
                      ? "bg-navy text-white"
                      : "bg-white text-gray-600 ring-1 ring-gray-200 hover:ring-pink"
                  }`}
                >
                  {r.label}
                </Link>
              );
            })}
          </nav>

          <div className="surface-card p-6 md:p-10">
            <div
              className="space-y-4 leading-relaxed text-gray-600
                [&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy
                [&_h2:first-child]:mt-0
                [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-bold [&_h3]:text-navy
                [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6
                [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6
                [&_strong]:text-navy
                [&_a]:font-medium [&_a]:text-pink [&_a]:underline"
            >
              {children}
            </div>
          </div>

          {/* Datos del titular */}
          <div className="mt-8 rounded-2xl bg-white p-6 text-sm leading-relaxed text-gray-500 ring-1 ring-gray-100">
            <p className="mb-1 font-semibold text-navy">{LEGAL.razonSocial}</p>
            <p>
              RUC {LEGAL.ruc} · {LEGAL.direccion}
            </p>
            <p>
              {LEGAL.telefono} ·{" "}
              <a
                href={`mailto:${LEGAL.email}`}
                className="font-medium text-pink hover:underline"
              >
                {LEGAL.email}
              </a>{" "}
              · {LEGAL.horario}
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
