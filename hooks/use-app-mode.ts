"use client"

import { create } from "zustand"

type AppMode = "execute" | "setup"

interface AppModeStore {
  mode: AppMode
  setMode: (mode: AppMode) => void
  toggleMode: () => void
}

const useAppModeStore = create<AppModeStore>((set) => ({
  mode: "execute",
  setMode: (mode) => set({ mode }),
  toggleMode: () => set((state) => ({ mode: state.mode === "execute" ? "setup" : "execute" })),
}))

export function useAppMode() {
  return useAppModeStore()
}
