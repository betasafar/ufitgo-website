"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"

export function GuestProtectedPrompt() {
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const router = useRouter()

  const handleLoginSuccess = () => {
    setIsLoginOpen(false)
    window.location.reload()
  }

  return (
    <div className="flex h-[80vh] flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-8 w-8 text-primary" />
        </div>
        <h2 className="mb-2 font-serif text-2xl font-bold text-foreground">Authentication Required</h2>
        <p className="mb-8 text-muted-foreground">
          You need to be signed in to view this page. Please log in or create an account to continue.
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            className="w-full h-12 rounded-xl text-base" 
            onClick={() => setIsLoginOpen(true)}
          >
            Log In
          </Button>
          <Link href="/register" className="w-full">
            <Button variant="outline" className="w-full h-12 rounded-xl text-base">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl bg-transparent">
          <LoginForm onSuccess={handleLoginSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
