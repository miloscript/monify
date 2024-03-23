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
import { AddProjectPage } from './pages/data/projects/add-project.data.page'
import { EditProjectPage } from './pages/data/projects/edit-project.data.page'
import { ProjectsPage } from './pages/data/projects/projects.data.page'
import { ExpensesPage } from './pages/expenses/expenses.page'
import { ImportsPage } from './pages/expenses/imports.expenses.page'
import { StatsPage } from './pages/expenses/stats.expenses.page'
import { AddInvoicePage } from './pages/invoices/add-invoice.invoices'
import { AllInvoices } from './pages/invoices/all-invoices.invoices'
import { EditInvoicePage } from './pages/invoices/edit-invoice.invoices'
import { InvoicesPage } from './pages/invoices/invoices.page'
import { ViewInvoicePage } from './pages/invoices/view-invoice.invoices'
import { SettingsPage } from './pages/settings.page'

const router = createHashRouter([
  {
    path: '/',
    element: <InvoicesPage />
  },
  {
    path: '/invoices',
    element: <AllInvoices />
  },
  {
    path: '/invoices/add',
    element: <AddInvoicePage />
  },
  {
    path: '/invoices/:id/view',
    element: <ViewInvoicePage />
  },
  {
    path: '/invoices/:id/edit',
    element: <EditInvoicePage />
  },
  {
    path: '/expenses',
    element: <ExpensesPage />
  },
  {
    path: '/expenses/imports',
    element: <ImportsPage />
  },
  {
    path: '/expenses/stats',
    element: <StatsPage />
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
    path: '/data/projects/:clientId/add',
    element: <AddProjectPage />
  },
  {
    path: '/data/projects/:clientId/:id/edit',
    element: <EditProjectPage />
  },
  {
    path: '/data/settings',
    element: <SettingsPage />
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
