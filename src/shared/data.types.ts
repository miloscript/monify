import { BankAccountTypeEnum, BankBankEnum } from './data.enums'

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
  clientId: string
  name: string
  hourlyRate: HourlyRate[]
  additionalFields?: {
    field: ProjectField
    value: string
  }[]
}

interface HourlyRate {
  rate: number
  dateActive: Date
}

export interface Client extends Company {
  id: string
  projects: Project[]
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

export interface BankTransaction {
  id: string
  valueDate: string // Datum valute | Value Date
  beneficiaryOrderingParty: string // Naziv primaoca pošiljaoca | Beneficiary Ordering Party
  beneficiaryOrderingAddress: string // Mesto primaoca pošiljaoca | Beneficiary Ordering Address
  beneficiaryAccountNumber: string // Broj računa primaoca pošiljaoca | Account Number
  paymentCode: string // Šifra plaćanja | Payment Code
  paymentPurpose: string // Svrha plaćanja | Purpose
  debitModel: string // Model zaduženja | Debit Model
  debitReferenceNumber: string // Poziv na broj zaduženja | Debit Reference Number
  creditModel: string // Model odobrenja | Credit Model
  creditReferenceNumber: string // Poziv na broj odobrenja | Credit Reference Number
  debitAmount: number // Na teret | Debit Amount
  creditAmount: number // U korist | Credit Amount
  yourReferenceNumber: string // Vaš broj naloga | Your Reference Number
  complaintNumber: string // Broj za reklamaciju | Complaint Number
  paymentReferenceNumber: string // Referenca naloga | Payment Reference Number
  labelId?: string // Reference to the transaction label
  attachment?: {
    fileName: string
    filePath: string
    uploadedAt: string
  }
}

export interface BankAccount {
  id: string
  number: string
  type: BankAccountTypeEnum
  bank: BankBankEnum
  transactions: BankTransaction[]
}

export type ProjectField = {
  id: string
  index: string
  value: string
}

export interface DataState {
  user: {
    id: string
    name: string
    email: string
    company: Company
    invoices: Invoice[]
    clients: Client[]
    accounts: Account[]
    bankAccounts: BankAccount[]
    app: {
      config: {
        transaction: {
          labels: TransactionLabel[]
          storagePath: string
        }
        project: {
          additionalFields: ProjectField[]
        }
        theme: {
          darkMode: boolean
        }
      }
    }
  }
}

export interface PersonalBankTransaction {
  id: string
  valueDate: string // Datum valute | Value Date
  amount: number // Amount of the transaction (positive for in, negative for out)
  balance: number // Balance after transaction
  description: string // Opis | Description
  type: 'in' | 'out' // Transaction type
  labelId?: string // Reference to the transaction label
  attachment?: {
    fileName: string
    filePath: string
    uploadedAt: string
  }
}
