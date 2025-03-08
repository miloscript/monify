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
  accountId: string
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
}

export interface BankAccount {
  id: string
  number: string
  type: 'personal' | 'business'
  bank: 'Intesa' | 'Raiffeisen' | 'Societe Generale' | 'Erste'
  transactions: BankTransaction[]
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
        }
        project: {
          additionalFields: string[]
        }
      }
    }
  }
}
