export default async function Layout ({
  children
}: {
  children: React.ReactNode
}) {
  return <section className='w-full h-full'>{children}</section>
}
