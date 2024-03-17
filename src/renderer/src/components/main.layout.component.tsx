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
import { cn } from '@renderer/lib/utils'
import { ArrowLeftFromLineIcon, BanknoteIcon, DatabaseIcon, FileIcon } from 'lucide-react'
import { useMemo } from 'react'

import { Link, useLocation } from 'react-router-dom'

interface Props {
  crumbs?: {
    name: string
    path: string
  }[]
  children: React.ReactNode
}

export const MainLayout = ({ children, crumbs }: Props): JSX.Element => {
  const location = useLocation()
  const { height: windowHeight } = useDimensions()

  const mainAreaHeight = useMemo(() => windowHeight - 36, [windowHeight])

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === path
    return location.pathname.startsWith(path)
  }

  return (
    <div className="flex flex-row">
      <header className="w-[240px] border-r h-[100vh] flex flex-col fixed">
        <div className="border-b flex justify-end items-center px-2 h-[36px] mb-0.5">
          <button className="hover:bg-accent cursor-pointer rounded size-6 flex justify-center items-center">
            <ArrowLeftFromLineIcon className="size-4" />
          </button>
        </div>
        <nav>
          <Link
            to="/"
            className={cn(
              'text-sm font-medium flex flex-row justify-start items-center px-2.5 my-1 mx-0.5 h-[26px] hover:bg-accent',
              isActive('/') && 'bg-accent font-semibold'
            )}
          >
            <FileIcon className="w-4 h-5 mr-2" />
            Invoices
          </Link>
          <Link
            to="/expenses"
            className={cn(
              'text-sm font-medium flex flex-row justify-start items-center px-2.5 my-1 mx-0.5 h-[26px] hover:bg-accent',
              isActive('/expenses') && 'bg-accent font-semibold'
            )}
          >
            <BanknoteIcon className="w-4 h-5 mr-2" />
            Expenses
          </Link>
          <div>
            <Link
              to="/data"
              className={cn(
                'text-sm font-medium flex flex-row justify-start items-center px-2.5 my-1 mx-0.5 h-[26px] hover:bg-accent',
                isActive('/data') && 'bg-accent font-semibold'
              )}
            >
              <DatabaseIcon className="w-4 h-5 mr-2" />
              Data
            </Link>
          </div>
        </nav>
      </header>
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
          <div className="px-4 py-2">{children}</div>
        </ScrollArea>
      </div>
    </div>
  )
}
