import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'

export default function NavItem ({
  children,
  className
}: {
  children: React.ReactNode
  className?: string | undefined
}) {
  return (
    <div
      className={cn(
        'py-3 px-3 hover:bg-muted rounded-md my-2 transition-all flex justify-start items-center gap-2',
        className
      )}
    >
      {children}
    </div>
  )
}
