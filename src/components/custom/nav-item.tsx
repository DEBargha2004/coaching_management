import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'

export default function NavItem ({
  children,
  shade
}: {
  children: React.ReactNode
  shade?: string | undefined
}) {
  return (
    <div
      className={cn(
        'py-3 px-3 hover:bg-muted rounded-md my-2 transition-all',
        shade
      )}
    >
      {children}
    </div>
  )
}
