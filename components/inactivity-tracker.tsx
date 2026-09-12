"use client"

import { useEffect, useRef } from "react"
import { useSession } from "next-auth/react"

const INACTIVITY_TIME = 15 * 60 * 1000 // 15 minutes in milliseconds
const LAST_ACTIVITY_KEY = "ufitgo_last_user_activity"

export function InactivityTracker() {
  const { status, data: session } = useSession()
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const markUserActive = () => {
    window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
  }

  useEffect(() => {
    if (status !== "authenticated") return

    const resetTimer = () => {
      markUserActive()
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("ufitgo-session-expired", {
            detail: { reason: "Your session has expired due to inactivity. Please sign in again to continue." },
          }),
        )
      }, INACTIVITY_TIME)
    }

    resetTimer()

    const events = ["mousemove", "keydown", "wheel", "touchstart", "click", "pointerdown", "pointermove"]
    events.forEach((event) => window.addEventListener(event, resetTimer, { passive: true }))

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      events.forEach((event) => window.removeEventListener(event, resetTimer))
    }
  }, [status, session])

  return null
}
