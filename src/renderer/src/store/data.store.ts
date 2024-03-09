import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import { DataState, Project } from '@shared/data.types'

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
  editClient(client: DataState['clients'][0]): void
  removeClient(clientId: string): void
  addProject(clientId: string, project: Project): void
  editProject(clientId: string, project: Project): void
  removeProject(clientId: string, projectId: string): void
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
      addProject: (clientId, project) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  projects: client.projects ? [...client.projects, project] : [project]
                }
              : client
          )
        })),
      editProject: (clientId, project) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  projects: client.projects?.map((p) => (p.id === project.id ? project : p))
                }
              : client
          )
        })),
      removeProject: (clientId, projectId) =>
        set((state) => ({
          clients: state.clients.map((client) =>
            client.id === clientId
              ? {
                  ...client,
                  projects: client.projects?.filter((project) => project.id !== projectId)
                }
              : client
          )
        })),
      addClient: (client) =>
        set((state) => ({
          clients: [...state.clients, client]
        })),
      editClient: (client) =>
        set((state) => ({
          clients: state.clients.map((c) => (c.id === client.id ? client : c))
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
