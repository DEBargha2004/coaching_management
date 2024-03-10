'use client'

import { useGlobalAppStore } from '@/store/global-app-store'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function NavigationHelper () {
  const pathname = usePathname()
  const { setSheet } = useGlobalAppStore()
  useEffect(() => {
    setSheet(false)
  }, [pathname])
  return null
}
