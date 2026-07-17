import { supabase } from '@/lib/supabase'
import type { GratitudeItem } from '@/lib/types'

type GratitudeRow = {
  id: string
  user_id: string
  message: string
  is_anonymous: boolean
  color: string
  created_at: string
  profile?: { name: string | null } | null
  gratitude_reactions?: { emoji: string; user_id: string }[] | null
}

export async function listGratitudePosts(currentUserId?: string): Promise<GratitudeItem[]> {
  const { data, error } = await supabase
    .from('gratitude_posts')
    .select(`
      id,
      user_id,
      message,
      is_anonymous,
      color,
      created_at,
      profile:profiles!gratitude_posts_user_id_fkey(name),
      gratitude_reactions(emoji,user_id)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error

  return ((data ?? []) as GratitudeRow[]).map((row) => {
    const likes = row.gratitude_reactions?.filter((r) => r.emoji === '❤️') ?? []

    return {
      id: row.id,
      userId: row.user_id,
      message: row.message,
      userName: row.profile?.name || 'Usuário',
      isAnonymous: row.is_anonymous,
      color: row.color,
      likes: likes.length,
      likedByMe: !!currentUserId && likes.some((r) => r.user_id === currentUserId),
      createdAt: row.created_at,
    }
  })
}

export async function createGratitudePost(params: {
  userId: string
  message: string
  isAnonymous: boolean
  color: string
}) {
  const { error } = await supabase.from('gratitude_posts').insert({
    user_id: params.userId,
    message: params.message.trim(),
    is_anonymous: params.isAnonymous,
    color: params.color,
  })

  if (error) throw error
}

export async function toggleGratitudeReaction(params: {
  gratitudeId: string
  userId: string
  likedByMe: boolean
}) {
  if (params.likedByMe) {
    const { error } = await supabase
      .from('gratitude_reactions')
      .delete()
      .eq('gratitude_id', params.gratitudeId)
      .eq('user_id', params.userId)
      .eq('emoji', '❤️')

    if (error) throw error
    return
  }

  const { error } = await supabase.from('gratitude_reactions').insert({
    gratitude_id: params.gratitudeId,
    user_id: params.userId,
    emoji: '❤️',
  })

  if (error) throw error
}
