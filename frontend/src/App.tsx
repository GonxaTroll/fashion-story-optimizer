import { useState } from 'react'
import SignInPage from '@/pages/sign-in'
import DashboardPage from '@/pages/dashboard'
import OptimizerPage from '@/pages/settings'
import SchedulerPage from '@/pages/scheduler'

export type Page = 'signin' | 'dashboard' | 'settings' | 'scheduler'

function App() {
  const [page, setPage] = useState<Page>('signin')

  if (page === 'scheduler')
    return (
      <SchedulerPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  if (page === 'settings')
    return (
      <OptimizerPage
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
