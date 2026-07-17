import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Verificar que quem chamou é um admin
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Sem autorização')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Pegar o usuário que fez a chamada
    const { data: { user: caller }, error: callerError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (callerError || !caller) throw new Error('Usuário inválido')

    // Verificar role = admin no profile
    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (callerProfile?.role !== 'admin') {
      throw new Error('Apenas administradores podem criar usuários')
    }

    const { name, email, password, department, role } = await req.json()

    if (!name || !email || !password) throw new Error('Campos obrigatórios faltando')

    // Criar o usuário via Admin API
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: name },
    })

    if (createError) throw new Error(createError.message)

    // Atualizar o profile com role e departamento
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        name,
        email,
        role: role || 'member',
        department: department || null,
      })
      .eq('id', newUser.user.id)

    if (profileError) throw new Error(profileError.message)

    return new Response(
      JSON.stringify({ success: true, userId: newUser.user.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
