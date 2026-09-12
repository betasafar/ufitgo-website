"use client"

import { SessionProvider } from "next-auth/react"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from "react"
import { InactivityTracker } from "./inactivity-tracker"
import { SessionReauthModal } from "./session-reauth-modal"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <InactivityTracker />
        <SessionReauthModal />
        {children}
      </SessionProvider>
    </QueryClientProvider>
  )
}
