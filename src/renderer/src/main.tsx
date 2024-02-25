import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { SettingsPage } from './pages/data/settings.page'
import { ExpensesPage } from './pages/expenses.page'
import { InvoicesPage } from './pages/invoices.page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <InvoicesPage />
  },
  {
    path: '/expenses',
    element: <ExpensesPage />
  },
  {
    path: '/settings',
    element: <SettingsPage />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
