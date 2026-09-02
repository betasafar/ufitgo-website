"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { AlertCircle, CheckCircle2, Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function EmailVerificationBanner() {
  const { data: session } = useSession()
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  // If user is verified, or not logged in, don't show the banner
  if (!session?.user || (session.user as any).isVerified || !isVisible) {
    return null
  }

  const handleResend = async () => {
    setIsLoading(true)
    setStatus("idle")
    
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const token = (session as any).accessToken

      const res = await fetch(`${API_URL}/auth/resend-verification`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ email: session.user?.email })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend verification email")
      }

      setStatus("success")
      setMessage("Verification email sent! Please check your inbox.")
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message || "Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-amber-100 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm leading-6 text-amber-900 flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          <strong className="font-semibold">Verify your email</strong>
          <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true"><circle cx="1" cy="1" r="1" /></svg>
          Please verify your email address to unlock all wallet and booking features.
        </p>
        
        {status === "success" ? (
          <span className="flex items-center text-sm font-medium text-emerald-600">
            <CheckCircle2 className="mr-1 h-4 w-4" />
            {message}
          </span>
        ) : status === "error" ? (
          <span className="flex items-center text-sm font-medium text-red-600">
            {message}
            <Button variant="link" size="sm" onClick={handleResend} className="h-auto p-0 px-2 text-red-700 underline">Try again</Button>
          </span>
        ) : (
          <Button 
            onClick={handleResend} 
            disabled={isLoading}
            variant="outline"
            size="sm"
            className="rounded-full bg-white border-green-400 text-green-900 hover:bg-green-100 hover:text-green-950 text-xs h-7 px-3"
          >
            {isLoading && <Loader2 className="mr-1 h-3 w-3 animate-spin" />}
            Resend Email
          </Button>
        )}
      </div>
      <div className="flex flex-1 justify-end">
        <button type="button" onClick={() => setIsVisible(false)} className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
          <span className="sr-only">Dismiss</span>
          <X className="h-4 w-4 text-amber-900" aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
