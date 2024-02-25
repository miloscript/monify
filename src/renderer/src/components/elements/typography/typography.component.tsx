import { cn } from '@renderer/lib/utils'

interface TypographyProps {
  element: 'h3' | 'p'
  className?: string
  children: React.ReactNode
}

export const Typography = ({ element, className, children }: TypographyProps): JSX.Element => {
  const Comp = element

  const getStyles = (element): string => {
    if (element === 'h3') return 'text-2xl font-semibold leading-none tracking-tight'
    return 'text-2xl font-semibold leading-none tracking-tight'
  }

  return <Comp className={cn(getStyles(element), className)}>{children}</Comp>
}
