import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import {
  // Account,
  // BankAccount,
  // BankTransaction,
  DataState,
  ProjectField
  // Invoice,
  // Project,
  // Transaction,
  // TransactionLabel
} from '@shared/data.types'

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
  // addClient(client: DataState['clients'][0]): void
  // editClient(client: DataState['clients'][0]): void
  // removeClient(clientId: string): void
  // addProject(clientId: string, project: Project): void
  // editProject(clientId: string, project: Project): void
  // removeProject(clientId: string, projectId: string): void
  // addAdditionalField(field: string): void
  // removeAdditionalField(field: string): void
  // addLabel(label: { id: string; name: string }): void
  // removeLabel(labelId: string): void
  // addAccount(account: Account): void
  // addTransaction(accountId: string, transaction: Transaction): void
  // clearTransactions(accountId: string): void
  // editTransactionLabel(accountId: string, transactionId: string, label: TransactionLabel): void
  // addInvoice(invoice: Invoice): void
  // editInvoice(invoice: Invoice): void
  // removeInvoice(invoiceId: string): void
  // addBankAccount(account: BankAccount): void
  // addBankTransactions(accountId: string, transaction: BankTransaction[]): void
}

const useDataStore = create<DataState & DataAction>()(
  persist(
    (set) => ({
      ...initialState,
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
        set((state) => ({
          user: {
            ...state.user,
            clients: state.user.clients.some((c) => c.id === client.id)
              ? state.user.clients.map((c) => (c.id === client.id ? client : c))
              : [...state.user.clients, client]
          }
        })),
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
        }))
    }),
    {
      name: '',
      storage: createJSONStorage(() => storage)
    }
  )
)

export default useDataStore
