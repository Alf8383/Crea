"use client";

import {
  ActionBarPrimitive,
  AssistantRuntimeProvider,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useAuiState,
  useLocalRuntime,
  type ChatModelAdapter,
} from "@assistant-ui/react";
import { ArrowDown, Check, Copy, RotateCcw, Send, Sparkles, Square, Trash2, X } from "lucide-react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/features/auth/session";
import { assistantTopics, isAssistantTopic, localAssistantTopic, type AssistantTopic } from "@/lib/assistant-topics";
import { ciiuCatalog, type CiiuCode } from "@/lib/ciiu-catalog";

type Context = {
  stage: string;
  question: string;
  topics: AssistantTopic[];
  stageAnswered: boolean;
  planning: boolean;
  code?: CiiuCode;
  suggestionCode?: CiiuCode;
};

function contextualHelp(context: Context | null, topic?: AssistantTopic) {
  if (topic === "sales" && context?.planning) return "Para tu etapa inicial, registra la estimación como proyección de todo el ejercicio.";
  if ((topic === "ciiu" || topic === "mixed") && context?.code) {
    const entry = ciiuCatalog[context.code];
    return context.code + " · " + entry.name + ". " + entry.reason;
  }
  if ((topic === "ciiu" || topic === "mixed") && context?.suggestionCode) {
    const entry = ciiuCatalog[context.suggestionCode];
    return "Sugerencia por confirmar · " + context.suggestionCode + ". " + entry.reason + " Si no coincide con lo que harás, usa «Corregir descripción».";
  }
  if ((topic === "ciiu" || topic === "mixed") && context?.stageAnswered) {
    return "Si aún no confirmaste el código, indica qué actividad predomina: comidas de consumo inmediato, bebidas, eventos puntuales o contratos continuos. Si falta esa información, deja la clasificación pendiente.";
  }
}

const subscribeToHydration = () => () => {};
const Register = createContext<(value: Context | null) => void>(() => {});
const endpoint = process.env.NEXT_PUBLIC_CREA_ASSISTANT_URL;

export function useAssistantContext(value: Context) {
  const register = useContext(Register);
  const key = JSON.stringify(value);
  useEffect(() => {
    register(JSON.parse(key) as Context);
    return () => register(null);
  }, [key, register]);
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [context, setContext] = useState<Context | null>(null);
  const { user, loading } = useSession();
  return (
    <Register.Provider value={setContext}>
      {children}
      <CloudChat key={loading ? "loading" : user?.uid ?? "guest"} context={context} />
    </Register.Provider>
  );
}

function ThinkingTimer() {
  const isRunning = useAuiState((s) => s.thread.isRunning);
  const [elapsedMs, setElapsedMs] = useState(0);

  useEffect(() => {
    if (!isRunning) return;
    const startedAt = Date.now();
    const id = window.setInterval(() => setElapsedMs(Date.now() - startedAt), 100);
    return () => {
      window.clearInterval(id);
      setElapsedMs(0);
    };
  }, [isRunning]);

  if (!isRunning) return null;
  return (
    <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-sm border border-[#e5dfd3] bg-white px-3.5 py-2 text-xs font-bold text-[#3b4b6b] shadow-[0_6px_18px_-12px_rgba(10,26,60,0.2)]">
      <Sparkles className="size-3.5 animate-pulse text-[#0b4ac9]" aria-hidden="true" />
      <span>Pensando… {(elapsedMs / 1000).toFixed(1)}s</span>
    </div>
  );
}

function UserMessage() {
  return (
    <MessagePrimitive.Root className="flex justify-end">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.24, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-[85%] rounded-2xl rounded-br-sm bg-[#0b4ac9] px-3.5 py-2.5 text-sm font-semibold leading-relaxed text-white shadow-[0_8px_20px_-10px_rgba(11,74,201,0.55)]"
      >
        <MessagePrimitive.Parts />
      </motion.div>
    </MessagePrimitive.Root>
  );
}

function AssistantMessage() {
  return (
    <MessagePrimitive.Root className="group flex flex-col items-start gap-1.5">
      <motion.div
        initial={{ opacity: 0, y: 8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
        className="max-w-[92%] rounded-2xl rounded-bl-sm border border-[#e5dfd3] bg-white px-4 py-3 text-sm leading-relaxed text-[#0a1a3c] shadow-[0_8px_24px_-16px_rgba(10,26,60,0.18)]"
      >
        <MessagePrimitive.Parts />
      </motion.div>
      <ActionBarPrimitive.Root
        hideWhenRunning
        autohide="not-last"
        className="flex items-center gap-1 pl-1 text-xs font-bold text-[#52607a]"
      >
        <ActionBarPrimitive.Copy asChild>
          <button
            type="button"
            aria-label="Copiar respuesta"
            className="inline-flex min-h-7 items-center gap-1 rounded-full px-2.5 py-1 transition-colors hover:bg-[#efeae0] hover:text-[#0a1a3c]"
          >
            <MessagePrimitive.If copied>
              <Check className="size-3 text-[#0b4ac9]" />
              <span>Copiado</span>
            </MessagePrimitive.If>
            <MessagePrimitive.If copied={false}>
              <Copy className="size-3" />
              <span>Copiar</span>
            </MessagePrimitive.If>
          </button>
        </ActionBarPrimitive.Copy>
        <ActionBarPrimitive.Reload asChild>
          <button
            type="button"
            aria-label="Regenerar respuesta"
            className="inline-flex min-h-7 items-center gap-1 rounded-full px-2.5 py-1 transition-colors hover:bg-[#efeae0] hover:text-[#0a1a3c]"
          >
            <RotateCcw className="size-3" />
            <span>Reintentar</span>
          </button>
        </ActionBarPrimitive.Reload>
      </ActionBarPrimitive.Root>
    </MessagePrimitive.Root>
  );
}

function CloudChat({ context }: { context: Context | null }) {
  const ready = useSyncExternalStore(subscribeToHydration, () => true, () => false);
  const path = usePathname();
  const restricted = path === "/investigacion" || path.startsWith("/investigacion/");
  const [open, setOpen] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const close = useRef<HTMLButtonElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) close.current?.focus();
    else if (wasOpen.current) button.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const adapter = useMemo<ChatModelAdapter>(
    () => ({
      async run({ messages, abortSignal }) {
        const lastUser = [...messages].reverse().find((m) => m.role === "user");
        const query = lastUser?.content
          .filter((part): part is { type: "text"; text: string } => part.type === "text")
          .map((part) => part.text)
          .join(" ")
          .trim() ?? "";

        const fallbackTopic = localAssistantTopic(query);
        const contextNote = authorized ? contextualHelp(context, fallbackTopic) : undefined;

        if (!endpoint) {
          const text = fallbackTopic
            ? `${assistantTopics[fallbackTopic].text}${contextNote ? `\n\n${contextNote}` : ""}`
            : "No encontré una explicación verificada para esa consulta. Prueba las sugerencias o consulta las guías oficiales.";
          return { content: [{ type: "text", text }] };
        }

        try {
          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question: query }),
            credentials: "omit",
            referrerPolicy: "no-referrer",
            signal: AbortSignal.any([abortSignal, AbortSignal.timeout(25000)]),
          });
          if (!response.ok) throw new Error("Assistant unavailable");
          const data = (await response.json()) as { answer?: string; topic?: string };
          const topic = isAssistantTopic(data.topic) ? data.topic : fallbackTopic;
          const extra = authorized ? contextualHelp(context, topic) : undefined;
          const baseText =
            typeof data.answer === "string" && data.answer.trim()
              ? data.answer.trim()
              : topic
                ? assistantTopics[topic].text
                : "No pude generar una respuesta en este momento. Intenta reformular tu pregunta.";
          const sourceLine = topic ? `\n\nFuente: ${assistantTopics[topic].source}` : "";
          const contextLine = extra ? `\n\n${extra}` : "";
          return { content: [{ type: "text", text: `${baseText}${sourceLine}${contextLine}` }] };
        } catch {
          const text = fallbackTopic
            ? `${assistantTopics[fallbackTopic].text}${contextNote ? `\n\n${contextNote}` : ""}`
            : "El asistente no pudo responder en este momento. Intenta nuevamente en unos segundos.";
          return { content: [{ type: "text", text }] };
        }
      },
    }),
    [authorized, context],
  );

  const runtime = useLocalRuntime(adapter);
  const topics = context?.topics.length ? context.topics : (["ciiu", "sales", "tax"] as const);

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <MotionConfig reducedMotion="user">
        <div className="crea-cloud print-hidden">
          <AnimatePresence>
            {open && (
              <motion.section
                key="crea-cloud-panel"
                id="crea-cloud-panel"
                className="crea-cloud-panel"
                role="dialog"
                aria-labelledby="crea-cloud-title"
                initial={{ opacity: 0, y: 12, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", duration: 0.36, bounce: 0.15 }}
              >
            <header className="crea-cloud-head">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-[#ffc400] text-[#081636] shadow-xs">
                  <Sparkles className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <h2 id="crea-cloud-title" className="flex items-center gap-1.5">
                    CREA IA
                    <span aria-hidden="true" className="inline-block size-1.5 rounded-full bg-[#ffc400]" />
                  </h2>
                  <p>Orientación gastronómica · Cajamarca</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Nueva conversación"
                  className="rounded-full text-[#cbd5e8] hover:bg-white/12 hover:text-white"
                  onClick={() => runtime.thread.reset()}
                >
                  <Trash2 className="size-4" aria-hidden="true" />
                </Button>
                <Button
                  ref={close}
                  size="icon"
                  variant="ghost"
                  aria-label="Cerrar CREA IA"
                  className="rounded-full text-[#cbd5e8] hover:bg-white/12 hover:text-white"
                  onClick={() => setOpen(false)}
                >
                  <X aria-hidden="true" />
                </Button>
              </div>
            </header>

            {restricted ? (
              <p className="p-5 text-sm leading-relaxed text-[#3b4b6b]">
                La asistencia está deshabilitada en el módulo de investigación para proteger las respuestas del pretest y el postest.
              </p>
            ) : (
              <ThreadPrimitive.Root className="flex min-h-0 flex-1 flex-col">
                <ThreadPrimitive.Viewport className="crea-cloud-log relative flex flex-1 flex-col gap-3 overflow-y-auto p-4">
                  {context && (
                    <div className="rounded-2xl border border-[#e5dfd3] bg-[#f3eee5] p-3 text-xs text-[#3b4b6b]">
                      <strong className="font-extrabold text-[#0a1a3c]">{context.stage}</strong>
                      <p className="mt-0.5 leading-relaxed">{context.question}</p>
                    </div>
                  )}

                  <ThreadPrimitive.Empty>
                    <div className="rounded-2xl border border-[#e5dfd3] bg-white p-4 shadow-[0_8px_24px_-16px_rgba(10,26,60,0.16)]">
                      <p className="text-[11px] font-extrabold uppercase tracking-[0.14em] text-[#9a3b22]">
                        Asistente de orientación
                      </p>
                      <p className="mt-1.5 [font-family:'Bricolage_Grotesque_Variable','Bricolage_Grotesque',system-ui,sans-serif] text-lg font-bold text-[#0a1a3c]">
                        ¡Hola! Soy CREA IA.
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-[#3b4b6b]">
                        Pregúntame sobre RUC, regímenes tributarios, CIIU o formalización en Cajamarca. Evita incluir claves o datos personales.
                      </p>
                    </div>
                  </ThreadPrimitive.Empty>

                  <ThreadPrimitive.Messages
                    components={{
                      UserMessage,
                      AssistantMessage,
                    }}
                  />

                  <ThinkingTimer />

                  <ThreadPrimitive.ScrollToBottom asChild>
                    <button
                      type="button"
                      aria-label="Ir al final"
                      className="sticky bottom-1 self-center rounded-full bg-[#0a1a3c] p-2 text-white shadow-md transition-transform hover:bg-[#132b5e] active:scale-95 disabled:hidden"
                    >
                      <ArrowDown className="size-3.5" aria-hidden="true" />
                    </button>
                  </ThreadPrimitive.ScrollToBottom>
                </ThreadPrimitive.Viewport>

                <div className="crea-cloud-form">
                  <div className="flex flex-wrap gap-1.5">
                    {topics.map((topic) => (
                      <ThreadPrimitive.Suggestion
                        key={topic}
                        prompt={assistantTopics[topic].label}
                        autoSend
                        asChild
                      >
                        <button type="button" className="crea-cloud-chip">
                          {assistantTopics[topic].label}
                        </button>
                      </ThreadPrimitive.Suggestion>
                    ))}
                  </div>

                  {context?.stageAnswered && (
                    <label className="flex items-start gap-2 text-xs font-semibold text-[#3b4b6b]">
                      <input
                        type="checkbox"
                        checked={authorized}
                        onChange={(event) => setAuthorized(event.target.checked)}
                      />
                      Usar mi etapa y actividad en esta ayuda local
                    </label>
                  )}

                  <ComposerPrimitive.Root className="flex items-center gap-2">
                    <ComposerPrimitive.Input
                      placeholder="Escribe tu pregunta…"
                      aria-label="Pregunta para CREA IA"
                      maxLength={320}
                      className="flex-1 rounded-full border border-[#cfc7b8] bg-[#faf8f4] px-4 py-2.5 text-sm text-[#0a1a3c] placeholder:text-[#52607a] outline-none transition-colors focus:border-[#0b4ac9] focus:bg-white focus:ring-2 focus:ring-[#0b4ac9]/25"
                    />
                    <ThreadPrimitive.If running={false}>
                      <ComposerPrimitive.Send asChild>
                        <Button
                          type="submit"
                          size="icon"
                          aria-label="Enviar pregunta"
                          className="size-10 shrink-0 rounded-full bg-[#0b4ac9] text-white shadow-[0_8px_18px_-8px_rgba(11,74,201,0.6)] transition-[transform,background-color] hover:bg-[#0839a0] active:scale-95"
                        >
                          <Send className="size-4" aria-hidden="true" />
                        </Button>
                      </ComposerPrimitive.Send>
                    </ThreadPrimitive.If>
                    <ThreadPrimitive.If running>
                      <ComposerPrimitive.Cancel asChild>
                        <Button
                          type="button"
                          size="icon"
                          variant="outline"
                          aria-label="Detener respuesta"
                          className="size-10 shrink-0 rounded-full border-[#0a1a3c] text-[#0a1a3c] hover:bg-[#f3eee5]"
                        >
                          <Square className="size-3.5 fill-current" aria-hidden="true" />
                        </Button>
                      </ComposerPrimitive.Cancel>
                    </ThreadPrimitive.If>
                  </ComposerPrimitive.Root>
                </div>
              </ThreadPrimitive.Root>
            )}
            </motion.section>
          )}
        </AnimatePresence>

          <motion.button
            ref={button}
            type="button"
            disabled={!ready}
            aria-label="CREA IA, asistente de orientación"
            aria-expanded={open}
            aria-controls={open ? "crea-cloud-panel" : undefined}
            className="crea-cloud-trigger"
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen((value) => !value)}
          >
            <span className="crea-cloud-icon" aria-hidden="true">
              <Sparkles strokeWidth={2.2} />
            </span>
            <span className="crea-cloud-label">CREA IA</span>
          </motion.button>
        </div>
      </MotionConfig>
    </AssistantRuntimeProvider>
  );
}
