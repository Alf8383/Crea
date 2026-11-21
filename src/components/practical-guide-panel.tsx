import Link from "next/link";
import { getTaxPath, practicalGuides } from "@/lib/practical-guides";
import { activities, sourceById } from "@/lib/seed-catalog";
import { classifyFood } from "@/lib/gastronomy";
import type { BusinessContext } from "@/lib/types";

export function PracticalGuidePanel({ requirementId, context }: { requirementId: string; context: BusinessContext }) {
  const guide = practicalGuides[requirementId];
  if (!guide) return null;
  const source = sourceById(guide.sourceId);
  const isMunicipal = requirementId === "license" || requirementId === "itse";
  const answers = context.questionnaire;
  const operatingDetails = [
    answers?.R09 === "Sí" && "Indica qué instalación de gas usarás.",
    answers?.R10 === "Sí" && "Incluye los hornos, parrillas o freidoras en la descripción del equipo.",
    answers?.R11 === "Sí" && "Describe el sistema previsto de extracción o ventilación.",
    answers?.R12 === "Sí" && "Consulta si el giro y horario declarados admiten el expendio de bebidas alcohólicas.",
  ].filter(Boolean);
  const mobileOrHome = answers?.P01 === "Food truck o puesto móvil" || answers?.P15 === "De manera ambulante o itinerante" || answers?.P15 === "Desde mi vivienda";
  return <div className="mt-5 space-y-4 border-t border-blue-100 pt-5">
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-blue-100 bg-white p-4"><h3 className="font-bold">Dónde ir</h3><p className="mt-2 text-sm leading-6 text-slate-700">{guide.where}</p>{isMunicipal&&<p className="mt-2 text-sm font-semibold text-[#1464f6]">Ubicación declarada: {[context.district, context.province, context.department].filter(Boolean).join(", ") || "Ubicación no informada"}</p>}</section>
      <section className="rounded-2xl border border-blue-100 bg-white p-4"><h3 className="font-bold">Qué solicitar</h3><p className="mt-2 text-sm leading-6 text-slate-700">{guide.askFor}</p></section>
    </div>
    <section className="rounded-2xl border border-blue-100 bg-white p-4"><h3 className="font-bold">Pasos para hacerlo</h3><ol className="mt-3 space-y-3">{guide.steps.map((step,index)=><li key={step} className="flex gap-3 text-sm leading-6 text-slate-700"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-blue-100 font-bold text-[#1464f6]">{index+1}</span><span>{step}</span></li>)}</ol></section>
    <div className="grid gap-4 md:grid-cols-2">
      <section className="rounded-2xl border border-blue-100 bg-white p-4"><h3 className="font-bold">Qué preparar</h3><ul className="mt-2 space-y-2">{guide.prepare.map(item=><li key={item} className="flex gap-2 text-sm leading-6 text-slate-700"><span className="text-emerald-600">✓</span>{item}</li>)}</ul></section>
      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4"><h3 className="font-bold text-amber-950">¿Hay que pagar?</h3><p className="mt-2 text-sm leading-6 text-amber-950">{guide.cost}</p></section>
    </div>
    {guide.note&&<p className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-[#102c68]">{guide.note}</p>}
    {isMunicipal && operatingDetails.length > 0 && <ul className="list-disc space-y-1 rounded-xl bg-blue-50 py-3 pl-8 pr-4 text-sm leading-6 text-[#102c68]">
      {operatingDetails.map(detail => <li key={String(detail)}>{detail}</li>)}
    </ul>}
    {requirementId === "sanidad" && <p className="text-sm leading-6 text-slate-700">
      <a href="https://www.gob.pe/institucion/minsa/normas-legales/4574749-811-2023-minsa" target="_blank" rel="noreferrer" className="font-bold underline">Consultar la modificación de la norma sanitaria de 2023 ↗</a>
      {mobileOrHome && <span className="mt-2 block">Describe si cocinarás desde una vivienda o un puesto móvil y consulta en qué lugares puedes operar y qué condiciones municipales se aplican.</span>}
    </p>}
    {source&&<a href={source.url} target="_blank" rel="noreferrer" className="inline-flex rounded-xl bg-[#1464f6] px-4 py-3 text-sm font-bold text-white">Abrir paso oficial de {source.institution} ↗</a>}
  </div>;
}

export function BusinessSetupAdvicePanel({ context }: { context: BusinessContext }) {
  const classification = context.questionnaire ? classifyFood(context.questionnaire) : null;
  const activity = activities.find(item => item.id === classification?.activityId);
  const ciiu = activity ? "5610 · Actividades de restaurantes y de servicio móvil de comidas" : "Clasificación por verificar";
  const ciiuMeaning = classification?.review
    ? "Confirma con SUNAT cuál es tu actividad principal y si corresponde registrar actividades adicionales por la elaboración de envasados, distribución u otro servicio declarado."
    : activity
    ? "La sugerencia considera tu tipo de establecimiento, cómo preparas o manipulas alimentos y tu modalidad de atención. Confirma el código ante SUNAT antes de declararlo."
    : "La información todavía no permite sugerir un código. Lleva tu descripción y modalidades de atención a SUNAT para confirmar la clasificación.";
  const legalChoice = context.legalPerson;
  const legalAdvice = context.hasPartners && legalChoice === "natural"
    ? "Hay una inconsistencia: seleccionaste persona natural, pero también indicaste que habrá más de una persona propietaria. La persona natural con negocio se registra a nombre de una persona; si compartirán la propiedad, revisen una persona jurídica y acuerden socios, aportes y representante antes de constituirla."
    : context.questionnaire?.P07 === "Aún no está definido"
    ? "Todavía no has definido cuántas personas serán propietarias. Si serás la única y quieres empezar con menos trámites, compara persona natural con negocio; si compartirás la propiedad, revisa una persona jurídica. La elección cambia responsabilidades y pasos."
    : legalChoice === "natural"
    ? "Elegiste persona natural con negocio. Si serás la única propietaria y buscas comenzar con menos trámites, puede ser la ruta más simple; respondes personalmente por las obligaciones del negocio. Si quieres separar patrimonio, sumar socios o asumir riesgos importantes, compara una persona jurídica antes de inscribirte."
    : legalChoice === "juridica"
    ? "Elegiste persona jurídica. Primero constituye e inscribe la empresa en SUNARP; luego activa el RUC de la empresa en SUNAT. Si todavía no decides el tipo (por ejemplo, E.I.R.L. con titular único o S.A.C. con socios), confirma cuál corresponde a tus propietarios y planes."
    : context.hasPartners
    ? "Indicaste que habrá más de una persona propietaria: revisa primero una persona jurídica, porque permite organizar la participación de los socios. Acuerden quiénes serán socios, aportes y representante; luego consulten el tipo societario y constitución en PRODUCE/notaría."
    : "Si serás la única propietaria y quieres empezar de forma sencilla, compara primero persona natural con negocio. Si prefieres separar la empresa de ti, incorporar inversión o limitar la responsabilidad según la forma legal, compara una persona jurídica (por ejemplo, E.I.R.L. si tendrás titular único).";
  const alreadyHasRuc = context.questionnaire?.P32 === "Sí";
  const alreadyOperating = ["Ya realizo algunas ventas", "Ya opero regularmente"].includes(String(context.questionnaire?.P03 || ""));
  const rucAdvice = alreadyHasRuc
    ? "Indicaste que ya tienes RUC: comprueba en SUNAT que esté activo y que incluya la actividad correcta; si falta, actualiza tus datos con Clave SOL."
    : alreadyOperating
    ? "Como ya empezaste a vender u operar, prioriza regularizar tu RUC en SUNAT y confirmar tu actividad, fecha de inicio y régimen. Si escoges persona jurídica, primero debe estar inscrita en SUNARP."
    : "Como todavía estás preparando o definiendo el negocio, puedes informarte y preparar la actividad ahora; inscríbete en el RUC antes de iniciar la actividad económica. Para persona natural con DNI, el trámite se hace por App Personas/SUNAT Virtual. Para persona jurídica, primero SUNARP y luego activación del RUC en SUNAT.";

  return <section className="mt-6 rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="setup-advice-title">
    <p className="text-xs font-bold uppercase tracking-widest text-[#1464f6]">Qué hacer para formalizarte</p>
    <h2 id="setup-advice-title" className="mt-2 text-2xl font-black">Tu orientación inicial, paso a paso</h2>
    <p className="mt-2 text-sm leading-6 text-slate-600">Esta recomendación usa tus respuestas. Puedes preparar estos datos antes de vender; no necesitas inventar ventas pasadas ni comprar documentos.</p>
    <div className="mt-5 grid gap-4 lg:grid-cols-3">
      <article className="rounded-2xl border border-blue-100 bg-blue-50/60 p-4"><h3 className="font-bold">1. Actividad y código CIIU sugerido</h3><p className="mt-2 text-lg font-black text-[#1464f6]">{ciiu}</p><p className="mt-2 text-sm leading-6 text-slate-700">{ciiuMeaning}</p><a className="mt-3 inline-block text-sm font-bold text-[#1464f6] underline" href="https://proyectos.inei.gob.pe/CIIU/frm_lista_notas.asp?wc_cod=5610" target="_blank" rel="noreferrer">Ver notas del INEI sobre la clase 5610 ↗</a></article>
      <article className="rounded-2xl border border-blue-100 p-4"><h3 className="font-bold">2. ¿Persona natural o empresa?</h3><p className="mt-2 text-sm leading-6 text-slate-700">{legalAdvice}</p>{legalChoice === "juridica" && <p className="mt-2 rounded-xl bg-blue-50 p-3 text-sm leading-5 text-slate-700"><b>Prepara:</b> DNI de propietarios, nombre propuesto, domicilio, actividad, aportes y quién representará la empresa. Pregunta el costo total a SID-SUNARP y a la notaría antes de pagar.</p>}</article>
      <article className="rounded-2xl border border-blue-100 p-4"><h3 className="font-bold">3. RUC: qué hacer y cuándo</h3><p className="mt-2 text-sm leading-6 text-slate-700">{rucAdvice}</p><p className="mt-2 rounded-xl bg-blue-50 p-3 text-sm leading-5 text-slate-700"><b>Ten a mano:</b> DNI, correo y celular, domicilio fiscal, fecha prevista de inicio y descripción de tu actividad. La inscripción digital en SUNAT no tiene tasa; constituir una empresa sí puede implicar pagos de notaría y registro.</p><a className="mt-3 inline-block text-sm font-bold text-[#1464f6] underline" href="https://centrovirtual.sunat.gob.pe/tramites/inscribete-ruc" target="_blank" rel="noreferrer">Inscribirse o revisar el RUC en SUNAT ↗</a></article>
    </div>
  </section>;
}

export function TaxPathPanel({ context, onExplore }: { context: BusinessContext; onExplore?: () => void }) {
  const advice = getTaxPath(context);
  const q = context.questionnaire;
  const answer = (key: string) => String(q?.[key] || "").trim();
  const salesAnswer = answer("P20");
  const taxItems = [
    { key:"P02", label:"Qué actividad harás", detail:"Escribe qué producto venderás o qué servicio brindarás y a quién. No necesitas conocer el código CIIU.", value:answer("P02") || answer("P01.1"), done:Boolean(answer("P02") || answer("P01.1")), example:"Ejemplo: “Daré tours guiados de un día por Cajamarca” o “Haré cortes de cabello a domicilio”." },
    { key:answer("P07")&&answer("P07")!=="Aún no está definido"?"P09":"P07", label:"Quién será dueño y cómo operarás", detail:"Indica si serás la única propietaria o tendrás socios, y si trabajarás como persona natural o empresa.", value:[answer("P07"),answer("P09")].filter(Boolean).join(" · "), done:Boolean(answer("P07")&&answer("P07")!=="Aún no está definido"&&answer("P09")&&answer("P09")!=="Todavía no lo sé"), example:"Si serás la única dueña, compara persona natural con negocio y empresa individual; si compartirás la propiedad, revisa persona jurídica." },
    { key:"P20", label:"Cuánto esperas cobrar en un mes", detail:"Escribe el total que pagarían tus clientes, antes de descontar compras o gastos. Si no has empezado, haz una proyección.", value:salesAnswer.startsWith("monto:")?`S/ ${salesAnswer.slice(6)}`:salesAnswer, done:Boolean(salesAnswer), example:"La calculadora suma cada oferta por separado: por ejemplo, 8 cortes × S/ 25 + 5 tintes × S/ 60. Si solo sabes un rango, puedes elegirlo y refinarlo luego." },
    { key:answer("P22")&&answer("P22")!=="Todavía no lo sé"?"P23":"P22", label:"Quiénes serán tus clientes y si pedirán factura", detail:"Responde a quién venderás y si necesitarán factura. Esto ayuda a descartar opciones que no permiten emitirla.", value:[answer("P22"),answer("P23")].filter(Boolean).join(" · "), done:Boolean(answer("P22")&&answer("P22")!=="Todavía no lo sé"&&answer("P23")&&!answer("P23").startsWith("No lo sé")), example:"Piensa si atenderás personas, empresas o ambas; muchas empresas suelen pedir factura." },
    { key:"TAX_PURCHASES", label:"Cuánto gastarás en productos o materiales al mes", detail:"Suma mercadería para revender, ingredientes o materiales usados para prestar el servicio. Si no comprarás nada, escribe 0.", value:answer("TAX_PURCHASES")?`S/ ${answer("TAX_PURCHASES")}`:"", done:Boolean(answer("TAX_PURCHASES")), example:"Ejemplo: 4 compras de materiales de S/ 120 = S/ 480 al mes. No incluyas alquiler ni sueldo." },
    { key:"TAX_ASSETS", label:"Qué equipos tendrá el negocio y cuánto valen", detail:"Suma el valor aproximado de máquinas, computadoras, herramientas o equipos. Si no tienes, escribe 0.", value:answer("TAX_ASSETS")?`S/ ${answer("TAX_ASSETS")}`:"", done:Boolean(answer("TAX_ASSETS")), example:"Ejemplo: una computadora de S/ 1,500 y una impresora de S/ 500 = S/ 2,000." },
    { key:answer("P28")==="Sí"?(answer("P29")?"P29.1":"P29"):"P28", label:"Si tendrás trabajadores", detail:"Indica si contratarás trabajadores. Si respondes que sí, apunta cuántos habrá en total y cuántos coincidirán al mismo tiempo en un turno.", value:answer("P28")==="No"?"No tendré trabajadores":answer("P28")==="Sí"?[answer("P29")&&`${answer("P29")} en total`,answer("P29.1")&&`${answer("P29.1")} por turno`].filter(Boolean).join(" · "):answer("P28"), done:answer("P28")==="No"||(answer("P28")==="Sí"&&Boolean(answer("P29"))&&Boolean(answer("P29.1"))), example:"Si trabajarás sola y no contratarás a nadie, responde “No”." },
  ];
  const completedCount = taxItems.filter(item=>item.done).length;
  const salesStatus = !salesAnswer ? "Falta responder" : salesAnswer.startsWith("monto:") ? "Monto estimado" : salesAnswer==="Todavía no puedo estimarlo" ? "Sin estimar" : "Rango elegido";
  return <section className="rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="tax-path-title">
    <div className="flex flex-wrap items-start justify-between gap-4"><div className="max-w-3xl"><p className="text-xs font-bold uppercase tracking-widest text-[#1464f6]">Orientación según tus respuestas</p><h2 id="tax-path-title" className="mt-2 text-2xl font-black">{advice.title}</h2><p className="mt-2 leading-6 text-slate-600">{advice.reason}</p></div><span className="rounded-full bg-amber-100 px-3 py-2 text-xs font-bold text-amber-950">{advice.status==="PRESELECCION"?"Opción para revisar con SUNAT":"Completa la guía"}</span></div>
    {advice.status==="FALTAN_DATOS"&&<><div className="mt-5 rounded-2xl border border-blue-100 bg-blue-50/60 p-4"><div className="flex flex-wrap items-center justify-between gap-2"><div><h3 className="font-bold">Completa esta lista para comparar tus regímenes</h3><p className="mt-1 text-sm text-slate-600">{completedCount} de {taxItems.length} respuestas registradas. Pulsa “Responder” o “Estimar” para ir directo a esa pregunta.</p></div><span className="rounded-full bg-white px-3 py-1 text-sm font-bold text-[#1464f6]">{completedCount}/{taxItems.length}</span></div><div className="mt-4 space-y-3">{taxItems.map(item=>{const isSales=item.key==="P20";const badge=isSales?salesStatus:item.done?"Respondido":"Falta responder";const badgeColor=badge==="Respondido"||badge==="Monto estimado"?"bg-emerald-100 text-emerald-800":badge==="Falta responder"?"bg-amber-100 text-amber-900":"bg-blue-100 text-blue-800";return <article key={item.key} className="rounded-xl border border-blue-100 bg-white p-4"><div className="flex flex-wrap items-start justify-between gap-3"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h4 className="font-bold">{item.label}</h4><span className={"rounded-full px-2 py-1 text-xs font-bold "+badgeColor}>{badge}</span></div><p className="mt-1 text-sm leading-5 text-slate-600">{item.detail}</p><p className="mt-2 text-sm leading-5 text-slate-700"><b>Ejemplo:</b> {item.example}</p>{item.value&&<p className="mt-2 text-sm text-slate-500"><b>Tu respuesta:</b> {item.value}</p>}{isSales&&salesAnswer&&!salesAnswer.startsWith("monto:")&&<p className="mt-2 rounded-lg bg-blue-50 p-2 text-sm leading-5 text-[#18335f]">Tu respuesta sí quedó guardada. La calculadora te ayuda a convertirla en un monto mensual para afinar la orientación.</p>}</div><Link href={`/negocios/nuevo?continuar=${item.key}`} className="shrink-0 rounded-lg border border-blue-200 px-3 py-2 text-sm font-bold text-[#1464f6] hover:bg-blue-50">{isSales&&item.done?"Estimar monto":item.done?"Cambiar":"Responder"} →</Link></div></article>})}</div><p className="mt-3 text-xs leading-5 text-slate-600">No necesitas presentar comprobantes ni pagar para completar esta evaluación. Si aún no sabes un dato, déjalo pendiente; la plataforma te dirá por qué todavía no puede recomendarte.</p></div>
      <div className="mt-4"><h3 className="font-bold">¿Cómo se usa esta información?</h3><div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><div className="rounded-xl border border-slate-200 p-3 text-sm leading-5"><b>Nuevo RUS</b><p className="mt-1 text-slate-600">Persona natural, ventas a consumidores y sin emitir factura; tiene límites y actividades excluidas.</p></div><div className="rounded-xl border border-slate-200 p-3 text-sm leading-5"><b>RER</b><p className="mt-1 text-slate-600">Permite factura; revisamos ingresos, compras, equipos, trabajadores y exclusiones de actividad.</p></div><div className="rounded-xl border border-slate-200 p-3 text-sm leading-5"><b>RMT</b><p className="mt-1 text-slate-600">Para negocios dentro de su límite y condiciones; la renta anual toma en cuenta la utilidad.</p></div><div className="rounded-xl border border-slate-200 p-3 text-sm leading-5"><b>Régimen General</b><p className="mt-1 text-slate-600">No tiene tope de ingresos; exige revisar obligaciones y cálculos tributarios completos.</p></div></div></div></>}
    {advice.status==="PRESELECCION"&&<div className="mt-4 grid gap-3 md:grid-cols-2">{advice.checks.map(check=><p key={check} className="flex gap-2 rounded-xl bg-blue-50 p-3 text-sm leading-6 text-[#18335f]"><span aria-hidden="true" className="font-bold text-[#1464f6]">→</span>{check}</p>)}</div>}
    <p className="mt-4 text-xs leading-5 text-slate-500">La comparación orienta, pero SUNAT confirma el régimen que corresponde según tu actividad exacta, las exclusiones y tu situación.</p>
    <div className="mt-4 flex flex-wrap gap-3">{onExplore&&<button onClick={onExplore} className="rounded-xl border border-blue-200 px-4 py-3 text-sm font-bold text-[#1464f6] hover:bg-blue-50">Comparar los cuatro regímenes →</button>}</div>
  </section>;
}

export function LegalFormRecommendationPanel({ context }: { context: BusinessContext }) {
  const hasCoOwners = context.hasPartners || context.partnerCount > 1;
  return <section className="mt-5 rounded-3xl border border-blue-200 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="legal-form-recommendation-title">
    <p className="text-xs font-bold uppercase tracking-widest text-[#1464f6]">Te ayudamos a decidir</p>
    <h2 id="legal-form-recommendation-title" className="mt-2 text-2xl font-black">Aún no defines cómo registrar tu negocio</h2>
    <p className="mt-2 leading-6 text-slate-600">No hay una opción mejor para todos. La decisión depende de quiénes serán propietarios, el riesgo de la actividad, tus planes de crecimiento y las formalidades que puedes asumir.</p>
    <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-[#18335f]"><b>Para tu escenario:</b> {hasCoOwners ? "Como indicaste que habrá más de un propietario, conviene revisar primero una persona jurídica y elegir el tipo adecuado con asesoría. Una persona natural con negocio se registra a nombre de una persona y no organiza por sí sola la propiedad compartida." : "Si iniciarás por tu cuenta y quieres simplicidad, compara la persona natural con negocio. Si te importa separar la organización del negocio, incorporar inversión o prepararte para crecer, compara también una persona jurídica, como una E.I.R.L. si serás titular único."}</div>
    <div className="mt-4 grid gap-4 md:grid-cols-2">
      <article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-bold">Persona natural con negocio</h3><p className="mt-2 text-sm leading-6 text-slate-700">La actividad se registra bajo tu identidad y tu RUC. Suele tener menos pasos iniciales porque no constituyes una entidad en SUNARP.</p><p className="mt-2 text-sm leading-6 text-amber-900"><b>Evalúa:</b> tú asumes las obligaciones del negocio; no se separa automáticamente el patrimonio personal del negocio.</p></article>
      <article className="rounded-2xl border border-slate-200 p-4"><h3 className="font-bold">Persona jurídica</h3><p className="mt-2 text-sm leading-6 text-slate-700">Constituyes una entidad con identidad y patrimonio propios, que opera mediante su representante. Puede ser de titular único o tener socios, según el tipo.</p><p className="mt-2 text-sm leading-6 text-amber-900"><b>Evalúa:</b> elegir el tipo legal, constituirla e inscribirla y mantener sus formalidades. La responsabilidad depende de la forma y del caso concreto.</p></article>
    </div>
    <p className="mt-4 text-sm leading-6 text-slate-600">Antes de decidir, pregúntate: ¿tendrás otros propietarios?, ¿necesitarás inversión?, ¿qué bienes o riesgos implica tu actividad?, ¿puedes asumir trámites y formalidades de una empresa? La recomendación es orientativa; puedes pedir orientación de constitución a PRODUCE.</p>
    <a href="https://www.gob.pe/es/80682-constituir-una-empresa-guia-paso-a-paso-para-emprendedores" target="_blank" rel="noreferrer" className="mt-4 inline-flex rounded-xl bg-[#1464f6] px-4 py-3 text-sm font-bold text-white">Revisar guía oficial de PRODUCE ↗</a>
  </section>;
}
