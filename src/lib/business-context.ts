import type { Answers } from "./questionnaire";
import type { BusinessContext } from "./types";
import { classifyFood, foodSector, foodScopeYes, isFoodType } from "./gastronomy";

const answer = (data: Answers, id: string) => typeof data[id] === "string" ? data[id] as string : "";
const number = (data: Answers, id: string) => {
  const value = Number(answer(data, id));
  return Number.isFinite(value) && value >= 0 ? value : 0;
};
const yes = (data: Answers, id: string) => data[id] === "Sí";

export function exactMonthlyRevenue(answers: Answers): number | undefined {
  const value = answer(answers, "P20");
  if (!/^monto:\d+(?:\.\d+)?$/.test(value)) return undefined;
  const amount = Number(value.slice(6));
  return Number.isFinite(amount) ? amount : undefined;
}

export function hasAmount(answers: Answers, key: string): boolean {
  const value = answer(answers, key).trim();
  return value !== "" && Number.isFinite(Number(value)) && Number(value) >= 0;
}

export function toContext(a: Answers): BusinessContext {
  const description = answer(a,"P02") || answer(a,"P01.1");
  const { activityId } = classifyFood(a);
  const invoice = answer(a,"P23");
  return {
    questionnaire:a,businessName:description || answer(a,"P01.1") || "Mi negocio",purpose:answer(a,"P03").includes("formalizad") ? "revisar" : answer(a,"P03").includes("ventas") || answer(a,"P03").includes("opero") ? "formalizar" : "crear",
    sectorId:foodSector,activityId,otherActivity:description,department:answer(a,"P04"),province:answer(a,"P05")==="No encuentro mi provincia"?answer(a,"P05_TEXT"):answer(a,"P05"),district:answer(a,"P06")==="No encuentro mi distrito"?answer(a,"P06_TEXT"):answer(a,"P06"),
    legalPerson:answer(a,"P09")==="Persona natural"?"natural":answer(a,"P09")==="Persona jurídica / empresa"?"juridica":"aun-no-se",
    hasPartners:["2 personas","3 personas","4 o más"].includes(answer(a,"P07")),partnerCount:answer(a,"P07")==="2 personas"?2:answer(a,"P07")==="3 personas"?3:answer(a,"P07")==="4 o más"?4:1,
    hasPhysicalLocation:yes(a,"P10"),servesPublic:yes(a,"P12"),hasEmployees:yes(a,"P28"),employeeCount:yes(a,"P28")?number(a,"P29"):0,employeeCountPerShift:yes(a,"P28")?number(a,"P29.1"):0,
    sellsOnline:yes(a,"P25"),preparesFood:yes(a,"R01"),handlesFood:yes(a,"R02"),importsGoods:false,exportsGoods:false,
    providesRegulatedService:false,customerType:answer(a,"P22")==="Personas"?"personas":answer(a,"P22")==="Empresas"?"empresas":answer(a,"P22")==="Personas y empresas" || answer(a,"P22")==="Personas, empresas y Estado"?"ambos":"aun-no-se",
    monthlyRevenue:exactMonthlyRevenue(a) ?? 0,
    monthlyPurchases:number(a,"TAX_PURCHASES"),annualPurchases:number(a,"TAX_PURCHASES")*12,fixedAssets:number(a,"TAX_ASSETS"),
    needsInvoices:invoice.startsWith("Sí")?true:invoice.startsWith("No, venderé")?false:null,
    hasMultipleLocations:false,foreignSourceIncome:false,collectsPersonalData:false,
  };
}

export async function readFoodContext(request: Request): Promise<BusinessContext | null> {
  const body: unknown = await request.json().catch(() => null);
  if (!body || typeof body !== "object" || !("sectorId" in body) || body.sectorId !== foodSector || !("questionnaire" in body)) return null;
  const answers = body.questionnaire;
  if (!answers || typeof answers !== "object" || Array.isArray(answers)) return null;
  if (!Object.values(answers).every(value => typeof value === "string" ||
    (Array.isArray(value) && value.every(item => typeof item === "string")))) return null;
  const q = answers as Answers;
  if (!isFoodType(q.P01) || q.P01_SCOPE !== foodScopeYes || !answer(q, "P02").trim()) return null;
  return toContext(q);
}
