import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@renderer/components/elements/crumbs/crumbs.component'
import { ScrollArea } from '@renderer/components/elements/scroll-area/scroll-area.component'
import { useDimensions } from '@renderer/hooks/use-dimensions.hook'

import { useMemo } from 'react'

import { cn } from '@renderer/lib/utils'
import useDataStore from '@renderer/store/data.store'
import { useLocation } from 'react-router-dom'
import { Sidebar } from '../atoms/sidebar/sidebar.component'
import { Button } from '../elements/button/button.component'

interface Props {
  className?: string
  actions?: {
    type?: 'button' | 'component'
    name: string
    component?: React.ReactNode
    icon?: React.ReactNode
    variant?: 'default' | 'secondary' | 'link' | 'destructive' | 'outline' | 'ghost'
    onClick?: () => void
  }[]
  crumbs?: {
    name: string
    path: string
  }[]
  children: React.ReactNode
}

export const MainLayout = ({ actions, children, crumbs, className }: Props): JSX.Element => {
  const location = useLocation()
  const { height: windowHeight } = useDimensions()

  const { company } = useDataStore((state) => state.user)

  const mainAreaHeight = useMemo(() => windowHeight - 36, [windowHeight])

  return (
    <div className="flex flex-row">
      <Sidebar company={company} />
      <div className="flex flex-col flex-1 ml-[240px] w-full">
        <header className="flex flex-row justify-between items-center flex-1 border-b h-[36px] min-h-[36px] bg-background z-10 pl-4">
          <Breadcrumb>
            <BreadcrumbList>
              {crumbs &&
                crumbs.map((crumb, index) => {
                  const isActive = location.pathname === crumb.path
                  return (
                    <BreadcrumbList
                      className="flex flex-row justify-center items-center"
                      key={index}
                    >
                      <BreadcrumbItem>
                        {isActive ? (
                          <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink href={crumb.path}>{crumb.name}</BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
                      {index < crumbs.length - 1 && <BreadcrumbSeparator key={index} />}
                    </BreadcrumbList>
                  )
                })}
            </BreadcrumbList>
          </Breadcrumb>
          {actions && (
            <div className="px-2 flex flex-row items-center gap-x-2">
              {actions.map((action, index) => {
                if (action.type === 'component') {
                  return action.component
                } else {
                  return (
                    <Button
                      size="sm"
                      key={index}
                      onClick={action.onClick}
                      variant={action.variant || 'default'}
                    >
                      {action.icon}
                      {action.name}
                    </Button>
                  )
                }
              })}
            </div>
          )}
        </header>
        <ScrollArea
          style={{
            height: `${mainAreaHeight}px`
          }}
        >
          <div className={cn(className)}>{children}</div>
        </ScrollArea>
      </div>
    </div>
  )
}
