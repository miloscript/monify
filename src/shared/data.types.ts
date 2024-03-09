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
    [key: string]: string
  }
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

export interface DataState {
  company: Company
  clients: Client[]
  app: {
    config: {
      project: {
        additionalFields: string[]
      }
    }
  }
}
