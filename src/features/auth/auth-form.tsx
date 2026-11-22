"use client";

import { ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react";
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

function authError(error: unknown) {
  const code = typeof error === "object" && error && "code" in error ? String(error.code) : "";
  return errors[code] ?? "No pudimos completar la solicitud. Intenta de nuevo.";
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const candidate = useSearchParams().get("volver");
  const destination = candidate && ["/admin", "/investigacion", "/negocios", "/negocios/nuevo", "/negocios?guardar=1"].includes(candidate) ? candidate : "/negocios";
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
          if (!(typeof failure === "object" && failure && "code" in failure && failure.code === "auth/user-not-found")) throw failure;
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
  const title = recovering ? "Recupera tu acceso" : isLogin ? "Ingresa a CREA" : "Crea tu cuenta";
  const intro = recovering ? "Te enviaremos un enlace al correo de tu cuenta."
    : destination === "/negocios?guardar=1" ? "Usa tu cuenta para guardar la evaluación que acabas de completar."
      : destination === "/investigacion" ? "Usa la cuenta vinculada a tu participación en el estudio."
        : destination === "/admin" ? "Usa tu cuenta de administración del catálogo."
          : "Accede a tus evaluaciones guardadas desde otros dispositivos.";
  return <div className="crea-auth-page bg-[#faf8f4] px-4 pb-8 [font-family:'Nunito_Variable','Nunito',system-ui,sans-serif] text-[#0a1a3c] sm:px-8">
    <div className="mx-auto grid max-w-[78rem] gap-6 rounded-b-[30px] border border-t-0 border-[#e5dfd3] bg-white p-5 shadow-[0_24px_64px_-28px_rgba(10,26,60,0.16)] sm:p-10 lg:grid-cols-2 lg:items-start">
      <section className="order-last overflow-hidden rounded-[26px] border border-[#e5dfd3] bg-[#faf8f4] lg:order-first" aria-labelledby="auth-benefits">
        <div className="relative h-48 sm:h-60">
          <Image src="/restaurante-cajamarca.webp" alt="Emprendedora gastronómica en Cajamarca" fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover object-center" />
        </div>
        <div className="p-6 sm:p-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.12em] text-[#9a3b22]">CREA · Cajamarca</p>
          <h2 id="auth-benefits" className="mt-2 [font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-2xl font-bold tracking-[-0.02em] text-[#0a1a3c] sm:text-3xl">Organiza la formalización de tu negocio</h2>
          <p className="mt-3 max-w-md text-[#3b4b6b]">Evalúa tu actividad gastronómica en Cajamarca, estima tus ventas y guarda tu ruta paso a paso.</p>
        </div>
      </section>
      <section className="crea-auth-card min-w-0 rounded-[26px] border border-[#e5dfd3] bg-white p-6 sm:p-9" aria-labelledby="auth-title">
        <h1 id="auth-title" className="mb-4 [font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-3xl font-bold tracking-[-0.025em] text-[#0a1a3c] sm:text-4xl">{title}</h1>
        {session.mode === "firebase" && !session.user && <p className="mb-5 text-muted-foreground">{intro}</p>}
        {session.loading ? <p role="status">Comprobando tu sesión…</p>
        : session.mode !== "firebase" ? <EmptyState title={session.mode === "demo" ? "Modo demostración" : "Cuentas sin conexión"}>
          {session.mode === "demo" ? "Esta vista previa usa el modo demostración. Puedes hacer una evaluación sin cuenta y tus respuestas se guardarán en esta pestaña." : "El acceso a cuentas no está disponible. Puedes evaluar tu restaurante y consultar las guías en esta pestaña."}
          {session.mode === "demo" && <div className="mt-3"><Link className="inline-flex min-h-11 items-center font-bold text-primary underline underline-offset-4" href="/negocios">Explorar una evaluación de demostración</Link></div>}
        </EmptyState>
        : session.user ? <div className="grid justify-items-start gap-4"><p className="text-muted-foreground">Sesión activa con {session.user.email}.</p><LinkButton href={destination}>Continuar <ArrowRight aria-hidden="true" /></LinkButton></div>
        : <>
          <form onSubmit={onSubmit} noValidate className="grid gap-4 border-t border-border pt-5" aria-busy={busy}>
            <Field id="email" label="Correo electrónico" error={invalid === "email" ? "Ingresa un correo electrónico válido." : undefined}>
              <Input id="email" name="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)}
                aria-invalid={invalid === "email"} aria-describedby={invalid === "email" ? "email-error" : undefined} />
            </Field>
            {!recovering && <Field id="password" label="Contraseña" hint={!isLogin ? "Usa al menos 8 caracteres." : undefined} error={invalid === "password" ? isLogin ? "Escribe tu contraseña." : "Usa al menos 8 caracteres." : undefined}>
              <div className="relative">
                <Input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete={isLogin ? "current-password" : "new-password"}
                  value={password} onChange={(event) => setPassword(event.target.value)}
                  className="pr-12"
                  aria-invalid={invalid === "password"} aria-describedby={invalid === "password" ? "password-error" : !isLogin ? "password-hint" : undefined} />
                <button type="button" onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-1.5 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                  {showPassword ? <EyeOff className="size-4" aria-hidden="true" /> : <Eye className="size-4" aria-hidden="true" />}
                </button>
              </div>
            </Field>}
            {error && <Notice tone="error">{error}</Notice>}
            {message && <Notice tone="success">{message}</Notice>}
            <Button type="submit" disabled={busy}>{busy ? "Procesando…" : recovering ? "Enviar enlace" : isLogin ? "Ingresar" : "Crear cuenta"} <ArrowRight aria-hidden="true" /></Button>
            {!recovering && <Button type="button" variant="outline" disabled={busy} onClick={() => void submit("google")}>
              <svg aria-hidden="true" className="mr-2 size-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.96H1.29v3.14C3.26 21.3 7.31 24 12 24Z" />
                <path fill="#FBBC05" d="M5.28 14.24c-.24-.72-.38-1.49-.38-2.24s.14-1.52.38-2.24V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.99-3.14Z" />
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.99 3.14c.95-2.85 3.6-4.96 6.72-4.96Z" />
              </svg>
              Continuar con Google
            </Button>}
          </form>
          <div className="mt-4 grid items-start gap-2 text-sm">
            {isLogin && <Button className="justify-start px-0" variant="ghost" onClick={() => { setScreen("recover"); setError(""); setInvalid(""); }}><KeyRound aria-hidden="true" /> Olvidé mi contraseña</Button>}
            {recovering ? <Button className="justify-start px-0" variant="ghost" onClick={() => { setScreen("login"); setError(""); setMessage(""); setInvalid(""); }}>Volver al ingreso</Button> : <div className="flex flex-wrap items-center gap-x-2 text-muted-foreground">
              {isLogin ? "¿Primera vez en CREA?" : "¿Ya tienes cuenta?"}
              <Link className="inline-flex min-h-11 items-center font-bold text-primary underline underline-offset-4" href={(isLogin ? "/registro" : "/ingresar") + (candidate ? "?volver=" + encodeURIComponent(destination) : "")}>{isLogin ? "Crear cuenta" : "Ingresar"}</Link>
            </div>}
          </div>
        </>}
      </section>
    </div>
  </div>;
}
