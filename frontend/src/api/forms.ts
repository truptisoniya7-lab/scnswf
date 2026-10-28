import apiClient from './client'
import type {
  ContactFormData,
  VolunteerFormData,
  InternshipFormData,
  PartnershipFormData,
} from '../types'

export interface SubmissionResponse {
  data: {
    id: string
    status: string
    created_at?: string
    message?: string
  }
}

export const submitContactForm = async (data: ContactFormData): Promise<SubmissionResponse> => {
  const response = await apiClient.post<SubmissionResponse>('/contact/', data)
  return response.data
}

export const submitVolunteerApplication = async (
  data: VolunteerFormData
): Promise<SubmissionResponse> => {
  const response = await apiClient.post<SubmissionResponse>('/applications/volunteer/', data)
  return response.data
}

export const submitInternshipApplication = async (
  data: InternshipFormData & { resume_url?: string }
): Promise<SubmissionResponse> => {
  const payload = {
    name: data.name,
    email: data.email,
    phone: data.phone,
    education: data.education,
    area_of_interest: data.area_of_interest,
    duration: data.duration,
    message: data.message,
    ...(data.resume_url ? { resume_url: data.resume_url } : {}),
  }
  const response = await apiClient.post<SubmissionResponse>('/applications/internship/', payload)
  return response.data
}

export const submitPartnershipRequest = async (
  data: PartnershipFormData
): Promise<SubmissionResponse> => {
  const response = await apiClient.post<SubmissionResponse>('/applications/partnership/', data)
  return response.data
}

export const subscribeNewsletter = async (
  email: string
): Promise<{ data: { message: string; email: string } }> => {
  const response = await apiClient.post<{ data: { message: string; email: string } }>(
    '/newsletter/subscribe/',
    { email }
  )
  return response.data
}
