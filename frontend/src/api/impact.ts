import apiClient from './client'
import type { ImpactMetric, ImpactStory, PaginatedResponse } from '../types'

export interface GetStoriesParams {
  page?: number
  page_size?: number
  search?: string
}

export const getImpactMetrics = async (programId?: string): Promise<ImpactMetric[]> => {
  const params = programId ? { program: programId } : undefined
  const response = await apiClient.get<{ data: ImpactMetric[] }>('/impact/metrics/', { params })
  return response.data.data
}

export const getImpactStories = async (params?: GetStoriesParams): Promise<PaginatedResponse<ImpactStory>> => {
  const response = await apiClient.get<PaginatedResponse<ImpactStory>>('/impact/stories/', { params })
  return response.data
}

export const getImpactStory = async (slug: string): Promise<ImpactStory> => {
  const response = await apiClient.get<{ data: ImpactStory }>(`/impact/stories/${slug}/`)
  return response.data.data
}
