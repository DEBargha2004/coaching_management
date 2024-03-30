import { storageDB } from '@/lib/firebase'
import getFullInfoTeacher from '@/server-actions/get-all-info-teacher'
import { getDownloadURL, ref } from 'firebase/storage'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import man from '../../../../../public/man.png'
import woman from '../../../../../public/woman.png'
import user from '../../../../../public/user.png'
import { Eye, Pen } from 'lucide-react'
import {
  differenceInCalendarYears,
  differenceInMinutes,
  format,
  parse
} from 'date-fns'
import { Separator } from '@/components/ui/separator'
import { SmallCard } from './_components/cards'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { teacher_membership_statuses } from '@/constants/membership-status'
import { sexList } from '@/constants/sex'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ProfilePageSectionWrapper from './_components/profilePageSectionWrapper'
import { drizzle_orm } from '@/lib/drizzle'
import { batchTimings } from '@/schema/drizzle/schema'
import { auth } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import getTeacherSchedules from '@/server-actions/get-teacher-schedules'
import getBatchesOfTeacher from '@/server-actions/get-batches-of-teacher'
import BatchCard from '@/components/custom/batch-card'

export default async function Page ({
  params
}: {
  params: { teacher_id: string }
}) {
  const { userId } = auth()
  const teacher_id = params.teacher_id

  if (!userId) {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        Please Login to see the Teacher Profile
      </div>
    )
  }

  let fullTeacherInfo_array = await getFullInfoTeacher(teacher_id)

  const schedules = await getTeacherSchedules(teacher_id)
  const batches = await getBatchesOfTeacher(teacher_id)

  if (!fullTeacherInfo_array)
    return (
      <div className='w-full h-full flex justify-center items-center'>
        No Teacher Found with id{' '}
        <span className='bg-[#ffffff2a] p-[3px] rounded-lg mx-2'>
          {teacher_id}
        </span>
      </div>
    )
  const fullTeacherInfo = fullTeacherInfo_array.at(-1)
  if (!fullTeacherInfo)
    return (
      <div className='w-full h-full flex justify-center items-center'>
        No Teacher Found with id{' '}
        <span className='bg-[#ffffff2a] p-[3px] rounded-lg mx-2'>
          {teacher_id}
        </span>
      </div>
    )

  const teacherImageUrl = fullTeacherInfo
    ? fullTeacherInfo.imageId
      ? await getDownloadURL(
          ref(storageDB, `teachers/${fullTeacherInfo.imageId}`)
        )
      : ''
    : ''
  const teacherImageUrlFormatted =
    teacherImageUrl ||
    (fullTeacherInfo ? (fullTeacherInfo.sex === 'male' ? man : woman) : user)

  const formatTime = (time: string) => {
    return format(parse(time, 'HH:mm:ss', new Date()), 'hh:mm a')
  }

  const formatDuration = (timeLeft: string, timeRight: string) => {
    const diff_mins = differenceInMinutes(
      parse(timeLeft, 'HH:mm:ss', new Date()),
      parse(timeRight, 'HH:mm:ss', new Date())
    )

    if (diff_mins >= 60) {
      return `${Math.floor(diff_mins / 60)}h ${
        diff_mins % 60 ? `${diff_mins % 60}m` : ''
      }`
    } else {
      return `${diff_mins}m`
    }
  }
  return (
    <section>
      <ProfilePageSectionWrapper>
        <Dialog>
          <DialogTrigger asChild>
            <div className='rounded-full overflow-hidden cursor-pointer'>
              <Image
                src={teacherImageUrlFormatted}
                alt='teacher'
                className='bg-white'
                height={200}
                width={200}
              />
            </div>
          </DialogTrigger>
          <DialogContent className='w-fit'>
            <ul className='w-[200px] my-5 cursor-pointer'>
              <Dialog>
                <DialogTrigger asChild>
                  <li className='rounded-md p-3 hover:bg-muted flex justify-between items-center'>
                    View <Eye className='h-5 w-5' />
                  </li>
                </DialogTrigger>
                <DialogContent>
                  <Image
                    src={teacherImageUrlFormatted}
                    className=''
                    alt='teacher'
                  />
                </DialogContent>
              </Dialog>
              <li className='rounded-md p-3 hover:bg-muted flex justify-between items-center'>
                Edit <Pen className='h-5 w-5' />
              </li>
            </ul>
          </DialogContent>
        </Dialog>
        <div className='flex flex-col items-center justify-center mt-5'>
          <h1 className='text-2xl font-bold'>
            {fullTeacherInfo.firstName} {fullTeacherInfo.lastName}
            <TooltipProvider delayDuration={20}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    {' '}
                    (
                    {
                      sexList.find(s => s.value === fullTeacherInfo.sex)
                        ?.name?.[0]
                    }
                    )
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {sexList.find(s => s.value === fullTeacherInfo.sex)?.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          <Badge
            variant={
              fullTeacherInfo.membershipStatus === 'active'
                ? 'default'
                : 'outline'
            }
            className='mt-1'
          >
            {
              teacher_membership_statuses.find(
                s => s.value === fullTeacherInfo.membershipStatus
              )?.name
            }
          </Badge>
          <div className='flex flex-col justify-center items-center w-[500px] gap-1 text-sm my-3'>
            <p className='text-slate-400 w-1/2 text-center'>
              +91 {fullTeacherInfo.phoneNumber.substring(0, 5)}{' '}
              {fullTeacherInfo.phoneNumber.substring(5)}
            </p>

            <p className='text-slate-400 w-1/2 text-center'>
              {fullTeacherInfo.email}
            </p>
          </div>
          <p>{fullTeacherInfo.address?.toLocaleUpperCase()}</p>
        </div>
        <div className='flex justify-between items-center gap-2 mt-10 h-[80px] w-[34%]'>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger asChild>
                <SmallCard
                  lowerNode='Age'
                  upperNode={`${differenceInCalendarYears(
                    new Date(),
                    new Date(fullTeacherInfo.dob)
                  )} y`}
                  className='w-[calc(33%-10px)]'
                />
              </TooltipTrigger>
              <TooltipContent>
                {format(fullTeacherInfo.dob, 'dd MMM yyyy')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation='vertical' className=' h-full ' />

          <SmallCard
            lowerNode='Language'
            upperNode={fullTeacherInfo.primaryLanguage}
            className='w-[calc(33%-10px)]'
          />

          <Separator orientation='vertical' className=' h-full ' />

          <SmallCard
            lowerNode={'Salary'}
            upperNode={`₹ ${fullTeacherInfo.salary}`}
            className='w-[calc(33%-10px)]'
          />
        </div>
      </ProfilePageSectionWrapper>

      <ProfilePageSectionWrapper classname='w-full mt-10 px-5 pb-10'>
        <div className='w-full'>
          <h1 className='text-2xl mb-6'>Schedules</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='border'>Day</TableHead>
                <TableHead className='border'>Batch</TableHead>
                <TableHead className='border'>Subject</TableHead>
                <TableHead className='border'>Start</TableHead>
                <TableHead className='border'>End</TableHead>
                <TableHead className='border'>Duration</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <>
                {schedules.result?.batch_timings_days.map(tim_obj => {
                  const { index: day_index, name: day_name } = tim_obj
                  const batch_timings =
                    schedules.result?.batch_timings[day_index]

                  return batch_timings?.map((timing_info, timing_info_idx) => {
                    return (
                      <TableRow className='border'>
                        {timing_info_idx === 0 ? (
                          <TableHead
                            rowSpan={batch_timings.length}
                            className='w-1/6 border'
                          >
                            {day_name}
                          </TableHead>
                        ) : null}
                        <TableCell className='w-1/6 border'>
                          {timing_info.batch_info.batch_name}
                        </TableCell>
                        <TableCell className='w-1/6 border'>
                          {timing_info.subject_info.subject_name}
                        </TableCell>
                        <TableCell className='w-1/6 border'>
                          {timing_info.start_time
                            ? formatTime(timing_info.start_time.split('.')[0])
                            : '—'}
                        </TableCell>
                        <TableCell className='w-1/6 border'>
                          {timing_info.end_time
                            ? formatTime(timing_info.end_time.split('.')[0])
                            : '—'}
                        </TableCell>
                        <TableCell className='w-1/6 border'>
                          {timing_info.start_time && timing_info.end_time
                            ? formatDuration(
                                timing_info.end_time.split('.')[0],
                                timing_info.start_time.split('.')[0]
                              )
                            : '—'}
                        </TableCell>
                      </TableRow>
                    )
                  })
                })}
              </>
            </TableBody>
          </Table>
        </div>
      </ProfilePageSectionWrapper>
      <ProfilePageSectionWrapper classname='w-full mt-10 px-5 pb-10'>
        <div className='w-full'>
          <h1 className='text-2xl mb-6'>Batches</h1>
          <div className='grid grid-cols-3 gap-3'>
            {batches.result?.map(batch => (
              <BatchCard key={batch.batch_id} batch={batch} />
            ))}
          </div>
        </div>
      </ProfilePageSectionWrapper>
    </section>
  )
}
