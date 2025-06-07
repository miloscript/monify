import { StateCreator } from 'zustand'

// Config slice interface
export interface ConfigSlice {
  theme: {
    darkMode: boolean
  }
  setDarkMode: (darkMode: boolean) => void
  toggleDarkMode: () => void
}

// Config slice creator
export const createConfigSlice: StateCreator<ConfigSlice, [], [], ConfigSlice> = (set) => ({
  theme: {
    darkMode: false
  },
  setDarkMode: (darkMode) =>
    set((state) => ({
      theme: {
        ...state.theme,
        darkMode
      }
    })),
  toggleDarkMode: () =>
    set((state) => ({
      theme: {
        ...state.theme,
        darkMode: !state.theme.darkMode
      }
    }))
})
