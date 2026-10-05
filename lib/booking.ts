import { type Booking, type BookingFilter } from "@/types/booking"

export function isCancelledBooking(booking: Booking): boolean {
  return booking.status?.toUpperCase() === "CANCELLED"
}

export function isRegistrationOutstanding(booking: Booking): boolean {
  const registration = booking.paymentBreakdown?.registration
  if (registration) return Number(registration.balance || 0) > 0

  return Number(booking.registrationFeeAmount || 0) > Number(booking.registrationAmountPaid || 0)
}

export function getBookingJourneyStep(booking: Booking): 0 | 1 | 2 | 3 {
  if (isRegistrationOutstanding(booking)) return 0

  const stage = String(booking.currentJourneyStage || booking.status || "").toUpperCase()
  if (["FULLY_PAID", "COMPLETED"].includes(stage)) return 3
  if (["AWAITING_CONCIERGE", "CONCIERGE_PROCESSING", "CONCIERGE_REVIEW", "REGISTRATION_PAID"].includes(stage)) return 1

  return 2
}

export function matchesBookingFilter(booking: Booking, filter: BookingFilter): boolean {
  const status = booking.status?.toUpperCase() || ""
  if (filter === "ALL") return true
  if (filter === "ACTION_REQUIRED") return isRegistrationOutstanding(booking) || status === "DEPOSIT_PAID"
  if (filter === "IN_PROGRESS") return ["REGISTRATION_PAID", "FULLY_PAID"].includes(status)
  return status === "COMPLETED"
}

export function getBookingStatusPresentation(booking: Booking) {
  const status = booking.status?.toUpperCase() || "PENDING"
  const stage = String(booking.currentJourneyStage || "").toUpperCase()

  if (isRegistrationOutstanding(booking)) {
    return { label: "Action Required", className: "bg-amber-100 text-amber-800" }
  }
  if (status === "REGISTRATION_PAID" && ["AWAITING_CONCIERGE", "CONCIERGE_PROCESSING", "CONCIERGE_REVIEW"].includes(stage)) {
    return { label: "At Concierge", className: "bg-emerald-100 text-emerald-800" }
  }
  if (status === "REGISTRATION_PAID") {
    return { label: "Registration Fee Paid", className: "bg-blue-100 text-blue-800" }
  }
  if (status === "DEPOSIT_PAID") {
    return { label: "Initial Deposit Paid", className: "bg-emerald-100 text-emerald-800" }
  }
  if (["FULLY_PAID", "COMPLETED"].includes(status)) {
    return { label: status === "COMPLETED" ? "Trip Completed" : "Fully Paid", className: "bg-green-100 text-green-800" }
  }

  return { label: status.replaceAll("_", " "), className: "bg-secondary text-muted-foreground" }
}