"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  generateClassPlanStream,
  saveClassPlan,
  getClassPlanHistory,
  getClassPlan,
  deleteClassPlan,
  deleteConversation,
  type GenerateClassResponse,
  type ClassPlanListItem,
  type PlanData,
} from "@/app/src/lib/api/ai";

const SESSION_KEY = "agora-gc-session-id";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  plan?: GenerateClassResponse;
};

export type ConversationItem = {
  id: string;
  session_id: string;
  first_message: string;
  last_message: string;
  last_active_at: string;
};

type RawMessage = {
  role: "user" | "assistant";
  content: string;
  blocks?: { type: string; content: unknown }[] | null;
};

function parseHistoryMessage(m: RawMessage): ChatMessage {
  const id = crypto.randomUUID();
  if (m.role === "user") {
    return { id, role: "user", content: m.content };
  }

  const planBlock = m.blocks?.find((b) => b.type === "class_plan");
  if (planBlock) {
    const planData = planBlock.content as GenerateClassResponse;
    return {
      id,
      role: "assistant",
      content: planData.type === "chat" ? (planData.message ?? planData.title) : planData.title,
      plan: planData,
    };
  }

  try {
    const parsed = JSON.parse(m.content) as GenerateClassResponse;
    if (parsed.type === "chat" || parsed.type === "plan") {
      return {
        id,
        role: "assistant",
        content: parsed.type === "chat" ? (parsed.message ?? parsed.title) : parsed.title,
        plan: parsed,
      };
    }
  } catch {}

  return { id, role: "assistant", content: m.content };
}

export function useGenerateClass() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ClassPlanListItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const loaded = useRef(false);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;

    loadConversations();

    const saved = localStorage.getItem(SESSION_KEY);
    if (!saved) return;

    setSessionId(saved);
    loadConversation(saved);
  }, []);

  async function loadConversation(sid: string) {
    try {
      const res = await fetch(`/api/ai/chat/history?session_id=${sid}`);
      if (!res.ok) return;
      const data = await res.json();
      if (!data.messages?.length) return;
      setMessages(data.messages.map(parseHistoryMessage));
    } catch {}
  }

  async function loadConversations() {
    try {
      const res = await fetch("/api/ai/chat/conversations?type=class_generator");
      if (!res.ok) return;
      const data = await res.json();
      setConversations(data.conversations ?? []);
    } catch {}
  }

  const createNewChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    localStorage.removeItem(SESSION_KEY);
    loadConversations();
  }, []);

  const switchConversation = useCallback(async (sid: string) => {
    setSessionId(sid);
    localStorage.setItem(SESSION_KEY, sid);
    setMessages([]);
    await loadConversation(sid);
  }, []);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    const placeholderId = crypto.randomUUID();
    const placeholderMsg: ChatMessage = {
      id: placeholderId,
      role: "assistant",
      content: "",
    };

    setMessages((prev) => [...prev, userMsg, placeholderMsg]);
    setIsGenerating(true);
    setError(null);

    try {
      const stream = generateClassPlanStream(prompt, sessionId ?? undefined);
      let fullContent = "";

      for await (const event of stream) {
        if (event.type === "token") {
          fullContent += event.content;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === placeholderId ? { ...msg, content: fullContent } : msg,
            ),
          );
        } else if (event.type === "result") {
          const data = event.data;
          if (data.session_id) {
            setSessionId(data.session_id);
            localStorage.setItem(SESSION_KEY, data.session_id);
          }

          const isChat = data.type === "chat";
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === placeholderId
                ? {
                    ...msg,
                    content: isChat ? (data.message ?? data.title) : data.title,
                    plan: data,
                  }
                : msg,
            ),
          );

          loadConversations();
        } else if (event.type === "error") {
          throw new Error(event.detail);
        }
      }
    } catch (err) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === placeholderId
            ? { ...msg, role: "error", content: err instanceof Error ? err.message : "Error al generar el plan de clase" }
            : msg,
        ),
      );
      setError("No se pudo generar el plan. Intentá de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating, sessionId]);

  const loadHistory = useCallback(async () => {
    try {
      const result = await getClassPlanHistory();
      setHistory(result.plans);
    } catch {}
  }, []);

  const savePlan = useCallback(async (title: string, prompt: string, planData: PlanData) => {
    try {
      await saveClassPlan(title, prompt, planData);
      loadHistory();
      const { toast } = await import("sonner");
      toast.success("Plan de clase guardado");
    } catch {
      const { toast } = await import("sonner");
      toast.error("Error al guardar el plan");
    }
  }, [loadHistory]);

  const toggleHistory = useCallback(() => {
    if (!showHistory) {
      loadHistory();
    }
    setShowHistory((prev) => !prev);
  }, [showHistory, loadHistory]);

  const openPlan = useCallback(async (planId: string) => {
    try {
      const { plan } = await getClassPlan(planId);
      const response: GenerateClassResponse = {
        type: "plan",
        title: plan.title,
        plan_data: plan.plan_data,
      };
      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: plan.title,
        plan: response,
      };
      setMessages([assistantMsg]);
      setShowHistory(false);
    } catch {
      const { toast } = await import("sonner");
      toast.error("Error al cargar el plan");
    }
  }, []);

  const removePlan = useCallback(async (planId: string) => {
    try {
      await deleteClassPlan(planId);
      setHistory((prev) => prev.filter((p) => p.id !== planId));
      const { toast } = await import("sonner");
      toast.success("Plan eliminado");
    } catch {
      const { toast } = await import("sonner");
      toast.error("Error al eliminar el plan");
    }
  }, []);

  const removeConversation = useCallback(async (sid: string) => {
    try {
      await deleteConversation(sid);
      setConversations((prev) => prev.filter((c) => c.session_id !== sid));
      if (sessionId === sid) {
        setSessionId(null);
        localStorage.removeItem(SESSION_KEY);
        setMessages([]);
      }
      const { toast } = await import("sonner");
      toast.success("Conversación eliminada");
    } catch {
      const { toast } = await import("sonner");
      toast.error("Error al eliminar la conversación");
    }
  }, [sessionId]);

  return {
    messages,
    isGenerating,
    history,
    conversations,
    showHistory,
    error,
    sessionId,
    sendMessage,
    savePlan,
    loadHistory,
    toggleHistory,
    createNewChat,
    switchConversation,
    openPlan,
    removePlan,
    removeConversation,
  };
}
