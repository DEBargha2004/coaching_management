'use client'

import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  teacherBoardList,
  teachersLimitPerBoard
} from '@/constants/teacher-board'
import { cn } from '@/lib/utils'
import { useUser } from '@clerk/nextjs'
import { BadgeCheck, Eye, Loader2, Pen, Trash2, User2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useThrottle } from '@uidotdev/usehooks'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { teacherEntrySchema } from '@/schema/entry-form/teacher'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import Link from 'next/link'
import { membership_statuses } from '@/constants/membership-status'
import { useSearchParams } from 'next/navigation'
import PaginationBar from '@/components/custom/pagination-bar'
import { isNumber } from 'lodash'
import { useStudentStore } from '@/store/students-store'
import { getStudents, getStudentsCount } from '@/server-actions/get-students'
import { studentEntrySchema } from '@/schema/entry-form/student'
import StudentEntryForm from '@/components/custom/student-entry-form'

export default function Page () {
  const [search, setSearch] = useState('')
  const [sortParam, setSortParam] = useState('')
  const throttledSearch = useThrottle(search, 500)
  const searchParams = useSearchParams()
  const [pageInfo, setPageInfo] = useState<{ active_page: number | null }>({
    active_page: null
  })

  const [dialogBoxState, setDialogBoxState] = useState({
    teacher_entry_form: false,
    delete_teacher: false
  })
  const [loading, setLoading] = useState<{
    get_students: boolean
    delete_student: boolean
  }>({
    get_students: true,
    delete_student: false
  })
  const { toast } = useToast()

  const {
    alterStudentsBoard,
    setStudentsBoard,
    setStudentsCount,
    students_board,
    students_count
  } = useStudentStore()
  const { user } = useUser()

  const form = useForm<z.infer<typeof studentEntrySchema>>({
    resolver: zodResolver(studentEntrySchema),
    defaultValues: {
      parentalInfo: [
        {
          email: '',
          phoneNumber: '',
          firstName: '',
          lastName: '',
          relation: ''
        }
      ]
    }
  })

  // const handleFormSubmit = async (data: z.infer<typeof teacherEntrySchema>) => {
  //   const serverMessage_addTeacher = await addTeacher(data)
  //   setDialogBoxState(prev => ({ ...prev, teacher_entry_form: false }))
  //   alterTeachersBoard(prev => {
  //     prev.teachers_board.unshift(...(serverMessage_addTeacher.result || []))
  //   })
  //   toast({
  //     title: serverMessage_addTeacher.heading,
  //     description: serverMessage_addTeacher.description,
  //     variant:
  //       serverMessage_addTeacher.status === 'success'
  //         ? 'default'
  //         : 'destructive'
  //   })
  //   form.reset()
  // }

  // const handleDeleteTeacher = async (id: string) => {
  //   setLoading(prev => ({ ...prev, delete_teacher: true }))
  //   const serverMessage = await removeTeacher(id)
  //   setLoading(prev => ({ ...prev, delete_teacher: false }))
  //   toast({
  //     title: serverMessage.heading,
  //     description: serverMessage.description,
  //     variant: serverMessage.status === 'success' ? 'default' : 'destructive'
  //   })
  //   if (serverMessage.status === 'success') {
  //     alterTeachersBoard(teachers => {
  //       teachers.teachers_board = teachers.teachers_board.filter(
  //         teacher => teacher.teacher_id !== id
  //       )
  //     })
  //   }
  //   setDialogBoxState(prev => ({ ...prev, delete_teacher: false }))
  // }

  // const handleMembershipStatus = async ({
  //   teacher_id,
  //   status
  // }: {
  //   teacher_id: string
  //   status: string
  // }) => {
  //   const prev_status = teachers_board.find(
  //     t => t.teacher_id === teacher_id
  //   )?.membership_status

  //   if (prev_status === status) {
  //     return toast({
  //       title: 'No change',
  //       description: `The teacher's membership status is already ${status}.`,
  //       variant: 'default'
  //     })
  //   }

  //   if (prev_status) {
  //     alterTeachersBoard(prev => {
  //       prev.teachers_board.map(teacher => {
  //         if (teacher.teacher_id === teacher_id) {
  //           teacher.membership_status = 'Loading'
  //         }
  //       })
  //     })

  //     const res = await changeTeacherInfo({
  //       teacher_id,
  //       data: { membershipStatus: status }
  //     })

  //     alterTeachersBoard(prev => {
  //       prev.teachers_board.map(teacher => {
  //         if (teacher.teacher_id === teacher_id) {
  //           teacher.membership_status =
  //             res.status === 'success'
  //               ? res?.result?.membershipStatus || prev_status
  //               : prev_status
  //         }
  //       })
  //     })

  //     toast({
  //       title: res.heading,
  //       description: res.description,
  //       variant: res.status === 'success' ? 'default' : 'destructive'
  //     })
  //   }
  // }

  useEffect(() => {
    if (user?.id) {
      setLoading(prev => ({ ...prev, get_students: true }))
      const activePage = searchParams.get('p')
      const activePage_num = activePage
        ? isNumber(Number(activePage))
          ? Number(activePage)
          : 1
        : 1
      getStudents({
        search: throttledSearch,
        offset: activePage_num
          ? (activePage_num - 1) * teachersLimitPerBoard
          : 0
      }).then(data => {
        setStudentsBoard(data)
        setLoading(prev => ({ ...prev, get_students: false }))
      })
    }
  }, [user, throttledSearch, searchParams])

  useEffect(() => {
    if (user?.id) {
      getStudentsCount().then(count =>
        setStudentsCount(count ? count[0]?.count : 0)
      )

      const activePage = Number(searchParams.get('p'))
      const activePage_num = isNumber(activePage) ? activePage : 1
      setPageInfo(prev => ({ ...prev, active_page: activePage_num }))
    }
  }, [user])

  return (
    <main className='h-full w-full'>
      <div className='flex justify-between items-center gap-10 h-[10%]'>
        <div className='w-2/3 flex justify-start items-center gap-5'>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={cn('w-1/2 shrink-0 grow-0', !search && 'italic')}
            placeholder='Search Students...'
          />
        </div>
        <Dialog
          onOpenChange={e => {
            setDialogBoxState(prev => ({ ...prev, teacher_entry_form: e }))
            form.reset()
          }}
          open={dialogBoxState.teacher_entry_form}
        >
          <DialogTrigger asChild>
            <Button>
              <User2 className='mr-2 h-4 w-4' />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className=''>
            <DialogHeader>Student Entry Form</DialogHeader>
            <StudentEntryForm
              form={form}
              onSubmit={data => console.log(data)}
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className='h-[90%] max-h-fit pt-12 pb-8 flex flex-col justify-between items-center'>
        <Table className=''>
          <TableHeader>
            <TableRow>
              <TableHead>sl no.</TableHead>
              {teacherBoardList.map((item, index) => (
                <TableHead key={index}>{item.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading.get_students
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className='h-6 w-6' />
                    </TableCell>
                    {teacherBoardList.map((item, index) => (
                      <TableCell key={index}>
                        <Skeleton className='h-6 w-auto' />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : students_board?.map((student, student_idx) => (
                  <TableRow key={student.student_id}>
                    <TableCell>
                      {((Number(pageInfo.active_page) || 1) - 1) *
                        teachersLimitPerBoard +
                        student_idx +
                        1}
                    </TableCell>
                    {teacherBoardList.map((item, index) => (
                      <TableCell key={index} className='p-0 cursor-pointer'>
                        <Dialog
                          onOpenChange={e => {
                            setDialogBoxState(prev => ({
                              ...prev,
                              delete_teacher: e
                            }))
                          }}
                          open={dialogBoxState.delete_teacher}
                        >
                          <ContextMenu>
                            <ContextMenuTrigger>
                              <p className='w-full h-full p-4'>
                                {item.beforeText}
                                {item.process(
                                  student[item.value as keyof typeof student] ||
                                    '—'
                                )}
                                {item.afterText}
                              </p>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <Link href={`/t/${student.student_id}`}>
                                <ContextMenuItem className='cursor-pointer'>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View
                                </ContextMenuItem>
                              </Link>
                              <Link href={`/t/${student.student_id}/edit`}>
                                <ContextMenuItem className='cursor-pointer'>
                                  <Pen className='mr-2 h-4 w-4' />
                                  Edit
                                </ContextMenuItem>
                              </Link>
                              <DialogTrigger asChild>
                                <ContextMenuItem className='cursor-pointer'>
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Remove
                                </ContextMenuItem>
                              </DialogTrigger>
                              <ContextMenuSeparator />
                              <ContextMenuSub>
                                <ContextMenuSubTrigger className='cursor-pointer'>
                                  <BadgeCheck className='mr-2 h-4 w-4' />
                                  Membership
                                </ContextMenuSubTrigger>
                                <ContextMenuSubContent>
                                  <ContextMenuRadioGroup
                                    value={student.membership_status}
                                  >
                                    {membership_statuses.map(status => (
                                      <ContextMenuRadioItem
                                        key={status.value}
                                        className='cursor-pointer'
                                        value={status.value}
                                        // onClick={() => {
                                        //   handleMembershipStatus({
                                        //     teacher_id: student.student_id,
                                        //     status: status.value
                                        //   })
                                        // }}
                                      >
                                        {status.name}
                                      </ContextMenuRadioItem>
                                    ))}
                                  </ContextMenuRadioGroup>
                                </ContextMenuSubContent>
                              </ContextMenuSub>
                            </ContextMenuContent>
                          </ContextMenu>
                          <DialogContent>
                            <DialogHeader>Delete Teacher</DialogHeader>
                            <DialogDescription>
                              Are you sure want to delete {student.first_name}{' '}
                              from your database? Remember this is an
                              irreversible action.
                            </DialogDescription>
                            <DialogFooter>
                              <Button
                                onClick={() => {
                                  setDialogBoxState(prev => ({
                                    ...prev,
                                    delete_teacher: false
                                  }))
                                }}
                                variant={'secondary'}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant={'destructive'}
                                // onClick={() =>
                                //   handleDeleteTeacher(student.student_id)
                                // }
                              >
                                {loading.delete_student ? (
                                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                ) : null}
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
          </TableBody>
        </Table>
        <PaginationBar
          activePage={Number(pageInfo.active_page) || 1}
          baseLink='/t?p=%s'
          replaceString='%s'
          totalPages={Math.ceil(students_count / teachersLimitPerBoard) | 1}
          minPage={1}
          pageItemLimit={5}
          className='mt-4'
        />
      </div>
    </main>
  )
}
