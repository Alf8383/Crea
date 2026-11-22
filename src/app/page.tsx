import {
  ArrowRight,
  BookOpenCheck,
  Calculator,
  CalendarClock,
  Check,
  Compass,
  FileCheck2,
  MapPin,
  Plus,
  Scale,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { AssessmentEntry } from "@/features/evaluation/assessment-entry";
import { ScenarioExplorer } from "@/features/landing/scenario-explorer";
import "@/features/landing/landing.css";

const highlights = [
  {
    icon: Compass,
    text: "Ruta personalizada según tu negocio",
  },
  {
    icon: ShieldCheck,
    text: "Información con fuente y revisión visible",
  },
  {
    icon: Sparkles,
    text: "Preguntas simples, incluso si aún no sabes la respuesta",
  },
];

const entities = [
  { name: "SUNAT", role: "RUC, regímenes y comprobantes" },
  { name: "SUNARP", role: "Constitución de empresas" },
  { name: "Municipalidades", role: "Licencia e inspección ITSE" },
  { name: "Indecopi", role: "Marca y libro de reclamaciones" },
  { name: "DIGESA", role: "Inocuidad alimentaria" },
];

const steps = [
  {
    num: "01",
    title: "Describe tu negocio",
    copy: "Indica qué ofrecerás, cómo atenderás y en qué etapa estás: desde una idea inicial hasta un restaurante en marcha.",
    tag: "3 minutos · sin jerga legal",
  },
  {
    num: "02",
    title: "Explora tu resultado",
    copy: "Compara los regímenes tributarios compatibles, simula tus impuestos y descubre con claridad qué datos faltan afinar.",
    tag: "NRUS · RER · RMT · RG",
  },
  {
    num: "03",
    title: "Sigue tu ruta",
    copy: "Abre cada trámite para entender por qué aplica a tu local en Cajamarca, qué llevar y consultar su fuente oficial.",
    tag: "Lista verificable paso a paso",
  },
];

const directTools = [
  {
    href: "/comparar",
    label: "Comparar regímenes",
    caption: "Enfrenta topes, comprobantes y obligaciones lado a lado.",
    icon: Scale,
  },
  {
    href: "/obligaciones",
    label: "Consultar obligaciones",
    caption: "Revisa declaraciones y fechas de vencimiento según tu RUC.",
    icon: CalendarClock,
  },
  {
    href: "/negocios?seccion=simulador",
    label: "Proyectar ventas",
    caption: "Calcula cuánto podrías vender al mes antes de inscribirte.",
    icon: Calculator,
  },
  {
    href: "/negocios?seccion=ejemplos",
    label: "Probar con un ejemplo",
    caption: "Explora casos ficticios listos con simulador y ruta completa.",
    icon: BookOpenCheck,
  },
];

const questions = [
  {
    question: "¿Necesito saber mi código CIIU?",
    answer:
      "No hace falta memorizar códigos. Puedes describir tu actividad con tus propias palabras, recibir una sugerencia de CREA IA y revisar las opciones del catálogo del INEI antes de confirmar.",
  },
  {
    question: "¿Y si aún no conozco mis ventas?",
    answer:
      "Puedes usar nuestra calculadora para proyectar tus ventas mensuales por plato o bebida, o dejar las cifras como pendientes y completarlas más adelante.",
  },
  {
    question: "¿Dónde puedo usar CREA?",
    answer:
      "El cuestionario y las referencias municipales están diseñados especialmente para negocios gastronómicos del distrito de Cajamarca, Perú.",
  },
  {
    question: "¿Tiene algún costo o debo crear una cuenta primero?",
    answer:
      "Puedes comenzar la evaluación gratis y sin registrarte. Si luego quieres guardar tus avances en la nube o revisar varios escenarios, puedes crear una cuenta en segundos.",
  },
];

export default function Home() {
  return (
    <div className="crea-landing">
      {/* HERO */}
      <section
        id="inicio"
        aria-labelledby="landing-title"
        className="landing-hero-atmosphere relative border-b border-[#e5dfd3]"
      >
        <div className="mx-auto grid max-w-[1360px] items-center gap-12 px-5 pb-16 pt-10 sm:px-10 sm:pb-24 sm:pt-16 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-14">
          <div className="min-w-0">
            <div className="landing-reveal inline-flex items-center gap-2.5 rounded-full border border-[#e5dfd3] bg-white px-4 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-[#9a3b22] shadow-[0_4px_14px_-6px_rgba(10,26,60,0.1)]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[#ffc400] ring-4 ring-[#ffc400]/25"
              />
              Cajamarca · Restaurantes, cafeterías y servicios afines
            </div>

            <h1
              id="landing-title"
              className="landing-serif landing-reveal landing-reveal-d1 mt-6 max-w-[18ch] text-[clamp(2.65rem,5vw,4.5rem)] font-medium leading-[1.03] tracking-[-0.03em] text-[#0a1a3c]"
            >
              Formaliza tu negocio gastronómico en Perú
            </h1>

            <p className="landing-reveal landing-reveal-d2 mt-6 max-w-[54ch] text-lg leading-[1.7] text-[#3b4b6b] sm:text-[1.18rem]">
              Cuéntanos cómo prepararás y servirás tus comidas en Cajamarca —en salón, para llevar,
              por delivery o en un puesto móvil— y descubre con claridad tus pasos, entidades y
              decisiones tributarias.
            </p>

            <div className="landing-reveal landing-reveal-d3 mt-8 flex flex-wrap items-center gap-3.5">
              <AssessmentEntry
                startLabel="Comenzar ahora"
                className="landing-press landing-lift landing-arrow-shift min-h-[3.5rem] rounded-full bg-[#0b4ac9] px-8 py-4 text-base font-extrabold text-white shadow-[0_14px_30px_-10px_rgba(11,74,201,0.55)] hover:bg-[#0839a0]"
              />
              <a
                href="#como-funciona"
                className="landing-press inline-flex min-h-[3.5rem] items-center justify-center rounded-full border border-[#cfc7b8] bg-white px-6 py-3.5 text-base font-extrabold text-[#0a1a3c] hover:border-[#0b4ac9] hover:text-[#0b4ac9]"
              >
                Ver cómo funciona
              </a>
            </div>

            <ul className="landing-reveal landing-reveal-d4 mt-10 grid gap-3 border-t border-[#e5dfd3] pt-7 sm:grid-cols-3 sm:gap-5">
              {highlights.map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-2.5 text-sm font-bold leading-snug text-[#0a1a3c]">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#e8f0fe] text-[#0b4ac9]"
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* EDITORIAL VISUAL COMPOSITION */}
          <div className="landing-photo-reveal relative">
            <div className="relative aspect-[4/4.3] w-full overflow-hidden rounded-[30px] border border-[#dfd8ca] bg-[#2a1d18] shadow-[0_32px_70px_-28px_rgba(10,26,60,0.34)] sm:aspect-[4/4.1]">
              <Image
                src="/restaurante-cajamarca.webp"
                alt="Emprendedora gastronómica tomando notas en su restaurante tradicional en Cajamarca"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1023px) 100vw, 44vw"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#081636]/75 via-[#081636]/10 to-transparent"
              />

              {/* Top floating badge */}
              <div className="absolute left-4 top-4 right-4 flex flex-wrap items-center justify-between gap-2 sm:left-6 sm:right-6 sm:top-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-2 text-xs font-extrabold text-[#0a1a3c] shadow-lg backdrop-blur-md">
                  <MapPin className="h-3.5 w-3.5 text-[#9a3b22]" aria-hidden="true" />
                  Distrito de Cajamarca
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-[#081636]/90 px-3.5 py-2 text-xs font-extrabold text-[#ffc400] shadow-lg backdrop-blur-md">
                  <span>CIIU 5610</span>
                  <span aria-hidden="true" className="text-white/40">·</span>
                  <span className="text-white">Verificado INEI</span>
                </div>
              </div>

              {/* Bottom editorial product card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-2xl backdrop-blur-md sm:bottom-6 sm:left-6 sm:right-6 sm:p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#0b4ac9]">
                    Tu hoja de ruta clara
                  </p>
                  <span className="rounded-full bg-[#e5f5ec] px-2.5 py-0.5 text-xs font-extrabold text-[#115e38]">
                    Paso a paso
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs font-bold text-[#0a1a3c]">
                  <div className="flex items-center gap-1.5 rounded-xl bg-[#faf8f4] px-2.5 py-2">
                    <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#0b4ac9] text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="truncate">RUC SUNAT</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-[#faf8f4] px-2.5 py-2">
                    <span aria-hidden="true" className="grid h-4 w-4 shrink-0 place-items-center rounded-full bg-[#0b4ac9] text-white">
                      <Check className="h-2.5 w-2.5" />
                    </span>
                    <span className="truncate">NRUS / RER</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl border border-[#d4e2fa] bg-[#f2f7ff] px-2.5 py-2 text-[#0b4ac9]">
                    <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-[#ffc400]" />
                    <span className="truncate">Licencia ITSE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL ENTITIES BAND */}
      <section aria-label="Entidades oficiales de referencia" className="border-b border-[#e5dfd3] bg-white">
        <div className="mx-auto max-w-[1360px] px-5 py-8 sm:px-10 sm:py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <p className="max-w-[26ch] text-xs font-extrabold uppercase tracking-[0.14em] text-[#52607a]">
              Información para consultar con entidades oficiales
            </p>
            <ul className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {entities.map((entity) => (
                <li
                  key={entity.name}
                  className="border-l-2 border-[#e5dfd3] pl-3.5"
                >
                  <p className="text-base font-black tracking-tight text-[#0a1a3c]">{entity.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-[#52607a]">{entity.role}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SCENARIO EXPLORER */}
      <section id="escenarios" aria-labelledby="escenarios-title" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-10">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0b4ac9]">
              Vista previa interactiva
            </p>
            <h2
              id="escenarios-title"
              className="landing-serif mt-3 text-[clamp(2rem,3.6vw,3.15rem)] font-medium leading-[1.08] tracking-[-0.025em] text-[#0a1a3c]"
            >
              Cada cocina tiene su propia{" "}
              <em className="italic text-[#0b4ac9]">ruta de formalización</em>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#3b4b6b] sm:text-lg">
              Selecciona un perfil gastronómico para ver cómo CREA identifica la actividad CIIU,
              compara los regímenes tributarios y prioriza los trámites en Cajamarca.
            </p>
          </div>

          <ScenarioExplorer />
        </div>
      </section>

      {/* HOW IT WORKS — DEEP NAVY ARCHITECTURAL BAND */}
      <section
        id="como-funciona"
        aria-labelledby="como-funciona-title"
        className="landing-navy-grid py-16 text-white sm:py-24"
      >
        <div className="mx-auto max-w-[1360px] px-5 sm:px-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div className="max-w-2xl">
              <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffc400]">
                Sin trámites enredados
              </p>
              <h2
                id="como-funciona-title"
                className="landing-serif mt-3 text-[clamp(2.1rem,3.8vw,3.3rem)] font-medium leading-[1.06] tracking-[-0.025em] text-white"
              >
                Cómo funciona
              </h2>
            </div>
            <p className="max-w-md text-base leading-relaxed text-[#cbd5e8]">
              Tres pasos pensados para dueños de restaurantes y emprendedores que necesitan respuestas
              concretas hoy mismo.
            </p>
          </div>

          <ol className="mt-12 grid gap-5 lg:grid-cols-3">
            {steps.map((step) => (
              <li
                key={step.num}
                className="flex flex-col justify-between rounded-[24px] border border-white/12 bg-[#10234d]/85 p-7 backdrop-blur-sm sm:p-8"
              >
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <span
                      aria-hidden="true"
                      className="landing-serif text-4xl font-medium tracking-tight text-[#ffc400]"
                    >
                      {step.num}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-bold text-[#cbd5e8]">
                      {step.tag}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-extrabold text-white">{step.title}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[#cbd5e8]">{step.copy}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* DIRECT TOOLS DOCK */}
          <div className="mt-12 rounded-[26px] border border-white/14 bg-[#0d1e44]/90 p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-5">
              <h3 className="text-sm font-extrabold uppercase tracking-[0.14em] text-[#ffc400]">
                Herramientas de consulta directa
              </h3>
              <p className="text-xs font-semibold text-[#cbd5e8]">
                Acceso libre · sin iniciar el cuestionario
              </p>
            </div>
            <nav
              aria-label="Consultas directas"
              className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4"
            >
              {directTools.map(({ href, label, caption, icon: Icon }) => (
                <div
                  key={href}
                  className="group flex flex-col justify-between rounded-2xl border border-white/12 bg-[#132959] p-5 transition-colors duration-200 hover:border-[#ffc400]/60 hover:bg-[#17326b]"
                >
                  <div>
                    <span
                      aria-hidden="true"
                      className="grid h-10 w-10 place-items-center rounded-xl bg-white/10 text-[#ffc400]"
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 text-sm leading-relaxed text-[#cbd5e8]">{caption}</p>
                  </div>
                  <Link
                    href={href}
                    className="landing-arrow-shift mt-5 inline-flex min-h-11 items-center justify-between gap-2 border-t border-white/10 pt-3 text-sm font-extrabold text-white underline decoration-[#ffc400]/70 underline-offset-4 hover:text-[#ffc400]"
                  >
                    <span>{label}</span>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[#ffc400]" aria-hidden="true" />
                  </Link>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* BENEFITS — ASYMMETRIC BENTO GRID */}
      <section id="beneficios" aria-labelledby="beneficios-title" className="py-16 sm:py-24">
        <div className="mx-auto max-w-[1360px] px-5 sm:px-10">
          <div className="max-w-2xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9a3b22]">
              Diseñado con rigor y cercanía
            </p>
            <h2
              id="beneficios-title"
              className="landing-serif mt-3 text-[clamp(2.1rem,3.8vw,3.3rem)] font-medium leading-[1.06] tracking-[-0.025em] text-[#0a1a3c]"
            >
              Beneficios
            </h2>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-12">
            {/* Large featured bento card */}
            <article className="landing-card-hover flex flex-col justify-between rounded-[26px] border border-[#e5dfd3] bg-white p-7 sm:p-9 lg:col-span-7">
              <div>
                <span
                  aria-hidden="true"
                  className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-[#e8f0fe] text-[#0b4ac9]"
                >
                  <TrendingUp className="h-6 w-6" />
                </span>
                <h3 className="landing-serif mt-6 text-2xl font-medium text-[#0a1a3c] sm:text-3xl">
                  Ruta según tu negocio
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#3b4b6b]">
                  Las preguntas se adaptan automáticamente a tu etapa y tipo de establecimiento. Si
                  aún tienes una idea, no te pedimos datos de RUC ni compras pasadas; si ya estás
                  operando, evaluamos tus cifras reales.
                </p>
              </div>
              <div className="mt-8 grid gap-3 rounded-2xl bg-[#faf8f4] p-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#e5dfd3] bg-white p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#9a3b22]">
                    Si estás empezando
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-[#0a1a3c]">
                    Proyección de ventas → Escenario inicial → Trámites clave
                  </p>
                </div>
                <div className="rounded-xl border border-[#e5dfd3] bg-white p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#0b4ac9]">
                    Si ya vendes
                  </p>
                  <p className="mt-1.5 text-sm font-bold text-[#0a1a3c]">
                    Diagnóstico de régimen → Simulador IGV/Renta → Calendario SUNAT
                  </p>
                </div>
              </div>
            </article>

            {/* Right column stacked cards */}
            <div className="grid gap-5 lg:col-span-5">
              <article className="landing-card-hover rounded-[26px] border border-[#e5dfd3] bg-white p-7">
                <span
                  aria-hidden="true"
                  className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-[#fff4d6] text-[#8a5700]"
                >
                  <FileCheck2 className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-[#0a1a3c]">Fuentes visibles</h3>
                <p className="mt-2 text-base leading-relaxed text-[#3b4b6b]">
                  Cada paso y regla tributaria muestra la entidad responsable, la versión revisada y
                  el enlace oficial para que puedas verificarlo directamente.
                </p>
              </article>

              <article className="landing-card-hover rounded-[26px] border border-[#e5dfd3] bg-[#f3eee5] p-7">
                <span
                  aria-hidden="true"
                  className="inline-grid h-11 w-11 place-items-center rounded-2xl bg-[#0a1a3c] text-[#ffc400]"
                >
                  <CalendarClock className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-extrabold text-[#0a1a3c]">A tu ritmo</h3>
                <p className="mt-2 text-base leading-relaxed text-[#3b4b6b]">
                  Puedes pausar y retomar el cuestionario en la misma pestaña sin perder tus
                  respuestas, o guardar tu diagnóstico en un reporte listo para imprimir en PDF.
                </p>
              </article>
            </div>

            {/* Full-width Cajamarca local identity strip */}
            <article className="grid overflow-hidden rounded-[26px] border border-[#e5dfd3] bg-white lg:col-span-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#0b4ac9]">
                  Enfoque territorial
                </p>
                <h3 className="landing-serif mt-2.5 text-2xl font-medium text-[#0a1a3c] sm:text-3xl">
                  Hecho para la realidad gastronómica de Cajamarca
                </h3>
                <p className="mt-3 max-w-xl text-base leading-relaxed text-[#3b4b6b]">
                  Desde cafeterías en el centro histórico hasta pollerías, picanterías, caterings y
                  módulos familiares. Incorporamos las reglas tributarias del Perú (incluyendo la
                  tasa especial de IGV para restaurantes MYPE) y las referencias locales del
                  distrito.
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {["Restaurantes", "Cafeterías", "Pollerías", "Catering", "Delivery", "Puestos móviles"].map(
                    (tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-[#e5dfd3] bg-[#faf8f4] px-3.5 py-1.5 text-xs font-extrabold text-[#0a1a3c]"
                      >
                        {tag}
                      </span>
                    ),
                  )}
                </div>
              </div>
              <div className="relative min-h-64 overflow-hidden bg-[#d8e4f2]">
                <Image
                  src="/cajamarca-plaza.jpg"
                  alt="Vista de la Plaza de Armas y la Catedral de Cajamarca"
                  fill
                  className="scale-110 object-cover object-[35%_30%]"
                  sizes="(max-width: 1023px) 100vw, 42vw"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-gradient-to-r from-white/25 via-transparent to-transparent"
                />
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* FAQ — STICKY EDITORIAL TWO-COLUMN */}
      <section
        id="preguntas"
        aria-labelledby="preguntas-title"
        className="border-t border-[#e5dfd3] bg-white py-16 sm:py-24"
      >
        <div className="mx-auto grid max-w-[1360px] gap-10 px-5 sm:px-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#0b4ac9]">
              Resolvemos tus dudas
            </p>
            <h2
              id="preguntas-title"
              className="landing-serif mt-3 text-[clamp(2rem,3.5vw,3.1rem)] font-medium leading-[1.08] tracking-[-0.025em] text-[#0a1a3c]"
            >
              Preguntas frecuentes
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[#3b4b6b]">
              ¿Tienes una duda específica sobre tu actividad o un trámite? También puedes abrir el
              asistente <strong className="font-extrabold text-[#0a1a3c]">CREA IA</strong> en la
              esquina inferior derecha en cualquier momento.
            </p>
          </div>

          <div className="space-y-3.5">
            {questions.map(({ question, answer }) => (
              <details
                key={question}
                className="landing-faq group rounded-2xl border border-[#e5dfd3] bg-[#faf8f4] transition-colors open:border-[#b9c8e6] open:bg-white"
              >
                <summary className="flex min-h-[4.25rem] cursor-pointer items-center justify-between gap-4 px-6 py-4 text-base font-extrabold text-[#0a1a3c] sm:text-lg">
                  <span>{question}</span>
                  <span
                    aria-hidden="true"
                    className="landing-faq-icon grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#e8f0fe] text-[#0b4ac9]"
                  >
                    <Plus className="h-4 w-4" />
                  </span>
                </summary>
                <div className="px-6 pb-6 pt-1 text-base leading-relaxed text-[#3b4b6b]">
                  {answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA BANNER */}
      <section aria-labelledby="cta-title" className="px-5 py-16 sm:px-10 sm:py-20">
        <div className="landing-navy-grid mx-auto max-w-[1360px] overflow-hidden rounded-[32px] px-7 py-12 text-white shadow-[0_30px_70px_-25px_rgba(8,22,54,0.45)] sm:px-14 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffc400]">
                <span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#ffc400]" />
                Gratis · Orientación estructurada
              </p>
              <h2
                id="cta-title"
                className="landing-serif mt-3 text-[clamp(2rem,3.8vw,3.35rem)] font-medium leading-[1.06] tracking-[-0.025em] text-white"
              >
                Empieza hoy con claridad, paso a paso
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-[#cbd5e8] sm:text-lg">
                Obtén tu diagnóstico tributario, proyecta tus ventas y organiza la ruta de
                formalización de tu negocio gastronómico en minutos.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/negocios/nuevo"
                className="landing-press landing-lift landing-arrow-shift inline-flex min-h-[3.5rem] items-center gap-2.5 rounded-full bg-[#ffc400] px-8 py-4 text-base font-black text-[#081636] shadow-[0_14px_30px_-10px_rgba(255,196,0,0.45)] hover:bg-[#ffd033]"
              >
                Evaluar mi negocio ahora
                <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PHOTO ATTRIBUTION */}
      <div className="border-t border-[#e5dfd3] bg-[#faf8f4] px-5 py-4 text-xs font-semibold text-[#52607a] sm:px-10">
        <div className="mx-auto max-w-[1360px]">
          <a
            href="https://commons.wikimedia.org/wiki/File:PLAZA_DE_ARMAS_DE_CAJAMARCA.jpg"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-[#9aa7bd] underline-offset-2 hover:text-[#0b4ac9]"
          >
            Foto de Plaza de Armas de Cajamarca por Carlos jc en Wikimedia Commons · CC BY-SA 4.0
          </a>
        </div>
      </div>
    </div>
  );
}
