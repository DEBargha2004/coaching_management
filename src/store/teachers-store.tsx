import { create } from 'zustand'

type TeacherTypeBoard = {
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
}

type Actions = {
  setTeachersBoard: (data: TeacherTypeBoard[]) => void
}

export const useTeachersStore = create<State & Actions>(set => ({
  teachers_board: [],
  setTeachersBoard: (data: TeacherTypeBoard[]) => set({ teachers_board: data })
}))
