export default function AuthLayout ({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <section className='h-screen w-full flex justify-center items-center'>
      {children}
    </section>
  )
}
