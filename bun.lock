import { supabase } from '@/lib/supabase'
import type { FeedbackItem, ReactionSummary } from '@/lib/types'

const FEEDBACK_EMOJIS = ['❤️', '👏', '🔥'] as const

type FeedbackRow = {
  id: string
  from_user_id: string
  to_user_id: string
  message: string
  is_anonymous: boolean
  created_at: string
  from_profile?: { name: string | null } | null
  to_profile?: { name: string | null } | null
  feedback_reactions?: { emoji: string; user_id: string }[] | null
}

function summarizeReactions(
  rows: { emoji: string; user_id: string }[] | null | undefined,
  currentUserId?: string,
): ReactionSummary[] {
  return FEEDBACK_EMOJIS.map((emoji) => {
    const matches = rows?.filter((r) => r.emoji === emoji) ?? []
    return {
      emoji,
      count: matches.length,
      reactedByMe: !!currentUserId && matches.some((r) => r.user_id === currentUserId),
    }
  })
}

export async function listFeedbacks(currentUserId?: string): Promise<FeedbackItem[]> {
  const { data, error } = await supabase
    .from('feedbacks')
    .select(`
      id,
      from_user_id,
      to_user_id,
      message,
      is_anonymous,
      created_at,
      from_profile:profiles!feedbacks_from_user_id_fkey(name),
      to_profile:profiles!feedbacks_to_user_id_fkey(name),
      feedback_reactions(emoji,user_id)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data ?? []) as FeedbackRow[]).map((row) => ({
    id: row.id,
    fromUserId: row.from_user_id,
    toUserId: row.to_user_id,
    fromName: row.from_profile?.name || 'Usuário',
    toName: row.to_profile?.name || 'Usuário',
    message: row.message,
    isAnonymous: row.is_anonymous,
    createdAt: new Date(row.created_at).toLocaleDateString('pt-BR'),
    reactions: summarizeReactions(row.feedback_reactions, currentUserId),
  }))
}

export async function createFeedback(params: {
  fromUserId: string
  toUserId: string
  message: string
  isAnonymous: boolean
}) {
  const { error } = await supabase.from('feedbacks').insert({
    from_user_id: params.fromUserId,
    to_user_id: params.toUserId,
    message: params.message.trim(),
    is_anonymous: params.isAnonymous,
  })

  if (error) throw error
}

export async function toggleFeedbackReaction(params: {
  feedbackId: string
  userId: string
  emoji: string
  reactedByMe: boolean
}) {
  if (params.reactedByMe) {
    const { error } = await supabase
      .from('feedback_reactions')
      .delete()
      .eq('feedback_id', params.feedbackId)
      .eq('user_id', params.userId)
      .eq('emoji', params.emoji)

    if (error) throw error
    return
  }

  const { error } = await supabase.from('feedback_reactions').insert({
    feedback_id: params.feedbackId,
    user_id: params.userId,
    emoji: params.emoji,
  })

  if (error) throw error
}
