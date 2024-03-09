import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@renderer/components/elements/navigation-menu/navigation-menu.component'
import { cn } from '@renderer/lib/utils'

import { Link, useLocation } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

const headerConfig = [
  {
    name: 'Invoices',
    path: '/'
  },

  {
    name: 'Data',
    path: '/data'
  }
]

export const MainLayout = ({ children }: Props): JSX.Element => {
  const location = useLocation()
  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }
  return (
    <div>
      <header className="flex flex-row justify-between px-6 py-4 border-b">
        <NavigationMenuItem className="hover:bg-accent px-4 py-1 rounded">
          <p>monify.finance</p>
        </NavigationMenuItem>
        <NavigationMenu className="justify-end">
          <NavigationMenuList className="gap-x-1">
            {headerConfig.map((item, index) => (
              <NavigationMenuItem key={index}>
                <NavigationMenuLink
                  className={cn(
                    'hover:bg-accent px-4 py-1 rounded',
                    isActive(item.path) && 'bg-accent'
                  )}
                  asChild
                >
                  <Link to={item.path}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <div className="px-8 py-2">{children}</div>
    </div>
  )
}
