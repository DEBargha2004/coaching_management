import getFullInfoTeacher from '@/server-actions/get-all-info-teacher'
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
import { SmallCard } from '../../../../components/custom/cards'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { membership_statuses } from '@/constants/membership-status'
import { sexList } from '@/constants/sex'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import ProfilePageSectionWrapper from '../../../../components/custom/profilePageSectionWrapper'
import getTeacherSchedules from '@/server-actions/get-teacher-schedules'
import getBatchesOfTeacher from '@/server-actions/get-batches-of-teacher'
import BatchCard from '@/components/custom/batch-card'
import getJoiningInfoTeacher from '@/server-actions/get-joining-info-teacher'
import { getTeacherQualifications } from '@/server-actions/get-teacher-qualifications'
import getFirebaseImageDownloadURL from '@/server-actions/get-firebase-image-download-url'

const user_dummy_image = {
  man,
  woman,
  other: user
}

export default async function Page ({
  params: { teacher_id }
}: {
  params: { teacher_id: string }
}) {
  let fullTeacherInfo_array = await getFullInfoTeacher(teacher_id)

  if (!fullTeacherInfo_array?.at(-1))
    return (
      <div className='w-full h-full flex justify-center items-center'>
        No Teacher Found with id
        <span className='bg-[#ffffff2a] p-[3px] rounded-lg mx-2'>
          {teacher_id}
        </span>
      </div>
    )
  const schedules = await getTeacherSchedules(teacher_id)
  const batches = await getBatchesOfTeacher(teacher_id)
  const joining_info = await getJoiningInfoTeacher(teacher_id)
  const qualifications = await getTeacherQualifications(teacher_id)

  const fullTeacherInfo = fullTeacherInfo_array.at(-1)!

  const teacherImageUrl = (
    await getFirebaseImageDownloadURL(`teacher/${fullTeacherInfo.teacherId}`)
  ).result

  const teacherImageUrlFormatted =
    teacherImageUrl ||
    (fullTeacherInfo
      ? user_dummy_image[fullTeacherInfo.sex as keyof typeof user_dummy_image]
      : user)

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
    <section className='py-10'>
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
          <Dialog>
            <DialogTrigger asChild>
              <Badge
                variant={
                  fullTeacherInfo.membershipStatus === 'active'
                    ? 'default'
                    : 'outline'
                }
                className='mt-1 cursor-pointer'
              >
                {
                  membership_statuses.find(
                    s => s.value === fullTeacherInfo.membershipStatus
                  )?.name
                }
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <Table className='mt-5'>
                <TableCaption>Joining Dates</TableCaption>
                <TableHeader>
                  <TableRow className='border'>
                    <TableHead className='border'>Joining Date</TableHead>
                    <TableHead className='border'>Leaving Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {joining_info.result?.map(joining => (
                    <TableRow key={joining.stayId} className='border'>
                      <TableCell className='border'>
                        {format(joining.joiningDate, 'dd-MM-yyyy')}
                      </TableCell>
                      <TableCell className='border'>
                        {joining.leavingDate
                          ? format(joining.leavingDate, 'dd-MM-yyyy')
                          : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </DialogContent>
          </Dialog>
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

      <ProfilePageSectionWrapper classname='w-full my-10 px-5 '>
        <div className='w-full'>
          <h1 className='text-2xl mb-6'>Qualifications</h1>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='border'>Course Type</TableHead>
                <TableHead className='border'>Course Name</TableHead>
                <TableHead className='border'>Major</TableHead>
                <TableHead className='border'>Institute</TableHead>
                <TableHead className='border'>Admission Date</TableHead>
                <TableHead className='border'>Passing Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {qualifications.result?.map(qual => (
                <TableRow key={qual.qualification_id} className='border'>
                  <TableCell className='border'>{qual.course_type}</TableCell>
                  <TableCell className='border'>{qual.course_name}</TableCell>
                  <TableCell className='border'>
                    {qual.major ? qual.major : '—'}
                  </TableCell>
                  <TableCell className='border max-w-[300px]'>
                    {qual.college_name}
                  </TableCell>
                  <TableCell className='border'>
                    {format(qual.start_date, 'dd MMM yyyy')}
                  </TableCell>
                  <TableCell className='border'>
                    {format(qual.end_date, 'dd MMM yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ProfilePageSectionWrapper>

      <ProfilePageSectionWrapper classname='w-full my-10 px-5 '>
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
      <ProfilePageSectionWrapper classname='w-full my-10 px-5 '>
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
