import { supabase } from '@/lib/supabase'
import type { Profile } from '@/lib/types'

export async function listProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return (data ?? []) as Profile[]
}
