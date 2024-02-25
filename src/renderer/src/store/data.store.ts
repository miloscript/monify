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

type DataAction = {
  setCompanyInfo(company: Pick<DataState, 'company'>): void
  addClient(client: DataState['clients'][0]): void
  removeClient(clientId: string): void
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
        })),
      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, client]
        })),
      removeClient: (clientId) =>
        set((state) => ({
          clients: state.clients.filter((client) => client.id !== clientId)
        }))
    }),
    {
      name: '',
      storage: createJSONStorage(() => storage)
    }
  )
)

export default useDataStore
