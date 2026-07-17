import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createCelebration, listCelebrations, toggleCelebrationReaction } from '@/lib/api/celebrations'

export function useCelebrations(currentUserId?: string) {
  return useQuery({
    queryKey: ['celebrations', currentUserId],
    queryFn: () => listCelebrations(currentUserId),
    enabled: !!currentUserId,
  })
}

export function useCreateCelebration() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCelebration,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['celebrations'] }),
  })
}

export function useToggleCelebrationReaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleCelebrationReaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['celebrations'] }),
  })
}
