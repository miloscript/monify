import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import { DataState } from '@shared/data.types'

const initialState: DataState = {
  company: {
    name: '',
    taxId: '',
    address: {
      street: '',
      number: '',
      city: '',
      zip: '',
      country: ''
    },
    contact: {
      name: '',
      email: '',
      phone: ''
    }
  },
  clients: []
}

type DataAction = {
  setCompanyInfo(company: Pick<DataState, 'company'>): void
}

// Custom storage object
const storage: StateStorage = {
  getItem: async (): Promise<string | null> => {
    const state = await getData()
    return JSON.stringify({ state })
  },
  setItem: async (_: string, value: string): Promise<void> => {
    const data: { state: DataState } = JSON.parse(value)
    saveData(data.state)
  },
  removeItem: async (): Promise<void> => {
    // empty for now, until we need it
  }
}

const useDataStore = create<DataState & DataAction>()(
  persist(
    (set) => ({
      ...initialState,
      clients: [],
      setCompanyInfo: (payload) =>
        set((state) => ({
          company: {
            ...state.company,
            ...payload.company
          }
        }))
    }),
    {
      name: '',
      storage: createJSONStorage(() => storage)
    }
  )
)

export default useDataStore
