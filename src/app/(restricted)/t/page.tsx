'use client'

import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
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
import { teacherBoardList } from '@/constants/teacher-board'
import { cn } from '@/lib/utils'
import { getTeachers, getTeachersCount } from '@/server-actions/get-teachers'
import { useTeachersStore } from '@/store/teachers-store'
import { useUser } from '@clerk/nextjs'
import { Delete, Eye, Loader2, Pen, Trash2, User2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useThrottle } from '@uidotdev/usehooks'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { teacherEntrySchema } from '@/schema/entry-form/teacher'
import { zodResolver } from '@hookform/resolvers/zod'
import TeacherEntryForm from '@/components/custom/teacher-entry-form'
import { addTeacher } from '@/server-actions/add-teacher'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import removeTeacher from '@/server-actions/delete-teacher'
import Link from 'next/link'

export default function Page () {
  const [search, setSearch] = useState('')
  const [sortParam, setSortParam] = useState('')
  const throttledSearch = useThrottle(search, 500)
  const throttledSortParam = useThrottle(sortParam, 500)

  const [dialogBoxState, setDialogBoxState] = useState({
    teacher_entry_form: false,
    delete_teacher: false
  })
  const [loading, setLoading] = useState({
    teachers: true,
    delete_teacher: false
  })

  const { toast } = useToast()

  const {
    setTeachersBoard,
    teachers_board,
    addTeachersBoard,
    setTeachersCount
  } = useTeachersStore()
  const { user } = useUser()

  const form = useForm<z.infer<typeof teacherEntrySchema>>({
    resolver: zodResolver(teacherEntrySchema)
  })

  const sortParamsList = useMemo(() => {
    return [{ name: 'Salary', value: 'salary' }] as {
      name: string
      value: string
    }[]
  }, [])

  const handleFormSubmit = async (data: z.infer<typeof teacherEntrySchema>) => {
    const serverMessage_addTeacher = await addTeacher(data)
    setDialogBoxState(prev => ({ ...prev, teacher_entry_form: false }))
    addTeachersBoard(prev => {
      prev.teachers_board.push(...(serverMessage_addTeacher.result || []))
    })
    toast({
      title: serverMessage_addTeacher.heading,
      description: serverMessage_addTeacher.description,
      variant:
        serverMessage_addTeacher.status === 'success'
          ? 'default'
          : 'destructive'
    })
    form.reset()
  }

  const handleDeleteTeacher = async (id: string) => {
    setLoading(prev => ({ ...prev, delete_teacher: true }))
    const serverMessage = await removeTeacher(id)
    setLoading(prev => ({ ...prev, delete_teacher: false }))
    toast({
      title: serverMessage.heading,
      description: serverMessage.description,
      variant: serverMessage.status === 'success' ? 'default' : 'destructive'
    })
    if (serverMessage.status === 'success') {
      addTeachersBoard(teachers => {
        teachers.teachers_board = teachers.teachers_board.filter(
          teacher => teacher.teacher_id !== id
        )
      })
    }
    setDialogBoxState(prev => ({ ...prev, delete_teacher: false }))
  }

  useEffect(() => {
    if (user?.id) {
      setLoading(prev => ({ ...prev, teachers: true }))
      getTeachers({
        search: throttledSearch,
        sortParam: throttledSortParam
      }).then(data => {
        setTeachersBoard(data)
        setLoading(prev => ({ ...prev, teachers: false }))
      })
    }
  }, [user, throttledSearch, throttledSortParam])

  useEffect(() => {
    if (user?.id) {
      getTeachersCount().then(count =>
        setTeachersCount(count ? count[0]?.count : 0)
      )
    }
  }, [user])
  return (
    <main className='h-full w-full'>
      <div className='flex justify-between items-center gap-10'>
        <div className='w-2/3 flex justify-start items-center gap-5'>
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={cn('w-1/2 shrink-0 grow-0', !search && 'italic')}
            placeholder='Search Teachers...'
          />
          <Select value={sortParam} onValueChange={setSortParam}>
            <SelectTrigger className='w-1/4 shrink-0 grow-0'>
              <SelectValue placeholder='Sort by' />
            </SelectTrigger>
            <SelectContent>
              {sortParamsList.map((item, index) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
            <DialogHeader>Teacher Entry Form</DialogHeader>
            <TeacherEntryForm form={form} onSubmit={handleFormSubmit} />
          </DialogContent>
        </Dialog>
      </div>
      <div>
        <Table className='mt-12'>
          <TableHeader>
            <TableRow>
              <TableHead>sl no.</TableHead>
              {teacherBoardList.map((item, index) => (
                <TableHead key={index}>{item.name}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading.teachers
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
              : teachers_board?.map((teacher, teacher_idx) => (
                  <TableRow key={teacher.teacher_id}>
                    <TableCell>{teacher_idx + 1}</TableCell>
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
                                  teacher[item.value as keyof typeof teacher] ||
                                    '—'
                                )}
                                {item.afterText}
                              </p>
                            </ContextMenuTrigger>
                            <ContextMenuContent>
                              <Link href={`/t/${teacher.teacher_id}`}>
                                <ContextMenuItem className='cursor-pointer'>
                                  <Eye className='mr-2 h-4 w-4' />
                                  View
                                </ContextMenuItem>
                              </Link>
                              <ContextMenuItem className='cursor-pointer'>
                                <Pen className='mr-2 h-4 w-4' />
                                Edit
                              </ContextMenuItem>
                              <DialogTrigger asChild>
                                <ContextMenuItem className='cursor-pointer'>
                                  <Trash2 className='mr-2 h-4 w-4' />
                                  Remove
                                </ContextMenuItem>
                              </DialogTrigger>
                            </ContextMenuContent>
                          </ContextMenu>
                          <DialogContent>
                            <DialogHeader>Delete Teacher</DialogHeader>
                            <DialogDescription>
                              Are you sure want to delete {teacher.first_name}{' '}
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
                                onClick={() =>
                                  handleDeleteTeacher(teacher.teacher_id)
                                }
                              >
                                {loading.delete_teacher ? (
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
      </div>
    </main>
  )
}
