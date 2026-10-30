"use client"

import { Suspense, useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { initPostHog, webAnalytics } from "@/lib/analytics"

function PostHogPageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (!pathname || typeof window === "undefined") return

    const search = searchParams?.toString()
    const fullUrl = `${window.origin}${pathname}${search ? `?${search}` : ""}`
    webAnalytics.trackPageView(fullUrl, {
      pathname,
      utm_source: searchParams?.get("utm_source") || undefined,
      utm_medium: searchParams?.get("utm_medium") || undefined,
      utm_campaign: searchParams?.get("utm_campaign") || undefined,
    })
  }, [pathname, searchParams])

  return null
}

function PostHogIdentitySync() {
  const { data: session, status } = useSession()
  const identifiedUserIdRef = useRef<string | null>(null)

  useEffect(() => {
    initPostHog()
  }, [])

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      if (identifiedUserIdRef.current !== session.user.id) {
        identifiedUserIdRef.current = session.user.id
        webAnalytics.identifyUser({
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.firstName,
          lastName: session.user.lastName,
          isVerified: session.user.isVerified,
          kycStatus: session.user.kycStatus,
          role: session.user.role,
        })
      }
    } else if (status === "unauthenticated" && identifiedUserIdRef.current !== null) {
      identifiedUserIdRef.current = null
      webAnalytics.resetUser()
    }
  }, [session?.user, status])

  return null
}

export function PostHogAnalytics() {
  return (
    <>
      <PostHogIdentitySync />
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
    </>
  )
}
