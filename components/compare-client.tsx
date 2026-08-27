"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowRight, Check, X, ShieldCheck, Sparkles, TrendingDown, Info, Loader2 } from "lucide-react"
import { formatNaira } from "@/lib/packages"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useQuery } from "@tanstack/react-query"
import { fetchPackageComparison } from "@/lib/api"



export function CompareClient() {
  const searchParams = useSearchParams()
  const id = searchParams.get("id")

  const { data: queryData, isLoading, error } = useQuery({
    queryKey: ['packageComparison', id],
    queryFn: () => fetchPackageComparison(id!),
    enabled: !!id
  })

  if (!id) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center">
        <h1 className="font-serif text-3xl font-bold text-foreground">No Package Selected</h1>
        <p className="mt-2 text-muted-foreground">Select a package from the Browse page to compare alternatives.</p>
        <Link href="/packages" className={cn(buttonVariants(), "mt-6 rounded-full")}>
          Browse Packages
        </Link>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    )
  }

  if (error || !queryData?.data) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-24 text-center text-red-500">
        <h1 className="font-serif text-3xl font-bold mb-4">Error loading comparison</h1>
        <p>Could not fetch comparison data for this package. Please try again later.</p>
      </div>
    )
  }

  const data = queryData.data
  const cheaper = data.comparison.cheaperAlternatives[0]
  const premium = data.comparison.premiumAlternatives[0]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      
      {/* Value Summary Banner */}
      <div className="mb-12 rounded-2xl bg-primary/5 p-6 border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-primary/20 p-2 text-primary mt-1">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground font-serif mb-2">Smart Value Summary</h2>
            <ul className="space-y-1">
              {data.valueSummary.map((summary: string, idx: number) => (
                <li key={idx} className="text-muted-foreground flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary/50"></span>
                  {summary}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Compare Alternatives
        </h1>
        <p className="mt-2 text-muted-foreground">
          See what you miss by paying less, and what you gain by paying more.
        </p>
      </div>

      {/* Delta-Focused Tiered UI */}
      <div className="grid gap-6 lg:grid-cols-3 lg:items-center">
        
        {/* CHEAPER CARD */}
        {cheaper && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-100 px-2.5 py-1 text-xs font-semibold text-orange-800">
                <TrendingDown className="h-3.5 w-3.5" />
                Save {formatNaira(data.primary.price - cheaper.price)}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">
              {cheaper.title}
            </h3>
            {cheaper.operator && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                {cheaper.operator.name}
                {cheaper.operator.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
              </p>
            )}
            <div className="font-serif text-2xl font-bold text-foreground mb-6">
              {formatNaira(cheaper.price)}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">What you miss</p>
              <ul className="space-y-3 mb-6">
                {cheaper.missing.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground line-through decoration-red-500/50">
                    <X className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href={`/packages/${cheaper.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full")}>
              View Details
            </Link>
          </div>
        )}

        {/* PRIMARY CARD (Highlighted) */}
        <div className="rounded-2xl border-2 border-primary bg-card p-8 shadow-xl flex flex-col h-[105%] relative z-10 lg:-mx-2">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Your Selection
          </div>
          
          <div className="mb-2">
            <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 text-xs font-semibold uppercase tracking-wider">
              {data.primary.serviceLevel}
            </span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-foreground mb-1">
            {data.primary.title}
          </h3>
          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
            {data.primary.operator.name}
            {data.primary.operator.verified && <ShieldCheck className="h-4 w-4 text-primary" />}
          </p>
          <div className="font-serif text-3xl font-bold text-foreground mb-6 text-primary">
            {formatNaira(data.primary.price)}
          </div>
          
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider">Included in this package</p>
            <ul className="space-y-3 mb-6">
              {data.primary.inclusions.map((item: string, idx: number) => (
                <li key={idx} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          
          <Link href={`/packages/${data.primary.id}`} className={cn(buttonVariants(), "w-full rounded-full")}>
            Continue with this package
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>

        {/* PREMIUM CARD */}
        {premium && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col h-full">
            <div className="mb-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-1 text-xs font-semibold text-purple-800">
                <Sparkles className="h-3.5 w-3.5" />
                + {formatNaira(premium.price - data.primary.price)}
              </span>
            </div>
            <h3 className="font-serif text-xl font-bold text-foreground mb-1">
              {premium.title}
            </h3>
            {premium.operator && (
              <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
                {premium.operator.name}
                {premium.operator.verified && <ShieldCheck className="h-3.5 w-3.5 text-primary" />}
              </p>
            )}
            <div className="font-serif text-2xl font-bold text-foreground mb-6">
              {formatNaira(premium.price)}
            </div>
            
            <div className="flex-1">
              <p className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">What you gain</p>
              <ul className="space-y-3 mb-6">
                {premium.extra.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm font-medium text-purple-900">
                    <Check className="h-4 w-4 text-purple-600 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            
            <Link href={`/packages/${premium.id}`} className={cn(buttonVariants({ variant: "outline" }), "w-full rounded-full")}>
              View Upgrade
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}
