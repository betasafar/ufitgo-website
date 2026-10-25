"use client"

import { useEffect } from "react"
import { useSession } from "next-auth/react"

export const LAST_AUTH_METHOD_STORAGE_KEY = "ufitgo:last-auth-method"

export type AuthMethod = "credentials" | "google" | "apple"

function isAuthMethod(value: unknown): value is AuthMethod {
  return value === "credentials" || value === "google" || value === "apple"
}

export function LastAuthMethodRecorder() {
  const { data: session, status } = useSession()

  useEffect(() => {
    const authMethod = session?.authMethod
    if (
      status === "authenticated" &&
      session.accessToken &&
      isAuthMethod(authMethod)
    ) {
      localStorage.setItem(LAST_AUTH_METHOD_STORAGE_KEY, authMethod)
    }
  }, [session?.accessToken, session?.authMethod, status])

  return null
}
