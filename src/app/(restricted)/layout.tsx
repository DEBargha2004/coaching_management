export default function LockedLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return <section className='h-full w-full px-5'>{children}</section>
}
