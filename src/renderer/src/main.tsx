import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { MainLayout } from './components/main.layout.component'
import { AddClientPage } from './pages/data/clients/add-client.data.page'
import { ClientsPage } from './pages/data/clients/clients.data.page'
import { EditClientPage } from './pages/data/clients/edit-client.data.page'
import { CompaniesPage } from './pages/data/companies/companies.data.page'
import { DataPage } from './pages/data/data.page'
import { ProjectsPage } from './pages/data/projects/projects.data.page'
import { ExpensesPage } from './pages/expenses.page'
import { InvoicesPage } from './pages/invoices.page'

const router = createHashRouter([
  {
    path: '/',
    element: <InvoicesPage />
  },
  {
    path: '/expenses',
    element: <ExpensesPage />
  },
  {
    path: '/data',
    element: <DataPage />
  },
  {
    path: '/data/companies',
    element: <CompaniesPage />
  },
  {
    path: '/data/clients',
    element: <ClientsPage />
  },
  {
    path: '/data/clients/add',
    element: <AddClientPage />
  },
  {
    path: '/data/clients/:id/edit',
    element: <EditClientPage />
  },
  {
    path: '/data/projects',
    element: <ProjectsPage />
  },
  {
    path: '*',
    element: (
      <MainLayout>
        <p>No match</p>
      </MainLayout>
    )
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
