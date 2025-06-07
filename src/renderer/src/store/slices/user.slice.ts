import { DataState } from '@shared/data.types'
import { StateCreator } from 'zustand'

// User slice interface
export interface UserSlice {
  user: {
    id: string
    name: string
    email: string
    company: DataState['user']['company']
  }
  setProfileInfo: (user: Partial<DataState['user']>, company?: DataState['user']['company']) => void
}

// User slice creator
export const createUserSlice: StateCreator<UserSlice, [], [], UserSlice> = (set) => ({
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
    }
  },
  setProfileInfo: (user, company) =>
    set((state) => ({
      user: {
        ...state.user,
        ...user,
        company: company
          ? {
              ...state.user.company,
              ...company
            }
          : state.user.company
      }
    }))
})
