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
    name: string
    icon?: React.ReactNode
    onClick: () => void
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

  const { company } = useDataStore((state) => state)

  const mainAreaHeight = useMemo(() => windowHeight - 36, [windowHeight])

  return (
    <div className="flex flex-row">
      <Sidebar company={company} />
      <div className="flex flex-col flex-1 ml-[240px]">
        <header className="flex flex-row justify-start items-center border-b h-[36px] fixed w-full bg-white z-10 pl-4">
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
        </header>
        <ScrollArea
          className="mt-[36px]"
          style={{
            height: `${mainAreaHeight}px`
          }}
        >
          {actions && (
            <div className="border-b px-2 py-2 flex flex-row justify-end">
              {actions.map((action, index) => (
                <Button key={index} onClick={action.onClick} variant="default" size="sm">
                  {action.icon}
                  {action.name}
                </Button>
              ))}
            </div>
          )}
          <div className={cn('px-4 py-1', className)}>{children}</div>
        </ScrollArea>
      </div>
    </div>
  )
}
