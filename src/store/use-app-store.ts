import { create } from "zustand";
import { LearningModule } from "@/lib/types";

type AppState = {
  view: "landing" | "processing" | "dashboard" | "game";
  data: LearningModule | null;
  error: string | null;
  
  startProcessing: () => void;
  setResults: (data: LearningModule) => void;
  setError: (error: string) => void;
  enterGame: () => void;
  exitGame: () => void;
  reset: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  view: "landing",
  data: null,
  error: null,

  startProcessing: () => set({ view: "processing", error: null }),
  setResults: (data) => set({ view: "dashboard", data }),
  setError: (error) => set({ error, view: "landing" }),
  enterGame: () => set({ view: "game" }),
  exitGame: () => set({ view: "dashboard" }),
  reset: () => set({ view: "landing", data: null, error: null }),
}));

