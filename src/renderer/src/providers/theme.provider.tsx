import { createContext, useContext, useEffect } from 'react'
import useDataStore from '@renderer/store/data.store'

interface ThemeContextType {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useDataStore((state) => state)
  const isDarkMode = user.app.config.theme?.darkMode || false

  useEffect(() => {
    const root = window.document.documentElement
    if (isDarkMode) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [isDarkMode])

  const toggleDarkMode = () => {
    useDataStore.setState((state) => ({
      user: {
        ...state.user,
        app: {
          ...state.user.app,
          config: {
            ...state.user.app.config,
            theme: {
              darkMode: !state.user.app.config.theme?.darkMode || false
            }
          }
        }
      }
    }))
  }

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
