export type BookingFilter = "ALL" | "ACTION_REQUIRED" | "IN_PROGRESS" | "COMPLETED"

export type BookingPaymentBreakdown = {
  registration?: {
    amount?: number
    paid?: number
    balance?: number
    status?: string
  }
  totalOutstanding?: number
  totalAmountPayable?: number
  payments?: Array<{
    id: string
    amount: number
    status: string
    reference?: string
    stages?: string[]
    createdAt: string
  }>
}

export type Booking = {
  id: string | number
  status?: string
  bookingRef?: string
  createdAt?: string
  packageName?: string
  operatorName?: string
  numberOfPilgrims?: number
  departureDate?: string
  totalAmount?: number
  amountPaid?: number
  registrationFeeAmount?: number
  registrationAmountPaid?: number
  packageAmountPaid?: number
  currentJourneyStage?: string
  hasAcknowledgedSecured?: boolean
  paymentBreakdown?: BookingPaymentBreakdown
}