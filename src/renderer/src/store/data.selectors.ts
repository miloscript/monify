import { Client, DataState } from '@shared/data.types'

export const getClientById = (state: DataState, id: string): Client | undefined => {
  return state.clients.find((client) => client.id === id)
}

export const getProjectById = (state: DataState, clientId: string, projectId: string) => {
  const client = getClientById(state, clientId)
  return client?.projects?.find((project) => project.id === projectId)
}
