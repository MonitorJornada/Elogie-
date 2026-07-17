import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createGratitudePost, listGratitudePosts, toggleGratitudeReaction } from '@/lib/api/gratitude'

export function useGratitudePosts(currentUserId?: string) {
  return useQuery({
    queryKey: ['gratitude-posts', currentUserId],
    queryFn: () => listGratitudePosts(currentUserId),
    enabled: !!currentUserId,
  })
}

export function useCreateGratitudePost() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createGratitudePost,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gratitude-posts'] }),
  })
}

export function useToggleGratitudeReaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleGratitudeReaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gratitude-posts'] }),
  })
}
