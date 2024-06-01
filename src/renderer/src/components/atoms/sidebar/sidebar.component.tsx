import { Avatar, AvatarFallback } from '@renderer/components/elements/avatar/avatar.component'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/elements/collapsible/collapsible.component'
import { cn } from '@renderer/lib/utils'
import { Company } from '@shared/data.types'
import {
  ArrowLeftFromLineIcon,
  BanknoteIcon,
  Building2Icon,
  ChevronsUpDownIcon,
  DatabaseIcon,
  FileIcon
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

export interface SidebarProps {
  company: Company
}

export const Sidebar = ({ company }: SidebarProps) => {
  const location = useLocation()
  const [companySubMenuOpen, setCompanySubMenuOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const openCompanySubMenu = () => {
    setCompanySubMenuOpen(!companySubMenuOpen)
  }

  return (
    <aside className="w-[240px] border-r h-[100vh] flex flex-col fixed">
      <div className="border-b flex justify-end items-center px-2 h-[36px]">
        <button className="hover:bg-accent cursor-pointer rounded size-6 flex justify-center items-center">
          <ArrowLeftFromLineIcon className="size-4" />
        </button>
      </div>
      <nav>
        <Collapsible open={companySubMenuOpen}>
          <CollapsibleTrigger asChild onClick={openCompanySubMenu}>
            <div
              onClick={openCompanySubMenu}
              className={cn(
                'h-[38px] px-3 py-1 flex flex-row justify-between items-center gap-x-2 border-b cursor-pointer',
                'hover:bg-black hover:text-white'
              )}
            >
              <div className="flex flex-row justify-start items-center gap-x-2">
                <Avatar>
                  <AvatarFallback className="text-[10px] text-black">
                    {company.name ? company.name[0] : 'C'}
                  </AvatarFallback>
                </Avatar>
                {company.name && <p className="text-sm font-medium">{company.name}</p>}
              </div>
              <ChevronsUpDownIcon className="size-3" />
            </div>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <Link
              to="/data/companies"
              className={cn(
                'text-sm font-medium flex flex-row justify-start items-center px-2.5 h-[26px] border-b',
                'hover:bg-black hover:text-white',
                isActive('/data/companies') && 'bg-black text-white font-semibold'
              )}
            >
              <Building2Icon className="w-4 h-5 mr-2" />
              Profile
            </Link>
          </CollapsibleContent>
        </Collapsible>
        <Link
          to="/"
          className={cn(
            'text-sm font-medium flex flex-row justify-start items-center px-2.5 h-[26px]',
            'hover:bg-black hover:text-white',
            isActive('/') && 'bg-black text-white font-semibold'
          )}
        >
          <FileIcon className="w-4 h-5 mr-2" />
          Invoices
        </Link>
        <Link
          to="/expenses"
          className={cn(
            'text-sm font-medium flex flex-row justify-start items-center px-2.5 h-[26px]',
            'hover:bg-black hover:text-white',
            isActive('/expenses') && 'bg-black text-white font-semibold'
          )}
        >
          <BanknoteIcon className="w-4 h-5 mr-2" />
          Expenses
        </Link>
        <div>
          <Link
            to="/data"
            className={cn(
              'text-sm font-medium flex flex-row justify-start items-center px-2.5 h-[26px]',
              'hover:bg-black hover:text-white',
              isActive('/data') && 'bg-black text-white font-semibold'
            )}
          >
            <DatabaseIcon className="w-4 h-5 mr-2" />
            Data
          </Link>
        </div>
      </nav>
    </aside>
  )
}