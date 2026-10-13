"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Check, Clock3, Copy, Gift, Loader2, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ReferralEntry = {
  id: number
  amount: number | string
  type: string
  status: "PENDING" | "CONFIRMED" | "REVERSED"
  createdAt: string
}

type ReferralSummary = {
  code: string
  balance: { confirmed: number; pending: number }
  history: ReferralEntry[]
}

function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

function rewardLabel(type: string) {
  return type.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())
}

export default function ReferralsPage() {
  const { data: session } = useSession()
  const [summary, setSummary] = useState<ReferralSummary | null>(null)
  const [isEnabled, setIsEnabled] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!session?.accessToken) return

    const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
    const headers = { Authorization: `Bearer ${session.accessToken}` }

    Promise.all([
      fetch(`${API_URL}/system/config`).then((response) => response.json()),
      fetch(`${API_URL}/referrals/me`, { headers }).then((response) => response.ok ? response.json() : Promise.reject(new Error("Referral details are unavailable"))),
    ])
      .then(([configPayload, referralPayload]) => {
        setIsEnabled(configPayload?.data?.features?.enableReferralProgram === true)
        setSummary(referralPayload)
      })
      .catch(() => setError("We could not load your referral details. Please try again."))
      .finally(() => setIsLoading(false))
  }, [session?.accessToken])

  const referralLink = summary && typeof window !== "undefined"
    ? `${window.location.origin}/register?ref=${summary.code}`
    : ""

  const copyReferralLink = async () => {
    if (!referralLink) return
    await navigator.clipboard.writeText(referralLink)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const shareReferralLink = async () => {
    if (!referralLink) return
    if (navigator.share) {
      await navigator.share({ title: "Join me on UfitGo", text: "Use my UfitGo referral code when you join.", url: referralLink })
      return
    }
    await copyReferralLink()
  }

  if (isLoading) {
    return <div className="flex min-h-64 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>
  }

  if (error || !summary) {
    return <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-destructive">{error || "Referral details are unavailable."}</div>
  }

  if (!isEnabled) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="border border-border bg-card p-6">
          <h1 className="text-xl font-bold">Referral program unavailable</h1>
          <p className="mt-2 text-sm text-muted-foreground">Referral rewards are not currently available. Please check back later.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-primary/10 text-primary"><Gift className="h-5 w-5" /></div>
        <div>
          <h1 className="text-2xl font-bold">Refer & earn</h1>
          <p className="mt-1 text-sm text-muted-foreground">Share your code. When a friend joins with it, eligible rewards become booking credit.</p>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.6fr)]">
        <section className="border border-border bg-card p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your referral code</p>
          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
            <code className="flex-1 border border-border bg-secondary/40 px-4 py-3 text-center text-lg font-bold tracking-widest text-foreground">{summary.code}</code>
            <div className="flex gap-2">
              <Button variant="outline" size="lg" onClick={copyReferralLink} className="flex-1 rounded-md sm:flex-none">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied" : "Copy link"}
              </Button>
              <Button size="lg" onClick={shareReferralLink} className="flex-1 rounded-md sm:flex-none"><Share2 className="mr-2 h-4 w-4" />Share</Button>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-2 border border-border bg-card">
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Available credit</p>
            <p className="mt-2 text-xl font-bold text-primary">{formatNaira(Number(summary.balance.confirmed))}</p>
          </div>
          <div className="border-l border-border p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Pending</p>
            <p className="mt-2 text-xl font-bold">{formatNaira(Number(summary.balance.pending))}</p>
          </div>
        </section>
      </div>

      <section className="mt-6 border border-border bg-card">
        <div className="border-b border-border px-5 py-4 sm:px-6"><h2 className="font-bold">Reward activity</h2></div>
        {summary.history.length === 0 ? (
          <p className="px-5 py-8 text-sm text-muted-foreground sm:px-6">Share your referral link to start earning booking credit.</p>
        ) : (
          <div className="divide-y divide-border">
            {summary.history.map((entry) => (
              <div key={entry.id} className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{rewardLabel(entry.type)}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(entry.createdAt).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={entry.status === "CONFIRMED" ? "text-sm font-semibold text-primary" : "text-sm font-semibold text-foreground"}>{formatNaira(Number(entry.amount))}</span>
                  {entry.status === "PENDING" && <Clock3 className="h-4 w-4 text-amber-600" aria-label="Pending" />}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}