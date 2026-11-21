import { foodSector, foodTypes } from "./gastronomy";
import type { BusinessActivity, BusinessCategory, Requirement, Rule, Source } from "./types";

const verified = { reviewedAt: "", nextReviewAt: "2026-10-01", reviewFrequencyDays: 90, status: "POR_VERIFICAR" as const, verifiedBy: "Pendiente de asignación", evidence: "Enlace oficial incorporado; revisión normativa y aprobación humana pendientes." };
export const sources: Source[] = [
  { id: "sunat-ruc", institution: "SUNAT", title: "Inscríbete en el RUC", url: "https://centrovirtual.sunat.gob.pe/tramites/inscribete-ruc", ...verified },
  { id: "sunat-regimes", institution: "SUNAT", title: "Regímenes tributarios MYPE", url: "https://emprender.sunat.gob.pe/ruc/regimenes-tributarios-mype/regimenes-tributarios", ...verified },
  { id: "sunat-planilla", institution: "SUNAT", title: "Planilla Electrónica", url: "https://www.gob.pe/8071-planilla-electronica", ...verified },
  { id: "sunarp", institution: "SUNARP", title: "Buscar y reservar el nombre de una empresa", url: "https://www.gob.pe/271-buscar-y-reservar-el-nombre-de-una-empresa-en-la-sunarp", ...verified },
  { id: "licencia", institution: "Congreso de la República", title: "Ley Marco de Licencia de Funcionamiento", url: "https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/1788305-28976", ...verified },
  { id: "licencia-paso", institution: "Presidencia del Consejo de Ministros", title: "Licencia de funcionamiento para negocios de riesgo bajo o medio", url: "https://www.gob.pe/20844-obtener-licencia-de-funcionamiento-para-negocios-de-riesgo-bajo-o-medio", ...verified },
  { id: "indecopi", institution: "Indecopi", title: "Libro de Reclamaciones", url: "https://consumidor.gob.pe/libro-de-reclamaciones/", ...verified },
  { id: "digesa", institution: "DIGESA", title: "Norma sanitaria para restaurantes y servicios afines", url: "https://www.gob.pe/institucion/minsa/normas-legales/195873-822-2018-minsa", ...verified },
  { id: "sector-review", institution: "INEI", title: "Clasificación CIIU Revisión 4", url: "https://proyectos.inei.gob.pe/ciiu/", reviewedAt: "2026-07-01", nextReviewAt: "2026-09-30", reviewFrequencyDays: 60, status: "POR_VERIFICAR", verifiedBy: "Pendiente de asignación", evidence: "No utilizar como requisito confirmado." },
];

export const categories: BusinessCategory[] = [
  { id: foodSector, name: "Restaurantes y servicios afines", icon: "🍽️", description: "Preparación o servicio de comidas para consumo inmediato", reviewSourceId: "digesa" },
];

export const activities: BusinessActivity[] = [
  ...foodTypes,
  ["servicio-comidas", "Servicio de comidas para consumo inmediato"],
].map(([id, name]) => ({ id, sectorId: foodSector, name, ciiu: "5610" }));

export const requirements: Requirement[] = [
  { id:"ruc", title:"Inscripción en el RUC", category:"SUNAT", description:"Revisa tu inscripción y actividad económica ante SUNAT.", documents:["DNI","Actividad económica","Domicilio fiscal"], institution:"SUNAT", sourceId:"sunat-ruc" },
  { id:"sunarp", title:"Evaluar constitución y reserva de nombre", category:"Constitución", description:"Si optarás por persona jurídica, revisa la constitución y la reserva de nombre.", documents:["Identificación de socios","Propuesta de nombre"], institution:"SUNARP", sourceId:"sunarp" },
  { id:"regime", title:"Elegir régimen tributario", category:"Tributario", description:"Compara las alternativas tributarias con tus ventas y forma de operar.", documents:["Proyección de ingresos y compras"], institution:"SUNAT", sourceId:"sunat-regimes" },
  { id:"license", title:"Solicitar licencia de funcionamiento", category:"Municipalidad", description:"Solicita en la municipalidad competente la licencia para tu giro y dirección. Primero pregunta por zonificación y nivel de riesgo.", documents:["RUC y documento de identidad","Dirección, área y giro del local","Solicitud y reporte de riesgo del TUPA local"], institution:"Municipalidad competente por la ubicación", sourceId:"licencia-paso" },
  { id:"itse", title:"Tramitar la inspección ITSE que corresponda", category:"Municipalidad", description:"Pregunta a la municipalidad si tu nivel de riesgo exige ITSE previa o posterior y qué documentos técnicos pide.", documents:["Nivel de riesgo asignado","Información de distribución, aforo e instalaciones","Anexos indicados por la municipalidad para tu riesgo"], institution:"Municipalidad competente por la ubicación", sourceId:"licencia-paso" },
  { id:"t-registro", title:"T-Registro y PLAME", category:"Laboral", description:"Revisa el registro y declaración de personal contratado.", documents:["Datos de trabajadores","Clave SOL"], institution:"SUNAT", sourceId:"sunat-planilla" },
  { id:"book", title:"Libro de Reclamaciones", category:"Consumidor", description:"Revisa el Libro de Reclamaciones si ofreces bienes o servicios a consumidores.", documents:["Datos del proveedor"], institution:"Indecopi", sourceId:"indecopi" },
  { id:"sanidad", title:"Revisar condiciones sanitarias de preparación y servicio", category:"Sanidad", description:"Consulta con la municipalidad cómo se aplica la norma sanitaria a tu modalidad de operación.", documents:[], institution:"Municipalidad competente por la ubicación", sourceId:"digesa" },
  { id:"sector", title:"Revisión sectorial especializada", category:"Sectorial", description:"Tu actividad tiene normativa sectorial que está en proceso de verificación antes de presentarse como requisito.", documents:[], institution:"Entidad sectorial competente", sourceId:"sector-review" },
];

const base = { effectiveFrom:"2026-01-01", lastVerifiedAt:"", nextReviewAt:"2026-10-01", verifiedBy:"Pendiente de asignación" };
const always = { connector:"AND" as const, conditions:[{ field:"purpose" as const, operator:"IN" as const, value:["crear","formalizar","revisar"] }] };
export const rules: Rule[] = [
  { id:"R001", version:1, name:"Base tributaria", status:"PUBLICADA", sourceId:"sunat-ruc", priority:100, conditions:always, actions:[{type:"ADD_REQUIREMENT",requirementId:"ruc",classification:"CONDICIONAL",reason:"Revisa tu inscripción en el RUC y confirma tu actividad económica ante SUNAT."}], ...base },
  { id:"R008", version:1, name:"Comparación tributaria", status:"PUBLICADA", sourceId:"sunat-regimes", priority:95, conditions:always, actions:[{type:"ADD_REQUIREMENT",requirementId:"regime",classification:"CONDICIONAL",reason:"Tu actividad, clientes, ventas y compras ayudan a comparar los regímenes empresariales."}], ...base },
  { id:"R002", version:1, name:"Persona jurídica", status:"PUBLICADA", sourceId:"sunarp", priority:90, conditions:{connector:"AND",conditions:[{field:"legalPerson",operator:"=",value:"juridica"}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"sunarp",classification:"CONDICIONAL",reason:"Indicaste que evaluarás una persona jurídica."}], ...base },
  { id:"R003", version:1, name:"Local físico", status:"PUBLICADA", sourceId:"licencia", priority:80, conditions:{connector:"AND",conditions:[{field:"hasPhysicalLocation",operator:"IS_TRUE"}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"license",classification:"CONDICIONAL",reason:"Indicaste que operarás desde un establecimiento físico."}], ...base },
  { id:"R004", version:2, name:"Seguridad del establecimiento", status:"PUBLICADA", sourceId:"licencia", priority:80, conditions:{connector:"AND",conditions:[{field:"hasPhysicalLocation",operator:"IS_TRUE"}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"itse",classification:"CONDICIONAL",reason:"Confirma si el establecimiento requiere ITSE y cuándo corresponde tramitarla, incluso si solo funciona como cocina de delivery."}], ...base },
  { id:"R005", version:1, name:"Trabajadores", status:"PUBLICADA", sourceId:"sunat-planilla", priority:85, conditions:{connector:"OR",conditions:[{field:"employeeCount",operator:">",value:0},{field:"hasEmployees",operator:"IS_TRUE"}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"t-registro",classification:"CONDICIONAL",reason:"Indicaste que podrías contratar trabajadores. Confirma las obligaciones laborales aplicables."}], ...base },
  { id:"R006", version:1, name:"Consumidores", status:"PUBLICADA", sourceId:"indecopi", priority:75, conditions:{connector:"AND",conditions:[{field:"customerType",operator:"IN",value:["personas","ambos"]}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"book",classification:"CONDICIONAL",reason:"Indicaste que atenderás consumidores finales."}], ...base },
  { id:"R009", version:1, name:"Preparación o manipulación de alimentos", status:"PUBLICADA", sourceId:"digesa", priority:70, conditions:{connector:"AND",conditions:[{field:"sectorId",operator:"=",value:foodSector},{connector:"OR",conditions:[{field:"preparesFood",operator:"IS_TRUE"},{field:"handlesFood",operator:"IS_TRUE"}]}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"sanidad",classification:"CONDICIONAL",reason:"Confirma las condiciones sanitarias para la preparación o manipulación de alimentos en tu modalidad."}], ...base },
  { id:"R007", version:1, name:"Tema sectorial pendiente", status:"PUBLICADA", sourceId:"sector-review", priority:10, conditions:{connector:"AND",conditions:[{field:"activityId",operator:"=",value:""}]}, actions:[{type:"ADD_REQUIREMENT",requirementId:"sector",classification:"INFORMATIVO",reason:"Las reglas específicas de este rubro están pendientes de revisión documental. No se muestran como obligaciones confirmadas."}], effectiveFrom:"2026-01-01",lastVerifiedAt:"2026-07-01",nextReviewAt:"2026-09-30",verifiedBy:"Pendiente" },
];
export const requirementById = (id:string) => requirements.find((item) => item.id === id);
export const sourceById = (id:string) => sources.find((item) => item.id === id);
