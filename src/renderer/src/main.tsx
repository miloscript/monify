import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createHashRouter, RouterProvider } from 'react-router-dom'

import { MainLayout } from './components/_layouts/main.layout.component'
import { AddClientPage } from './pages/data/clients/add-client/add-client.data.page'
import { ClientsPage } from './pages/data/clients/all-clients.data.page'
import { ProfilePage } from './pages/profile/profile.data.page'
import { DataPage } from './pages/data/data.page'
import { ExportPage } from './pages/data/export/export.data.page'
import { AddProjectPage } from './pages/data/projects/add-project/add-project.data.page'
import { ProjectsPage } from './pages/data/projects/all-projects.data.page'
import { ExpensesPage } from './pages/expenses/expenses.page'
import { ImportsPage } from './pages/expenses/imports.expenses.page'
import { StatsPage } from './pages/expenses/stats.expenses.page'
import { FinancesDashboardPage } from './pages/finances/dashboard.finances.page'
import { FinancesDataPage } from './pages/finances/data.finances.page'
import { FinancesExpensesPage } from './pages/finances/expenses.finances.page'
import { FinancesPage } from './pages/finances/finances.page'
import { AddInvoicePage } from './pages/invoices/add-invoice/add-invoice.invoices.page'
import { AllInvoices } from './pages/invoices/all-invoices.invoices.page'
import { InvoicesPage } from './pages/invoices/invoices.page'
import { ViewInvoicePage } from './pages/invoices/view-invoice.invoices'
import { SettingsPage } from './pages/data/settings/settings.page'
import { AccountsPage } from './pages/data/accounts/accounts.data.page'

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
    element: <AddInvoicePage />
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
  { path: '/finances', element: <FinancesPage /> },
  { path: '/finances/data', element: <FinancesDataPage /> },
  { path: '/finances/dashboard', element: <FinancesDashboardPage /> },
  { path: '/finances/expenses', element: <FinancesExpensesPage /> },
  {
    path: '/data',
    element: <DataPage />
  },
  {
    path: '/profile',
    element: <ProfilePage />
  },
  {
    path: '/data/accounts',
    element: <AccountsPage />
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
    element: <AddClientPage />
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
    element: <AddProjectPage />
  },
  {
    path: '/data/settings',
    element: <SettingsPage />
  },
  {
    path: '/data/export',
    element: <ExportPage />
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
