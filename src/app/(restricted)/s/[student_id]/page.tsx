import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import ProfilePageSectionWrapper from '../../t/[teacher_id]/_components/profilePageSectionWrapper'
import Image from 'next/image'
import { Eye, Pen } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Badge } from '@/components/ui/badge'
import { membership_statuses } from '@/constants/membership-status'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { SmallCard } from '../../t/[teacher_id]/_components/cards'
import { Separator } from '@/components/ui/separator'
import { sexList } from '@/constants/sex'
import getFullInfoStudent from '@/server-actions/get-all-info-student'
import getFirebaseImageDownloadURL from '@/server-actions/get-firebase-image-download-url'
import man from '../../../../../public/man.png'
import woman from '../../../../../public/woman.png'
import user from '../../../../../public/user.png'
import getJoiningInfoStudent from '@/server-actions/get-joining-info-student'
import { differenceInCalendarYears, format } from 'date-fns'
import { parentalRelations } from '@/constants/parental-relations'

export default async function Page ({
  params: { student_id }
}: {
  params: { student_id: string }
}) {
  const fullStudentInfo_array_resp = await getFullInfoStudent(student_id)

  if (fullStudentInfo_array_resp.status === 'error') {
    return (
      <div className='w-full h-full flex justify-center items-center'>
        Something went wrong. Please try again later
      </div>
    )
  }

  if (!fullStudentInfo_array_resp?.result?.at(-1))
    return (
      <div className='w-full h-full flex justify-center items-center'>
        No Student Found with id
        <span className='bg-[#ffffff2a] p-[3px] rounded-lg mx-2'>
          {student_id}
        </span>
      </div>
    )

  const joining_info = await getJoiningInfoStudent(student_id)
  const fullStudentInfo = fullStudentInfo_array_resp?.result?.at(-1)!
  const studenImageUrl = (
    await getFirebaseImageDownloadURL(`student/${fullStudentInfo.studentId}`)
  ).result

  const studenImageUrlFormatted =
    studenImageUrl ||
    (fullStudentInfo ? (fullStudentInfo.sex === 'male' ? man : woman) : user)

  return (
    <section className='py-10'>
      <ProfilePageSectionWrapper>
        <Dialog>
          <DialogTrigger asChild>
            <div className='rounded-full overflow-hidden cursor-pointer'>
              <Image
                src={studenImageUrlFormatted}
                alt='student'
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
                    src={studenImageUrlFormatted}
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
            {fullStudentInfo.firstName} {fullStudentInfo.lastName}
            <TooltipProvider delayDuration={20}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span>
                    (
                    {
                      sexList.find(s => s.value === fullStudentInfo.sex)
                        ?.name?.[0]
                    }
                    )
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {sexList.find(s => s.value === fullStudentInfo.sex)?.name}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </h1>
          <Dialog>
            <DialogTrigger asChild>
              <Badge
                variant={
                  fullStudentInfo.membershipStatus === 'active'
                    ? 'default'
                    : 'outline'
                }
                className='mt-1 cursor-pointer'
              >
                {
                  membership_statuses.find(
                    s => s.value === fullStudentInfo.membershipStatus
                  )?.name
                }
              </Badge>
            </DialogTrigger>
            <DialogContent>
              <Table className='mt-5 '>
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
              +91 {fullStudentInfo.phoneNumber.substring(0, 5)}{' '}
              {fullStudentInfo.phoneNumber.substring(5)}
            </p>

            <p className='text-slate-400 w-1/2 text-center'>
              {fullStudentInfo.email}
            </p>
            <p>
              {fullStudentInfo.aadharNumber.slice(0, 4)}{' '}
              {fullStudentInfo.aadharNumber.slice(4, 8)}{' '}
              {fullStudentInfo.aadharNumber.slice(8, 12)}
            </p>
          </div>
          <p>{fullStudentInfo.address?.toLocaleUpperCase()}</p>
        </div>
        <div className='flex justify-between items-center gap-2 mt-10 h-[80px] w-1/4'>
          <TooltipProvider>
            <Tooltip delayDuration={20}>
              <TooltipTrigger asChild>
                <SmallCard
                  lowerNode='Age'
                  upperNode={`${differenceInCalendarYears(
                    new Date(),
                    new Date(fullStudentInfo.dob)
                  )} y`}
                  className='w-[calc(50%-10px)]'
                />
              </TooltipTrigger>
              <TooltipContent>
                {format(fullStudentInfo.dob, 'dd MMM yyyy')}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <Separator orientation='vertical' className=' h-full ' />

          <SmallCard
            lowerNode='Language'
            upperNode={fullStudentInfo.primaryLanguage}
            className='w-[calc(50%-10px)]'
          />
        </div>
      </ProfilePageSectionWrapper>
      <ProfilePageSectionWrapper classname='w-full my-10 px-5'>
        <div className='w-full'>
          <h1 className='text-2xl mb-6'>Parental Info</h1>
          <Table>
            <TableHeader>
              <TableRow className='border'>
                <TableHead className='border'>Relation</TableHead>
                <TableHead className='border'>First Name</TableHead>
                <TableHead className='border'>Last Name</TableHead>
                <TableHead className='border'>Phone Number</TableHead>
                <TableHead className='border'>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className='border'>
              {fullStudentInfo.parentalInfo?.map(parent => (
                <TableRow key={parent.parentId} className='border'>
                  <TableCell className='border'>
                    {
                      parentalRelations.find(r => r.value === parent.relation)
                        ?.label
                    }
                  </TableCell>
                  <TableCell className='border'>{parent.firstName}</TableCell>
                  <TableCell className='border'>{parent.lastName}</TableCell>
                  <TableCell className='border'>{`${parent.phoneNumber.slice(
                    0,
                    5
                  )} ${parent.phoneNumber.slice(5, 10)}`}</TableCell>
                  <TableCell className='border'>{parent.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </ProfilePageSectionWrapper>
    </section>
  )
}
