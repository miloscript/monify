export interface Company {
  name: string
  taxId: string
  address: {
    street: string
    number: string
    city: string
    zip: string
    country: string
  }
  contact?: {
    name: string
    email: string
    phone: string
  }
}

export interface Project {
  id: string
  name: string
  hourlyRate: HourlyRate[]
  additionalFields?: {
    name: string
    value: string
  }[]
}

interface HourlyRate {
  rate: number
  dateActive: Date
}

export interface Client extends Company {
  id: string
  projects?: Project[]
  hourlyRate: HourlyRate[]
}

export interface TransactionLabel {
  id: string
  name: string
}

export interface Transaction {
  id: string
  date: string
  type: 'in' | 'out'
  amount: number
  description: string
  label: TransactionLabel
}

export interface Account {
  id: string
  number: string
  transactions: Transaction[]
}

export interface InvoiceProject extends Project {
  hours: number
}

export interface Invoice {
  id: string
  createdAt: string
  date: string
  number: string
  performancePeriod: string
  from: Company
  to: Client
  items: InvoiceProject[]
}

export interface DataState {
  invoices: Invoice[]
  company: Company
  clients: Client[]
  accounts: Account[]
  app: {
    config: {
      transaction: {
        labels: TransactionLabel[]
      }
      project: {
        additionalFields: string[]
      }
    }
  }
}
