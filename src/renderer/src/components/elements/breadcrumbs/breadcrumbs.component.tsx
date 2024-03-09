'use client'

import { cn } from '@renderer/lib/utils'
import { VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

export const Breadcrumb = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn(className)} {...props} />
)
Breadcrumb.displayName = 'Breadcrumb'

export const BreadcrumbList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'inline-flex h-10 items-center justify-center rounded-md p-1 text-muted-foreground gap-x-2',
      className
    )}
    {...props}
  />
))
BreadcrumbList.displayName = 'BreadcrumbList'

export const BreadcrumbSeparator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm font-medium', className)} {...props}>
    /
  </div>
))
BreadcrumbSeparator.displayName = 'BreadcrumbSeparator'

const itemVariants = cva(
  cn(
    'inline-flex items-center justify-center whitespace-nowrap rounded-sm',
    'text-sm font-medium',
    'hover:underline cursor-pointer'
  ),
  {
    variants: {
      variant: {
        default: 'text-black',
        active: 'hover:no-underline cursor-default'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

export interface BreadcrumbItemProps
  extends React.ButtonHTMLAttributes<HTMLDivElement>,
    VariantProps<typeof itemVariants> {}

export const BreadcrumbItem = React.forwardRef<HTMLDivElement, BreadcrumbItemProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(itemVariants({ variant }), className)} {...props} />
  )
)
BreadcrumbItem.displayName = 'BreadcrumbItem'
