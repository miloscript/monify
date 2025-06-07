import { BankTransaction, DataState } from '@shared/data.types'
import { StateCreator } from 'zustand'

// Bank slice interface
export interface BankSlice {
  bankAccounts: DataState['user']['bankAccounts']
  addBankAccount: (account: DataState['user']['bankAccounts'][0]) => void
  upsertBankAccount: (account: DataState['user']['bankAccounts'][0]) => void
  removeBankAccount: (accountId: string) => void
  addBankTransactions: (transactions: BankTransaction[], accountId: string) => void
  labelTransaction: (transactionId: string, labelId: string, accountId: string) => void
  labelTransactions: (transactionIds: string[], labelId: string, accountId: string) => void
  removeTransactionLabel: (transactionId: string, accountId: string) => void
}

// Bank slice creator
export const createBankSlice: StateCreator<BankSlice, [], [], BankSlice> = (set) => ({
  bankAccounts: [],
  addBankAccount: (account) =>
    set((state) => ({
      bankAccounts: [...state.bankAccounts, account]
    })),
  upsertBankAccount: (account) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.some((a) => a.id === account.id)
        ? state.bankAccounts.map((a) => (a.id === account.id ? account : a))
        : [...state.bankAccounts, account]
    })),
  removeBankAccount: (accountId) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.filter((a) => a.id !== accountId)
    })),
  addBankTransactions: (transactions, accountId) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            transactions: [...account.transactions, ...transactions]
          }
        }
        return account
      })
    })),
  labelTransaction: (transactionId, labelId, accountId) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) => {
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
    })),
  labelTransactions: (transactionIds, labelId, accountId) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) => {
        if (account.id === accountId) {
          return {
            ...account,
            transactions: account.transactions.map((transaction) =>
              transactionIds.includes(transaction.id) ? { ...transaction, labelId } : transaction
            )
          }
        }
        return account
      })
    })),
  removeTransactionLabel: (transactionId, accountId) =>
    set((state) => ({
      bankAccounts: state.bankAccounts.map((account) => {
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
    }))
})
