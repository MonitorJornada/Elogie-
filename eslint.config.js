export type UserRole = 'admin' | 'member'

export type Profile = {
  id: string
  name: string
  email: string
  avatar_url: string | null
  role: UserRole
  department: string | null
  company_id: string | null
  created_at: string
}

export type ReactionSummary = {
  emoji: string
  count: number
  reactedByMe: boolean
}

export type FeedbackItem = {
  id: string
  fromUserId: string
  toUserId: string
  fromName: string
  toName: string
  message: string
  isAnonymous: boolean
  createdAt: string
  reactions: ReactionSummary[]
}

export type CelebrationType = 'birthday' | 'admission' | 'achievement' | 'baby' | 'wedding' | 'custom'

export type CelebrationItem = {
  id: string
  userId: string
  createdBy: string
  userName: string
  type: CelebrationType
  title: string
  description: string
  celebrationDate: string
  isToday: boolean
  reactions: ReactionSummary[]
}

export type GratitudeItem = {
  id: string
  userId: string
  message: string
  userName: string
  isAnonymous: boolean
  color: string
  likes: number
  likedByMe: boolean
  createdAt: string
}
