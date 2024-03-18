import { create } from 'zustand'

export type TeacherTypeBoard = {
  first_name: string
  last_name: string
  phone_number: string
  address: string | null
  teacher_id: string
  email?: string | null
  salary: number | null
}

type State = {
  teachers_board: TeacherTypeBoard[]
  teachers_count: number
}

type Actions = {
  setTeachersBoard: (data: TeacherTypeBoard[]) => void
  addTeachersBoard: (fn: (data: State) => void) => void
  setTeachersCount: (count: number) => void
}

export const useTeachersStore = create<State & Actions>(set => ({
  teachers_board: [],
  teachers_count: 0,
  setTeachersBoard: (data: TeacherTypeBoard[]) => set({ teachers_board: data }),
  addTeachersBoard: (fn: (data: State) => void) =>
    set(state => {
      fn(state)
      return state
    }),
  setTeachersCount: (count: number) => set({ teachers_count: count })
}))
