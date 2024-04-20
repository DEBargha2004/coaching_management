'use client'

import GroupEntryForm from '@/components/custom/group-entry-form'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger
} from '@/components/ui/context-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger
} from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'
import {
  GroupEntrySchemaType,
  groupEntrySchema
} from '@/schema/entry-form/group'
import { useGroupStore } from '@/store/group-store'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Box, Boxes, EllipsisVertical, School } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import GroupCard from './_components/group-card'
import { createGroup, restoreGroup, updateGroup } from '@/server-actions/groups'
import { toast } from '@/components/ui/use-toast'
import { ToastAction } from '@/components/ui/toast'
import { orderBy } from 'lodash'
import BatchCard from '@/components/custom/batch-card'
import { Batch } from '@/types/batch'
import { getAllBatches } from '@/server-actions/batches'

export default function Page () {
  const [batches, setBatches] = useState<Batch[]>([])
  const { groups, setGroups, loading: groups_loading } = useGroupStore()
  const [loading, setLoading] = useState({
    batches: true
  })
  const [dialogState, setDialogState] = useState({
    group_entry_form: false
  })

  const form = useForm<GroupEntrySchemaType>({
    resolver: zodResolver(groupEntrySchema)
  })

  const handleRestoreGroup = async (group_id: string) => {
    const serverMessage_restoreGroup = await restoreGroup(group_id)
    if (serverMessage_restoreGroup.status === 'success') {
      toast({
        title: serverMessage_restoreGroup.heading,
        description: serverMessage_restoreGroup.description
      })
      setGroups(prev => {
        const updated_groups = [
          ...prev.groups,
          serverMessage_restoreGroup.result!
        ]
        const sorted_groups = orderBy(updated_groups, 'createdAt', 'asc')
        prev.groups = sorted_groups
      })
    } else {
      toast({
        title: serverMessage_restoreGroup.heading,
        description: serverMessage_restoreGroup.description,
        variant: 'destructive'
      })
    }
  }

  const handleCreateGroup = async (data: GroupEntrySchemaType) => {
    const serverMessage_createGroup = await createGroup(data)
    if (serverMessage_createGroup.status === 'success') {
      toast({
        title: serverMessage_createGroup.heading,
        description: serverMessage_createGroup.description
      })
      setGroups(prev => {
        prev.groups.push(serverMessage_createGroup.result!)
      })
      setDialogState(prev => ({ ...prev, group_entry_form: false }))
    } else {
      toast({
        title: serverMessage_createGroup.heading,
        description: serverMessage_createGroup.description,
        variant: 'destructive',
        ...(serverMessage_createGroup.trashed
          ? {
              action: (
                <ToastAction
                  altText='recycle'
                  onClick={() =>
                    handleRestoreGroup(
                      serverMessage_createGroup.result!.group_id
                    )
                  }
                >
                  Recycle
                </ToastAction>
              )
            }
          : {})
      })
      setDialogState(prev => ({ ...prev, group_entry_form: false }))
    }
  }

  useEffect(() => {
    ;(async () => {
      const serverMessage_getAllBatches = await getAllBatches()
      if (serverMessage_getAllBatches.status === 'success') {
        setBatches(serverMessage_getAllBatches.result || [])
        setLoading(prev => ({ ...prev, batches: false }))
      } else {
        setLoading(prev => ({ ...prev, batches: false }))
        toast({
          title: serverMessage_getAllBatches.heading,
          description: serverMessage_getAllBatches.description,
          variant: 'destructive'
        })
      }
    })()
  }, [])

  return (
    <div>
      <div className='w-full flex justify-between items-center gap-3'>
        <div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Boxes className='h-4 w-4 mr-2' />
                View Groups
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Groups</DialogHeader>
              <DialogDescription className='space-y-4 max-h-[400px] overflow-auto scroller px-3'>
                {groups_loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <Skeleton
                        key={i}
                        className='py-4 px-2 rounded bg-muted text-muted-foreground min-h-16'
                      />
                    ))
                  : groups.map(g => <GroupCard key={g.group_id} g={g} />)}
              </DialogDescription>
            </DialogContent>
          </Dialog>
        </div>
        <div className='flex gap-4'>
          <Dialog
            open={dialogState.group_entry_form}
            onOpenChange={e => {
              setDialogState({ ...dialogState, group_entry_form: e })
              form.reset()
            }}
          >
            <DialogTrigger asChild>
              <Button>
                <Box className='h-4 w-4 mr-2' />
                Add Group
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>Create Group</DialogHeader>
              <GroupEntryForm form={form} onSubmit={handleCreateGroup} />
            </DialogContent>
          </Dialog>
          <Button>
            <School className='h-4 w-4 mr-2' />
            Add Batch
          </Button>
        </div>
      </div>
      <div className='py-4 grid grid-cols-4 gap-4'>
        {loading.batches
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className='rounded-lg w-full aspect-video' />
            ))
          : batches.map(b => <BatchCard key={b.batch_id} batch={b} />)}
      </div>
    </div>
  )
}
