"use client";

import { ArrowUpRight, LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useSession } from "@/features/auth/session";
import { Button } from "@/components/ui/button";
import { LinkButton } from "@/components/ui/primitives";
import { useActiveAssessment } from "@/features/evaluation/assessment-entry";
import { Brand } from "./brand";

const pages = [
  { path: "/", label: "Inicio" },
  { path: "/comparar", label: "Comparar regímenes" },
  { path: "/obligaciones", label: "Consultar obligaciones" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuPath, setMenuPath] = useState<string | null>(null);
  const menuOpen = menuPath === pathname;
  const { user, signOut, mode } = useSession();
  const active = useActiveAssessment();
  const workspaceLabel = user ? "Mis evaluaciones" : active ? "Mi diagnóstico" : undefined;
  const [error, setError] = useState(false);
  const modeLabel = mode === "demo" ? "Modo demostración" : mode === "offline" ? "Cuentas sin conexión" : null;

  async function logout() {
    try {
      await signOut();
      setError(false);
    } catch {
      setError(true);
    }
  }

  const authPage = pathname === "/ingresar" || pathname === "/registro";
  if (pathname === "/negocios/nuevo" || authPage) return <>
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <header className="bg-[#edf5fb] px-4 pt-5 font-[Arial,Helvetica,sans-serif] sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 rounded-t-[28px] border-b border-blue-100 bg-white px-6 py-5 sm:px-10">
        <Brand />
        <nav aria-label="Navegación principal" className="flex gap-3 text-sm font-semibold text-[#0a4db7]">
          <Link href="/" className="rounded-xl px-4 py-3 hover:bg-blue-50">Inicio</Link>
          {authPage && !user ? <Link href={pathname === "/registro" ? "/ingresar" : "/registro"} className="rounded-xl bg-[#1464f6] px-4 py-3 text-white">
            {pathname === "/registro" ? "Iniciar sesión" : "Crear cuenta"}
          </Link> : <Link href="/negocios" className="rounded-xl border border-blue-200 px-4 py-3">Mi espacio</Link>}
        </nav>
      </div>
    </header>
  </>;

  if (pathname === "/") return <>
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <header className="border-b border-[#e5dfd3]/90 bg-[#faf8f4]/90 backdrop-blur-md lg:sticky lg:top-0 lg:z-30 [font-family:'Nunito_Variable','Nunito',system-ui,sans-serif]">
      <div className="mx-auto flex max-w-[1360px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-5 py-3.5 sm:px-10">
        <Brand />
        <nav aria-label="Navegación principal" className="order-last flex w-full flex-wrap items-center gap-x-1 gap-y-0.5 text-sm font-bold text-[#3b4b6b] lg:order-none lg:w-auto lg:gap-2">
          <a href="#inicio" className="inline-flex min-h-11 items-center rounded-full px-3.5 text-[#0a1a3c] transition-colors hover:bg-[#efeae0] hover:text-[#0b4ac9]">Inicio</a>
          <a href="#escenarios" className="inline-flex min-h-11 items-center rounded-full px-3.5 transition-colors hover:bg-[#efeae0] hover:text-[#0b4ac9]">Escenarios</a>
          <a href="#como-funciona" className="inline-flex min-h-11 items-center rounded-full px-3.5 transition-colors hover:bg-[#efeae0] hover:text-[#0b4ac9]">¿Cómo funciona?</a>
          <a href="#beneficios" className="inline-flex min-h-11 items-center rounded-full px-3.5 transition-colors hover:bg-[#efeae0] hover:text-[#0b4ac9]">Beneficios</a>
          <a href="#preguntas" className="inline-flex min-h-11 items-center rounded-full px-3.5 transition-colors hover:bg-[#efeae0] hover:text-[#0b4ac9]">Preguntas frecuentes</a>
        </nav>
        <div className="flex flex-wrap items-center gap-2 text-sm font-extrabold">
          {user ? <>
            <Link href="/negocios" className="inline-flex min-h-11 items-center rounded-full bg-[#0b4ac9] px-5 text-white transition-[transform,background-color] duration-150 hover:bg-[#0839a0] active:scale-[0.97]">Mis evaluaciones</Link>
            <Button variant="ghost" onClick={logout}>Salir <LogOut aria-hidden="true" /></Button>
          </> : <>
            <Link href="/ingresar" className="inline-flex min-h-11 items-center rounded-full border border-[#c9d4e8] bg-white px-4 text-[#0a1a3c] transition-[transform,border-color,background-color] duration-150 hover:border-[#0b4ac9] hover:text-[#0b4ac9] active:scale-[0.97]">Iniciar sesión</Link>
            <Link href="/registro" className="inline-flex min-h-11 items-center rounded-full bg-[#0b4ac9] px-5 text-white shadow-[0_8px_20px_-8px_rgba(11,74,201,0.55)] transition-[transform,background-color] duration-150 hover:bg-[#0839a0] active:scale-[0.97]">Crear cuenta</Link>
          </>}
        </div>
        {error && <p role="alert" className="w-full text-sm text-destructive">No pudimos cerrar tu sesión. Intenta de nuevo.</p>}
      </div>
    </header>
  </>;

  return <>
    <a href="#contenido" className="skip-link">Saltar al contenido</a>
    <header className="site-header">
      <div className="container-site header-inner">
        <Brand />
        {modeLabel && <span className="mode-label mobile-mode">{modeLabel}</span>}
        <Button size="icon" variant="outline" className="mobile-menu" aria-expanded={menuOpen} aria-controls="site-menu" aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"} onClick={() => setMenuPath(menuOpen ? null : pathname)}>
          {menuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </Button>
        <div id="site-menu" className="site-menu" data-open={menuOpen} onKeyDown={(event) => {
          if (event.key === "Escape" && menuOpen) {
            setMenuPath(null);
            document.querySelector<HTMLButtonElement>(".mobile-menu")?.focus();
          }
        }}>
          <nav className="primary-nav" aria-label="Navegación principal">
            {pages.map(({ path, label }) => <Link key={path} href={path} aria-current={pathname === path ? "page" : undefined} onClick={() => setMenuPath(null)}>{label}</Link>)}
            {workspaceLabel && <Link href="/negocios" aria-current={pathname === "/negocios" ? "page" : undefined} onClick={() => setMenuPath(null)}>{workspaceLabel}</Link>}
          </nav>
          <div className="header-actions">
            {modeLabel && <span className="mode-label">{modeLabel}</span>}
            {user
              ? <Button variant="ghost" onClick={logout}>Salir <LogOut aria-hidden="true" /></Button>
              : <LinkButton href="/ingresar" variant="outline" onClick={() => setMenuPath(null)}>Ingresar <ArrowUpRight aria-hidden="true" /></LinkButton>}
          </div>
        </div>
      </div>
      {error && <p role="alert" className="container-site pb-2 text-sm text-destructive">No pudimos cerrar tu sesión. Intenta de nuevo.</p>}
    </header>
  </>;
}
