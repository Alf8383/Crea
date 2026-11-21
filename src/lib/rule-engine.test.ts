import { describe, expect, it } from "vitest";
import { toContext } from "./business-context";
import { foodScopeYes } from "./gastronomy";
import { RuleEngine } from "./rule-engine";
import { rules, sources } from "./seed-catalog";
import { questions, visibleQuestions } from "./questionnaire";
import type { BusinessContext } from "./types";

const business: BusinessContext = { businessName:"Restaurante Andino",purpose:"crear",sectorId:"alimentos",activityId:"restaurante",otherActivity:"",department:"Cajamarca",province:"Cajamarca",district:"Cajamarca",legalPerson:"juridica",hasPartners:true,partnerCount:2,hasPhysicalLocation:true,servesPublic:true,employeeCount:3,employeeCountPerShift:3,sellsOnline:true,preparesFood:true,importsGoods:false,exportsGoods:false,providesRegulatedService:false,customerType:"personas",monthlyRevenue:5000,monthlyPurchases:2000,annualPurchases:24000,fixedAssets:0,needsInvoices:false,hasMultipleLocations:false,foreignSourceIncome:false,collectsPersonalData:false };
const evaluate=(context=business,date="2026-10-01")=>RuleEngine.evaluate(context,rules,sources,date);
describe("RuleEngine",()=>{
 it("genera ruta nacional para un restaurante con local y trabajadores",()=>expect(evaluate().map(item=>item.requirementId)).toEqual(expect.arrayContaining(["ruc","sunarp","license","itse","t-registro","book","sanidad"])));
 it("no genera obligaciones laborales ni municipales sin sus condiciones",()=>{const result=evaluate({...business,employeeCount:0,hasPhysicalLocation:false,servesPublic:false}).map(item=>item.requirementId);for (const id of ["t-registro","license","itse"]) expect(result).not.toContain(id);});
 it("mantiene visible una regla vencida con estado por verificar",()=>expect(evaluate(business,"2027-02-01").find(item=>item.requirementId==="ruc")?.verification).toBe("POR_VERIFICAR"));
 it("devuelve comparación tributaria explicable",()=>expect(RuleEngine.recommendTax(business).map(item=>item.code)).toEqual(["NRUS","RER","RMT","RG"]));
 it("pide información de facturas para NRUS sin bloquear los otros regímenes",()=>{const result=RuleEngine.recommendTax({...business,legalPerson:"natural",needsInvoices:null});expect(result.find(item=>item.code==="NRUS")?.status).toBe("INFORMACION_INSUFICIENTE");expect(result.find(item=>item.code==="RG")?.status).toBe("COMPATIBLE");});
 it("no convierte un rango de ventas en un monto exacto",()=>{const result=RuleEngine.recommendTax({...business,questionnaire:{P20:"S/ 5,001 a S/ 10,000",TAX_PURCHASES:"2000",TAX_ASSETS:"1000"},legalPerson:"natural",needsInvoices:false});expect(result.find(item=>item.code==="RMT")?.status).toBe("INFORMACION_INSUFICIENTE");});
 it("muestra las doce preguntas gastronómicas incluso sin salón y recupera el P01 histórico",()=>{
   const ids = Array.from({length:12}, (_, index) => "R" + String(index + 1).padStart(2, "0"));
   for (const P01 of ["Cocina exclusiva para delivery", "Food truck o puesto móvil", "Restaurante / alimentos"]) {
     expect(visibleQuestions(3, {P01, P10:"No"}).map(item=>item.id)).toEqual(expect.arrayContaining(ids));
   }
   expect(visibleQuestions(1,{P10:"No"}).map(item=>item.id)).toContain("P15");
   expect(visibleQuestions(1,{P10:"No"}).map(item=>item.id)).not.toContain("P11");
   expect(visibleQuestions(3,{P01:"Hospedaje",H03:"Sí"}).map(item=>item.id)).not.toContain("R01");
 });
 it("ofrece solo los once tipos gastronómicos",()=>{
   const choices = questions[0].find(q=>q.id==="P01")?.options?.map(option=>option.value);
   expect(choices).toHaveLength(11);
   expect(choices).toContain("Otro establecimiento similar de comidas");
   for (const legacy of ["Turismo","Tienda / comercio","Manufactura"]) expect(choices).not.toContain(legacy);
 });
 it.each([
   ["Restaurante","Solo tengo la idea","crear","restaurante"],
   ["Cafetería","Estoy preparando el negocio","crear","cafeteria"],
   ["Pollería","Ya realizo algunas ventas","formalizar","polleria"],
   ["Restaurante","Estoy formalizado parcialmente","revisar","restaurante"],
 ])("conserva el tipo %s en la etapa %s",(P01,P03,purpose,activityId)=>{
   const questionnaire = {P01,P03,P01_SCOPE:foodScopeYes,P02:"Comidas en salón",R01:"Sí",R03:"Sí",P28:"No",P29:"7"};
   const context = toContext(questionnaire);
   expect(context).toMatchObject({questionnaire,purpose,activityId,sectorId:"alimentos",employeeCount:0});
   expect(evaluate(context).map(item=>item.requirementId)).not.toContain("t-registro");
 });
 it("orienta sobre seguridad y sanidad para una cocina de delivery sin atención presencial",()=>{
   const business = toContext({P01:"Cocina exclusiva para delivery",P02:"Pizza por pedido",P10:"Sí",P12:"No",R01:"Sí",R05:"Sí"});
   expect(business.activityId).toBe("delivery");
   expect(evaluate(business).map(item=>item.requirementId)).toEqual(expect.arrayContaining(["license","itse","sanidad"]));
 });
 it("envía actividades mixtas y descripciones ambiguas a revisión",()=>{
   const context = toContext({P01:"Restaurante",P02:"Comidas frescas en salón",R01:"Sí",R03:"Sí",R06:"Sí"});
   expect(context.activityId).toBe("");
   expect(evaluate(context).map(item=>item.requirementId)).toContain("sector");
   expect(toContext({P01:"Cafetería",P02:"Bebidas"}).activityId).toBe("");
 });
 it("mantiene pendientes las ventas desconocidas",()=>{
   const result = RuleEngine.recommendTax({...business,questionnaire:{P20:"Todavía no puedo estimarlo"}});
   expect(result.find(item=>item.code==="RG")?.status).toBe("INFORMACION_INSUFICIENTE");
 });
 it("no presenta reglas de demostración como verificadas",()=>{const result=evaluate();expect(result.length).toBeGreaterThan(0);expect(result.every(item=>item.verification==="POR_VERIFICAR")).toBe(true);});
 it("permite explorar condiciones tributarias sin confirmar una fuente pendiente",()=>{const result=RuleEngine.recommendTax(business,"sunat-regimes","POR_VERIFICAR");expect(result.every(item=>item.status==="INFORMACION_INSUFICIENTE")).toBe(true);expect(result.find(item=>item.code==="NRUS")?.reasons.some(reason=>reason.includes("personas jurídicas"))).toBe(true);});
});
