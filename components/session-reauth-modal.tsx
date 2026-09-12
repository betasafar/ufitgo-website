"use client"

import { useEffect, useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { signIn, useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const LAST_AUTH_EMAIL_KEY = "ufitgo_last_authenticated_email"
const LAST_ACTIVITY_KEY = "ufitgo_last_user_activity"
const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000
const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/bookings",
  "/wallet",
  "/profile",
  "/settings",
  "/transactions",
  "/passport",
]

export function SessionReauthModal() {
  const { data: session, status, update } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [reason, setReason] = useState("Your session has expired or is no longer valid.")

  const isProtectedRoute = useMemo(
    () =>
      pathname === "/dashboard" ||
      PROTECTED_PATH_PREFIXES.some((prefix) => pathname.startsWith(prefix)),
    [pathname],
  )

  useEffect(() => {
    const storedEmail = window.localStorage.getItem(LAST_AUTH_EMAIL_KEY)
    const activeEmail = session?.user?.email || storedEmail || ""

    if (activeEmail) {
      window.localStorage.setItem(LAST_AUTH_EMAIL_KEY, activeEmail)
      setEmail(activeEmail)
    }
  }, [session?.user?.email])

  useEffect(() => {
    const handleSessionExpired = (event: Event) => {
      const detail = (event as CustomEvent<{ reason?: string }>).detail
      if (detail?.reason) {
        setReason(detail.reason)
      }

      const lastActivityAt = Number(window.localStorage.getItem(LAST_ACTIVITY_KEY) || Date.now())
      const idleForTooLong = Date.now() - lastActivityAt >= INACTIVITY_TIMEOUT_MS

      if (isProtectedRoute && idleForTooLong) {
        setIsOpen(true)
      }
    }

    window.addEventListener("ufitgo-session-expired", handleSessionExpired)
    return () => {
      window.removeEventListener("ufitgo-session-expired", handleSessionExpired)
    }
  }, [isProtectedRoute])

  useEffect(() => {
    if (status === "loading") {
      return
    }

    const lastActivityAt = Number(window.localStorage.getItem(LAST_ACTIVITY_KEY) || Date.now())
    const idleForTooLong = Date.now() - lastActivityAt >= INACTIVITY_TIMEOUT_MS
    const sessionInvalid =
      status === "unauthenticated" ||
      (status === "authenticated" && (!session?.accessToken || !session?.user?.id || !!(session as any)?.error))

    if (sessionInvalid && isProtectedRoute && idleForTooLong) {
      setIsOpen(true)
      setReason("Your session has expired or is no longer valid. Please sign in again to continue.")
      const storedEmail = window.localStorage.getItem(LAST_AUTH_EMAIL_KEY)
      if (storedEmail) {
        setEmail(storedEmail)
      }
    }
  }, [status, session, isProtectedRoute])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      const callbackUrl = isProtectedRoute ? pathname || "/dashboard" : "/dashboard"
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
        callbackUrl,
      })

      if (result?.error) {
        setError(result.error.includes("CredentialsSignin") ? "Invalid email or password. Please try again." : "We could not sign you back in. Please try again.")
        setIsSubmitting(false)
        return
      }

      window.localStorage.setItem(LAST_AUTH_EMAIL_KEY, email)
      window.localStorage.setItem(LAST_ACTIVITY_KEY, String(Date.now()))
      await update()
      setPassword("")
      setError("")
      setIsOpen(false)
      router.refresh()
    } catch (err) {
      setError("An unexpected error occurred while re-authenticating.")
      setIsSubmitting(false)
    }
  }

  const canDismiss = !isProtectedRoute

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(nextOpen) => {
        if (!nextOpen && !canDismiss) {
          return
        }
        setIsOpen(nextOpen)
      }}
    >
      <DialogContent
        showCloseButton={canDismiss}
        className="sm:max-w-md overflow-hidden rounded-2xl border-0 p-0 shadow-2xl"
      >
        <div className="p-6">
          <DialogHeader className="mb-4 text-left">
            <DialogTitle className="text-2xl font-bold font-serif text-foreground">
              Re-authentication required
            </DialogTitle>
            <DialogDescription className="mt-1.5 text-sm text-muted-foreground">
              {reason}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="reauth-email" className="text-sm font-medium text-foreground/80">
                Email
              </label>
              <Input
                id="reauth-email"
                type="email"
                value={email}
                readOnly
                className="h-12 rounded-xl bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reauth-password" className="text-sm font-medium text-foreground/80">
                Password
              </label>
              <Input
                id="reauth-password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-12 rounded-xl"
              />
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
                {error}
              </div>
            )}

            <DialogFooter className="mt-4 flex-col-reverse sm:flex-row sm:justify-end">
              {canDismiss && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || !password.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging in...
                  </>
                ) : (
                  "Log in again"
                )}
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
