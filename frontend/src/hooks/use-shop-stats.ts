import { create } from 'zustand'

interface ShopStats {
  profit: number
  xp: number
  gems: number
  addProfit: (amount: number) => void
  addXp: (amount: number) => void
  addGems: (amount: number) => void
  spendGems: (amount: number) => boolean
}

export const useShopStats = create<ShopStats>((set, get) => ({
  profit: 0,
  xp: 0,
  gems: 0,

  addProfit: (amount) => set((s) => ({ profit: s.profit + amount })),
  addXp: (amount) => set((s) => ({ xp: s.xp + amount })),
  addGems: (amount) => set((s) => ({ gems: s.gems + amount })),
  spendGems: (amount) => {
    if (get().gems < amount) return false
    set((s) => ({ gems: s.gems - amount }))
    return true
  },
}))
