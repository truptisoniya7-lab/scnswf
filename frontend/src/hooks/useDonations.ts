import { useMutation, useQuery } from '@tanstack/react-query'
import {
  createDonationSession,
  getDonationStatus,
  verifyDonationPayment,
  VerifyPaymentPayload,
} from '../api/donations'
import type { DonationPayload } from '../types'

export const useCreateDonation = () => {
  return useMutation({
    mutationFn: (payload: DonationPayload) => createDonationSession(payload),
  })
}

export const useVerifyDonation = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: VerifyPaymentPayload }) =>
      verifyDonationPayment(id, payload),
  })
}

export const useDonationStatus = (donationId: string | null) => {
  return useQuery({
    queryKey: ['donation-status', donationId],
    queryFn: () => getDonationStatus(donationId!),
    enabled: Boolean(donationId),
  })
}
