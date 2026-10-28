import { useQuery } from '@tanstack/react-query'
import { getImpactMetrics, getImpactStories, getImpactStory, GetStoriesParams } from '../api/impact'

export const useImpactMetrics = (programId?: string) => {
  return useQuery({
    queryKey: ['impact-metrics', programId],
    queryFn: () => getImpactMetrics(programId),
  })
}

export const useImpactStories = (params?: GetStoriesParams) => {
  return useQuery({
    queryKey: ['impact-stories', params],
    queryFn: () => getImpactStories(params),
  })
}

export const useImpactStory = (slug: string) => {
  return useQuery({
    queryKey: ['impact-story', slug],
    queryFn: () => getImpactStory(slug),
    enabled: Boolean(slug),
  })
}
