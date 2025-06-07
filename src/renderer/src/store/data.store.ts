import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { getData, saveData } from '@renderer/api/main.api'
import { DataState } from '@shared/data.types'

// Import slice interfaces and creators
import { BankSlice, createBankSlice } from './slices/bank.slice'
import { ClientsSlice, createClientsSlice } from './slices/clients.slice'
import { ConfigSlice, createConfigSlice } from './slices/config.slice'
import { InvoicesSlice, createInvoicesSlice } from './slices/invoices.slice'
import { LabelsSlice, createLabelsSlice } from './slices/labels.slice'
import { PersonalSlice, createPersonalSlice } from './slices/personal.slice'
import { UserSlice, createUserSlice } from './slices/user.slice'

// Combined store state with compatibility layer
export type StoreState = UserSlice &
  ClientsSlice &
  InvoicesSlice &
  BankSlice &
  LabelsSlice &
  PersonalSlice &
  ConfigSlice & {
    // Compatibility layer - provides the old user structure
    user: DataState['user']
    // Legacy properties for backward compatibility
    accounts: DataState['user']['accounts']
    company: DataState['user']['company']
    editInvoice: (invoice: DataState['user']['invoices'][0]) => void
    addTransaction: (accountId: string, transaction: unknown) => void
    editTransactionLabel: (accountId: string, transactionId: string, labelId: string) => void
    clearTransactions: (accountId: string) => void
    app: DataState['user']['app']
  }

const useDataStore = create(
  persist<StoreState>(
    (...a) => {
      const userSlice = createUserSlice(...a)
      const clientsSlice = createClientsSlice(...a)
      const invoicesSlice = createInvoicesSlice(...a)
      const bankSlice = createBankSlice(...a)
      const labelsSlice = createLabelsSlice(...a)
      const personalSlice = createPersonalSlice(...a)
      const configSlice = createConfigSlice(...a)

      return {
        ...userSlice,
        ...clientsSlice,
        ...invoicesSlice,
        ...bankSlice,
        ...labelsSlice,
        ...personalSlice,
        ...configSlice,
        // Compatibility layer - merge all slices into the old user structure
        user: {
          ...userSlice.user,
          invoices: invoicesSlice.invoices,
          clients: clientsSlice.clients,
          accounts: [], // Legacy field, keeping empty for now
          bankAccounts: bankSlice.bankAccounts,
          app: {
            config: {
              transaction: {
                labels: labelsSlice.labels,
                storagePath: labelsSlice.storagePath
              },
              project: {
                additionalFields: clientsSlice.projectAdditionalFields
              },
              theme: configSlice.theme
            }
          }
        },
        // Legacy top-level properties
        accounts: [],
        company: userSlice.user.company,
        app: {
          config: {
            transaction: {
              labels: labelsSlice.labels,
              storagePath: labelsSlice.storagePath
            },
            project: {
              additionalFields: clientsSlice.projectAdditionalFields
            },
            theme: configSlice.theme
          }
        },
        // Legacy action aliases
        editInvoice: invoicesSlice.upsertInvoice,
        addTransaction: (accountId: string, transaction: unknown) => {
          // This would need proper implementation based on the transaction type
          console.warn('addTransaction not implemented in slices pattern', {
            accountId,
            transaction
          })
        },
        editTransactionLabel: (accountId: string, transactionId: string, labelId: string) => {
          bankSlice.labelTransaction(transactionId, labelId, accountId)
        },
        clearTransactions: (accountId: string) => {
          // This would need proper implementation
          console.warn('clearTransactions not implemented in slices pattern', { accountId })
        }
      }
    },
    {
      name: '',
      storage: createJSONStorage(() => ({
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
      }))
    }
  )
)

export default useDataStore
