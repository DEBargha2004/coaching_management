'use client'

import { create } from 'zustand'

type State = {
  sheet: boolean
}

type Actions = {
  setSheet: (open: boolean) => void
}

export const useGlobalAppStore = create<State & Actions>(set => ({
  sheet: false,
  setSheet: open =>
    set({
      sheet: open
    })
}))
