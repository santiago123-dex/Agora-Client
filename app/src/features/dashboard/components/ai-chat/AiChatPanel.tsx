"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { ChevronLeft, MessageSquarePlus, X, MessageSquare, Trash2, Send } from "lucide-react";
import { sendChatMessage } from "@/app/src/lib/api/ai";
import type { ChatResponse, AiBlock, GradeResult } from "@/app/src/lib/api/ai";
import ChatBlocks from "./ChatBlocks";
import { useGrading } from "@/app/src/lib/contexts/GradingContext";

type Message = {
  role: "user" | "assistant";
  content: string;
  blocks?: AiBlock[];
  actions?: string[];
  error?: boolean;
};

type Conversation = {
  id: string;
  session_id: string;
  first_message: string;
  last_message: string;
  last_active_at: string;
  started_at: string;
};

function MarkdownContent({ text }: { text: string }) {
  const html = useMemo(() => {
    let result = text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(
        /```(\w*)\n?([\s\S]*?)```/g,
        '<pre class="rounded-lg bg-slate-100 p-2 my-1 overflow-x-auto text-xs dark:bg-slate-800"><code>$2</code></pre>',
      )
      .replace(
        /`([^`]+)`/g,
        '<code class="rounded bg-slate-100 px-1 dark:bg-slate-800">$1</code>',
      )
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/^### (.+)$/gm, "<h4 class='text-sm font-semibold my-1'>$1</h4>")
      .replace(
        /^## (.+)$/gm,
        "<h3 class='text-base font-semibold my-1'>$1</h3>",
      )
      .replace(/^# (.+)$/gm, "<h2 class='text-lg font-semibold my-1'>$1</h2>")
      .replace(/\n/g, "<br/>");
    return result;
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

const loadingBubbles = (
  <div className="flex justify-start">
    <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-[#253245] dark:bg-[#0a1424]">
      <div className="flex gap-1">
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"
          style={{ animationDelay: "300ms" }}
        />
      </div>
    </div>
  </div>
);

const WELCOME_MESSAGE: Message = {
  role: "assistant",
  content: "¡Hola! Soy el asistente de Agora. ¿En qué puedo ayudarte?",
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 86400000) return d.toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });
  if (diff < 604800000) return d.toLocaleDateString("es-CO", { weekday: "long" });
  return d.toLocaleDateString("es-CO", { day: "numeric", month: "short" });
}

function conversationTitle(c: Conversation): string {
  if (!c.first_message) return "Nueva conversación";
  const firstLine = c.first_message.split("\n")[0].trim();
  if (firstLine.length <= 48) return firstLine;
  return firstLine.slice(0, 45) + "...";
}

export default function AiChatPanel({
  isOpen,
  onClose,
  workspaceId,
}: {
  isOpen: boolean;
  onClose: () => void;
  workspaceId?: string;
}) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const { setAiSuggestions, setCurrentSuggestionId, setAiError } = useGrading();
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [inConversation, setInConversation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const suggestedMessages = useMemo(() => {
    const base = [
      { label: "Listar workspaces", text: "Listar workspaces" },
      { label: "Ver membresías", text: "¿De qué workspaces soy miembro?" },
    ];
    if (workspaceId) {
      base.push(
        { label: "Listar tareas", text: "Listar tareas" },
        { label: "Resumen del workspace", text: "Mostrar resumen del workspace" },
      );
    }
    return base;
  }, [workspaceId]);

  // ── Cargar conversaciones al abrir ──
  useEffect(() => {
    if (!isOpen) return;

    const saved = localStorage.getItem("aiChatSessionId");
    if (saved) {
      loadConversation(saved);
    } else {
      fetchConversations().then((list) => {
        if (list.length > 0) {
          loadConversation(list[0].session_id);
        } else {
          setInConversation(false);
        }
      });
    }
  }, [isOpen]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current && !loading) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, loading]);

  async function fetchConversations() {
    try {
      const res = await fetch("/api/ai/chat/conversations");
      if (!res.ok) return [];
      const data = await res.json();
      const list: Conversation[] = data.conversations ?? [];
      setConversations(list);
      return list;
    } catch {
      return [];
    }
  }

  function loadConversation(session_id: string) {
    setLoading(true);
    fetch(`/api/ai/chat/history?session_id=${session_id}`)
      .then((res) => {
        if (!res.ok) throw new Error("not found");
        return res.json();
      })
      .then((data) => {
        setSessionId(data.session_id);
        localStorage.setItem("aiChatSessionId", data.session_id);
        if (data.messages?.length) {
          setMessages(
            data.messages.map((m: any) => ({
              role: m.role,
              content: m.content,
              blocks: m.blocks ?? undefined,
            })),
          );
        }
        setInConversation(true);
      })
      .catch(() => {
        localStorage.removeItem("aiChatSessionId");
      })
      .finally(() => setLoading(false));
  }

  const handleNewConversation = () => {
    localStorage.removeItem("aiChatSessionId");
    setSessionId(null);
    setMessages([WELCOME_MESSAGE]);
    setInConversation(true);
  };

  const backToList = () => {
    setInConversation(false);
    fetchConversations();
  };

  const handleDeleteConversation = async (e: React.MouseEvent, session_id: string) => {
    e.stopPropagation();
    try {
      const res = await fetch(`/api/ai/chat/conversations?session_id=${session_id}`, {
        method: "DELETE",
      });
      if (!res.ok) return;
      setConversations((prev) => prev.filter((c) => c.session_id !== session_id));
      const saved = localStorage.getItem("aiChatSessionId");
      if (saved === session_id) {
        localStorage.removeItem("aiChatSessionId");
        setSessionId(null);
      }
    } catch {
      // ignore
    }
  };

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isPending) return;

    setInput("");
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
    setMessages((prev) => [...prev, { role: "user", content: text }]);

    startTransition(async () => {
      try {
        const res: ChatResponse = await sendChatMessage(
          text,
          workspaceId,
          sessionId ?? undefined,
        );

        setSessionId(res.session_id);
        localStorage.setItem("aiChatSessionId", res.session_id);
        setInConversation(true);

        const gradingBlock = res.blocks?.find(
          (b: any) => b.type === "grading_result",
        ) as any;

        if (gradingBlock) {
          setCurrentSuggestionId(gradingBlock.suggestion_id);
          const bySubmission: Record<string, GradeResult> = {};
          for (const r of gradingBlock.results) {
            bySubmission[r.submission_id] = {
              submission_id: r.submission_id,
              total_score: r.total_score,
              max_score: r.max_score,
              feedback_summary: r.feedback_summary,
              grading_model: r.grading_model,
              evaluated_at: r.evaluated_at,
              criteria_results: r.criteria_results.map((c: any) => ({
                criterion_id: c.criterion_id,
                criterion_name: c.criterion_name,
                score: c.score,
                max_score: c.max_score,
                feedback: c.feedback,
                matched_level: c.matched_level,
              })),
            };
          }
          setAiSuggestions((prev) => ({ ...prev, ...bySubmission }));
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: res.message,
            blocks: res.blocks,
            actions: res.actions_triggered,
          },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Ocurrió un error al comunicarme con el asistente. Intentalo de nuevo.",
            error: true,
          },
        ]);
      }
    });
  }, [input, isPending, sessionId, workspaceId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  // ──────────── RENDER ────────────

  return (
    <aside
      className={`fixed right-0 top-0 z-40 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 lg:w-[420px] dark:border-[#253245] dark:bg-[#141f33] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-[#253245]">
        <div className="flex items-center gap-2">
          {inConversation && (
            <button
              type="button"
              onClick={backToList}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#253245] dark:hover:text-slate-300"
              aria-label="Volver"
            >
              <ChevronLeft size={16} />
            </button>
          )}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#275D79] text-xs font-bold text-white dark:bg-[#3a7fa0]">
            IA
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Asistente Agora
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {!inConversation ? "Conversaciones" : "Conectado"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handleNewConversation}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#253245] dark:hover:text-slate-300"
            aria-label="Nueva conversación"
            title="Nueva conversación"
          >
            <MessageSquarePlus size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#253245] dark:hover:text-slate-300"
            aria-label="Cerrar chat"
          >
          <X size={18} />
        </button>
      </div>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
          Cargando...
        </div>
      ) : !inConversation ? (
        /* ── Lista de conversaciones ── */
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {conversations.length === 0 ? (
            <div className="flex flex-col items-center gap-4 pt-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-[#253245]">
                <MessageSquare size={22} strokeWidth={1.5} className="text-slate-400" />
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay conversaciones anteriores
              </p>
              <button
                type="button"
                onClick={handleNewConversation}
                className="rounded-lg bg-[#275D79] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#1f4a61] dark:bg-[#3a7fa0] dark:hover:bg-[#2d6a8a]"
              >
                Nueva conversación
              </button>
            </div>
          ) : (
            <>
              <div className="mb-3 flex items-center justify-between px-1">
                <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  Conversaciones
                </h3>
                <span className="text-xs text-slate-400">{conversations.length}</span>
              </div>
              {conversations.map((c) => (
                <div
                  key={c.id}
                  className="group relative rounded-xl transition hover:bg-slate-50 dark:hover:bg-[#0a1424]"
                >
                  <button
                    type="button"
                    onClick={() => loadConversation(c.session_id)}
                    className="w-full px-3 py-2.5 text-left"
                  >
                    <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
                      {conversationTitle(c)}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">
                      {formatDate(c.last_active_at)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => handleDeleteConversation(e, c.session_id)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-300 opacity-0 transition hover:bg-slate-200 hover:text-red-500 group-hover:opacity-100 dark:text-slate-500 dark:hover:bg-[#1e293b] dark:hover:text-red-400"
                    aria-label="Eliminar conversación"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>
      ) : (
        <>
          {/* Messages */}
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "flex-col items-start"}`}
              >
                {msg.actions && msg.actions.length > 0 && (
                  <div className="mb-1.5 flex flex-wrap gap-1">
                    {msg.actions.map((action, ai) => (
                      <span
                        key={ai}
                        className="rounded-full bg-[#275D79]/10 px-2 py-0.5 text-[10px] font-medium text-[#275D79] dark:bg-[#3a7fa0]/15 dark:text-[#3a7fa0]"
                      >
                        {action}
                      </span>
                    ))}
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "rounded-br-md bg-[#275D79] text-white dark:bg-[#3a7fa0]"
                      : msg.error
                        ? "rounded-bl-md border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                        : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-300"
                  }`}
                  style={{ overflowWrap: "break-word", wordBreak: "break-word" }}
                >
                  {msg.role === "user" ? (
                    msg.content
                  ) : (
                    <MarkdownContent text={msg.content} />
                  )}
                </div>
                {msg.blocks && msg.blocks.length > 0 && (
                  <div className="mt-2 w-full">
                    <ChatBlocks blocks={msg.blocks} message={msg.content} />
                  </div>
                )}
              </div>
            ))}
            {isPending && loadingBubbles}
          </div>

          {/* Suggested messages */}
          {!isPending && messages.length <= 1 && (
            <div className="flex shrink-0 flex-wrap gap-1.5 border-t border-slate-100 px-3 py-2 dark:border-[#1e293b]">
              {suggestedMessages.map((s) => (
                <button
                  key={s.text}
                  type="button"
                  onClick={() => {
                    setInput(s.text);
                    if (inputRef.current) inputRef.current.focus();
                  }}
                  className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600 transition hover:border-[#275D79] hover:text-[#275D79] dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-400 dark:hover:border-[#3a7fa0] dark:hover:text-[#3a7fa0]"
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="flex shrink-0 items-end gap-2 border-t border-slate-200 px-3 py-3 dark:border-[#253245]">
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Escribí un mensaje..."
              disabled={isPending}
              rows={1}
              className="flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 disabled:opacity-50 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:ring-[#3a7fa0]/40 [&::-webkit-scrollbar]:hidden"
              style={{ maxHeight: "120px", overflowY: "auto", lineHeight: "2.1" }}
            />
            <button
              type="button"
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#275D79] text-white transition hover:bg-[#1f4a61] disabled:opacity-40 dark:bg-[#3a7fa0] dark:hover:bg-[#2d6a8a]"
            >
              <Send size={16} strokeWidth={2.5} />
            </button>
          </div>
        </>
      )}
    </aside>
  );
}
