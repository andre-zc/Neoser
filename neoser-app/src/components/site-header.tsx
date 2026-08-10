"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";
import { services, categoryLabels, type ServiceCategory } from "@/lib/services";
import { coursesCatalog } from "@/lib/courses-catalog";

const ANCHOR_LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "reserva", label: "Reserva" },
  { id: "nosotros", label: "Nosotros" },
  { id: "noticias", label: "Noticias" },
  { id: "contacto", label: "Contacto" },
];

// --- Menús desplegables -----------------------------------------------------
// La clienta pidió poder llegar a un servicio o curso concreto desde la barra
// superior, sin entrar antes a la página general (obs. 10/08/2026). Ambos
// catálogos ya viajan en el bundle del cliente (services-carousel, home), así
// que derivamos los enlaces de la misma fuente de verdad para que no se
// desfasen cuando se agregue o quite un ítem.

type MenuLink = { href: string; label: string };
type MenuGroup = { title?: string; links: MenuLink[] };

const CATEGORY_ORDER: ServiceCategory[] = ["medica", "somatica", "comunidad"];

const SERVICE_GROUPS: MenuGroup[] = CATEGORY_ORDER.map((category) => ({
  title: categoryLabels[category].title,
  links: services
    .filter((s) => s.category === category)
    .map((s) => ({ href: `/servicios/${s.slug}`, label: s.navTitle ?? s.title })),
})).filter((g) => g.links.length > 0);

const COURSE_GROUPS: MenuGroup[] = [
  {
    links: coursesCatalog.map((c) => ({
      href: c.landingHref ?? `/cursos/${c.slug}`,
      label: c.navTitle ?? c.title,
    })),
  },
];

function NavDropdown({
  label,
  href,
  groups,
  footerLabel,
  wide = false,
}: {
  label: string;
  href: string;
  groups: MenuGroup[];
  footerLabel: string;
  wide?: boolean;
}) {
  return (
    <div className="nav-dropdown">
      <Link href={href} className="nav-link nav-dropdown-trigger">
        {label}
        <ChevronDown className="nav-dropdown-chevron" aria-hidden="true" />
      </Link>
      <div className={`nav-dropdown-panel ${wide ? "nav-dropdown-panel-wide" : ""}`}>
        <div className={wide ? "nav-dropdown-columns" : ""}>
          {groups.map((group, i) => (
            <div key={group.title ?? i} className="nav-dropdown-group">
              {group.title && (
                <p className="nav-dropdown-group-title">{group.title}</p>
              )}
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="nav-dropdown-item">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <Link href={href} className="nav-dropdown-footer">
          {footerLabel}
        </Link>
      </div>
    </div>
  );
}

function MobileAccordion({
  label,
  href,
  groups,
  onNavigate,
}: {
  label: string;
  href: string;
  groups: MenuGroup[];
  onNavigate: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="mobile-accordion">
      <div className="mobile-accordion-head">
        <Link href={href} className="nav-link" onClick={onNavigate}>
          {label}
        </Link>
        <button
          type="button"
          className={`mobile-accordion-toggle ${open ? "is-open" : ""}`}
          aria-expanded={open}
          aria-label={`${open ? "Ocultar" : "Mostrar"} ${label}`}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
      {open && (
        <div className="mobile-accordion-body">
          {groups.map((group, i) => (
            <div key={group.title ?? i}>
              {group.title && (
                <p className="mobile-accordion-group-title">{group.title}</p>
              )}
              <ul>
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="mobile-accordion-item"
                      onClick={onNavigate}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setNavScrolled(window.scrollY > 50);
        ticking = false;
      });
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeMobile = () => setMobileMenuOpen(false);

  // En home: anchors locales (#inicio). En otras rutas: paths absolutos (/#inicio).
  const anchorHref = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  // Fuera de home, forzar estado "scrolled" para que el navbar tenga fondo
  // blanco visible (sino se pierde sobre el fondo claro de la pagina).
  const showScrolled = !isHome || navScrolled;

  return (
    <>
      <nav className={`navbar ${showScrolled ? "scrolled" : ""}`}>
        <div className="container-main flex items-center justify-between">
          <Link href={isHome ? "#inicio" : "/"} className="navbar-logo flex-shrink-0 flex flex-col items-start">
            <span className="logo-img-wrap">
              <Image src="/assets/logo-white.png" alt="NeoSer" width={320} height={128} className="logo-white h-32 w-auto md:h-40" priority={isHome} />
              <Image src="/assets/logo-color.png" alt="NeoSer" width={200} height={80} className="logo-color h-10 w-auto md:h-12" priority={!isHome} />
            </span>
            <span className="navbar-script">¡Porque nacer y vivir con amor cambia el mundo!</span>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            <a href={anchorHref("inicio")} className="nav-link">Inicio</a>
            <NavDropdown
              label="Servicios"
              href="/servicios"
              groups={SERVICE_GROUPS}
              footerLabel="Ver todos los servicios"
              wide
            />
            <NavDropdown
              label="Cursos"
              href="/cursos"
              groups={COURSE_GROUPS}
              footerLabel="Ver todos los cursos"
            />
            <a href={anchorHref("reserva")} className="nav-link">Reserva</a>
            <a href={anchorHref("nosotros")} className="nav-link">Nosotros</a>
            <a href={anchorHref("noticias")} className="nav-link">Noticias</a>
            <a href={anchorHref("contacto")} className="nav-link">Contacto</a>
            <a href={anchorHref("reserva")} className="btn-nav-cta text-sm">
              <Calendar className="h-4 w-4" /> Reserva tu Cita
            </a>
          </div>
          <div className={`hamburger lg:hidden ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span /><span /><span />
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-overlay ${mobileMenuOpen ? "active" : ""}`} onClick={closeMobile} />
      <div className={`mobile-menu ${mobileMenuOpen ? "active" : ""}`}>
        <a href={anchorHref("inicio")} className="nav-link" onClick={closeMobile}>Inicio</a>
        <MobileAccordion label="Servicios" href="/servicios" groups={SERVICE_GROUPS} onNavigate={closeMobile} />
        <MobileAccordion label="Cursos" href="/cursos" groups={COURSE_GROUPS} onNavigate={closeMobile} />
        {ANCHOR_LINKS.slice(1).map((item) => (
          <a key={item.id} href={anchorHref(item.id)} className="nav-link" onClick={closeMobile}>
            {item.label}
          </a>
        ))}
        <a href={anchorHref("reserva")} onClick={closeMobile} className="btn-primary mt-6 justify-center">
          <Calendar className="h-5 w-5" /> Reserva tu Cita
        </a>
      </div>
    </>
  );
}
