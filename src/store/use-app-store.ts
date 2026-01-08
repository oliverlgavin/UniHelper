import { create } from "zustand";
import { LearningModule, SavedModule } from "@/lib/types";
import { User } from "@supabase/supabase-js";

type AppState = {
  // Existing state
  view: "landing" | "processing" | "dashboard" | "game" | "library";
  data: LearningModule | null;
  error: string | null;

  // New auth state
  user: User | null;
  savedModules: SavedModule[];
  currentModuleId: string | null;

  // Existing actions
  startProcessing: () => void;
  setResults: (data: LearningModule) => void;
  setError: (error: string) => void;
  enterGame: () => void;
  exitGame: () => void;
  reset: () => void;

  // New auth actions
  setUser: (user: User | null) => void;
  clearUser: () => void;

  // New module actions
  setSavedModules: (modules: SavedModule[]) => void;
  addSavedModule: (module: SavedModule) => void;
  removeSavedModule: (id: string) => void;
  loadModule: (module: SavedModule) => void;
  setCurrentModuleId: (id: string | null) => void;
  enterLibrary: () => void;
};

export const useAppStore = create<AppState>((set) => ({
  // Existing state
  view: "landing",
  data: null,
  error: null,

  // New state
  user: null,
  savedModules: [],
  currentModuleId: null,

  // Existing actions
  startProcessing: () => set({ view: "processing", error: null }),
  setResults: (data) => set({ view: "dashboard", data }),
  setError: (error) => set({ error, view: "landing" }),
  enterGame: () => set({ view: "game" }),
  exitGame: () => set({ view: "dashboard" }),
  reset: () => set({ view: "landing", data: null, error: null, currentModuleId: null }),

  // New auth actions
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, savedModules: [], data: null, view: "landing" }),

  // New module actions
  setSavedModules: (modules) => set({ savedModules: modules }),
  addSavedModule: (module) => set((state) => ({
    savedModules: [module, ...state.savedModules],
    currentModuleId: module.id
  })),
  removeSavedModule: (id) => set((state) => ({
    savedModules: state.savedModules.filter(m => m.id !== id)
  })),
  loadModule: (module) => set({
    data: module,
    currentModuleId: module.id,
    view: "dashboard"
  }),
  setCurrentModuleId: (id) => set({ currentModuleId: id }),
  enterLibrary: () => set({ view: "library" }),
}));

