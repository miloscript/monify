import { DataState, Project, ProjectField } from '@shared/data.types'
import { StateCreator } from 'zustand'

// Clients slice interface
export interface ClientsSlice {
  clients: DataState['user']['clients']
  projectAdditionalFields: ProjectField[]
  upsertClient: (client: DataState['user']['clients'][0]) => void
  removeClient: (clientId: string) => void
  upsertProject: (project: Project) => void
  removeProject: (projectId: string) => void
  upsertProjectAdditionalField: (field: ProjectField) => void
  removeProjectAdditionalField: (fieldId: string) => void
}

// Clients slice creator
export const createClientsSlice: StateCreator<ClientsSlice, [], [], ClientsSlice> = (set) => ({
  clients: [],
  projectAdditionalFields: [],
  upsertClient: (client) =>
    set((state) => {
      console.log({ client, state })

      return {
        clients: state.clients.some((c) => c.id === client.id)
          ? state.clients.map((c) => (c.id === client.id ? client : c))
          : [...state.clients, client]
      }
    }),
  removeClient: (clientId) =>
    set((state) => ({
      clients: state.clients.filter((c) => c.id !== clientId)
    })),
  upsertProject: (project) =>
    set((state) => ({
      clients: state.clients.some((c) => c.id === project.clientId)
        ? state.clients.map((c) => ({
            ...c,
            projects: c.projects.some((p) => p.id === project.id)
              ? c.projects.map((p) => (p.id === project.id ? project : p))
              : [...c.projects, project]
          }))
        : state.clients
    })),
  removeProject: (projectId) =>
    set((state) => ({
      clients: state.clients.map((c) => ({
        ...c,
        projects: c.projects.filter((p) => p.id !== projectId)
      }))
    })),
  upsertProjectAdditionalField: (field) =>
    set((state) => ({
      projectAdditionalFields: state.projectAdditionalFields.some((f) => f.value === field.value)
        ? state.projectAdditionalFields.map((f) => (f.value === field.value ? field : f))
        : [...state.projectAdditionalFields, field]
    })),
  removeProjectAdditionalField: (fieldId) =>
    set((state) => ({
      projectAdditionalFields: state.projectAdditionalFields.filter((f) => f.id !== fieldId)
    }))
})
