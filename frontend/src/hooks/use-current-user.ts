import { useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

interface CurrentUser {
  name: string
  boutique_name: string
  item_slots: number | null
}

export function useCurrentUser(): CurrentUser {
  const [user, setUser] = useState<CurrentUser>({ name: '', boutique_name: '', item_slots: null })

  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    fetch(`${API_BASE}/auth/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : null)
      .then((data) => {
        if (data) setUser({
          name: data.name ?? '',
          boutique_name: data.boutique_name ?? '',
          item_slots: data.item_slots ?? null,
        })
      })
      .catch(() => {})
  }, [])

  return user
}
