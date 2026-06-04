"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import { sendChatMessage } from "@/app/src/lib/api/ai";
import type { ChatResponse, AiBlock } from "@/app/src/lib/api/ai";
import ChatBlocks from "./ChatBlocks";

type Message = {
  role: "user" | "assistant";
  content: string;
  blocks?: AiBlock[];
  actions?: string[];
  error?: boolean;
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

export default function AiChatPanel({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "¡Hola! Soy el asistente de Agora. ¿En qué puedo ayudarte?",
    },
  ]);
  const [input, setInput] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
          undefined,
          sessionId ?? undefined,
        );
        setSessionId(res.session_id);
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
  }, [input, isPending, sessionId]);

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

  return (
    <aside
      className={`fixed right-0 top-0 z-40 flex h-full w-full flex-col border-l border-slate-200 bg-white shadow-2xl transition-all duration-300 sm:w-[420px] dark:border-[#253245] dark:bg-[#141f33] ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200 px-4 py-3 dark:border-[#253245]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#275D79] text-xs font-bold text-white dark:bg-[#3a7fa0]">
            IA
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Asistente Agora
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Conectado
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-[#253245] dark:hover:text-slate-300"
          aria-label="Cerrar chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m22 2-7 20-4-9-9-4Z" />
            <path d="M22 2 11 13" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
