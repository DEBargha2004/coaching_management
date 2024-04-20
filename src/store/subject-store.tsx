import { SubjectType } from '@/types/subject-type'
import { produce } from 'immer'
import { create } from 'zustand'

type SubjectBoardType = SubjectType[]
type State = {
  subject_board: SubjectBoardType
}

type Actions = {
  setSubjectBoard: (fn: (data: State) => void) => void
}

export const useSubjectStore = create<State & Actions>(set => ({
  subject_board: [],
  setSubjectBoard: (fn: (data: State) => void) =>
    set(
      produce((state: State) => {
        fn(state)
      })
    )
}))
