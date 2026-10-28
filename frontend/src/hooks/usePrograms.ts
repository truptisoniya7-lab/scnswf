import { useQuery } from '@tanstack/react-query'
import { getPrograms, getProgram, getProgramServices, GetProgramsParams } from '../api/programs'

export const usePrograms = (params?: GetProgramsParams) => {
  return useQuery({
    queryKey: ['programs', params],
    queryFn: () => getPrograms(params),
  })
}

export const useProgramDetail = (slug: string) => {
  return useQuery({
    queryKey: ['program', slug],
    queryFn: () => getProgram(slug),
    enabled: Boolean(slug),
  })
}

export const useProgramServices = (slug: string) => {
  return useQuery({
    queryKey: ['program-services', slug],
    queryFn: () => getProgramServices(slug),
    enabled: Boolean(slug),
  })
}
