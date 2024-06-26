'use client'

import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { AlignJustify, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import dynamic from 'next/dynamic'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { useGlobalAppStore } from '@/store/global-app-store'
import { navlist } from '@/constants/navlist'
import Link from 'next/link'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '../ui/accordion'
import NavItem from './nav-item'
import { usePathname } from 'next/navigation'
import React from 'react'

const Switch = dynamic(() => import('./switch'), { ssr: false })

export default function Navbar ({ className }: { className?: string }) {
  const { setTheme, theme } = useTheme()
  const { sheet, setSheet } = useGlobalAppStore()
  const pathName = usePathname()

  return (
    <div className={cn(' flex justify-between items-center', className)}>
      <Sheet open={sheet} onOpenChange={setSheet}>
        <SheetTrigger asChild>
          <Button variant='ghost' className='px-2'>
            <AlignJustify />
          </Button>
        </SheetTrigger>
        <SheetContent side={'left'}>
          <section className='my-10'>
            {navlist.map((item, index) => (
              <React.Fragment key={item.name}>
                {item.type === 'link' ? (
                  <Link href={item.href}>
                    <NavItem
                      className={
                        pathName.split('?')[0] === item.href.split('?')[0]
                          ? 'bg-primary hover:bg-primary'
                          : ''
                      }
                    >
                      {item.icon ? item.icon('h-5 w-5') : null}
                      {item.name}
                    </NavItem>
                  </Link>
                ) : (
                  <NavItem>
                    <Accordion
                      key={item.name}
                      type='single'
                      collapsible
                      className='w-full rounded-md'
                      // defaultValue={pathName}
                      defaultValue={pathName.split('/')[1]}
                    >
                      <AccordionItem
                        value={item.href.split('/')[1]}
                        className='border-none'
                      >
                        <AccordionTrigger className='hover:no-underline p-0 '>
                          <div className='flex justify-start items-center gap-2'>
                            {item.icon ? item.icon('h-5 w-5') : null}
                            {item.name}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          {item.items?.map((accord_item, accord_item_idx) => (
                            <Link
                              href={accord_item.href}
                              key={accord_item.name}
                            >
                              <NavItem
                                key={accord_item_idx}
                                className={
                                  pathName === accord_item.href
                                    ? 'bg-primary hover:bg-primary'
                                    : `hover:bg-stone-300 dark:hover:bg-stone-700`
                                }
                              >
                                {accord_item.name}
                              </NavItem>
                            </Link>
                          ))}
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </NavItem>
                )}
              </React.Fragment>
            ))}
          </section>
        </SheetContent>
      </Sheet>

      <Switch
        checked={theme === 'dark'}
        onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        iconon={<Moon className='dark:text-black' />}
        iconoff={<Sun />}
      />
    </div>
  )
}
