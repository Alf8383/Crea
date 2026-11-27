import { randomUUID } from "node:crypto";
import { writeFile } from "node:fs/promises";
import { setTimeout as pause } from "node:timers/promises";
import { parseArgs } from "node:util";

const hosting = "http://127.0.0.1:5000";
const auth = "http://127.0.0.1:9099/identitytoolkit.googleapis.com/v1/accounts:";
const documents = "http://127.0.0.1:8080/v1/projects/demo-crea/databases/(default)/documents";
const routes = ["/", "/comparar", "/obligaciones", "/ingresar", "/negocios/nuevo", "/investigacion"];
const levels = [1, 36, 64, 96, 128];
const timeoutMs = 5000;
const date = new Date().toISOString().slice(0, 10);
const password = "crea-carga-sintetica";

const { values } = parseArgs({
  options: {
    scenario: { type: "string", default: "hosting" },
    seconds: { type: "string", default: "15" },
    output: { type: "string" },
  },
});
const { scenario, output } = values;
const seconds = Number(values.seconds);
if (!["hosting", "firebase"].includes(scenario) || !Number.isInteger(seconds) || seconds < 5 || seconds > 60) {
  throw new Error("Usa --scenario hosting|firebase y --seconds entre 5 y 60.");
}

async function request(url, { body, token, method, json = true } = {}) {
  const headers = {};
  if (body) headers["Content-Type"] = "application/json";
  if (token) headers.Authorization = "Bearer " + token;
  const response = await fetch(url, {
    method: method ?? (body ? "POST" : "GET"),
    headers,
    body: body ? JSON.stringify(body) : undefined,
    redirect: "error",
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) {
    await response.body?.cancel();
    throw new Error(new URL(url).pathname + " HTTP " + response.status);
  }
  return json ? response.json() : response.text();
}

async function discoverAsset() {
  const html = await request(hosting + "/", { json: false });
  const [asset] = html.match(/\/_next\/static\/chunks\/[^"'<\s]+\.js/) ?? [];
  if (!asset || !html.includes("Formaliza tu negocio gastronómico")) {
    throw new Error("El emulador de Hosting debe servir una compilación de CREA.");
  }
  await request(hosting + asset, { json: false });
  return asset;
}

async function signIn(email, operation = "signInWithPassword") {
  const account = await request(auth + operation + "?key=emulator-only-crea", {
    body: { email, password, returnSecureToken: true },
  });
  if (!account.localId || !account.idToken) throw new Error("Auth no devolvió la sesión de prueba.");
  return { email, uid: account.localId, token: account.idToken };
}

function firestoreFields(values) {
  return Object.fromEntries(Object.entries(values).map(([field, value]) => {
    if (typeof value === "boolean") return [field, { booleanValue: value }];
    if (Number.isInteger(value)) return [field, { integerValue: String(value) }];
    return [field, { stringValue: value }];
  }));
}

function syntheticRestaurant(revision) {
  return {
    businessName: "Restaurante sintético " + revision,
    purpose: "revisar",
    department: "Cajamarca",
    province: "Cajamarca",
    district: "Cajamarca",
    sectorId: "restaurantes",
    activityId: "restaurante",
    otherActivity: "",
    legalPerson: "natural",
    hasPartners: false,
    partnerCount: 0,
    hasPhysicalLocation: true,
    servesPublic: true,
    employeeCount: 2,
    sellsOnline: false,
    preparesFood: true,
    importsGoods: false,
    exportsGoods: false,
    providesRegulatedService: false,
    customerType: "personas",
    needsInvoices: false,
    hasMultipleLocations: false,
    foreignSourceIncome: false,
    collectsPersonalData: false,
    currentRegime: "NRUS",
    ciiu: "5610",
    annualRevenue: 48000,
    annualPurchases: 24000,
    assessmentVersion: 3,
  };
}

async function save({ uid, token }, revision) {
  const name = "projects/demo-crea/databases/(default)/documents/businesses/carga-" + uid;
  const { transaction } = await request(documents + ":beginTransaction", { token, body: {} });
  const [current] = await request(documents + ":batchGet", { token, body: { documents: [name], transaction } });
  const context = syntheticRestaurant(revision);
  const fields = firestoreFields({
    owner_id: uid,
    name: context.businessName,
    purpose: context.purpose,
    department: context.department,
    province: context.province,
    district: context.district,
    evaluationDate: date,
  });
  fields.context = { mapValue: { fields: firestoreFields(context) } };
  const updateTransforms = [{ fieldPath: "updatedAt", setToServerValue: "REQUEST_TIME" }];
  if (!current.found) updateTransforms.push({ fieldPath: "createdAt", setToServerValue: "REQUEST_TIME" });
  else fields.createdAt = current.found.fields.createdAt;
  await request(documents + ":commit", { token, body: { transaction, writes: [{ update: { name, fields }, updateTransforms }] } });
}

async function list({ uid, token }) {
  const items = await request(documents + ":runQuery", { token, body: {
    structuredQuery: {
      from: [{ collectionId: "businesses" }],
      where: { fieldFilter: { field: { fieldPath: "owner_id" }, op: "EQUAL", value: { stringValue: uid } } },
    },
  } });
  const [item] = items;
  if (items.length !== 1 || item.document?.fields.owner_id.stringValue !== uid) {
    throw new Error("La consulta no devolvió exclusivamente la evaluación de la cuenta.");
  }
  return item.document.fields.name.stringValue;
}

async function prepareFirebase() {
  const accounts = [];
  const run = randomUUID();
  for (let start = 0; start < levels.at(-1); start += 8) {
    const batch = Array.from({ length: 8 }, (_, offset) => signIn("carga-" + run + "-" + (start + offset) + "@example.test", "signUp"));
    accounts.push(...await Promise.all(batch));
  }
  for (let start = 0; start < accounts.length; start += 8) {
    await Promise.all(accounts.slice(start, start + 8).map((account) => save(account, 0)));
  }
  await list(accounts[0]);
  console.log("Cuentas y evaluaciones sintéticas preparadas:", accounts.length);
  return async (worker, iteration) => {
    const account = accounts[worker];
    const turn = (worker + iteration) % 10;
    if (turn === 0) account.token = (await signIn(account.email)).token;
    if (turn === 1) await save(account, iteration);
    const result = await list(account);
    if (turn === 1 && result !== "Restaurante sintético " + iteration) {
      throw new Error("No se recuperó el valor guardado en el ciclo.");
    }
  };
}

async function prepareHosting() {
  const asset = await discoverAsset();
  return async (worker, iteration) => {
    const route = routes[(worker + iteration) % routes.length];
    const page = await request(hosting + route, { json: false });
    if (!page.includes("lang=\"es-PE\"")) throw new Error("HTML inesperado en " + route);
    await request(hosting + asset, { json: false });
  };
}

function percentile(sorted, fraction) {
  return sorted.length ? Number(sorted[Math.ceil(sorted.length * fraction) - 1].toFixed(1)) : null;
}

async function runStage(operation, phase, concurrency) {
  const start = performance.now();
  const duration = phase === "carga" ? seconds * 2 : seconds;
  const cutoff = start + duration * 1000;
  const durations = [];
  const errors = new Map();
  let attempts = 0;
  await Promise.all(Array.from({ length: concurrency }, async (_, worker) => {
    for (let iteration = 0; performance.now() < cutoff; iteration++) {
      const before = performance.now();
      attempts++;
      try {
        await operation(worker, iteration);
        durations.push(performance.now() - before);
      } catch (error) {
        const cause = error.cause?.code ?? error.message;
        errors.set(cause, (errors.get(cause) ?? 0) + 1);
        await pause(100);
      }
    }
  }));
  const elapsed = (performance.now() - start) / 1000;
  durations.sort((left, right) => left - right);
  const failures = attempts - durations.length;
  const summary = {
    phase, concurrency, attempts, successes: durations.length, failures,
    elapsedSeconds: Number(elapsed.toFixed(2)),
    cyclesPerSecond: Number((durations.length / elapsed).toFixed(1)),
    errorPercent: Number((100 * failures / attempts).toFixed(2)),
    p50Ms: percentile(durations, 0.5),
    p95Ms: percentile(durations, 0.95),
    p99Ms: percentile(durations, 0.99),
    errors: Object.fromEntries(errors),
  };
  console.log(JSON.stringify(summary));
  return summary;
}

const operation = await (scenario === "hosting" ? prepareHosting() : prepareFirebase());
const results = [];
const p95Limit = scenario === "hosting" ? 1000 : 2000;
const passed = ({ p95Ms, errorPercent }) => p95Ms !== null && p95Ms <= p95Limit && errorPercent <= 1;

for (const [index, concurrency] of levels.entries()) {
  const phase = index === 0 ? "base" : index === 1 ? "carga" : "estrés";
  const result = await runStage(operation, phase, concurrency);
  results.push(result);
  if (!result.successes || result.errorPercent >= 10 || result.p95Ms >= 4000) break;
  await pause(1000);
}
await pause(3000);
const recovery = await runStage(operation, "recuperación", 1);
results.push(recovery);

const load = results.find(({ phase }) => phase === "carga");
const acceptable = Boolean(load) && passed(load) && passed(recovery);
const report = { scenario, seconds, criteria: { p95LimitMs: p95Limit, maxErrorPercent: 1 }, acceptable, results };
if (output) await writeFile(output, JSON.stringify(report, null, 2) + "\n", "utf8");
if (!acceptable) process.exitCode = 1;
