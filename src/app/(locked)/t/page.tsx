'use client'

import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
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
import getTeachersInitial from '@/server-actions/get-teachers'
import { useTeachersStore } from '@/store/teachers-store'
import { useUser } from '@clerk/nextjs'
import { Eye, Pen, User2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useThrottle } from '@uidotdev/usehooks'

export default function Page () {
  const [search, setSearch] = useState('')
  const [sortParam, setSortParam] = useState('')
  const throttledSearch = useThrottle(search, 500)
  const throttledSortParam = useThrottle(sortParam, 500)

  const { setTeachersBoard, teachers_board } = useTeachersStore()
  const { user } = useUser()

  const sortParamsList = useMemo(() => {
    return [
      { name: 'Salary', value: 'salary' },
      {
        name: 'First Name',
        value: 'first_name'
      }
    ] as {
      name: string
      value: string
    }[]
  }, [])

  useEffect(() => {
    if (user?.id) {
      getTeachersInitial({
        search: throttledSearch,
        sortParam: throttledSortParam
      }).then(data => {
        setTeachersBoard(data)
      })
    }
  }, [user, throttledSearch, throttledSortParam])
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
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <User2 className='mr-2 h-4 w-4' />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent></DialogContent>
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
            {teachers_board.map((teacher, teacher_idx) => (
              <TableRow key={teacher.teacher_id}>
                <TableCell>{teacher_idx + 1}</TableCell>
                {teacherBoardList.map((item, index) => (
                  <TableCell key={index} className='p-0'>
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <p className='w-full h-full p-4'>
                          {item.beforeText}
                          {teacher[item.value as keyof typeof teacher] || '—'}
                          {item.afterText}
                        </p>
                      </ContextMenuTrigger>
                      <ContextMenuContent>
                        <ContextMenuItem>
                          <Eye className='mr-2 h-4 w-4' />
                          View
                        </ContextMenuItem>
                        <ContextMenuItem>
                          <Pen className='mr-2 h-4 w-4' />
                          Edit
                        </ContextMenuItem>
                      </ContextMenuContent>
                    </ContextMenu>
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
