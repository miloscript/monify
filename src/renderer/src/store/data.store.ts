import { create } from 'zustand'
import { StateStorage, createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import {
  BankTransaction,
  DataState,
  PersonalBankTransaction,
  Project,
  ProjectField,
  TransactionLabel
} from '@shared/data.types'

const initialState: DataState & {
  personalAccounts: {
    id: string
    number: string
    transactions: PersonalBankTransaction[]
  }[]
  personalTransactions: PersonalBankTransaction[]
  personalLabels: TransactionLabel[]
} = {
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
        },
        theme: {
          darkMode: false
        }
      }
    }
  },
  personalAccounts: [],
  personalTransactions: [],
  personalLabels: []
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
  addLabel: (label: TransactionLabel) => void
  updateLabel: (id: string, label: TransactionLabel) => void
  deleteLabel: (id: string) => void
  labelTransaction: (transactionId: string, labelId: string, accountId: string) => void
  labelTransactions: (transactionIds: string[], labelId: string, accountId: string) => void
  removeTransactionLabel: (transactionId: string, accountId: string) => void
  addPersonalAccount: (account: {
    id: string
    number: string
    transactions: PersonalBankTransaction[]
  }) => void
  upsertPersonalAccount: (account: {
    id: string
    number: string
    transactions: PersonalBankTransaction[]
  }) => void
  removePersonalAccount: (accountId: string) => void
  addPersonalTransactions: (transactions: PersonalBankTransaction[], accountId: string) => void
  addPersonalLabel: (label: TransactionLabel) => void
  updatePersonalLabel: (id: string, label: TransactionLabel) => void
  deletePersonalLabel: (id: string) => void
  labelPersonalTransaction: (transactionId: string, labelId: string, accountId: string) => void
  labelPersonalTransactions: (transactionIds: string[], labelId: string, accountId: string) => void
  removePersonalTransactionLabel: (transactionId: string, accountId: string) => void
  clearPersonalTransactions: () => void
}

const useDataStore = create(
  persist<
    DataState &
      DataAction & {
        personalAccounts: {
          id: string
          number: string
          transactions: PersonalBankTransaction[]
        }[]
        personalTransactions: PersonalBankTransaction[]
        personalLabels: TransactionLabel[]
      }
  >(
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
        })),
      addLabel: (label) =>
        set((state) => ({
          user: {
            ...state.user,
            app: {
              ...state.user.app,
              config: {
                ...state.user.app.config,
                transaction: {
                  ...state.user.app.config.transaction,
                  labels: [...state.user.app.config.transaction.labels, label]
                }
              }
            }
          }
        })),
      updateLabel: (id, label) =>
        set((state) => ({
          user: {
            ...state.user,
            app: {
              ...state.user.app,
              config: {
                ...state.user.app.config,
                transaction: {
                  ...state.user.app.config.transaction,
                  labels: state.user.app.config.transaction.labels.map((l) =>
                    l.id === id ? label : l
                  )
                }
              }
            }
          }
        })),
      deleteLabel: (id) =>
        set((state) => ({
          user: {
            ...state.user,
            app: {
              ...state.user.app,
              config: {
                ...state.user.app.config,
                transaction: {
                  ...state.user.app.config.transaction,
                  labels: state.user.app.config.transaction.labels.filter((l) => l.id !== id)
                }
              }
            }
          }
        })),
      labelTransaction: (transactionId, labelId, accountId) =>
        set((state) => ({
          user: {
            ...state.user,
            bankAccounts: state.user.bankAccounts.map((account) => {
              if (account.id === accountId) {
                return {
                  ...account,
                  transactions: account.transactions.map((transaction) =>
                    transaction.id === transactionId ? { ...transaction, labelId } : transaction
                  )
                }
              }
              return account
            })
          }
        })),
      labelTransactions: (transactionIds, labelId, accountId) =>
        set((state) => ({
          user: {
            ...state.user,
            bankAccounts: state.user.bankAccounts.map((account) => {
              if (account.id === accountId) {
                return {
                  ...account,
                  transactions: account.transactions.map((transaction) =>
                    transactionIds.includes(transaction.id)
                      ? { ...transaction, labelId }
                      : transaction
                  )
                }
              }
              return account
            })
          }
        })),
      removeTransactionLabel: (transactionId, accountId) =>
        set((state) => ({
          user: {
            ...state.user,
            bankAccounts: state.user.bankAccounts.map((account) => {
              if (account.id === accountId) {
                return {
                  ...account,
                  transactions: account.transactions.map((transaction) =>
                    transaction.id === transactionId
                      ? { ...transaction, labelId: undefined }
                      : transaction
                  )
                }
              }
              return account
            })
          }
        })),
      addPersonalAccount: (account) =>
        set((state) => ({
          personalAccounts: [...state.personalAccounts, account]
        })),
      upsertPersonalAccount: (account) =>
        set((state) => ({
          personalAccounts: state.personalAccounts.some((a) => a.id === account.id)
            ? state.personalAccounts.map((a) => (a.id === account.id ? account : a))
            : [...state.personalAccounts, account]
        })),
      removePersonalAccount: (accountId) =>
        set((state) => ({
          personalAccounts: state.personalAccounts.filter((a) => a.id !== accountId)
        })),
      addPersonalTransactions: (transactions, accountId) =>
        set((state) => ({
          personalAccounts: state.personalAccounts.map((account) => {
            if (account.id === accountId) {
              return {
                ...account,
                transactions: [...(account.transactions || []), ...transactions]
              }
            }
            return account
          })
        })),
      addPersonalLabel: (label) =>
        set((state) => ({
          personalLabels: [...state.personalLabels, label]
        })),
      updatePersonalLabel: (id, label) =>
        set((state) => ({
          personalLabels: state.personalLabels.map((l) => (l.id === id ? label : l))
        })),
      deletePersonalLabel: (id) =>
        set((state) => ({
          personalLabels: state.personalLabels.filter((l) => l.id !== id)
        })),
      labelPersonalTransaction: (transactionId, labelId, accountId) =>
        set((state) => ({
          personalAccounts: state.personalAccounts.map((account) => {
            if (account.id === accountId) {
              return {
                ...account,
                transactions: account.transactions.map((t) =>
                  t.id === transactionId ? { ...t, labelId } : t
                )
              }
            }
            return account
          })
        })),
      labelPersonalTransactions: (transactionIds, labelId, accountId) =>
        set((state) => ({
          personalAccounts: state.personalAccounts.map((account) => {
            if (account.id === accountId) {
              return {
                ...account,
                transactions: account.transactions.map((t) =>
                  transactionIds.includes(t.id) ? { ...t, labelId } : t
                )
              }
            }
            return account
          })
        })),
      removePersonalTransactionLabel: (transactionId, accountId) =>
        set((state) => ({
          personalAccounts: state.personalAccounts.map((account) => {
            if (account.id === accountId) {
              return {
                ...account,
                transactions: account.transactions.map((t) =>
                  t.id === transactionId ? { ...t, labelId: undefined } : t
                )
              }
            }
            return account
          })
        })),
      clearPersonalTransactions: () =>
        set((state) => ({
          personalAccounts: state.personalAccounts.map((account) => ({
            ...account,
            transactions: []
          }))
        }))
    }),
    {
      name: '',
      storage: createJSONStorage(() => storage)
    }
  )
)

export default useDataStore
