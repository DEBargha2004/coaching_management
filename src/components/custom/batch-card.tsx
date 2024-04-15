'use client'

import { format } from 'date-fns'
import Image from 'next/image'
import { useEffect, useState } from 'react'

import man from '../../../public/man.png'
import woman from '../../../public/woman.png'
import other from '../../../public/user.png'
import { AnimatedTooltip } from '../ui/animated-tooltip'
import getFirebaseImageDownloadURL from '@/server-actions/get-firebase-image-download-url'
import { Batch } from '@/types/batch'

export default function BatchCard ({ batch }: { batch: Batch }) {
  const [batchImageUrl, setBatchImageUrl] = useState<string>('')

  useEffect(() => {
    getFirebaseImageDownloadURL(`batches/${batch.batch_id}`).then(res => {
      if (res.result) {
        setBatchImageUrl(res.result)
      }
    })
  }, [batch])
  return (
    <div className='p-3 rounded-lg border'>
      <div>
        {batchImageUrl ? (
          <Image
            alt='batch image'
            src={batchImageUrl}
            className='w-full aspect-video rounded'
          />
        ) : (
          <div className='w-full aspect-video rounded bg-muted'></div>
        )}
        <h1 className='text-2xl mt-4 mb-2'>{batch.batch_name}</h1>
        <p className='text-slate-400 text-sm my-2'>
          {batch.students_count} student{batch.students_count > 1 ? 's' : ''}
        </p>
        <p className='text-muted-foreground text-sm'>
          Created at{' '}
          <span>
            {batch.created_at
              ? format(new Date(batch.created_at), 'dd MMM yyyy')
              : '—'}
          </span>
        </p>
        <div className='flex mt-4 relative'>
          <AnimatedTooltip
            items={batch.teachers.map(teacher => ({
              first_name: teacher.first_name,
              last_name: teacher.last_name,
              id: teacher.teacher_id,
              fallbackUrl:
                teacher.sex === 'male'
                  ? man
                  : teacher.sex === 'female'
                  ? woman
                  : other,
              imgBaseUrl: 'teachers',
              itemBaseLink: '/t'
            }))}
          />
        </div>
      </div>
    </div>
  )
}
