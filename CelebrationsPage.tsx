import { AppSidebar } from '@/components/AppSidebar'
import { MobileNav } from '@/components/MobileNav'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

export default function AppLayout() {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold gradient-text mb-2">Elogie+</h1>
          <p className="text-muted-foreground text-sm">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!session) return <Navigate to="/auth" replace />

  return (
    <div className="flex min-h-screen w-full bg-surface">
      <AppSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <MobileNav />
        <main className="flex-1 p-4 md:p-8 max-w-5xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
