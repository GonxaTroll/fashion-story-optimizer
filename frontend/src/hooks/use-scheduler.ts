import { create } from 'zustand'

const INIT = (): boolean[][] => Array.from({ length: 24 }, () => Array(7).fill(false))

interface SchedulerState {
  grid: boolean[][]
  toggleCell: (hour: number, day: number) => void
  setCells: (cells: { hour: number; day: number }[], value: boolean) => void
  resetGrid: () => void
  saveGrid: () => void
}

export const useScheduler = create<SchedulerState>((set, get) => ({
  grid: (() => {
    try {
      const saved = localStorage.getItem('scheduler-grid')
      if (saved) return JSON.parse(saved) as boolean[][]
    } catch {}
    return INIT()
  })(),

  toggleCell: (hour, day) =>
    set((s) => ({
      grid: s.grid.map((row, h) =>
        h === hour ? row.map((v, d) => (d === day ? !v : v)) : row
      ),
    })),

  setCells: (cells, value) =>
    set((s) => {
      const grid = s.grid.map((row) => [...row])
      cells.forEach(({ hour, day }) => {
        grid[hour][day] = value
      })
      return { grid }
    }),

  resetGrid: () => set({ grid: INIT() }),

  saveGrid: () => {
    try {
      localStorage.setItem('scheduler-grid', JSON.stringify(get().grid))
    } catch {}
  },
}))
