"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar } from "lucide-react";

const ANCHOR_LINKS = [
  { id: "inicio", label: "Inicio" },
  { id: "cursos", label: "Cursos" },
  { id: "reserva", label: "Reserva" },
  { id: "nosotros", label: "Nosotros" },
  { id: "noticias", label: "Noticias" },
  { id: "contacto", label: "Contacto" },
];

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
              <Image src="/assets/logo-white.png" alt="NeoSer" width={320} height={128} className="logo-white h-24 w-auto md:h-32" priority={isHome} />
              <Image src="/assets/logo-color.png" alt="NeoSer" width={260} height={104} className="logo-color h-20 w-auto md:h-24" priority={!isHome} />
            </span>
            <span className="navbar-script">¡Porque nacer y vivir con amor cambia el mundo!</span>
          </Link>
          <div className="hidden items-center gap-8 lg:flex">
            <a href={anchorHref("inicio")} className="nav-link">Inicio</a>
            <Link href="/servicios" className="nav-link">Servicios</Link>
            <a href={anchorHref("cursos")} className="nav-link">Cursos</a>
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
        <Link href="/servicios" className="nav-link" onClick={closeMobile}>Servicios</Link>
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
