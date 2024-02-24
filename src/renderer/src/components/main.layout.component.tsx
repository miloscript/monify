import React from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

export const MainLayout = ({ children }: Props) => {
  return (
    <div>
      <div className="navbar bg-base-100 border">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">monify.finance</a>
        </div>
        <div className="flex-none">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to={`/`}>Invoices</Link>
            </li>
            <li>
              <Link to={`/expenses`}>Expenses</Link>
            </li>
            <li>
              <Link to={`/tracker`}>Tracker</Link>
            </li>
            <li>
              <Link to={`/forecast`}>Forecast</Link>
            </li>
            <li>
              <Link to={`/settings`}>Settings</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="px-10 pt-10">{children}</div>
    </div>
  )
}
