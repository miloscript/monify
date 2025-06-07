import { PersonalBankTransaction, TransactionLabel } from '@shared/data.types'
import { StateCreator } from 'zustand'

// Personal Account type
export interface PersonalAccount {
  id: string
  number: string
  transactions: PersonalBankTransaction[]
}

// Personal slice interface
export interface PersonalSlice {
  personalAccounts: PersonalAccount[]
  personalLabels: TransactionLabel[]
  personalTransactions: PersonalBankTransaction[]
  addPersonalAccount: (account: PersonalAccount) => void
  upsertPersonalAccount: (account: PersonalAccount) => void
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

// Personal slice creator
export const createPersonalSlice: StateCreator<PersonalSlice, [], [], PersonalSlice> = (set) => ({
  personalAccounts: [],
  personalLabels: [],
  personalTransactions: [],
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
    }))
})
