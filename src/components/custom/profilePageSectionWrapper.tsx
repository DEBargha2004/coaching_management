import { cn } from '@/lib/utils'

export default function ProfilePageSectionWrapper ({
  children,
  classname
}: {
  children?: React.ReactNode
  classname?: string
}) {
  return (
    <section
      className={cn(
        'flex flex-col justify-center items-center h-fit',
        classname
      )}
    >
      {children}
    </section>
  )
}
