"use client";

import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Coffee,
  Flame,
  ReceiptText,
  Store,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Scenario = {
  id: string;
  label: string;
  stage: string;
  icon: typeof Coffee;
  summary: string;
  ciiu: string;
  ciiuName: string;
  regimes: { code: string; status: "Compatible" | "Revisar"; note: string }[];
  milestones: { title: string; entity: string; done?: boolean }[];
  salesExample: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "cafeteria",
    label: "Cafetería en preparación",
    stage: "Solo tengo una idea",
    icon: Coffee,
    summary: "Café de especialidad, desayunos y pastelería en un local pequeño cerca del centro de Cajamarca.",
    ciiu: "5630",
    ciiuName: "Actividades de servicio de bebidas",
    salesExample: "S/ 4,500 / mes proyectados",
    regimes: [
      { code: "Nuevo RUS", status: "Compatible", note: "Cuota fija mensual si solo emites boletas." },
      { code: "RER", status: "Compatible", note: "Ideal si tus clientes piden factura." },
    ],
    milestones: [
      { title: "Definir actividad CIIU e inscripción en el RUC", entity: "SUNAT · INEI", done: true },
      { title: "Elegir comprobantes y régimen tributario", entity: "SUNAT" },
      { title: "Licencia de funcionamiento e inspección ITSE", entity: "Municipalidad de Cajamarca" },
    ],
  },
  {
    id: "polleria",
    label: "Pollería con local y delivery",
    stage: "Ya estoy vendiendo",
    icon: Flame,
    summary: "Atención en salón y pedidos por delivery con emisión de boletas y facturas a empresas locales.",
    ciiu: "5610",
    ciiuName: "Actividades de restaurantes y de servicio móvil de comidas",
    salesExample: "S/ 18,000 / mes estimados",
    regimes: [
      { code: "RER", status: "Compatible", note: "Hasta S/ 525,000 de ingresos netos anuales." },
      { code: "RMT", status: "Compatible", note: "Escala progresiva si planeas crecer con personal." },
    ],
    milestones: [
      { title: "Verificar ficha RUC y régimen vigente", entity: "SUNAT", done: true },
      { title: "Evaluar tasa especial de IGV para restaurantes", entity: "SUNAT" },
      { title: "Condiciones de cocina a gas, campana e ITSE", entity: "Municipalidad · DIGESA" },
    ],
  },
  {
    id: "catering",
    label: "Catering y comidas por encargo",
    stage: "Preparando el negocio",
    icon: UtensilsCrossed,
    summary: "Preparación de platos para eventos familiares, matrimonios y reuniones corporativas en Cajamarca.",
    ciiu: "5621",
    ciiuName: "Suministro de comidas por encargo",
    salesExample: "S/ 9,200 / mes proyectados",
    regimes: [
      { code: "RER", status: "Compatible", note: "Permite emitir facturas a instituciones y empresas." },
      { code: "RMT", status: "Compatible", note: "Deduce gastos reales de insumos y equipamiento." },
    ],
    milestones: [
      { title: "Elegir Persona Natural con Negocio o EIRL / SAC", entity: "SUNARP · SUNAT", done: true },
      { title: "Emitir comprobantes electrónicos desde SOL", entity: "SUNAT" },
      { title: "Buenas prácticas de manipulación de alimentos", entity: "DIGESA · Municipalidad" },
    ],
  },
  {
    id: "movil",
    label: "Sanguchería o puesto móvil",
    stage: "Empezando a pequeña escala",
    icon: Store,
    summary: "Venta rápida para llevar con bajo capital inicial y atención directa al público en horarios pico.",
    ciiu: "5610",
    ciiuName: "Actividades de restaurantes y de servicio móvil de comidas",
    salesExample: "S/ 3,200 / mes estimados",
    regimes: [
      { code: "Nuevo RUS", status: "Compatible", note: "Categoría 1: cuota mensual simple de S/ 20." },
      { code: "RER", status: "Revisar", note: "Solo si necesitas emitir facturas o crecer rápido." },
    ],
    milestones: [
      { title: "Inscripción rápida en RUC como Persona Natural", entity: "SUNAT", done: true },
      { title: "Autorización municipal para módulo o espacio", entity: "Municipalidad de Cajamarca" },
      { title: "Carné sanitario y control de higiene", entity: "Municipalidad · Salud" },
    ],
  },
];

export function ScenarioExplorer() {
  const [selectedId, setSelectedId] = useState(SCENARIOS[0].id);
  const current = SCENARIOS.find((item) => item.id === selectedId) ?? SCENARIOS[0];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
      <div
        role="tablist"
        aria-label="Ejemplos de negocios gastronómicos"
        className="grid gap-3 content-start"
      >
        {SCENARIOS.map((item) => {
          const Icon = item.icon;
          const isSelected = item.id === current.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={`tab-${item.id}`}
              aria-selected={isSelected}
              aria-controls={`panel-${item.id}`}
              onClick={() => setSelectedId(item.id)}
              className={`landing-press group flex w-full items-start gap-4 rounded-2xl border p-4 text-left sm:p-5 ${
                isSelected
                  ? "border-[#0b4ac9] bg-white shadow-[0_14px_34px_-16px_rgba(11,74,201,0.28)]"
                  : "border-[#e5dfd3] bg-[#faf8f4]/70 hover:border-[#b9c8e6] hover:bg-white"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 grid h-11 w-11 shrink-0 place-items-center rounded-xl transition-colors duration-200 ${
                  isSelected
                    ? "bg-[#0b4ac9] text-white"
                    : "bg-[#ede8dd] text-[#0a1a3c] group-hover:bg-[#e1ebfc] group-hover:text-[#0b4ac9]"
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-extrabold text-[#0a1a3c]">{item.label}</span>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                      isSelected
                        ? "bg-[#e8f0fe] text-[#0b4ac9]"
                        : "bg-[#ede8dd] text-[#3b4b6b]"
                    }`}
                  >
                    {item.stage}
                  </span>
                </span>
                <span className="mt-1.5 block text-sm leading-relaxed text-[#3b4b6b]">
                  {item.summary}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        key={current.id}
        id={`panel-${current.id}`}
        role="tabpanel"
        aria-labelledby={`tab-${current.id}`}
        className="landing-panel-swap flex flex-col justify-between rounded-[26px] border border-[#e5dfd3] bg-white p-6 shadow-[0_24px_60px_-24px_rgba(10,26,60,0.16)] sm:p-8"
      >
        <div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#efeae0] pb-5">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#9a3b22]">
                Vista previa orientativa · Cajamarca
              </p>
              <h3 className="landing-serif mt-1 text-2xl font-semibold tracking-tight text-[#0a1a3c] sm:text-3xl">
                {current.label}
              </h3>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#d4e2fa] bg-[#f2f7ff] px-3.5 py-1.5 text-xs font-extrabold text-[#0b4ac9]">
              <ReceiptText className="h-3.5 w-3.5" aria-hidden="true" />
              {current.salesExample}
            </span>
          </div>

          <div className="mt-5 rounded-2xl border border-[#efeae0] bg-[#faf8f4] p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#52607a]">
                Actividad sugerida (INEI)
              </span>
              <span className="rounded-md bg-[#0a1a3c] px-2.5 py-0.5 text-xs font-extrabold text-[#ffc400]">
                CIIU {current.ciiu}
              </span>
            </div>
            <p className="mt-1.5 text-sm font-bold text-[#0a1a3c]">{current.ciiuName}</p>
          </div>

          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#52607a]">
              Regímenes a evaluar
            </p>
            <div className="mt-2.5 grid gap-3 sm:grid-cols-2">
              {current.regimes.map((regime) => (
                <div
                  key={regime.code}
                  className="rounded-2xl border border-[#e5dfd3] bg-white p-3.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-extrabold text-[#0a1a3c]">{regime.code}</span>
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-extrabold ${
                        regime.status === "Compatible"
                          ? "bg-[#e5f5ec] text-[#115e38]"
                          : "bg-[#fff4d6] text-[#7a4b00]"
                      }`}
                    >
                      {regime.status}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#3b4b6b]">{regime.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#52607a]">
              Primeros pasos en tu ruta
            </p>
            <ul className="mt-2.5 space-y-2.5">
              {current.milestones.map((step) => (
                <li
                  key={step.title}
                  className="flex items-start gap-3 rounded-xl bg-[#faf8f4] px-3.5 py-2.5"
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className={`mt-0.5 h-4 w-4 shrink-0 ${
                      step.done ? "text-[#0b4ac9]" : "text-[#8b98b1]"
                    }`}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#0a1a3c]">{step.title}</p>
                    <p className="mt-0.5 flex items-center gap-1.5 text-xs font-semibold text-[#52607a]">
                      <Building2 className="h-3 w-3 shrink-0" aria-hidden="true" />
                      {step.entity}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[#efeae0] pt-5">
          <p className="text-xs font-semibold text-[#52607a]">
            ¿Tu caso es diferente? Responde el cuestionario y obtén tu diagnóstico real.
          </p>
          <Link
            href="/negocios/nuevo"
            className="landing-press landing-arrow-shift inline-flex min-h-11 items-center gap-2 rounded-full bg-[#0a1a3c] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#132b5e]"
          >
            Evaluar mi caso
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
