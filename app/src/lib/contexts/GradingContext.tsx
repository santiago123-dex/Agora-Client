import { GradeResult } from "../api/ai";
import { createContext, useContext } from "react";
import { useState } from "react";

type GradingState = {
  aiSuggestions: Record<string, GradeResult>;
  currentSuggestionId: string | null;
  aiError: string | null;
  approving: boolean;
  setAiSuggestions: React.Dispatch<React.SetStateAction<Record<string, GradeResult>>>;
  setCurrentSuggestionId: (id: string | null) => void;
  setAiError: (error: string | null) => void;
  setApproving: (approving: boolean) => void;
};

// guarda el tipo de datos para decir que es lo que se puede usar
const GradingContext = createContext<GradingState | null>(null);

// El hook
// cuando alguien use el hook va a tener un tipado para saber que datos usar
export function useGrading(): GradingState {
  const ctx = useContext(GradingContext);
  if (!ctx) throw new Error("useGrading must be used within GradingProvider");
  return ctx;
}


// Crea y guarda los datos en los estados
export function GradingProvider({ children }: { children: React.ReactNode }) {
  const [aiSuggestions, setAiSuggestions] = useState<Record<string, GradeResult>>({});
  const [currentSuggestionId, setCurrentSuggestionId] = useState<string | null>(null);
  const [aiError, setAiError] = useState<string | null>(null);
  const [approving, setApproving] = useState(false);

  return (
    <GradingContext.Provider value={{
      aiSuggestions, currentSuggestionId, aiError, approving,
      setAiSuggestions, setCurrentSuggestionId, setAiError, setApproving,
    }}>
      {children}
    </GradingContext.Provider>
  );
}