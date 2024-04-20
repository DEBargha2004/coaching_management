import { GroupType } from '@/types/group-type'
import { produce } from 'immer'
import { create } from 'zustand'

type State = {
  groups: GroupType[]
  loading: boolean
}

type Actions = {
  setGroups: (fn: (data: State) => void) => void
}

export const useGroupStore = create<State & Actions>(set => ({
  groups: [],
  loading: true,
  setGroups: fn => {
    set(
      produce(state => {
        fn(state)
      })
    )
  }
}))
