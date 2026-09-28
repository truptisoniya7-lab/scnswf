import apiClient from "./client"
import type { Program, PaginatedResponse } from "../types"

export const getPrograms = () =>
  apiClient.get<PaginatedResponse<Program>>("/programs/")

export const getProgram = (slug: string) =>
  apiClient.get<{ data: Program }>(`/programs/${slug}/`)
