import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../ui/tooltip'
import { cn } from '@/lib/utils'

export const CustomTooltipTeacherEntry = ({
  delay,
  children,
  className
}: {
  delay?: number
  children: React.ReactNode
  className?: string
}) => {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delay || 200}>
        <TooltipTrigger asChild>
          <Info className='cursor-pointer h-[14px] aspect-square' />
        </TooltipTrigger>
        <TooltipContent className={cn('max-w-[300px]', className)}>
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
