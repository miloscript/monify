import { Avatar, AvatarFallback } from '@renderer/components/elements/avatar/avatar.component'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from '@renderer/components/elements/collapsible/collapsible.component'
import { cn } from '@renderer/lib/utils'
import useUiStore from '@renderer/store/ui.store'
import { Company } from '@shared/data.types'
import {
  Building2Icon,
  ChevronsUpDownIcon,
  DatabaseIcon,
  DollarSignIcon,
  FileIcon
} from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  company: Company
}

const menuItems = [
  {
    label: 'Profile',
    icon: <Building2Icon className="w-4 h-5 mr-2" />,
    to: '/profile',
    section: 'company'
  },
  {
    label: 'Invoices',
    icon: <FileIcon className="w-4 h-5 mr-2" />,
    to: '/'
  },
  {
    label: 'Finances',
    icon: <DollarSignIcon className="w-4 h-5 mr-2" />,
    to: '/finances'
  },
  {
    label: 'Data',
    icon: <DatabaseIcon className="w-4 h-5 mr-2" />,
    to: '/data'
  }
]

export const Sidebar = ({ company }: SidebarProps) => {
  const location = useLocation()
  const { sideMenu, toggleAccountDropdown } = useUiStore((state) => state)

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  const openCompanySubMenu = () => {
    toggleAccountDropdown()
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r bg-background">
      <div className="flex flex-col h-full">
        <nav className="flex flex-col gap-y-0.5">
          {/* Company Section (Collapsible) */}
          <Collapsible className="flex flex-col gap-y-0.5" open={sideMenu.accountDropdownOpened}>
            <CollapsibleTrigger asChild onClick={openCompanySubMenu}>
              <div
                className={cn(
                  'h-[36px] px-3 py-1 flex flex-row justify-between items-center gap-x-2 border-b cursor-pointer',
                  'hover:bg-accent hover:text-accent-foreground'
                )}
              >
                <div className="flex flex-row justify-start items-center gap-x-2">
                  <Avatar>
                    <AvatarFallback className="text-[10px] text-primary-foreground">
                      {company.name ? company.name[0] : 'C'}
                    </AvatarFallback>
                  </Avatar>
                  {company.name && <p className="text-sm font-medium">{company.name}</p>}
                </div>
                <ChevronsUpDownIcon className="size-3" />
              </div>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {menuItems
                .filter((item) => item.section === 'company')
                .map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'text-sm font-medium flex flex-row justify-start items-center px-2.5 h-[26px] border-b',
                      'hover:bg-accent hover:text-accent-foreground',
                      isActive(item.to) && 'bg-accent text-accent-foreground font-semibold'
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
            </CollapsibleContent>
          </Collapsible>
          {/* Main Menu Items */}
          {menuItems
            .filter((item) => !item.section)
            .map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  'text-sm font-medium flex flex-row justify-start items-center px-2.5 h-[26px]',
                  'hover:bg-accent hover:text-accent-foreground',
                  isActive(item.to) && 'bg-accent text-accent-foreground font-semibold'
                )}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
        </nav>
      </div>
    </aside>
  )
}
