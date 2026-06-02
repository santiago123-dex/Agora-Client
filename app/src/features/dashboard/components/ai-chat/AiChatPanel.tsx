"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { sendChatMessage } from "@/app/src/lib/api/ai";
import type { ChatResponse } from "@/app/src/lib/api/ai";

type Message = {
  role: "user" | "assistant";
  content: string;
  error?: boolean;
};

export default function AiChatPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "¡Hola! Soy el asistente de Agora. ¿En qué puedo ayudarte?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    try {
      const res: ChatResponse = await sendChatMessage(text, undefined, sessionId ?? undefined);
      setSessionId(res.session_id);
      setMessages((prev) => [...prev, { role: "assistant", content: res.message }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ocurrió un error al comunicarme con el asistente. Intentalo de nuevo.", error: true },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sessionId]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#275D79] text-white shadow-lg transition hover:bg-[#1f4a61] dark:bg-[#3a7fa0] dark:hover:bg-[#2d6a8a]"
        aria-label={isOpen ? "Cerrar chat" : "Abrir chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      <aside
        className={`fixed bottom-24 right-6 z-50 flex w-80 flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all duration-300 ${
          isOpen ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        } dark:border-[#253245] dark:bg-[#141f33]`}
        style={{ height: "480px" }}
      >
        {/* Header */}
        <div className="flex shrink-0 items-center gap-2 border-b border-slate-200 px-4 py-3 dark:border-[#253245]">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#275D79] text-xs font-bold text-white dark:bg-[#3a7fa0]">
            IA
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Asistente Agora</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Conectado</p>
          </div>
        </div>

        {/* Messages */}
        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "rounded-br-md bg-[#275D79] text-white dark:bg-[#3a7fa0]"
                    : msg.error
                      ? "rounded-bl-md border border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-400"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-300"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-[#253245] dark:bg-[#0a1424]">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex shrink-0 items-center gap-2 border-t border-slate-200 px-3 py-3 dark:border-[#253245]">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribí un mensaje..."
            disabled={isLoading}
            className="h-9 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-900 outline-none transition focus:border-[#275D79] focus:ring-2 focus:ring-[#275D79]/15 disabled:opacity-50 dark:border-[#253245] dark:bg-[#0a1424] dark:text-slate-200 dark:focus:border-[#3a7fa0] dark:focus:ring-[#3a7fa0]/40"
          />
          <button
            type="button"
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#275D79] text-white transition hover:bg-[#1f4a61] disabled:opacity-40 dark:bg-[#3a7fa0] dark:hover:bg-[#2d6a8a]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
