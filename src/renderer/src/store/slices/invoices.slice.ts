import { DataState } from '@shared/data.types'
import { StateCreator } from 'zustand'

// Invoices slice interface
export interface InvoicesSlice {
  invoices: DataState['user']['invoices']
  upsertInvoice: (invoice: DataState['user']['invoices'][0]) => void
  removeInvoice: (invoiceId: string) => void
}

// Invoices slice creator
export const createInvoicesSlice: StateCreator<InvoicesSlice, [], [], InvoicesSlice> = (set) => ({
  invoices: [],
  upsertInvoice: (invoice) =>
    set((state) => ({
      invoices: state.invoices.some((i) => i.id === invoice.id)
        ? state.invoices.map((i) => (i.id === invoice.id ? invoice : i))
        : [...state.invoices, invoice]
    })),
  removeInvoice: (invoiceId) =>
    set((state) => ({
      invoices: state.invoices.filter((i) => i.id !== invoiceId)
    }))
})
