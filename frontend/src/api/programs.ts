import apiClient from './client'
import type { Program, ProgramService, PaginatedResponse } from '../types'

export interface GetProgramsParams {
  page?: number
  page_size?: number
  search?: string
}

export const getPrograms = async (params?: GetProgramsParams): Promise<PaginatedResponse<Program>> => {
  const response = await apiClient.get<PaginatedResponse<Program>>('/programs/', { params })
  return response.data
}

export const getProgram = async (slug: string): Promise<Program> => {
  const response = await apiClient.get<{ data: Program }>(`/programs/${slug}/`)
  return response.data.data
}

export const getProgramServices = async (slug: string): Promise<ProgramService[]> => {
  const response = await apiClient.get<{ data: ProgramService[] }>(`/programs/${slug}/services/`)
  return response.data.data
}
