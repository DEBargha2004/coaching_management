'use client'
import Image, { StaticImageData } from 'next/image'
import React, { useState } from 'react'
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring
} from 'framer-motion'
import CustomAvatar from '../custom/custom-avatar'
import Link from 'next/link'

export const AnimatedTooltip = ({
  items
}: {
  items: {
    id: string
    first_name: string
    last_name: string
    fallbackUrl: StaticImageData | string
    imgBaseUrl: string
    itemBaseLink: string
  }[]
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const springConfig = { stiffness: 100, damping: 5 }
  const x = useMotionValue(0) // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig
  )
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig
  )
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2
    x.set(event.nativeEvent.offsetX - halfWidth) // set the x value, which is then used in transform and rotate
  }

  return (
    <>
      {items.map((item, idx) => (
        <div
          className='-mr-4 relative group'
          key={item.id}
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === idx && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              style={{
                translateX: translateX,
                rotate: rotate,
                whiteSpace: 'nowrap'
              }}
              className='absolute -top-12 -left-1/2 translate-x-1/2 flex text-xs text-muted flex-col items-center justify-center rounded-md bg-muted-foreground z-50 border shadow-xl px-4 py-2'
            >
              {/* <div className='absolute inset-x-10 z-30 w-[20%] -bottom-px bg-gradient-to-r from-transparent via-emerald-500 to-transparent h-px ' />
              <div className='absolute left-10 w-[40%] z-30 -bottom-px bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px ' /> */}
              <div className='font-bold text-white relative z-30 text-base'>
                {item.first_name} {item.last_name}
              </div>
            </motion.div>
          )}
          <Link href={`${item.itemBaseLink}/${item.id}`}>
            <CustomAvatar
              id={item.id}
              height={80}
              width={80}
              src={''}
              fallbackUrl={item.fallbackUrl}
              alt={`${item.first_name[0]} ${item.last_name[0]}`}
              className='object-cover !m-0 !p-0 object-top rounded-full cursor-pointer h-12 w-12 border-2 group-hover:scale-105 group-hover:z-30 border-white  relative transition duration-500'
              baseUrl={item.imgBaseUrl}
            />
          </Link>
        </div>
      ))}
    </>
  )
}
