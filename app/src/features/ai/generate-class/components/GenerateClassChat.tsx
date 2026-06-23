"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Loader2, History, X, Sparkles, Plus, MessageSquare, Trash2, BookOpen } from "lucide-react";
import ClassPlanCard from "./ClassPlanCard";
import { useGenerateClass } from "../hooks/useGenerateClass";

function conversationTitle(c: { first_message: string; last_message: string }): string {
  const text = c.first_message || c.last_message || "Nueva clase";
  const firstLine = text.split("\n")[0].trim();
  return firstLine.length <= 48 ? firstLine : firstLine.slice(0, 45) + "...";
}

export default function GenerateClassChat() {
  const {
    messages,
    isGenerating,
    history,
    conversations,
    showHistory,
    sendMessage,
    savePlan,
    toggleHistory,
    createNewChat,
    switchConversation,
    openPlan,
    removePlan,
    removeConversation,
    sessionId,
  } = useGenerateClass();

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;
    sendMessage(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex h-full">
      <div className="flex flex-1 flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 dark:border-[#253245] dark:bg-[#0b1120]">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-[#275D79] dark:text-[#7BB8D4]" />
            <h1 className="text-lg font-semibold text-slate-950 dark:text-slate-100">
              Generar Clase
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={createNewChat}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#1a2740] dark:text-slate-400 dark:hover:bg-[#253245]"
            >
              <Plus size={14} />
              Nueva clase
            </button>
            <button
              type="button"
              onClick={toggleHistory}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-[#253245] dark:bg-[#1a2740] dark:text-slate-400 dark:hover:bg-[#253245]"
            >
              <History size={14} />
              Historial
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Sparkles size={40} className="mb-4 text-[#275D79]/30 dark:text-[#7BB8D4]/30" />
              <h2 className="serif text-2xl text-slate-950 dark:text-slate-100">
                ¿Qué clase querés planificar?
              </h2>
              <p className="mt-2 max-w-md text-sm text-slate-500 dark:text-slate-400">
                Describí el tema, nivel, duración y objetivos. La IA va a generar un plan
                estructurado con actividades, rúbrica y evaluación.
              </p>
            </div>
          ) : (
            <div className="mx-auto max-w-3xl space-y-6">
              {messages.map((msg) => (
                <div key={msg.id}>
                  {msg.role === "user" && (
                    <div className="flex justify-end">
                      <div className="max-w-[80%] rounded-2xl bg-[#275D79] px-4 py-3 text-sm text-white">
                        {msg.content}
                      </div>
                    </div>
                  )}
                  {msg.role === "assistant" && msg.plan && msg.plan.type === "chat" && (
                    <div className="max-w-[80%] rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-800 dark:bg-[#1a2740] dark:text-slate-200">
                      {msg.content}
                    </div>
                  )}
                  {msg.role === "assistant" && msg.plan && msg.plan.type !== "chat" && msg.plan.plan_data && (
                    <ClassPlanCard
                      plan={msg.plan}
                      onSave={(title, prompt, planData) =>
                        savePlan(title, prompt, planData)
                      }
                      prompt={msg.content}
                    />
                  )}
                  {msg.role === "error" && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400">
                      {msg.content}
                    </div>
                  )}
                </div>
              ))}

              {isGenerating && (
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 dark:border-[#253245] dark:bg-[#0f1a2e]">
                  <Loader2 size={20} className="animate-spin text-[#275D79] dark:text-[#7BB8D4]" />
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    Pensando...
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 bg-white px-6 py-4 dark:border-[#253245] dark:bg-[#0b1120]">
          <div className="mx-auto flex max-w-3xl gap-3">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Decime qué clase querés planificar o saludame..."
              rows={1}
              disabled={isGenerating}
              className="min-h-[44px] flex-1 resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#275D79] focus:bg-white focus:ring-2 focus:ring-[#275D79]/15 disabled:opacity-50 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-[#3a7fa0] dark:focus:bg-[#0f1a2e] dark:focus:ring-[#3a7fa0]/20"
            />
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!input.trim() || isGenerating}
              className="inline-flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-xl bg-[#275D79] text-white transition hover:bg-[#1f4a61] disabled:opacity-40 dark:bg-[#3a7fa0] dark:hover:bg-[#2d6a8a]"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>

      {showHistory && (
        <aside className="w-80 border-l border-slate-200 bg-white dark:border-[#253245] dark:bg-[#0b1120]">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-[#253245]">
            <h2 className="text-sm font-semibold text-slate-950 dark:text-slate-100">
              Historial
            </h2>
            <button
              type="button"
              onClick={toggleHistory}
              className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-[#1a2740]"
            >
              <X size={16} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Conversaciones
            </h3>
            {conversations.length === 0 ? (
              <p className="mb-4 text-xs text-slate-400 dark:text-slate-500">
                No hay conversaciones anteriores
              </p>
            ) : (
              <div className="mb-6 space-y-1.5">
                {conversations.map((c) => (
                  <div
                    key={c.session_id}
                    className={`group flex items-start gap-1 rounded-xl px-3 py-2 transition hover:bg-slate-100 dark:hover:bg-[#1a2740] ${
                      c.session_id === sessionId
                        ? "bg-[#275D79]/10 dark:bg-[#7BB8D4]/10"
                        : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => switchConversation(c.session_id)}
                      className="flex min-w-0 flex-1 items-start gap-2 text-left text-xs"
                    >
                      <MessageSquare size={14} className="mt-0.5 shrink-0 text-slate-400" />
                      <div className="min-w-0">
                        <p className="truncate font-medium text-slate-950 dark:text-slate-100">
                          {conversationTitle(c)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-400 dark:text-slate-500">
                          {new Date(c.last_active_at).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeConversation(c.session_id)}
                      className="mt-0.5 shrink-0 rounded p-0.5 text-slate-400 opacity-0 transition hover:text-red-500 group-hover:opacity-100"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Planes guardados
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500">
                No hay planes guardados aún
              </p>
            ) : (
              <div className="space-y-2">
                {history.map((item) => (
                  <div
                    key={item.id}
                    className="group relative rounded-xl border border-slate-100 bg-slate-50 p-3 hover:bg-slate-100 dark:border-[#1e293b] dark:bg-[#0a1424] dark:hover:bg-[#1a2740]"
                  >
                    <button
                      type="button"
                      onClick={() => openPlan(item.id)}
                      className="w-full text-left"
                    >
                      <p className="text-sm font-medium text-slate-950 dark:text-slate-100">
                        {item.title}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                        {new Date(item.created_at).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </button>
                    <div className="absolute right-2 top-2 flex gap-1 opacity-0 transition group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => openPlan(item.id)}
                        className="rounded p-1 text-slate-400 hover:text-[#275D79] dark:hover:text-[#7BB8D4]"
                        title="Abrir plan"
                      >
                        <BookOpen size={12} />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePlan(item.id)}
                        className="rounded p-1 text-slate-400 hover:text-red-500"
                        title="Eliminar plan"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      )}
    </div>
  );
}
