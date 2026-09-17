"use client"

import Link from "next/link"
import { IdCard, ShieldCheck, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

// Purely informational — no data capture, no outbound redirects, no offline processing (NIS/App Store compliance).
export default function PassportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <IdCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Passport & Visa Readiness</h1>
          <p className="text-muted-foreground text-sm">
            Ensure your travel documents meet regulatory guidelines well ahead of your departure date.
          </p>
        </div>
      </div>

      <div className="space-y-6 max-w-2xl">
        <div className="flex gap-4 bg-secondary/20 border border-border rounded-2xl p-6">
          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
            <ShieldCheck className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold text-base mb-1">6-Month Validity Requirement</h3>
            <p className="text-sm text-muted-foreground">
              The Nigeria Immigration Service (NIS) requires your international passport to have at least 6 months
              validity from your travel date.
            </p>
          </div>
        </div>

        <div className="flex gap-4 bg-secondary/20 border border-border rounded-2xl p-6">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
            <FileText className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-base mb-1">Ecosystem Visa Hand-Off</h3>
            <p className="text-sm text-muted-foreground">
              Kindly ensure your passport is renewed independently via the official government portal. Once ready,
              clear copies must be uploaded to your secure Travel Docs vault for your chosen tour operator to
              process your visa.
            </p>
          </div>
        </div>

        <Button asChild className="h-12 rounded-xl w-full sm:w-auto px-8">
          <Link href="/dashboard">I Understand</Link>
        </Button>
      </div>
    </div>
  )
}
