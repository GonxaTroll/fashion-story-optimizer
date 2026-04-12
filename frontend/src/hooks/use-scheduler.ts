import { create } from 'zustand'
import { flushSync } from 'react-dom'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'
const INIT = (): boolean[][] => Array.from({ length: 24 }, () => Array(7).fill(false))

function authHeaders() {
  const token = localStorage.getItem('auth_token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}

interface SchedulerState {
  grid: boolean[][]
  saving: boolean
  toggleCell: (hour: number, day: number) => void
  setCells: (cells: { hour: number; day: number }[], value: boolean) => void
  resetGrid: () => void
  saveGrid: () => Promise<void>
  loadGrid: () => Promise<void>
}

export const useScheduler = create<SchedulerState>((set, get) => ({
  grid: (() => {
    try {
      const saved = localStorage.getItem('scheduler-grid')
      if (saved) return JSON.parse(saved) as boolean[][]
    } catch {}
    return INIT()
  })(),

  saving: false,

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

  saveGrid: async () => {
    const { grid } = get()
    // flushSync ensures the spinner renders before the fetch fires
    flushSync(() => set({ saving: true }))
    try {
      await fetch(`${API_BASE}/schedule`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ grid }),
      })
      localStorage.setItem('scheduler-grid', JSON.stringify(grid))
    } finally {
      set({ saving: false })
    }
  },

  loadGrid: async () => {
    try {
      const res = await fetch(`${API_BASE}/schedule`, {
        headers: authHeaders(),
      })
      if (!res.ok) return
      const { grid } = await res.json()
      set({ grid })
      localStorage.setItem('scheduler-grid', JSON.stringify(grid))
    } catch {}
  },
}))
