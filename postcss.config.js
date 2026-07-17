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
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) throw new Error('Sem autorização')

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: { user: caller }, error: callerError } = await supabaseAdmin.auth.getUser(
      authHeader.replace('Bearer ', '')
    )
    if (callerError || !caller) throw new Error('Usuário inválido')

    const { data: callerProfile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', caller.id)
      .single()

    if (callerProfile?.role !== 'admin') {
      throw new Error('Apenas administradores podem remover usuários')
    }

    const { userId } = await req.json()
    if (!userId) throw new Error('Usuário não informado')
    if (userId === caller.id) throw new Error('Você não pode remover seu próprio acesso')

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userId)
    if (deleteError) throw new Error(deleteError.message)

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
