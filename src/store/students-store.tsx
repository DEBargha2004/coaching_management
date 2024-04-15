import { create } from 'zustand'
import { produce } from 'immer'

export type StudentTypeBoard = {
  student_id: string
  first_name: string
  last_name: string
  phone_number: string
  address: string | null
  email?: string | null
  membership_status: string
  aadhar_number: string
}

type State = {
  students_board: StudentTypeBoard[]
  students_count: number
}

type Actions = {
  setStudentsBoard: (data: StudentTypeBoard[]) => void
  alterStudentsBoard: (fn: (data: State) => void) => void
  setStudentsCount: (count: number) => void
}

export const useStudentStore = create<State & Actions>(set => ({
  students_board: [],
  students_count: 0,
  setStudentsBoard: (data: StudentTypeBoard[]) => set({ students_board: data }),
  alterStudentsBoard: (fn: (data: State) => void) =>
    set(
      produce((state: State) => {
        fn(state)
      })
    ),
  setStudentsCount: (count: number) => set({ students_count: count })
}))
