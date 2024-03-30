import { storageDB } from '@/lib/firebase'
import { getDownloadURL, ref } from 'firebase/storage'
import { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { cn } from '@/lib/utils'
import Image, { ImageProps } from 'next/image'
import getFirebaseImageDownloadURL from '@/server-actions/get-firebase-image-download-url'

export default function CustomAvatar ({
  id,
  className,
  fallbackUrl,
  baseUrl,
  ...props
}: {
  id: string
  className?: string
  fallbackUrl?: any
  baseUrl: string
} & ImageProps) {
  const [imageUrl, setImageUrl] = useState<string>('')
  useEffect(() => {
    console.log(id)
    getFirebaseImageDownloadURL(`${baseUrl}/${id}`).then(res => {
      if (res.result) {
        setImageUrl(res.result)
      }
    })
  }, [id])

  return (
    <Image
      {...props}
      src={imageUrl || fallbackUrl}
      className={cn('w-10 aspect-square rounded-full', className)}
    />
  )
}
