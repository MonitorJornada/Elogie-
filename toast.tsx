import { useQuery } from '@tanstack/react-query'
import { listProfiles } from '@/lib/api/profiles'

export function useProfiles() {
  return useQuery({
    queryKey: ['profiles'],
    queryFn: listProfiles,
  })
}
