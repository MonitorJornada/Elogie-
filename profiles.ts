import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Plus, Users, ShieldCheck, UserX, Copy, Check } from 'lucide-react'
import { supabase, Profile } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function AdminPage() {
  const { isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loadingProfiles, setLoadingProfiles] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState(false)
  const [newCredentials, setNewCredentials] = useState<{ email: string; password: string } | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [department, setDepartment] = useState('')
  const [role, setRole] = useState<'member' | 'admin'>('member')

  useEffect(() => {
    if (!loading && !isAdmin) navigate('/feedbacks')
  }, [isAdmin, loading, navigate])

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    setLoadingProfiles(true)
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .order('name')
    setProfiles(data || [])
    setLoadingProfiles(false)
  }

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefghjkmnpqrstwxyz23456789@#!'
    return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
  }

  const handleCreate = async () => {
    if (!name || !email || !password) {
      setError('Preencha nome, email e senha.')
      return
    }
    setSubmitting(true)
    setError('')

    // Chamar Supabase Admin API via Edge Function
    const { data, error: fnError } = await supabase.functions.invoke('create-user', {
      body: { name, email, password, department, role },
    })

    setSubmitting(false)

    if (fnError || data?.error) {
      setError(fnError?.message || data?.error || 'Erro ao criar usuário.')
      return
    }

    setNewCredentials({ email, password })
    setSuccess(`Colaborador "${name}" criado com sucesso!`)
    resetForm()
    fetchProfiles()
  }

  const resetForm = () => {
    setName('')
    setEmail('')
    setPassword('')
    setDepartment('')
    setRole('member')
  }

  const copyCredentials = () => {
    if (!newCredentials) return
    navigator.clipboard.writeText(
      `Acesso Elogie+\nEmail: ${newCredentials.email}\nSenha: ${newCredentials.password}`
    )
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDeactivate = async (userId: string, name: string) => {
    if (!confirm(`Desativar acesso de ${name}?`)) return

    const { data, error: fnError } = await supabase.functions.invoke('delete-user', {
      body: { userId },
    })

    if (fnError || data?.error) {
      alert(fnError?.message || data?.error || 'Erro ao remover usuário.')
      return
    }

    fetchProfiles()
  }

  if (loading) return null

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="text-elogie-teal" size={26} />
          Painel Admin
        </h1>
        <p className="text-muted-foreground text-sm mt-1">Gerencie os colaboradores da plataforma</p>
      </div>

      <div className="gradient-separator rounded-full" />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold gradient-text">{profiles.length}</p>
          <p className="text-sm text-muted-foreground mt-1">Colaboradores</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center">
          <p className="text-3xl font-bold gradient-text">
            {profiles.filter(p => p.role === 'admin').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Admins</p>
        </div>
        <div className="bg-card border border-border rounded-2xl p-4 text-center sm:col-span-1 col-span-2">
          <p className="text-3xl font-bold gradient-text">
            {profiles.filter(p => p.role === 'member').length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">Membros</p>
        </div>
      </div>

      {/* Success banner com credenciais */}
      {newCredentials && (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
          <p className="text-green-700 font-semibold mb-2">✅ {success}</p>
          <div className="bg-white border border-green-100 rounded-xl p-3 font-mono text-sm text-foreground mb-3">
            <p><span className="text-muted-foreground">Email:</span> {newCredentials.email}</p>
            <p><span className="text-muted-foreground">Senha:</span> {newCredentials.password}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={copyCredentials}
            className="flex items-center gap-2"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? 'Copiado!' : 'Copiar credenciais'}
          </Button>
        </div>
      )}

      {/* Collaborators list */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2 font-semibold text-foreground">
            <Users size={18} />
            Colaboradores
          </div>
          <Dialog open={modalOpen} onOpenChange={(o) => { setModalOpen(o); if (!o) { resetForm(); setError(''); setNewCredentials(null); setSuccess('') } }}>
            <DialogTrigger asChild>
              <Button variant="gradient" size="sm" className="flex items-center gap-2 rounded-xl font-semibold">
                <Plus size={16} />
                Novo colaborador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="gradient-text text-xl">Criar Colaborador</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label>Nome completo</Label>
                  <Input placeholder="João Silva" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" placeholder="joao@empresa.com" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Senha temporária</Label>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Senha"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setPassword(generatePassword())}
                      className="shrink-0 text-xs"
                    >
                      Gerar
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Departamento <span className="text-muted-foreground">(opcional)</span></Label>
                  <Input placeholder="Ex: Marketing, TI, RH..." value={department} onChange={e => setDepartment(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Perfil</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as 'member' | 'admin')}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="member">👤 Membro</SelectItem>
                      <SelectItem value="admin">🛡️ Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">
                    {error}
                  </div>
                )}

                <Button
                  variant="gradient"
                  className="w-full h-11 rounded-xl font-semibold"
                  onClick={handleCreate}
                  disabled={submitting}
                >
                  {submitting ? 'Criando...' : 'Criar Colaborador'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {loadingProfiles ? (
          <div className="p-8 text-center text-muted-foreground">Carregando...</div>
        ) : profiles.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">Nenhum colaborador ainda.</div>
        ) : (
          <div className="divide-y divide-border">
            {profiles.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {p.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.email}{p.department ? ` · ${p.department}` : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    p.role === 'admin'
                      ? 'bg-teal-50 text-teal-700 border border-teal-200'
                      : 'bg-muted text-muted-foreground border border-border'
                  }`}>
                    {p.role === 'admin' ? '🛡️ Admin' : '👤 Membro'}
                  </span>
                  <button
                    onClick={() => handleDeactivate(p.id, p.name)}
                    title="Remover acesso"
                    className="text-muted-foreground hover:text-red-500 transition-colors p-1"
                  >
                    <UserX size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
