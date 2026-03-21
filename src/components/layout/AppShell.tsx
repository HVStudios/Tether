import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { useAuthContext } from '../../context/AuthContext'

export function AppShell() {
  const { user, signOut } = useAuthContext()

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-lg font-bold text-violet-600">Tether</h1>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400 hidden sm:block">{user?.email}</span>
          <button
            onClick={() => signOut()}
            className="text-xs text-gray-500 hover:text-gray-700 font-medium transition-colors"
          >
            Sign out
          </button>
        </div>
      </header>

      <main className="flex-1 pb-20 overflow-y-auto">
        <Outlet />
      </main>

      <BottomNav />
    </div>
  )
}
