'use client'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

export default function Layout ({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  let pathnameArray = useMemo(() => {
    let pathArray = pathname?.split('/')
    pathArray.shift()
    pathArray = pathArray.join('/separator/').split('/')
    return pathArray
  }, [pathname])

  return (
    <section className='w-full h-full'>
      <div className='h-[5%]'>
        <Breadcrumb>
          <BreadcrumbList>
            {pathnameArray.map((path, path_idx) => {
              return (
                <>
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
                        {path}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )}
                </>
              )
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className='h-[95%]'>{children}</div>
    </section>
  )
}
