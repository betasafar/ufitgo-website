"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  const { update } = useSession()

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("Verifying your email address...")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("No verification token provided. Please check the link in your email.")
      return
    }

    const verifyToken = async () => {
      try {
        const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
        const res = await fetch(`${API_URL}/auth/verify-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || "Failed to verify email. The link may have expired.")
        }

        setStatus("success")
        setMessage("Your email address has been successfully verified!")
        
        // Update the NextAuth session so the banner disappears
        await update()
      } catch (err: any) {
        setStatus("error")
        setMessage(err.message || "An unexpected error occurred during verification.")
      }
    }

    verifyToken()
  }, [token, update])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm text-center">
        {status === "loading" && (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <h1 className="text-xl font-semibold">Verifying Email</h1>
            <p className="text-muted-foreground">{message}</p>
          </div>
        )}

        {status === "success" && (
          <div className="flex flex-col items-center gap-4">
            <CheckCircle2 className="h-16 w-16 text-emerald-500" />
            <h1 className="text-2xl font-semibold text-emerald-600">Verified!</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button 
              className="mt-4 w-full h-12 rounded-xl text-base" 
              onClick={() => router.push("/dashboard")}
            >
              Continue to Dashboard
            </Button>
          </div>
        )}

        {status === "error" && (
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-semibold text-red-600">Verification Failed</h1>
            <p className="text-muted-foreground">{message}</p>
            <Button 
              variant="outline"
              className="mt-4 w-full h-12 rounded-xl text-base" 
              onClick={() => router.push("/dashboard")}
            >
              Return to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  )
}
