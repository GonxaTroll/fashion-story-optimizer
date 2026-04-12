import { useState } from 'react'
import SignInPage from '@/pages/sign-in'
import SignUpPage from '@/pages/sign-up'
import DashboardPage from '@/pages/dashboard'
import OptimizerPage from '@/pages/optimizer'
import SchedulerPage from '@/pages/scheduler'
import AccountPage from '@/pages/account'
import ResultsPage from '@/pages/results'

export type Page = 'signin' | 'signup' | 'dashboard' | 'optimizer' | 'scheduler' | 'account' | 'results'

function App() {
  const [page, setPage] = useState<Page>('signin')

  if (page === 'results')
    return (
      <ResultsPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  if (page === 'account')
    return (
      <AccountPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  if (page === 'scheduler')
    return (
      <SchedulerPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  if (page === 'optimizer')
    return (
      <OptimizerPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  if (page === 'dashboard')
    return (
      <DashboardPage
        onSignOut={() => setPage('signin')}
        onNavigate={(p) => setPage(p as Page)}
      />
    )

  if (page === 'signup')
    return (
      <SignUpPage
        onSignUp={() => setPage('dashboard')}
        onGoToSignIn={() => setPage('signin')}
      />
    )

  return <SignInPage onSignIn={() => setPage('dashboard')} onGoToSignUp={() => setPage('signup')} />
}

export default App
