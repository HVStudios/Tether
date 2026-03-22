import { createBrowserRouter, RouterProvider, Navigate, Outlet } from 'react-router-dom'
import { AuthProvider, useAuthContext } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthPage } from './pages/AuthPage'
import { LogPage } from './pages/LogPage'
import { HistoryPage } from './pages/HistoryPage'
import { ChartPage } from './pages/ChartPage'
import { AppShell } from './components/layout/AppShell'

function AuthGuard() {
  const { session, loading, isGuest } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-violet-600 border-t-transparent" />
      </div>
    )
  }

  if (!session && !isGuest) return <Navigate to="/auth" replace />
  return <Outlet />
}

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthPage />,
  },
  {
    element: <AuthGuard />,
    children: [
      {
        element: <AppShell />,
        children: [
          { index: true, element: <Navigate to="/log" replace /> },
          { path: '/log',     element: <LogPage /> },
          { path: '/history', element: <HistoryPage /> },
          { path: '/chart',   element: <ChartPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/log" replace />,
  },
], { basename: '/Tether' })

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ThemeProvider>
  )
}
