"use client"

import { useEffect, useRef } from "react"
import { useSession, signOut } from "next-auth/react"

const INACTIVITY_TIME = 15 * 60 * 1000 // 15 minutes in milliseconds

export function InactivityTracker() {
  const { status } = useSession()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Only track inactivity if the user is currently logged in
    if (status !== "authenticated") return

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        // Log out the user and redirect to login with a specific reason query param
        signOut({ callbackUrl: "/login?reason=inactivity" })
      }, INACTIVITY_TIME)
    }

    // Initialize timer immediately
    resetTimer()

    const events = ["mousemove", "keydown", "wheel", "touchstart", "click"]
    
    // Add event listeners to reset timer on user activity
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [status])

  return null
}
