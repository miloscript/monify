import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from '@renderer/components/elements/navigation-menu/navigation-menu.component'

import { Link } from 'react-router-dom'

interface Props {
  children: React.ReactNode
}

const headerConfig = [
  {
    name: 'Invoices',
    path: '/'
  },
  {
    name: 'Expenses',
    path: '/expenses'
  },
  {
    name: 'Tracker',
    path: '/tracker'
  },
  {
    name: 'Forecast',
    path: '/forecast'
  },
  {
    name: 'Settings',
    path: '/settings'
  }
]

export const MainLayout = ({ children }: Props): JSX.Element => {
  return (
    <div>
      <header className="flex flex-row justify-between px-6 py-4 border-b">
        <NavigationMenuItem className="hover:bg-accent px-4 py-1 rounded">
          <p>monify.finance</p>
        </NavigationMenuItem>
        <NavigationMenu className="justify-end">
          <NavigationMenuList className="gap-x-1">
            {headerConfig.map((item, index) => (
              <NavigationMenuItem className="hover:bg-accent px-4 py-1 rounded" key={index}>
                <NavigationMenuLink>
                  <Link to={item.path}>{item.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </header>
      <div className="p-6">{children}</div>
    </div>
  )
}
