import posthog from "posthog-js"

export const POSTHOG_API_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY ||
  process.env.NEXT_PUBLIC_POSTHOG_API_KEY ||
  "phc_AR4x6WEELUx5RnbSVnBxnbTftHQmQGB7B8LBuoaNjopo"

export const POSTHOG_HOST =
  process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://eu.i.posthog.com"

let isInitialized = false

export function initPostHog() {
  if (typeof window === "undefined" || isInitialized || !POSTHOG_API_KEY) {
    return posthog
  }

  posthog.init(POSTHOG_API_KEY, {
    api_host: POSTHOG_HOST,
    person_profiles: "identified_only",
    capture_pageview: false, // Handled manually on Next.js App Router navigation
    capture_pageleave: true,
    session_recording: {
      maskAllInputs: true,
    },
  })

  isInitialized = true
  return posthog
}

export const webAnalytics = {
  identifyUser(user: {
    id: string | number
    email?: string
    firstName?: string
    lastName?: string
    isVerified?: boolean
    kycStatus?: string
    role?: string
  }) {
    if (typeof window === "undefined") return
    initPostHog()
    if (user?.id) {
      const properties: Record<string, string | boolean> = {
        platform: "web",
      }
      if (user.email) properties.email = user.email
      const name = `${user.firstName || ""} ${user.lastName || ""}`.trim()
      if (name) properties.name = name
      if (typeof user.isVerified === "boolean") properties.is_verified = user.isVerified
      if (user.kycStatus) properties.kyc_status = user.kycStatus
      if (user.role) properties.role = user.role
      posthog.identify(String(user.id), properties)
    } else {
      posthog.reset()
    }
  },

  resetUser() {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.reset()
  },

  trackPageView(url: string, metadata?: Record<string, unknown>) {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.capture("$pageview", {
      $current_url: url,
      platform: "web",
      ...metadata,
    })
  },

  trackPackageView(packageId: string | number, metadata?: Record<string, unknown>) {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.capture("package_view", {
      packageId: String(packageId),
      platform: "web",
      ...metadata,
    })
  },

  trackOperatorView(operatorId: string | number, metadata?: Record<string, unknown>) {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.capture("operator_view", {
      operatorId: String(operatorId),
      platform: "web",
      ...metadata,
    })
  },

  trackSearch(searchTerm: string, metadata?: Record<string, unknown>) {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.capture("search", {
      searchTerm,
      platform: "web",
      ...metadata,
    })
  },

  trackContactClick(
    packageId?: string,
    operatorId?: string,
    contactType: "whatsapp" | "call" = "whatsapp",
    metadata?: Record<string, unknown>,
  ) {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.capture("contact_click", {
      packageId,
      operatorId,
      contactType,
      platform: "web",
      ...metadata,
    })
  },

  trackBookingCheckoutStarted(metadata: Record<string, unknown>) {
    if (typeof window === "undefined") return
    initPostHog()
    posthog.capture("payment_checkout_started", {
      platform: "web",
      ...metadata,
    })
  },
}
