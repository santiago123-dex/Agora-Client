"use client";

import { useState, useCallback } from "react";
import {
  generateClassPlan,
  saveClassPlan,
  getClassPlanHistory,
  type GenerateClassResponse,
  type ClassPlanListItem,
  type PlanData,
} from "@/app/src/lib/api/ai";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant" | "error";
  content: string;
  plan?: GenerateClassResponse;
};

export function useGenerateClass() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<ClassPlanListItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (prompt: string) => {
    if (!prompt.trim() || isGenerating) return;

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: prompt,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsGenerating(true);
    setError(null);

    try {
      const response = await generateClassPlan(prompt);

      const assistantMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.title || "Plan de clase generado",
        plan: response,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "error",
        content: err instanceof Error ? err.message : "Error al generar el plan de clase",
      };
      setMessages((prev) => [...prev, errorMsg]);
      setError("No se pudo generar el plan. Intentá de nuevo.");
    } finally {
      setIsGenerating(false);
    }
  }, [isGenerating]);

  const savePlan = useCallback(async (title: string, prompt: string, planData: PlanData) => {
    try {
      await saveClassPlan(title, prompt, planData);
      const { toast } = await import("sonner");
      toast.success("Plan de clase guardado");
    } catch {
      const { toast } = await import("sonner");
      toast.error("Error al guardar el plan");
    }
  }, []);

  const loadHistory = useCallback(async () => {
    try {
      const result = await getClassPlanHistory();
      setHistory(result.plans);
    } catch {
      // silently fail
    }
  }, []);

  const toggleHistory = useCallback(() => {
    if (!showHistory) {
      loadHistory();
    }
    setShowHistory((prev) => !prev);
  }, [showHistory, loadHistory]);

  return {
    messages,
    isGenerating,
    history,
    showHistory,
    error,
    sendMessage,
    savePlan,
    loadHistory,
    toggleHistory,
  };
}
