"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { RefreshCcw } from "lucide-react"
import { useState } from "react"

export function RetryButton({ action }: { action?: () => Promise<void> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleRetry = async () => {
    setLoading(true)
    try {
      if (action) {
        await action()
      }
      router.refresh()
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button 
      onClick={handleRetry} 
      variant="outline" 
      className="mt-4 gap-2"
      disabled={loading}
    >
      <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      Try Again
    </Button>
  )
}
