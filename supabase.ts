import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error)
    } else {
      navigate('/feedbacks')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-extrabold gradient-text mb-2">Elogie+</h1>
          <p className="text-muted-foreground">Reconhecimento que transforma equipes</p>
        </div>

        <div className="gradient-separator rounded-full mb-8" />

        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          <h2 className="text-xl font-bold text-foreground mb-1">Entrar</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Use o acesso fornecido pelo administrador.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="gradient"
              className="w-full h-12 text-base font-semibold rounded-xl"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Problemas com o acesso? Fale com o administrador.
          </p>
        </div>
      </div>
    </div>
  )
}
