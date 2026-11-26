"use client";

import { Tabs } from "@base-ui/react/tabs";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";

const EASE_OUT_EXPO = [0.23, 1, 0.32, 1] as const;

type Scenario = {
  id: string;
  shortLabel: string;
  label: string;
  stage: string;
  summary: string;
  ciiu: string;
  ciiuName: string;
  salesExample: string;
  regimes: { code: string; status: "Compatible" | "Revisar"; note: string }[];
  milestones: { step: string; title: string; entity: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "cafeteria",
    shortLabel: "Cafetería",
    label: "Cafetería en preparación",
    stage: "Solo tengo una idea",
    summary:
      "Café de especialidad, desayunos y pastelería en un local pequeño cerca del centro de Cajamarca.",
    ciiu: "5630",
    ciiuName: "Actividades de servicio de bebidas",
    salesExample: "S/ 4,500 / mes proyectados",
    regimes: [
      {
        code: "Nuevo RUS",
        status: "Compatible",
        note: "Cuota fija mensual si atiendes a consumidores finales con boleta.",
      },
      {
        code: "RER",
        status: "Compatible",
        note: "Recomendado si tus clientes o empresas locales te pedirán factura.",
      },
    ],
    milestones: [
      { step: "01", title: "Definir actividad CIIU e inscripción en el RUC", entity: "SUNAT · INEI" },
      { step: "02", title: "Elegir comprobantes y régimen tributario", entity: "SUNAT" },
      {
        step: "03",
        title: "Licencia de funcionamiento e inspección ITSE",
        entity: "Municipalidad de Cajamarca",
      },
    ],
  },
  {
    id: "polleria",
    shortLabel: "Pollería",
    label: "Pollería con local y delivery",
    stage: "Ya estoy vendiendo",
    summary:
      "Atención en salón y pedidos por delivery con emisión de boletas y facturas a empresas locales.",
    ciiu: "5610",
    ciiuName: "Actividades de restaurantes y de servicio móvil de comidas",
    salesExample: "S/ 18,000 / mes estimados",
    regimes: [
      {
        code: "RER",
        status: "Compatible",
        note: "Hasta S/ 525,000 de ingresos netos anuales con declaración mensual simple.",
      },
      {
        code: "RMT",
        status: "Compatible",
        note: "Escala progresiva de renta si planeas crecer con personal y más equipos.",
      },
    ],
    milestones: [
      { step: "01", title: "Verificar ficha RUC y régimen vigente", entity: "SUNAT" },
      {
        step: "02",
        title: "Evaluar tasa especial de IGV para restaurantes MYPE",
        entity: "SUNAT",
      },
      {
        step: "03",
        title: "Condiciones de cocina a gas, campana extractora e ITSE",
        entity: "Municipalidad · DIGESA",
      },
    ],
  },
  {
    id: "catering",
    shortLabel: "Catering",
    label: "Catering y comidas por encargo",
    stage: "Preparando el negocio",
    summary:
      "Preparación de platos para eventos familiares, matrimonios y reuniones corporativas en Cajamarca.",
    ciiu: "5621",
    ciiuName: "Suministro de comidas por encargo",
    salesExample: "S/ 9,200 / mes proyectados",
    regimes: [
      {
        code: "RER",
        status: "Compatible",
        note: "Permite emitir facturas electrónicas a instituciones y empresas.",
      },
      {
        code: "RMT",
        status: "Compatible",
        note: "Deduce gastos sustentados de insumos, menaje y equipamiento.",
      },
    ],
    milestones: [
      {
        step: "01",
        title: "Elegir Persona Natural con Negocio o EIRL / SAC",
        entity: "SUNARP · SUNAT",
      },
      { step: "02", title: "Emitir comprobantes electrónicos desde SOL", entity: "SUNAT" },
      {
        step: "03",
        title: "Buenas prácticas de manipulación de alimentos",
        entity: "DIGESA · Municipalidad",
      },
    ],
  },
  {
    id: "movil",
    shortLabel: "Puesto móvil",
    label: "Sanguchería o puesto móvil",
    stage: "Empezando a pequeña escala",
    summary:
      "Venta rápida para llevar con bajo capital inicial y atención directa al público en horarios pico.",
    ciiu: "5610",
    ciiuName: "Actividades de restaurantes y de servicio móvil de comidas",
    salesExample: "S/ 3,200 / mes estimados",
    regimes: [
      {
        code: "Nuevo RUS",
        status: "Compatible",
        note: "Categoría 1: cuota fija mensual de S/ 20 sin declaraciones complejas.",
      },
      {
        code: "RER",
        status: "Revisar",
        note: "Solo si necesitas emitir facturas o proyectas crecer rápido.",
      },
    ],
    milestones: [
      { step: "01", title: "Inscripción rápida en RUC como Persona Natural", entity: "SUNAT" },
      {
        step: "02",
        title: "Autorización municipal para módulo o espacio",
        entity: "Municipalidad de Cajamarca",
      },
      {
        step: "03",
        title: "Carné sanitario y control de higiene",
        entity: "Municipalidad · Salud",
      },
    ],
  },
];

export function ScenarioExplorer() {
  return (
    <Tabs.Root defaultValue={SCENARIOS[0].id}>
      <Tabs.List
        aria-label="Ejemplos de negocios gastronómicos"
        activateOnFocus
        className="inline-flex flex-wrap gap-1.5 rounded-3xl border border-[#e5dfd3] bg-[#f2ede3] p-1.5"
      >
        {SCENARIOS.map((item) => (
          <Tabs.Tab
            key={item.id}
            value={item.id}
            className="landing-press min-h-11 rounded-full px-5 py-2 text-sm font-extrabold text-[#3b4b6b] hover:text-[#0a1a3c] data-active:bg-[#0b4ac9] data-active:text-white data-active:hover:text-white data-active:shadow-[0_6px_16px_-6px_rgba(11,74,201,0.55)]"
          >
            {item.shortLabel}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {SCENARIOS.map((current) => (
        <Tabs.Panel key={current.id} value={current.id} keepMounted className="mt-6 grid gap-8 rounded-[28px] border border-[#e5dfd3] bg-white p-6 shadow-[0_24px_60px_-28px_rgba(10,26,60,0.16)] data-hidden:hidden sm:p-9 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-12">
          {/* Left column: plain-language profile summary */}
          <div className="flex flex-col justify-between border-b border-[#ece6dc] pb-7 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
            <div>
              <p className="inline-block rounded-full bg-[#fdf3e7] px-3.5 py-1 text-xs font-extrabold text-[#9a3b22]">
                {current.stage}
              </p>
              <h3 className="landing-display mt-4 text-2xl font-bold leading-tight tracking-[-0.02em] text-[#0a1a3c] sm:text-3xl">
                {current.label}
              </h3>
              <p className="mt-3 text-base leading-[1.7] text-[#3b4b6b]">{current.summary}</p>

              <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl bg-[#faf8f4] p-4">
                <div>
                  <dt className="text-xs font-extrabold text-[#52607a]">Código CIIU</dt>
                  <dd className="landing-display mt-1 text-2xl font-bold text-[#0a1a3c]">
                    {current.ciiu}
                  </dd>
                  <dd className="mt-0.5 text-xs font-semibold leading-snug text-[#52607a]">
                    {current.ciiuName}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs font-extrabold text-[#52607a]">Ventas de ejemplo</dt>
                  <dd className="landing-display mt-1 text-xl font-bold text-[#0b4ac9] sm:text-2xl">
                    {current.salesExample}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-7">
              <Link
                href="/negocios/nuevo"
                className="landing-press landing-arrow-shift inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0a1a3c] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#132b5e]"
              >
                <span>Evaluar mi propio negocio</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right column: regimes & 3 clear steps */}
          <div className="space-y-7">
            <div>
              <p className="text-sm font-extrabold text-[#0a1a3c]">
                Regímenes tributarios que podrías revisar
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {current.regimes.map((regime, index) => (
                  <motion.div
                    key={regime.code}
                    initial={{ opacity: 0, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.06, ease: EASE_OUT_EXPO }}
                    className="rounded-2xl border border-[#e5dfd3] bg-[#faf8f4] p-4"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="landing-display text-lg font-bold text-[#0a1a3c]">
                        {regime.code}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                          regime.status === "Compatible"
                            ? "bg-[#e3f5eb] text-[#115e38]"
                            : "bg-[#fff3d1] text-[#7a4b00]"
                        }`}
                      >
                        {regime.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs leading-relaxed text-[#3b4b6b]">{regime.note}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-extrabold text-[#0a1a3c]">Tus primeros pasos en Cajamarca</p>
              <ol className="mt-3 space-y-2.5">
                {current.milestones.map((item, index) => (
                  <motion.li
                    key={item.step}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.32,
                      delay: 0.08 + index * 0.06,
                      ease: EASE_OUT_EXPO,
                    }}
                    className="flex items-start gap-3.5 rounded-2xl bg-[#faf8f4] px-4 py-3"
                  >
                    <span className="landing-display grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#e8f0fe] text-xs font-extrabold text-[#0b4ac9]">
                      {index + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-extrabold text-[#0a1a3c]">{item.title}</p>
                      <p className="mt-0.5 text-xs font-bold text-[#52607a]">{item.entity}</p>
                    </div>
                  </motion.li>
                ))}
              </ol>
            </div>
          </div>
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
