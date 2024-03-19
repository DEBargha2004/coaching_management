'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'

export default function Page ({ params }: { params: { teacher_id: string } }) {
  const { user } = useUser()

  useEffect(() => {
    if (user?.id) {
      const teacherId = params.teacher_id
    }
  }, [user])
  return <section></section>
}
