import apiClient from './client'
import type { DonationPayload, DonationSessionResponse, DonationReceipt } from '../types'

export const createDonationSession = async (
  payload: DonationPayload
): Promise<DonationSessionResponse['data']> => {
  const response = await apiClient.post<DonationSessionResponse>('/donations/', payload)
  return response.data.data
}

export const getDonationStatus = async (id: string): Promise<DonationReceipt> => {
  const response = await apiClient.get<{ data: DonationReceipt }>(`/donations/${id}/`)
  return response.data.data
}

export interface VerifyPaymentPayload {
  razorpay_payment_id?: string
  razorpay_order_id?: string
  razorpay_signature?: string
}

export const verifyDonationPayment = async (
  id: string,
  payload: VerifyPaymentPayload
): Promise<DonationReceipt> => {
  const response = await apiClient.post<{ data: DonationReceipt }>(`/donations/${id}/verify/`, payload)
  return response.data.data
}
