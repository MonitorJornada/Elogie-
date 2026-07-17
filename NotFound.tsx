import { MessageSquare, PartyPopper, Heart, ShieldCheck, LogOut } from 'lucide-react'
import { NavLink } from '@/components/NavLink'
import { useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

const navItems = [
  { title: 'Feedbacks', url: '/feedbacks', emoji: '💬', icon: MessageSquare },
  { title: 'Comemorações', url: '/comemoracoes', emoji: '🎉', icon: PartyPopper },
  { title: 'Gratidão', url: '/gratidao', emoji: '🙏', icon: Heart },
]

export function AppSidebar() {
  const location = useLocation()
  const { isAdmin, profile, signOut } = useAuth()

  return (
    <aside className="hidden md:flex flex-col w-64 min-h-screen gradient-brand-vertical">
      {/* Logo */}
      <div className="flex items-center justify-center py-8 px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md">
          Elogie<span className="text-white/90">+</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.url
          return (
            <NavLink
              key={item.url}
              to={item.url}
              end
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 font-medium transition-all hover:bg-white/15 ${
                isActive ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm' : ''
              }`}
              activeClassName="bg-white/20 text-white"
            >
              <span className="text-lg">{item.emoji}</span>
              <span>{item.title}</span>
            </NavLink>
          )
        })}

        {/* Admin item — só aparece para admins */}
        {isAdmin && (
          <>
            <div className="mx-4 my-3 border-t border-white/20" />
            <NavLink
              to="/admin"
              end
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 font-medium transition-all hover:bg-white/15 ${
                location.pathname === '/admin' ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm' : ''
              }`}
              activeClassName="bg-white/20 text-white"
            >
              <ShieldCheck size={18} className="opacity-90" />
              <span>Admin</span>
            </NavLink>
          </>
        )}
      </nav>

      {/* User + logout */}
      <div className="p-4 border-t border-white/20">
        {profile && (
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {profile.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold truncate">{profile.name}</p>
              <p className="text-white/50 text-xs truncate">{profile.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={signOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all text-sm font-medium"
        >
          <LogOut size={16} />
          Sair
        </button>
      </div>
    </aside>
  )
}
