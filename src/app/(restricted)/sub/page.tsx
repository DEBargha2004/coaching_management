'use client'

import SubjectEntryForm from '@/components/custom/subject-entry-form'
import {
  HighlightWrapper,
  UnderlineWrapper
} from '@/components/custom/text-wrappers'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'

import { Skeleton } from '@/components/ui/skeleton'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import {
  SubjectEntrySchemaType,
  subjectEntrySchema
} from '@/schema/entry-form/subject'
import changeSubjectName from '@/server-actions/change-subject-name'
import createSubject from '@/server-actions/create-subject'
import getSubjects from '@/server-actions/get-subjects'
import trashSubject from '@/server-actions/trash-subject'
import { useSubjectStore } from '@/store/subject-store'
import { useUser } from '@clerk/nextjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { BookMarked, Loader2, Pen, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

export default function Page () {
  const [dialogBoxState, setDialogBoxState] = useState({
    subject_entry_form: false,
    subject_edit_form: false,
    trash_subject: false
  })
  const [loading, setLoading] = useState({
    // subject_entry_form: false
    subjects: false,
    trash_subject: false
  })
  const [selectedSubject, setSelectedSubject] = useState({
    subject_id: ''
  })

  const { subject_board, setSubjectBoard } = useSubjectStore()
  const { user } = useUser()
  const { toast } = useToast()
  const form = useForm<SubjectEntrySchemaType>({
    resolver: zodResolver(subjectEntrySchema)
  })

  const handleCreateSubject = async (data: SubjectEntrySchemaType) => {
    const serverMessage_createSubject = await createSubject(data)
    if (serverMessage_createSubject.status === 'success') {
      setSubjectBoard(prev => {
        prev.subject_board.push(serverMessage_createSubject.result!)
      })
    }
    setDialogBoxState(prev => ({ ...prev, subject_entry_form: false }))
    toast({
      title: serverMessage_createSubject.heading,
      description: serverMessage_createSubject.description,
      variant:
        serverMessage_createSubject.status === 'success'
          ? 'default'
          : 'destructive'
    })
  }

  const handleTrashSubject = async (subject_id: string) => {
    setLoading(prev => ({ ...prev, trash_subject: true }))
    const serverMessage_trashSubject = await trashSubject(subject_id)
    if (serverMessage_trashSubject.status === 'success') {
      setSubjectBoard(prev => {
        prev.subject_board = prev.subject_board.filter(
          sub => sub.subjectId !== subject_id
        )
      })
    }
    setLoading(prev => ({ ...prev, trash_subject: false }))
    setDialogBoxState(prev => ({ ...prev, trash_subject: false }))
    toast({
      title: serverMessage_trashSubject.heading,
      description: serverMessage_trashSubject.description,
      variant:
        serverMessage_trashSubject.status === 'success'
          ? 'default'
          : 'destructive'
    })
  }

  const handleSubjectEdit = async (
    data: SubjectEntrySchemaType & { subject_id: string }
  ) => {
    const serverMessage_EditSubject = await changeSubjectName(
      data.subject_id,
      data.subject_name
    )
    setDialogBoxState(prev => ({ ...prev, subject_edit_form: false }))
    if (serverMessage_EditSubject.status === 'success') {
      setSubjectBoard(prev => {
        prev.subject_board.map(sub => {
          sub.subjectName =
            sub.subjectId === data.subject_id
              ? data.subject_name
              : sub.subjectName
        })
      })
    }

    toast({
      title: serverMessage_EditSubject.heading,
      description: serverMessage_EditSubject.description,
      variant:
        serverMessage_EditSubject.status === 'success'
          ? 'default'
          : 'destructive'
    })
  }

  useEffect(() => {
    if (user?.id) {
      setLoading(prev => ({ ...prev, subjects: true }))
      getSubjects().then(res => {
        if (res.status === 'success' && res.result) {
          setSubjectBoard(prev => {
            prev.subject_board = res.result!
          })
        } else {
          toast({
            title: res.heading,
            description: res.description,
            variant: 'destructive'
          })
        }
        setLoading(prev => ({ ...prev, subjects: false }))
      })
    }
  }, [user])

  return (
    <div>
      <div className='flex justify-between items-center gap-10 h-[10%]'>
        <div className='w-2/3 flex justify-start items-center gap-5'></div>
        <Dialog
          onOpenChange={e => {
            setDialogBoxState(prev => ({ ...prev, subject_entry_form: e }))
            form.reset()
          }}
          open={dialogBoxState.subject_entry_form}
        >
          <DialogTrigger asChild>
            <Button>
              <BookMarked className='mr-2 h-4 w-4' />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent className=''>
            <DialogHeader>Student Entry Form</DialogHeader>
            <SubjectEntryForm form={form} onSubmit={handleCreateSubject} />
          </DialogContent>
        </Dialog>
      </div>
      <div className='grid grid-cols-4 gap-4 py-3'>
        {loading.subjects
          ? Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className='w-full aspect-[16/9]' />
            ))
          : subject_board.map(sub => (
              <ContextMenu
                onOpenChange={e =>
                  setSelectedSubject(prev => ({
                    ...prev,
                    subject_id: e ? sub.subjectId : ''
                  }))
                }
                key={sub.subjectId}
              >
                <ContextMenuTrigger asChild>
                  <Link href={`/sub/${sub.subjectId}`}>
                    <div
                      key={sub.subjectId}
                      className={cn(
                        `w-full relative aspect-[16/9] flex flex-col justify-end 
                      gap-10 items-center font-medium border rounded-lg bg-muted 
                      hover:text-primary-foreground cursor-pointer transition-all 
                      group overflow-hidden`,
                        selectedSubject.subject_id === sub.subjectId
                          ? 'bg-primary'
                          : ''
                      )}
                      onContextMenu={e =>
                        setSelectedSubject(prev => ({
                          ...prev,
                          subject_id: sub.subjectId
                        }))
                      }
                    >
                      <p className='z-20'>{sub.subjectName}</p>
                      <p className='z-20 text-xs text-muted-foreground w-full p-2'>
                        {format(new Date(sub.createdAt), 'dd/MM/yyyy hh:mm a')}
                      </p>
                      <div
                        className={`w-full h-full absolute left-0 top-full transition-all
                                  group-hover:-translate-y-full z-10 bg-primary`}
                      />
                    </div>
                  </Link>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <Dialog
                    open={dialogBoxState.subject_edit_form}
                    onOpenChange={e =>
                      setDialogBoxState(prev => ({
                        ...prev,
                        subject_edit_form: e
                      }))
                    }
                  >
                    <DialogTrigger asChild>
                      <ContextMenuItem
                        onSelect={e => {
                          e.preventDefault()
                          form.setValue('subject_name', sub.subjectName)
                        }}
                      >
                        <Pen className='mr-2 h-4 w-4' /> Edit
                      </ContextMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <SubjectEntryForm
                        form={form}
                        onSubmit={data =>
                          handleSubjectEdit({
                            ...data,
                            subject_id: sub.subjectId
                          })
                        }
                      />
                    </DialogContent>
                  </Dialog>
                  <Dialog>
                    <DialogTrigger asChild>
                      <ContextMenuItem onSelect={e => e.preventDefault()}>
                        <Trash2 className='mr-2 h-4 w-4' /> Trash
                      </ContextMenuItem>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <p>
                          Move{' '}
                          <HighlightWrapper>{sub.subjectName}</HighlightWrapper>{' '}
                          to Trash
                        </p>
                      </DialogHeader>
                      <DialogDescription>
                        Are you sure you want to move{' '}
                        <HighlightWrapper>{sub.subjectName}</HighlightWrapper>{' '}
                        to Trash? You can{' '}
                        <UnderlineWrapper className='decoration-red-500'>
                          restore
                        </UnderlineWrapper>{' '}
                        it anytime from Trash.
                      </DialogDescription>
                      <DialogFooter>
                        <DialogClose>
                          <Button variant={'secondary'}>Cancel</Button>
                        </DialogClose>
                        <Button
                          variant={'destructive'}
                          onClick={() => handleTrashSubject(sub.subjectId)}
                        >
                          {loading.trash_subject ? (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                          ) : null}
                          Trash
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </ContextMenuContent>
              </ContextMenu>
            ))}
      </div>
    </div>
  )
}
