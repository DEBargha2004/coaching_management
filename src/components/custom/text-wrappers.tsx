import { cn } from '@/lib/utils'

export const HighlightWrapper = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('p-[2px] bg-muted rounded', className)}>
      {children}
    </span>
  )
}

export const UnderlineWrapper = ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <span className={cn('p-[2px] underline decoration-2 rounded', className)}>
      {children}
    </span>
  )
}
