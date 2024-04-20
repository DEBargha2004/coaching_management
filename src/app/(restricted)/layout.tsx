'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { getGroups } from '@/server-actions/groups'
import { useGroupStore } from '@/store/group-store'
import { usePathname } from 'next/navigation'
import React, { useEffect, useMemo } from 'react'

export default function LockedLayout ({
  children
}: {
  children: React.ReactNode
}) {
  const { setGroups } = useGroupStore()
  const pathname = usePathname()
  let pathnameArray = useMemo(() => {
    let pathArray = pathname?.split('/')
    pathArray.shift()
    pathArray = pathArray.join('/separator/').split('/')
    return pathArray
  }, [pathname])

  useEffect(() => {
    getGroups().then(res => {
      if (res.status === 'success' && res?.result) {
        setGroups(prev => {
          prev.groups = res.result!
          prev.loading = false
        })
      }
    })
  }, [])
  return (
    <section className='h-full w-full px-5'>
      <div className='h-[5%]'>
        <Breadcrumb>
          <BreadcrumbList>
            {pathnameArray.map((path, path_idx) => {
              return (
                <React.Fragment key={path_idx}>
                  {path === 'separator' ? (
                    <BreadcrumbSeparator />
                  ) : (
                    <BreadcrumbItem
                      className={
                        path === pathnameArray.at(-1)
                          ? 'text-primary-foreground'
                          : ''
                      }
                    >
                      <BreadcrumbLink
                        href={`/${pathnameArray
                          .slice(0, path_idx + 1)
                          .join('/')
                          .replaceAll('/separator', '')}`}
                      >
                        {path.length > 12 ? `${path.slice(0, 12)}...` : path}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </React.Fragment>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='h-[95%]'>{children}</div>
    </section>
  )
}
