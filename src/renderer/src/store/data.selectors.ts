import { Client, DataState } from '@shared/data.types'

export const getClientById = (state: DataState, id: string): Client | undefined => {
  return state.clients.find((client) => client.id === id)
}
