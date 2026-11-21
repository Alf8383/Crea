import { describe, expect, it } from "vitest";
import { getTaxPath } from "./practical-guides";
import type { BusinessContext } from "./types";

const profile: BusinessContext = {
  businessName: "Cafetería de barrio", purpose: "crear", sectorId: "alimentos", activityId: "cafeteria", otherActivity: "Sirvo café y sándwiches",
  department: "Cajamarca", province: "Cajamarca", district: "Cajamarca", legalPerson: "natural", hasPartners: false, partnerCount: 1,
  hasPhysicalLocation: false, servesPublic: true, employeeCount: 0, employeeCountPerShift: 0, sellsOnline: true, preparesFood: false,
  importsGoods: false, exportsGoods: false, providesRegulatedService: false, customerType: "personas", monthlyRevenue: 4000,
  monthlyPurchases: 1000, annualPurchases: 12000, fixedAssets: 1000, needsInvoices: false, hasMultipleLocations: false,
  foreignSourceIncome: false, collectsPersonalData: false,
};

describe("getTaxPath", () => {
  it("does not turn an income range into an automatic RMT recommendation", () => {
    const result = getTaxPath({ ...profile, questionnaire: { P20: "S/ 2,500 a S/ 5,000", TAX_PURCHASES: "1000", TAX_ASSETS: "1000", P28: "No", P22: "Personas", P23: "No, venderé a consumidores" } });
    expect(result.code).toBeUndefined();
    expect(result.status).toBe("FALTAN_DATOS");
    expect(result.checks.some(item=>item.includes("calculadora"))).toBe(true);
  });

  it("prioriza revisar Nuevo RUS con datos completos de una cafetería", () => {
    const result = getTaxPath({ ...profile, questionnaire: { P20: "monto:4000", TAX_PURCHASES: "1000", TAX_ASSETS: "1000", P28: "No", P22: "Personas", P23: "No, venderé a consumidores" } });
    expect(result.code).toBe("NRUS");
  });

  it("considera RER cuando la cafetería debe emitir factura", () => {
    const result = getTaxPath({ ...profile, needsInvoices:true, questionnaire:{P20:"monto:4000",TAX_PURCHASES:"1000",TAX_ASSETS:"1000",P28:"No",P23:"Sí, frecuentemente"} });
    expect(result.code).toBe("RER");
  });

  it("no preselecciona un régimen con actividad o ventas pendientes de verificar", () => {
    const result = getTaxPath({ ...profile, activityId:"", questionnaire:{P20:"monto:4000",TAX_PURCHASES:"1000",TAX_ASSETS:"1000",P28:"No",P23:"No, venderé a consumidores"} });
    expect(result.status).toBe("FALTAN_DATOS");
    expect(result.code).toBeUndefined();
  });
});
