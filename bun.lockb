import { supabase } from '@/lib/supabase'
import type { CelebrationItem, CelebrationType, ReactionSummary } from '@/lib/types'

type CelebrationRow = {
  id: string
  user_id: string
  created_by: string
  type: CelebrationType
  title: string
  description: string
  celebration_date: string
  created_at: string
  profile?: { name: string | null } | null
  celebration_reactions?: { emoji: string; user_id: string }[] | null
}

function isToday(date: string) {
  const today = new Date().toISOString().slice(0, 10)
  return date === today
}

function summarizeReactions(
  rows: { emoji: string; user_id: string }[] | null | undefined,
  currentUserId?: string,
): ReactionSummary[] {
  const matches = rows?.filter((r) => r.emoji === '🎉') ?? []
  return [{
    emoji: '🎉',
    count: matches.length,
    reactedByMe: !!currentUserId && matches.some((r) => r.user_id === currentUserId),
  }]
}

export async function listCelebrations(currentUserId?: string): Promise<CelebrationItem[]> {
  const { data, error } = await supabase
    .from('celebrations')
    .select(`
      id,
      user_id,
      created_by,
      type,
      title,
      description,
      celebration_date,
      created_at,
      profile:profiles!celebrations_user_id_fkey(name),
      celebration_reactions(emoji,user_id)
    `)
    .order('celebration_date', { ascending: false })

  if (error) throw error

  return ((data ?? []) as CelebrationRow[]).map((row) => ({
    id: row.id,
    userId: row.user_id,
    createdBy: row.created_by,
    userName: row.profile?.name || 'Usuário',
    type: row.type,
    title: row.title,
    description: row.description,
    celebrationDate: row.celebration_date,
    isToday: isToday(row.celebration_date),
    reactions: summarizeReactions(row.celebration_reactions, currentUserId),
  }))
}

export async function createCelebration(params: {
  userId: string
  createdBy: string
  type: CelebrationType
  title: string
  description: string
  celebrationDate: string
}) {
  const { error } = await supabase.from('celebrations').insert({
    user_id: params.userId,
    created_by: params.createdBy,
    type: params.type,
    title: params.title.trim(),
    description: params.description.trim(),
    celebration_date: params.celebrationDate,
  })

  if (error) throw error
}

export async function toggleCelebrationReaction(params: {
  celebrationId: string
  userId: string
  reactedByMe: boolean
}) {
  if (params.reactedByMe) {
    const { error } = await supabase
      .from('celebration_reactions')
      .delete()
      .eq('celebration_id', params.celebrationId)
      .eq('user_id', params.userId)
      .eq('emoji', '🎉')

    if (error) throw error
    return
  }

  const { error } = await supabase.from('celebration_reactions').insert({
    celebration_id: params.celebrationId,
    user_id: params.userId,
    emoji: '🎉',
  })

  if (error) throw error
}
