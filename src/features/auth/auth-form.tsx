"use client";

import { ArrowRight, Check, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { EmptyState, LinkButton, Notice } from "@/components/ui/primitives";
import { useSession } from "./session";

const EASE_OUT_EXPO = [0.23, 1, 0.32, 1] as const;

const emailSchema = z.email();
const errors: Record<string, string> = {
  "auth/invalid-credential": "Comprueba tu correo y contraseña.",
  "auth/invalid-email": "Ingresa un correo electrónico válido.",
  "auth/email-already-in-use": "Ya existe una cuenta con este correo. Puedes ingresar o recuperar tu contraseña.",
  "auth/weak-password": "Elige una contraseña más segura (mínimo 8 caracteres).",
  "auth/user-disabled": "Esta cuenta fue deshabilitada.",
  "auth/network-request-failed": "Revisa tu conexión e inténtalo de nuevo.",
  "auth/too-many-requests": "Hay demasiados intentos seguidos. Espera unos minutos e intenta otra vez.",
  "auth/popup-closed-by-user": "Se cerró la ventana de Google. Puedes volver a intentarlo.",
  "auth/cancelled-popup-request": "Se canceló la ventana de Google. Intenta de nuevo.",
  "auth/popup-blocked": "Permite las ventanas emergentes para ingresar con Google.",
  "auth/operation-not-allowed": "Este método de ingreso no está habilitado en Firebase Authentication.",
  "auth/configuration-not-found": "Firebase Authentication aún no está activado en el proyecto crea-958bf. Activa Email/Contraseña y Google en Firebase Console.",
  "auth/unauthorized-domain": "Este dominio aún no está autorizado en Firebase Authentication (agrégalo en Configuración → Dominios autorizados).",
  "auth/account-exists-with-different-credential": "Ya existe una cuenta para este correo. Ingresa con el método que usaste al registrarte.",
};

const authHighlights = [
  "Guarda tus evaluaciones y retómalas desde cualquier dispositivo",
  "Compara NRUS, RER, RMT y Régimen General con fuentes oficiales",
  "Sigue tu ruta paso a paso con SUNAT, Municipalidad y DIGESA",
];

function authError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  return errors[code] ?? "No pudimos completar la solicitud. Intenta de nuevo.";
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const candidate = useSearchParams().get("volver");
  const destination =
    candidate && ["/admin", "/investigacion", "/negocios", "/negocios/nuevo", "/negocios?guardar=1"].includes(candidate)
      ? candidate
      : "/negocios";
  const session = useSession();
  const [screen, setScreen] = useState<"login" | "register" | "recover">(mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [invalid, setInvalid] = useState<"email" | "password" | "">("");

  async function submit(type: "form" | "google") {
    setError("");
    setMessage("");
    setInvalid("");
    const address = email.trim();
    if (type === "form" && !emailSchema.safeParse(address).success) {
      setInvalid("email");
      document.getElementById("email")?.focus();
      return;
    }
    if (type === "form" && screen !== "recover" && (!password || (screen === "register" && password.length < 8))) {
      setInvalid("password");
      document.getElementById("password")?.focus();
      return;
    }
    setBusy(true);
    try {
      const [sdk, client] = await Promise.all([import("firebase/auth"), import("@/lib/firebase/client")]);
      const auth = client.getFirebaseAuth();
      if (!auth) throw new Error("Firebase no configurado");
      if (type === "google") {
        await sdk.signInWithPopup(auth, client.getGoogleProvider());
      } else if (screen === "recover") {
        try {
          await sdk.sendPasswordResetEmail(auth, address);
        } catch (failure) {
          if (!(typeof failure === "object" && failure && "code" in failure && failure.code === "auth/user-not-found")) {
            throw failure;
          }
        }
        setMessage("Si existe una cuenta con este correo, recibirás el enlace para restablecer tu contraseña.");
        return;
      } else if (screen === "register") {
        await sdk.createUserWithEmailAndPassword(auth, address, password);
      } else {
        await sdk.signInWithEmailAndPassword(auth, address, password);
      }
      router.replace(destination);
    } catch (failure) {
      setError(authError(failure));
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit("form");
  }

  const isLogin = screen === "login";
  const recovering = screen === "recover";
  const title = recovering ? "Recupera tu acceso" : isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta";
  const intro = recovering
    ? "Te enviaremos un enlace a tu correo para crear una nueva contraseña."
    : destination === "/negocios?guardar=1"
      ? "Ingresa o crea tu cuenta para guardar la evaluación que acabas de completar."
      : destination === "/investigacion"
        ? "Usa la cuenta vinculada a tu participación en el estudio."
        : destination === "/admin"
          ? "Usa tu cuenta de administración del catálogo."
          : isLogin
            ? "Retoma tus evaluaciones, simulaciones y tu ruta de formalización en Cajamarca."
            : "Empieza gratis y guarda tu diagnóstico tributario y tu ruta paso a paso.";
  const querySuffix = candidate ? "?volver=" + encodeURIComponent(destination) : "";

  return (
    <MotionConfig reducedMotion="user">
      <div className="crea-auth-page min-h-[calc(100vh-5.5rem)] bg-[#faf8f4] bg-[radial-gradient(ellipse_55%_45%_at_6%_4%,rgba(255,196,0,0.1),transparent_65%),radial-gradient(ellipse_48%_45%_at_95%_16%,rgba(11,74,201,0.07),transparent_65%)] px-4 pb-12 pt-2 [font-family:'Nunito_Variable','Nunito',system-ui,sans-serif] text-[#0a1a3c] sm:px-8">
        <motion.div
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.48, ease: EASE_OUT_EXPO }}
          className="mx-auto grid max-w-[78rem] gap-6 rounded-b-[32px] border border-t-0 border-[#e5dfd3] bg-white p-5 shadow-[0_28px_72px_-30px_rgba(10,26,60,0.18)] sm:p-8 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-stretch lg:gap-10 lg:p-10"
        >
          {/* LEFT STORYTELLING SHOWCASE PANEL */}
          <section
            aria-labelledby="auth-benefits"
            className="relative order-last flex flex-col justify-between overflow-hidden rounded-[26px] bg-[#0b2254] text-white lg:order-first"
          >
            <div className="relative min-h-56 flex-1 sm:min-h-64">
              <Image
                src="/restaurante-cajamarca.webp"
                alt="Emprendedora gastronómica organizando su restaurante en Cajamarca"
                fill
                priority
                sizes="(min-width: 1024px) 44vw, 100vw"
                className="object-cover object-center"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-[#0b2254] via-[#0b2254]/45 to-transparent"
              />
            </div>

            <div className="relative z-10 -mt-12 px-6 pb-7 pt-2 sm:px-8 sm:pb-9">
              <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.16em] text-[#ffc400]">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[#ffc400]" />
                CREA · Cajamarca, Perú
              </p>
              <h2
                id="auth-benefits"
                className="mt-2.5 [font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-2xl font-bold leading-[1.12] tracking-[-0.02em] text-white sm:text-3xl"
              >
                Organiza la formalización de tu negocio sin complicaciones
              </h2>

              <ul className="mt-5 space-y-3 border-t border-white/15 pt-5">
                {authHighlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm font-semibold leading-snug text-[#e2ebf8]">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-[#ffc400] text-[#0b2254]"
                    >
                      <Check className="size-3 stroke-[3]" />
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* RIGHT FORM PANEL */}
          <section
            aria-labelledby="auth-title"
            className="crea-auth-card flex min-w-0 flex-col justify-center rounded-[26px] bg-[#faf8f4]/55 p-5 sm:p-8 lg:p-10"
          >
            {/* MODE SWITCHER PILL */}
            {session.mode === "firebase" && !session.user && !recovering && (
              <div className="mb-7 inline-flex w-fit rounded-full border border-[#e5dfd3] bg-[#f2ede3] p-1">
                <Link
                  href={"/ingresar" + querySuffix}
                  aria-current={isLogin ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-5 text-sm font-extrabold transition-colors ${
                    isLogin
                      ? "bg-[#0b4ac9] text-white shadow-[0_6px_16px_-6px_rgba(11,74,201,0.55)]"
                      : "text-[#3b4b6b] hover:text-[#0a1a3c]"
                  }`}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href={"/registro" + querySuffix}
                  aria-current={!isLogin ? "page" : undefined}
                  className={`inline-flex min-h-10 items-center rounded-full px-5 text-sm font-extrabold transition-colors ${
                    !isLogin
                      ? "bg-[#0b4ac9] text-white shadow-[0_6px_16px_-6px_rgba(11,74,201,0.55)]"
                      : "text-[#3b4b6b] hover:text-[#0a1a3c]"
                  }`}
                >
                  Crear cuenta
                </Link>
              </div>
            )}

            <h1
              id="auth-title"
              className="[font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-3xl font-bold tracking-[-0.025em] text-[#0a1a3c] sm:text-4xl"
            >
              {title}
            </h1>

            {session.mode === "firebase" && !session.user && (
              <p className="mt-2.5 max-w-md text-base leading-relaxed text-[#3b4b6b]">{intro}</p>
            )}

            <div className="mt-6">
              {session.loading ? (
                <p role="status" className="text-sm font-bold text-[#52607a]">
                  Comprobando tu sesión…
                </p>
              ) : session.mode !== "firebase" ? (
                <EmptyState title={session.mode === "demo" ? "Modo demostración" : "Cuentas sin conexión"}>
                  {session.mode === "demo"
                    ? "Explora evaluaciones con datos ficticios. Para evaluar tu negocio necesitas una cuenta en el sitio de CREA."
                    : "El acceso a cuentas no está disponible en este entorno. Puedes consultar las guías y explorar casos ficticios."}
                  <div className="mt-3">
                    <Link
                      className="inline-flex min-h-11 items-center font-bold text-primary underline underline-offset-4"
                      href="/negocios?seccion=ejemplos"
                    >
                      Ver casos ficticios
                    </Link>
                  </div>
                </EmptyState>
              ) : session.user ? (
                <div className="grid justify-items-start gap-4 rounded-2xl border border-[#e5dfd3] bg-white p-6">
                  <p className="text-sm font-bold text-[#3b4b6b]">
                    Sesión activa con <strong className="text-[#0a1a3c]">{session.user.email}</strong>.
                  </p>
                  <LinkButton href={destination}>
                    Continuar <ArrowRight aria-hidden="true" />
                  </LinkButton>
                </div>
              ) : (
                <AnimatePresence mode="wait">
                  <motion.div
                    key={screen}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.2, ease: EASE_OUT_EXPO }}
                  >
                    {/* GOOGLE SIGN-IN FIRST FOR EFFORTLESS ONBOARDING */}
                    {!recovering && (
                      <div className="mb-5">
                        <Button
                          type="button"
                          variant="outline"
                          size="lg"
                          disabled={busy}
                          onClick={() => void submit("google")}
                          className="w-full border-[#d4ccbe] bg-white text-[#0a1a3c] shadow-[0_6px_16px_-12px_rgba(10,26,60,0.2)] hover:border-[#0b4ac9] hover:bg-[#faf8f4]"
                        >
                          <svg aria-hidden="true" className="size-4 shrink-0" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z"
                            />
                          </svg>
                          Continuar con Google
                        </Button>

                        <div className="my-5 flex items-center gap-3 text-xs font-extrabold uppercase tracking-[0.12em] text-[#52607a]">
                          <span aria-hidden="true" className="h-px flex-1 bg-[#e5dfd3]" />
                          <span>o con tu correo</span>
                          <span aria-hidden="true" className="h-px flex-1 bg-[#e5dfd3]" />
                        </div>
                      </div>
                    )}

                    <form onSubmit={onSubmit} noValidate className="grid gap-4" aria-busy={busy}>
                      <Field
                        id="email"
                        label="Correo electrónico"
                        error={invalid === "email" ? "Ingresa un correo electrónico válido." : undefined}
                      >
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          placeholder="tu@correo.com"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className="bg-white"
                          aria-invalid={invalid === "email"}
                          aria-describedby={invalid === "email" ? "email-error" : undefined}
                        />
                      </Field>

                      {!recovering && (
                        <Field
                          id="password"
                          label="Contraseña"
                          hint={!isLogin ? "Usa al menos 8 caracteres." : undefined}
                          error={
                            invalid === "password"
                              ? isLogin
                                ? "Escribe tu contraseña."
                                : "Usa al menos 8 caracteres."
                              : undefined
                          }
                        >
                          <div className="relative">
                            <Input
                              id="password"
                              name="password"
                              type={showPassword ? "text" : "password"}
                              autoComplete={isLogin ? "current-password" : "new-password"}
                              placeholder={isLogin ? "Tu contraseña" : "Mínimo 8 caracteres"}
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              className="bg-white pr-12"
                              aria-invalid={invalid === "password"}
                              aria-describedby={
                                invalid === "password" ? "password-error" : !isLogin ? "password-hint" : undefined
                              }
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword((value) => !value)}
                              aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[#52607a] transition-colors hover:bg-[#f2ede3] hover:text-[#0a1a3c]"
                            >
                              {showPassword ? (
                                <EyeOff className="size-4" aria-hidden="true" />
                              ) : (
                                <Eye className="size-4" aria-hidden="true" />
                              )}
                            </button>
                          </div>
                        </Field>
                      )}

                      {error && <Notice tone="error">{error}</Notice>}
                      {message && <Notice tone="success">{message}</Notice>}

                      <Button type="submit" size="lg" disabled={busy} className="mt-1 w-full">
                        {busy
                          ? "Procesando…"
                          : recovering
                            ? "Enviar enlace"
                            : isLogin
                              ? "Ingresar"
                              : "Crear cuenta"}{" "}
                        <ArrowRight aria-hidden="true" />
                      </Button>
                    </form>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-[#e5dfd3] pt-4 text-sm">
                      {isLogin && (
                        <Button
                          className="justify-start px-2 text-xs font-extrabold"
                          variant="ghost"
                          onClick={() => {
                            setScreen("recover");
                            setPassword("");
                            setError("");
                            setInvalid("");
                          }}
                        >
                          <KeyRound aria-hidden="true" /> Olvidé mi contraseña
                        </Button>
                      )}
                      {recovering ? (
                        <Button
                          className="justify-start px-2"
                          variant="ghost"
                          onClick={() => {
                            setScreen("login");
                            setError("");
                            setMessage("");
                            setInvalid("");
                          }}
                        >
                          Volver al ingreso
                        </Button>
                      ) : (
                        <div className="flex flex-wrap items-center gap-x-2 text-[#52607a]">
                          <span>{isLogin ? "¿Primera vez en CREA?" : "¿Ya tienes cuenta?"}</span>
                          <Link
                            className="inline-flex min-h-11 items-center font-extrabold text-[#0b4ac9] underline decoration-[#0b4ac9]/40 underline-offset-4 hover:text-[#0839a0]"
                            href={(isLogin ? "/registro" : "/ingresar") + querySuffix}
                          >
                            {isLogin ? "Crear cuenta" : "Ingresar"}
                          </Link>
                        </div>
                      )}
                    </div>

                    <p className="mt-4 flex items-center gap-2 text-xs font-semibold text-[#52607a]">
                      <ShieldCheck className="size-4 shrink-0 text-[#115e38]" aria-hidden="true" />
                      Tus evaluaciones son privadas y solo tú puedes verlas o actualizarlas.
                    </p>
                  </motion.div>
                </AnimatePresence>
              )}
            </div>
          </section>
        </motion.div>
      </div>
    </MotionConfig>
  );
}
