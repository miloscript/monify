import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import { BankTransaction, DataState, Project, ProjectField } from '@shared/data.types'

const initialState: DataState = {
  user: {
    id: '',
    name: '',
    email: '',
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
    accounts: [
      {
        id: '',
        number: '',
        transactions: []
      }
    ],
    bankAccounts: [],
    clients: [],
    invoices: [],
    app: {
      config: {
        transaction: {
          labels: []
        },
        project: {
          additionalFields: []
        }
      }
    }
  }
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
  setProfileInfo: (user: DataState['user'], company: DataState['user']['company']) => void
  upsertClient: (client: DataState['user']['clients'][0]) => void
  removeClient: (clientId: string) => void
  upsertProjectAdditionalField: (field: ProjectField) => void
  removeProjectAdditionalField: (fieldId: string) => void
  upsertProject: (project: Project) => void
  removeProject: (projectId: string) => void
  upsertInvoice: (invoice: DataState['user']['invoices'][0]) => void
  removeInvoice: (invoiceId: string) => void
  addBankAccount: (account: DataState['user']['bankAccounts'][0]) => void
  upsertBankAccount: (account: DataState['user']['bankAccounts'][0]) => void
  removeBankAccount: (accountId: string) => void
  addBankTransactions: (transactions: BankTransaction[], accountId: string) => void
}

const useDataStore = create<DataState & DataAction>()(
  persist(
    (set) => ({
      ...initialState,
      addBankTransactions: (transactions, accountId) =>
        set((state) => {
          return {
            user: {
              ...state.user,
              bankAccounts: state.user.bankAccounts.map((account) => {
                if (account.id === accountId) {
                  return {
                    ...account,
                    transactions: [...account.transactions, ...transactions]
                  }
                }
                return account
              })
            }
          }
        }),
      addBankAccount: (account) =>
        set((state) => {
          return {
            user: {
              ...state.user,
              bankAccounts: [...state.user.bankAccounts, account]
            }
          }
        }),
      upsertBankAccount: (account) =>
        set((state) => {
          return {
            user: {
              ...state.user,
              bankAccounts: state.user.bankAccounts.some((a) => a.id === account.id)
                ? state.user.bankAccounts.map((a) => (a.id === account.id ? account : a))
                : [...state.user.bankAccounts, account]
            }
          }
        }),
      removeBankAccount: (accountId) =>
        set((state) => ({
          user: {
            ...state.user,
            bankAccounts: state.user.bankAccounts.filter((a) => a.id !== accountId)
          }
        })),
      upsertInvoice: (invoice) =>
        set((state) => {
          return {
            user: {
              ...state.user,
              invoices: state.user.invoices.some((i) => i.id === invoice.id)
                ? state.user.invoices.map((i) => (i.id === invoice.id ? invoice : i))
                : [...state.user.invoices, invoice]
            }
          }
        }),
      removeInvoice: (invoiceId) =>
        set((state) => ({
          user: {
            ...state.user,
            invoices: state.user.invoices.filter((i) => i.id !== invoiceId)
          }
        })),
      setProfileInfo: (user, company) =>
        set((state) => {
          return {
            user: {
              ...state.user,
              ...user,
              company: {
                ...state.user.company,
                ...company
              }
            }
          }
        }),
      upsertClient: (client) =>
        set((state) => {
          return {
            user: {
              ...state.user,
              clients: state.user.clients.some((c) => c.id === client.id)
                ? state.user.clients.map((c) => (c.id === client.id ? client : c))
                : [...state.user.clients, client]
            }
          }
        }),
      removeClient: (clientId) =>
        set((state) => ({
          user: {
            ...state.user,
            clients: state.user.clients.filter((c) => c.id !== clientId)
          }
        })),
      upsertProjectAdditionalField: (field) =>
        set((state) => ({
          user: {
            ...state.user,
            app: {
              ...state.user.app,
              config: {
                ...state.user.app.config,
                project: {
                  ...state.user.app.config.project,
                  additionalFields: state.user.app.config.project.additionalFields.some(
                    (f) => f.value === field.value
                  )
                    ? state.user.app.config.project.additionalFields.map((f) =>
                        f.value === field.value ? field : f
                      )
                    : [...state.user.app.config.project.additionalFields, field]
                }
              }
            }
          }
        })),
      removeProjectAdditionalField: (fieldId) =>
        set((state) => ({
          user: {
            ...state.user,
            app: {
              ...state.user.app,
              config: {
                ...state.user.app.config,
                project: {
                  ...state.user.app.config.project,
                  additionalFields: state.user.app.config.project.additionalFields.filter(
                    (f) => f.id !== fieldId
                  )
                }
              }
            }
          }
        })),
      upsertProject: (project) =>
        set((state) => ({
          user: {
            ...state.user,
            clients: state.user.clients.some((c) => c.id === project.clientId)
              ? state.user.clients.map((c) => ({
                  ...c,
                  projects: c.projects.some((p) => p.id === project.id)
                    ? c.projects.map((p) => (p.id === project.id ? project : p))
                    : [...c.projects, project]
                }))
              : state.user.clients
          }
        })),
      removeProject: (projectId) =>
        set((state) => ({
          user: {
            ...state.user,
            clients: state.user.clients.map((c) => ({
              ...c,
              projects: c.projects.filter((p) => p.id !== projectId)
            }))
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
