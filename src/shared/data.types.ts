interface Company {
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

interface Project {
  name: string
  hourlyRate?: HourlyRate[]
  additionalFields?: {
    [key: string]: string
  }
}

interface HourlyRate {
  rate: number
  dateActive: Date
}

interface Client extends Company {
  id: string
  projects?: Project[]
  hourlyRate: HourlyRate[]
}

export interface DataState {
  company: Company
  clients: Client[]
}
