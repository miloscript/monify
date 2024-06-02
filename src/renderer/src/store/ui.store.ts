import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UiState {
  sideMenu: {
    accountDropdownOpened: boolean
  }
}

interface UiAction {
  toggleAccountDropdown: () => void
}

const initialState: UiState = {
  sideMenu: {
    accountDropdownOpened: false
  }
}

const useUiStore = create<UiState & UiAction>()(
  persist(
    (set) => ({
      ...initialState,
      toggleAccountDropdown: () =>
        set((state) => ({
          sideMenu: {
            ...state.sideMenu,
            accountDropdownOpened: !state.sideMenu.accountDropdownOpened
          }
        }))
    }),
    {
      name: 'monify:ui'
    }
  )
)

export default useUiStore
