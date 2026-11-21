import { describe, expect, it } from "vitest";
import { readFoodContext } from "./business-context";
import { foodScopeNo, foodScopeYes, foodSector, legacyFoodType } from "./gastronomy";

const questionnaire = {P01:"Restaurante",P02:"Menú diario en salón",P01_SCOPE:foodScopeYes,R01:"Sí",R03:"Sí",P20:"monto:4050.50",P20_LINES:"filas guardadas"};
const body = {sectorId:foodSector,questionnaire};
const request = (payload: unknown) => new Request("http://localhost/api/businesses", {method:"POST",body:JSON.stringify(payload)});

describe("validación compartida por las API de negocios y diagnóstico", () => {
  it.each([
    null,
    { ...body, sectorId:"turismo" },
    { ...body, questionnaire:{ ...questionnaire, P01:"Tienda / comercio" } },
    { ...body, questionnaire:{ ...questionnaire, P01_SCOPE:foodScopeNo } },
    { ...body, questionnaire:{ ...questionnaire, P01_SCOPE:undefined } },
    { ...body, questionnaire:{ ...questionnaire, P02:["Inválido"] } },
  ])("rechaza evaluaciones fuera de alcance o sin confirmar", async (invalid) => {
    expect(await readFoodContext(request(invalid))).toBeNull();
  });

  it("conserva las respuestas y recalcula el contexto aunque el cliente mande otros montos o giros", async () => {
    const result = await readFoodContext(request({...body, activityId:"tienda", monthlyRevenue:1}));
    expect(result).toMatchObject({ questionnaire, activityId:"restaurante", monthlyRevenue:4050.5 });
  });

  it("reutiliza el P01 gastronómico anterior cuando se confirma el alcance", async () => {
    const saved = {...questionnaire, P01:legacyFoodType};
    expect(await readFoodContext(request({...body, questionnaire:saved}))).toMatchObject({ questionnaire:saved, sectorId:foodSector });
  });
});
