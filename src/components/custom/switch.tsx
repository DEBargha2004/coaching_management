import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'

export default function Switch ({
  checked,
  onChange,
  iconon,
  iconoff
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  iconon?: React.ReactNode
  iconoff?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        'w-12 p-1 rounded-full flex transition-all cursor-pointer',
        checked ? 'bg-primary justify-end' : 'bg-secondary justify-start'
      )}
      onClick={() => onChange(!checked)}
    >
      <motion.div
        layout
        className='h-5 p-[2px] aspect-square rounded-full inset-1 bg-primary-foreground transition-all ease-linear duration-75 flex justify-center items-center'
      >
        {checked ? iconon || '' : iconoff || ''}
      </motion.div>
    </div>
  )
}
