import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFeedback, listFeedbacks, toggleFeedbackReaction } from '@/lib/api/feedbacks'

export function useFeedbacks(currentUserId?: string) {
  return useQuery({
    queryKey: ['feedbacks', currentUserId],
    queryFn: () => listFeedbacks(currentUserId),
    enabled: !!currentUserId,
  })
}

export function useCreateFeedback() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createFeedback,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feedbacks'] }),
  })
}

export function useToggleFeedbackReaction() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: toggleFeedbackReaction,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['feedbacks'] }),
  })
}
