import { cn } from '@/lib/utils'

export const SmallCard = ({
  lowerNode,
  upperNode,
  className
}: {
  upperNode: any
  lowerNode: any
  className?: string
}) => (
  <div
    className={cn(
      'flex flex-col justify-center items-center gap-2 px-7 py-3 cursor-pointer hover:bg-muted transition-all rounded-md',
      className
    )}
  >
    <p>{upperNode}</p>
    <p className='text-slate-400'>{lowerNode}</p>
  </div>
)
