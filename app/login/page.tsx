"use client"
import { Suspense } from "react"

import { LoginForm } from "@/components/login-form"

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <LoginForm />
      </div>
    </Suspense>
  )
}
