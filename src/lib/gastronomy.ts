import type { Answers } from "./questionnaire";

export const foodSector = "alimentos";
export const legacyFoodType = "Restaurante / alimentos";
export const otherFoodType = "Otro establecimiento similar de comidas";
export const foodTypes = [
  ["restaurante", "Restaurante"],
  ["cafeteria", "Cafetería"],
  ["polleria", "Pollería"],
  ["cevicheria", "Cevichería"],
  ["pizzeria", "Pizzería"],
  ["comida-rapida", "Comida rápida"],
  ["menu", "Restaurante de menú o comida casera"],
  ["para-llevar", "Comida para llevar"],
  ["delivery", "Cocina exclusiva para delivery"],
  ["puesto-movil", "Food truck o puesto móvil"],
] as const;

export const foodScopeYes = "Sí, es mi actividad principal";
export const foodScopeNo = "No, mi actividad principal es otra";
export const foodScopeUnsure = "Todavía no lo sé";

export const scopeMessage = "CREA evalúa negocios cuya actividad principal es preparar o servir comidas para consumo inmediato. Si tienes dudas sobre tu actividad, confírmala con SUNAT.";

export const isFoodType = (value: unknown) =>
  value === legacyFoodType || value === otherFoodType || foodTypes.some(([, label]) => value === label);

export const normalizeFoodText = (value: string) =>
  value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function classifyFood(answers: Answers) {
  const description = normalizeFoodText([answers.P02, answers.P17].filter(Boolean).join(" "));
  const review = /\b(catering|concesion|comedores institucionales|mayorist\w*|industrial\w*|envasad\w*|distribucion a tiendas|reventa)\b/.test(description)
    || answers.R06 === "Sí" || answers.R07 === "Sí";
  const service = ["R03", "R04", "R05"].some(id => answers[id] === "Sí")
    || answers.P01 === "Food truck o puesto móvil";
  const handlesFood = answers.R01 === "Sí" || answers.R02 === "Sí";
  const type = foodTypes.find(([, label]) => label === answers.P01);
  const describedType = foodTypes.find(([, label]) => description.includes(normalizeFoodText(label)));
  const activityId = !review && service && handlesFood ? (type || describedType)?.[0] || "servicio-comidas" : "";
  return { activityId, review };
}
