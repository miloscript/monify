import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { InvoicesPage } from './pages/invoices.page'

const router = createBrowserRouter([
  {
    path: '/',
    element: <InvoicesPage />
  },
  {
    path: '/expenses',
    element: <InvoicesPage />
  },
  {
    path: '/tracker',
    element: <InvoicesPage />
  },
  {
    path: '/forecast',
    element: <InvoicesPage />
  },
  {
    path: '/settings',
    element: <InvoicesPage />
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
