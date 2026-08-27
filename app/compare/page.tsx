import { Suspense } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CompareClient } from "@/components/compare-client"

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Suspense fallback={<div className="p-20 text-center">Loading comparison...</div>}>
          <CompareClient />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  )
}
