"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { UfitGoLogo } from "@/components/ufitgo-logo"

export default function OnboardingPage() {
  const { data: session, update } = useSession()
  const router = useRouter()
  
  const [phone, setPhone] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // If session is broken (missing user ID), force them to log out and try again
  if (session && !session.user?.id) {
    signOut({ callbackUrl: "/login?error=SessionExpired" })
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Resetting session...</span>
      </div>
    )
  }

  // If session doesn't exist or if they already have a phone, send them away
  // (In a real app, layout or middleware prevents them from seeing a flash of this)
  if (session && session.user?.phone) {
    router.push("/dashboard")
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id) {
      setError("User ID is missing from your session. Please log out and log back in.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/users/${session.user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.accessToken}`
        },
        body: JSON.stringify({ phone }),
      })

      if (!res.ok) {
        throw new Error("Failed to update phone number")
      }

      setSuccess(true)
      
      // Update NextAuth session
      await update({ phone })
      
      // Navigate to dashboard
      router.push("/dashboard")
      router.refresh() // Ensure dashboard layout re-evaluates session
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")
      setIsLoading(false)
    }
  }

  // Show loading state while session initializes
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <UfitGoLogo className="mb-6 h-10 w-auto" />
          <h1 className="font-serif text-2xl font-bold text-foreground">Just One More Step</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We need your phone number to secure your account and set up your wallet.
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-xl text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-semibold text-foreground/80">Phone Number</label>
            <Input 
              id="phone" 
              type="tel" 
              placeholder="+2348123456789"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="h-12 rounded-xl"
            />
          </div>
          
          <Button type="submit" className="w-full h-12 rounded-xl" disabled={isLoading || success}>
            {isLoading || success ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : "Complete Setup"}
          </Button>
        </form>
      </div>
    </div>
  )
}
