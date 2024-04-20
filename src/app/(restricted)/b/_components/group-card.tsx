import GroupEntryForm from '@/components/custom/group-entry-form'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import {
  GroupEntrySchemaType,
  groupEntrySchema
} from '@/schema/entry-form/group'
import { trashGroup, updateGroup } from '@/server-actions/groups'
import { useGroupStore } from '@/store/group-store'
import { GroupType } from '@/types/group-type'
import { zodResolver } from '@hookform/resolvers/zod'
import { ifError } from 'assert'
import { format } from 'date-fns'
import { Loader2, Pen, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

export default function GroupCard ({
  g,
  ...props
}: { g: GroupType } & React.HTMLAttributes<HTMLDivElement>) {
  const [selectedGroupId, setSelectedGroupId] = useState('')
  const form = useForm<GroupEntrySchemaType>({
    resolver: zodResolver(groupEntrySchema)
  })
  const [loading, setLoading] = useState({
    trash_group: false
  })
  const [dialogState, setDialogState] = useState({
    group_entry_form: false,
    trash_group: false
  })

  const { setGroups } = useGroupStore()
  const { toast } = useToast()

  const handleUpdateGroup = async (data: GroupEntrySchemaType) => {
    const serverMessage_updateGroup = await updateGroup({
      group_id: g.group_id,
      ...data
    })
    if (serverMessage_updateGroup.status === 'success') {
      toast({
        title: serverMessage_updateGroup.heading,
        description: serverMessage_updateGroup.description
      })
      setDialogState(prev => ({ ...prev, group_entry_form: false }))
      setGroups(prev => {
        prev.groups.forEach(group => {
          if (group.group_id === serverMessage_updateGroup.result?.group_id) {
            group.name = serverMessage_updateGroup.result.name
            group.other = serverMessage_updateGroup.result.other
            group.created_at = serverMessage_updateGroup.result.created_at
          }
        })
      })
    } else {
      toast({
        title: serverMessage_updateGroup.heading,
        description: serverMessage_updateGroup.description,
        variant: 'destructive'
      })
      setDialogState(prev => ({ ...prev, group_entry_form: false }))
    }
  }

  const handleTrashGroup = async (group_id: string) => {
    setLoading(prev => ({ ...prev, trash_group: true }))
    const serverMessage_trashGroup = await trashGroup(group_id)
    if (serverMessage_trashGroup.status === 'success') {
      setGroups(prev => {
        prev.groups = prev.groups.filter(group => group.group_id !== group_id)
      })
    }
    toast({
      title: serverMessage_trashGroup.heading,
      description: serverMessage_trashGroup.description,
      variant:
        serverMessage_trashGroup.status === 'success'
          ? 'default'
          : 'destructive'
    })
    setLoading(prev => ({ ...prev, trash_group: false }))
    setDialogState(prev => ({ ...prev, trash_group: false }))
  }

  return (
    <ContextMenu
      key={g.group_id}
      onOpenChange={e => setSelectedGroupId(e ? g.group_id : '')}
    >
      <ContextMenuTrigger asChild>
        <div
          className={cn(
            `py-4 px-2 rounded bg-muted hover:bg-primary
          min-h-16 flex items-center justify-between relative
          transition-all cursor-pointer`,
            selectedGroupId === g.group_id ? 'bg-primary' : ''
          )}
          key={g.group_id}
          {...props}
          onContextMenu={e => {
            // e.preventDefault()
            setSelectedGroupId(g.group_id)
          }}
        >
          <div className='flex flex-col justify-between items-start'>
            <p className='font-semibold text-lg '>{g.name}</p>
            <TooltipProvider delayDuration={20}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <p className='max-w-[200px] truncate'>{g.other}</p>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{g.other}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <p className='absolute right-2 bottom-2 text-xs'>
            {format(new Date(g.created_at), 'dd/MM/yyyy')}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <Dialog
          open={dialogState.group_entry_form}
          onOpenChange={e => {
            setDialogState({
              ...dialogState,
              group_entry_form: e
            })
            form.setValue('name', g.name)
            form.setValue('other', g.other || '')
          }}
        >
          <DialogTrigger asChild>
            <ContextMenuItem onSelect={e => e.preventDefault()}>
              <Pen className='mr-2 h-4 w-4' />
              Edit
            </ContextMenuItem>
          </DialogTrigger>
          <DialogContent>
            <GroupEntryForm
              form={form}
              onSubmit={handleUpdateGroup}
              buttonLabel='Update'
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={dialogState.trash_group}
          onOpenChange={e => setDialogState({ ...dialogState, trash_group: e })}
        >
          <DialogTrigger asChild>
            <ContextMenuItem onSelect={e => e.preventDefault()}>
              <Trash2 className='mr-2 h-4 w-4' />
              Trash
            </ContextMenuItem>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <p>
                Trash Group <HighlightWrapper>{g.name}</HighlightWrapper>
              </p>
            </DialogHeader>
            <DialogDescription>
              Are you sure you want to trash this group{' '}
              <HighlightWrapper>{g.name}</HighlightWrapper>?You can{' '}
              <UnderlineWrapper className='decoration-red-500'>
                restore
              </UnderlineWrapper>{' '}
              it anytime from Trash
            </DialogDescription>
            <DialogFooter>
              <DialogClose>
                <Button variant={'secondary'}>Cancel</Button>
              </DialogClose>
              <Button
                variant={'destructive'}
                onClick={() => handleTrashGroup(g.group_id)}
              >
                {loading.trash_group ? (
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                ) : null}
                Trash
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </ContextMenuContent>
    </ContextMenu>
  )
}
