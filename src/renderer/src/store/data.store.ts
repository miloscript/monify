import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import {
  Account,
  BankAccount,
  BankTransaction,
  DataState,
  Invoice,
  Project,
  Transaction,
  TransactionLabel
} from '@shared/data.types'

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

  addAdditionalField(field: string): void
  removeAdditionalField(field: string): void

  addLabel(label: { id: string; name: string }): void
  removeLabel(labelId: string): void

  addAccount(account: Account): void
  addTransaction(accountId: string, transaction: Transaction): void
  clearTransactions(accountId: string): void

  editTransactionLabel(accountId: string, transactionId: string, label: TransactionLabel): void

  addInvoice(invoice: Invoice): void
  editInvoice(invoice: Invoice): void
  removeInvoice(invoiceId: string): void

  addBankAccount(account: BankAccount): void
  addBankTransactions(accountId: string, transaction: BankTransaction[]): void
}

const useDataStore = create<DataState & DataAction>()(
  persist(
    (set) => ({
      ...initialState,
      clients: [],
      addBankAccount: (account) =>
        set((state) => ({
          bankAccounts: [...state.bankAccounts, account]
        })),
      addBankTransactions: (accountId, transactions) => {
        set((state) => ({
          bankAccounts: state.bankAccounts.map((account) =>
            account.id === accountId
              ? {
                  ...account,
                  transactions: [...account.transactions, ...transactions]
                }
              : account
          )
        }))
      },

      addInvoice: (invoice) =>
        set((state) => ({
          invoices: [...state.invoices, invoice]
        })),
      editInvoice: (invoice) =>
        set((state) => ({
          invoices: state.invoices.map((i) => (i.id === invoice.id ? invoice : i))
        })),
      removeInvoice: (invoiceId) =>
        set((state) => ({
          invoices: state.invoices.filter((invoice) => invoice.id !== invoiceId)
        })),

      editTransactionLabel: (accountId, transactionId, label) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId
              ? {
                  ...account,
                  transactions: account.transactions.map((transaction) =>
                    transaction.id === transactionId
                      ? {
                          ...transaction,
                          label
                        }
                      : transaction
                  )
                }
              : account
          )
        })),

      addAccount: (account) =>
        set((state) => ({
          accounts: [...state.accounts, account]
        })),

      addTransaction: (accountId, transaction) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId
              ? {
                  ...account,
                  transactions: [...account.transactions, transaction]
                }
              : account
          )
        })),

      clearTransactions: (accountId) =>
        set((state) => ({
          accounts: state.accounts.map((account) =>
            account.id === accountId ? { ...account, transactions: [] } : account
          )
        })),

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
        })),
      addAdditionalField: (field) =>
        set((state) => ({
          app: {
            config: {
              ...state.app.config,
              project: {
                additionalFields: [...state.app.config.project.additionalFields, field]
              }
            }
          }
        })),
      removeAdditionalField: (field) =>
        set((state) => ({
          app: {
            config: {
              ...state.app.config,
              project: {
                additionalFields: state.app.config.project.additionalFields.filter(
                  (f) => f !== field
                )
              }
            }
          }
        })),
      addLabel: (label) =>
        set((state) => ({
          app: {
            config: {
              ...state.app.config,
              transaction: {
                labels: [...state.app.config.transaction.labels, label]
              }
            }
          }
        })),
      removeLabel: (labelId) =>
        set((state) => ({
          app: {
            config: {
              ...state.app.config,
              transaction: {
                labels: state.app.config.transaction.labels.filter((l) => l.id !== labelId)
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
