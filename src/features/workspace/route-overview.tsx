import { Building2, Store, UserRound } from "lucide-react";
import { SourceLink } from "@/components/ui/primitives";
import { ciiuCatalog, CIIU_TABLE, isCiiuCode } from "@/lib/ciiu-catalog";
import { buildFormalizationRoute } from "@/lib/formalization";
import type { BusinessContext } from "@/lib/types";

export function RouteOverview({ context }: { context: BusinessContext }) {
  const code = isCiiuCode(context.ciiu) ? context.ciiu : undefined;
  const ruc = buildFormalizationRoute(context).find((task) => task.id === "ruc");
  const options = [
    { id: "natural", icon: UserRound, title: "Persona natural", text: "Puedes operar a tu propio nombre." },
    { id: "juridica", icon: Building2, title: "Persona jurídica", text: "Opera a través de una empresa constituida." },
  ] as const;
  return <section aria-labelledby="route-overview" className="print-hidden rounded-[28px] border border-[#e5dfd3] bg-white p-5 shadow-[0_18px_46px_-26px_rgba(10,26,60,0.16)] sm:p-7">
    <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#9a3b22]">Qué hacer para formalizarte</p>
    <h2 id="route-overview" className="mt-1.5 [font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-2xl font-bold tracking-[-0.02em] text-[#0a1a3c] sm:text-3xl">Tu orientación inicial, paso a paso</h2>
    <p className="mb-5 mt-2 text-sm text-[#3b4b6b]">Revisa cómo se aplican a tu negocio la actividad económica, la forma legal y el registro ante SUNAT.</p>
    <div className="grid gap-4 min-[1160px]:grid-cols-3">
      <article className="rounded-2xl border border-[#e5dfd3] bg-[#faf8f4] p-5">
        <h3 className="flex items-center font-extrabold text-[#0a1a3c]"><span aria-hidden="true" className="mr-2.5 inline-grid size-7 shrink-0 place-items-center rounded-full bg-[#ffc400] text-xs font-black text-[#0b2254]">1</span>Tu actividad económica (CIIU)</h3>
        {code ? <div className="my-3.5 grid grid-cols-[auto_minmax(0,1fr)] gap-3 rounded-2xl border border-[#e5dfd3] bg-white p-3.5 shadow-[0_8px_20px_-14px_rgba(10,26,60,0.16)]">
          <Store className="mt-1 size-8 text-[#0b4ac9]" aria-hidden="true" />
          <div><p className="text-xs font-extrabold text-[#0b4ac9]">Código de tu evaluación</p><p className="[font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-2xl font-bold text-[#0a1a3c]">{code}</p><p className="text-sm font-bold text-[#3b4b6b]">{ciiuCatalog[code].name}</p></div>
        </div> : <p className="my-3 text-sm text-[#3b4b6b]">{context.ciiuStatus === "revision" ? "Clasificación por revisar" : "Clasificación pendiente"}. Puedes consultar el catálogo oficial para verificar tu actividad.</p>}
        <SourceLink href={code ? "https://proyectos.inei.gob.pe/CIIU/frm_lista_notas.asp?wc_cod=" + code : CIIU_TABLE}>{code ? "Ver código " + code + " en el INEI" : "Consultar catálogo del INEI"}</SourceLink>
      </article>
      <article className="rounded-2xl border border-[#e5dfd3] bg-[#faf8f4] p-5">
        <h3 className="flex items-center font-extrabold text-[#0a1a3c]"><span aria-hidden="true" className="mr-2.5 inline-grid size-7 shrink-0 place-items-center rounded-full bg-[#ffc400] text-xs font-black text-[#0b2254]">2</span>¿Persona natural o empresa?</h3>
        <div className="mt-3.5 grid grid-cols-2 gap-2.5">
          {options.map(({ id, icon: Icon, title, text }) => <div key={id} className={"rounded-2xl border p-3 " + (context.legalPerson === id ? "border-[#0b4ac9] bg-[#f2f7ff]" : "border-[#e5dfd3] bg-white")}>
            <Icon className="mb-2 size-5 text-[#0b4ac9]" aria-hidden="true" />
            <p className="text-sm font-extrabold text-[#0a1a3c]">{title}</p><p className="mt-1 text-xs text-[#3b4b6b]">{text}</p>
            {context.legalPerson === id && <p className="mt-2 text-xs font-extrabold text-[#0b4ac9]">Tu elección</p>}
          </div>)}
        </div>
      </article>
      <article className="rounded-2xl border border-[#e5dfd3] bg-[#faf8f4] p-5">
        <h3 className="flex items-center font-extrabold text-[#0a1a3c]"><span aria-hidden="true" className="mr-2.5 inline-grid size-7 shrink-0 place-items-center rounded-full bg-[#ffc400] text-xs font-black text-[#0b2254]">3</span>RUC: qué hacer y cuándo</h3>
        {ruc && <><p className="mt-3.5 text-sm font-extrabold text-[#0a1a3c]">{ruc.title}</p><p className="mt-2 text-sm text-[#3b4b6b]">{ruc.description}</p><SourceLink href={ruc.url}>Consultar en SUNAT</SourceLink></>}
      </article>
    </div>
  </section>;
}
