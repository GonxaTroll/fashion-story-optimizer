import { useState } from 'react'
import SignInPage from '@/pages/sign-in'
import DashboardPage from '@/pages/dashboard'
import SettingsPage from '@/pages/settings'

export type Page = 'signin' | 'dashboard' | 'settings'

function App() {
  const [page, setPage] = useState<Page>('signin')

  if (page === 'settings')
    return (
      <SettingsPage
        onBack={() => setPage('dashboard')}
        onSignOut={() => setPage('signin')}
      />
    )

  if (page === 'dashboard')
    return (
      <DashboardPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  return <SignInPage onSignIn={() => setPage('dashboard')} />
}

export default App
