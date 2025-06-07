import { TransactionLabel } from '@shared/data.types'
import { StateCreator } from 'zustand'

// Labels slice interface
export interface LabelsSlice {
  labels: TransactionLabel[]
  storagePath: string
  addLabel: (label: TransactionLabel) => void
  updateLabel: (id: string, label: TransactionLabel) => void
  deleteLabel: (id: string) => void
  setStoragePath: (path: string) => void
}

// Labels slice creator
export const createLabelsSlice: StateCreator<LabelsSlice, [], [], LabelsSlice> = (set) => ({
  labels: [],
  storagePath: '',
  addLabel: (label) =>
    set((state) => ({
      labels: [...state.labels, label]
    })),
  updateLabel: (id, label) =>
    set((state) => ({
      labels: state.labels.map((l) => (l.id === id ? label : l))
    })),
  deleteLabel: (id) =>
    set((state) => ({
      labels: state.labels.filter((l) => l.id !== id)
    })),
  setStoragePath: (path) =>
    set(() => ({
      storagePath: path
    }))
})
