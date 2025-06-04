import { Avatar, AvatarFallback } from '@renderer/components/elements/avatar/avatar.component'
import { cn } from '@renderer/lib/utils'
import { Company } from '@shared/data.types'
import { Building2Icon, DatabaseIcon, DollarSignIcon, FileIcon } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface SidebarProps {
  company: Company
}

const menuItems = [
  {
    label: 'Profile',
    icon: <Building2Icon className="w-4 h-5 mr-2" />,
    to: '/profile'
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

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] border-r bg-background">
      <div className="flex flex-col h-full">
        <div className="h-[48px] px-3 py-2 flex flex-row items-center gap-x-2 border-b">
          <Avatar>
            <AvatarFallback className="text-[10px] text-primary-foreground">
              {company.name ? company.name[0] : 'C'}
            </AvatarFallback>
          </Avatar>
          {company.name && <p className="text-sm font-medium">{company.name}</p>}
        </div>
        <nav className="flex flex-col gap-y-0.5 mt-2">
          {menuItems.map((item) => (
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
