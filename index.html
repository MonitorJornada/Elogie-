import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { AuthProvider } from '@/contexts/AuthContext'
import AppLayout from '@/components/AppLayout'
import AuthPage from '@/pages/AuthPage'
import FeedbacksPage from '@/pages/FeedbacksPage'
import CelebrationsPage from '@/pages/CelebrationsPage'
import GratitudePage from '@/pages/GratitudePage'
import AdminPage from '@/pages/AdminPage'
import NotFound from '@/pages/NotFound'

const queryClient = new QueryClient()

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/feedbacks" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route element={<AppLayout />}>
              <Route path="/feedbacks" element={<FeedbacksPage />} />
              <Route path="/comemoracoes" element={<CelebrationsPage />} />
              <Route path="/gratidao" element={<GratitudePage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
)

export default App
