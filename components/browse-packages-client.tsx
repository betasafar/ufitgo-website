"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { type Package } from "@/lib/packages"
import { type DiscoveryFilters, type DiscoveryMetadata, packageCollectionHref } from "@/lib/package-discovery"
import { PackageCard } from "@/components/package-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function BrowsePackagesClient({ initialPackages, discovery, filters }: {
  initialPackages: Package[]
  discovery: DiscoveryMetadata
  filters: DiscoveryFilters
}) {
  const [showFilters, setShowFilters] = useState(false)
  const seasonal = filters.type === "hajj" || filters.season === "ramadan"
  const [yearMode, setYearMode] = useState<string>(filters.yearMode || "default")
  const allYearsHref = packageCollectionHref({ ...filters, yearMode: "all", seasonYear: undefined, year: undefined })
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:hidden">
          <button onClick={() => setShowFilters(!showFilters)} className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium">
            <span className="flex items-center gap-2"><SlidersHorizontal className="h-4 w-4" />Filters</span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
        <aside className={cn("w-full lg:w-64 shrink-0 space-y-6 border-b border-border pb-8 lg:border-b-0 lg:border-r lg:pr-8", showFilters ? "block" : "hidden lg:block")}>
          <div>
            <h2 className="text-sm font-medium mb-3">Package type</h2>
            <div className="flex flex-wrap gap-2">
              {discovery.categories.map((category) => (
                <Link
                  key={category.id}
                  href={category.id === "all" ? "/packages" : packageCollectionHref(category.id === "ramadan"
                    ? { type: "umrah", season: "ramadan", yearMode: "default" }
                    : { type: category.id, yearMode: "default" })}
                  aria-current={(category.id === "all" ? !filters.type : category.id === "ramadan" ? filters.season === "ramadan" : filters.type === category.id && !filters.season) ? "page" : undefined}
                  className="rounded-lg border px-3 py-2 text-sm aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
                >{category.label}</Link>
              ))}
            </div>
          </div>
          <form action="/packages" method="get" key={JSON.stringify(filters)} className="space-y-5">
            {filters.type && <input type="hidden" name="type" value={filters.type} />}
            {filters.season && <input type="hidden" name="season" value={filters.season} />}
            <label className="block text-sm space-y-2">
              <span className="flex items-center gap-2"><Search className="h-4 w-4" />Package title</span>
              <Input name="title" defaultValue={filters.title} placeholder="Search packages..." />
            </label>
            <label className="block text-sm space-y-2">
              <span>Year</span>
              <select name="yearMode" value={yearMode} onChange={(e) => setYearMode(e.target.value)} className="w-full rounded-md border bg-background p-2">
                <option value="default">{seasonal ? `Configured season${discovery.defaultYear ? ` (${discovery.defaultYear})` : ""}` : "All upcoming dates"}</option>
                <option value="all">All upcoming years</option>
                <option value="specific">Choose a year</option>
              </select>
            </label>
            {yearMode === "specific" && (
              <label className="block text-sm space-y-2">
                <span>{seasonal ? "Selling season year" : "Departure year"}</span>
                <select name={seasonal ? "seasonYear" : "year"} defaultValue={filters.seasonYear ?? filters.year ?? ""} required className="w-full rounded-md border bg-background p-2">
                  <option value="" disabled>Select a year</option>
                  {Array.from(new Set([...discovery.years, ...(filters.seasonYear ? [filters.seasonYear] : []), ...(filters.year ? [filters.year] : [])])).map((year) => (
                    <option key={year} value={year}>{year}{discovery.counts.find((item) => item.year === year) ? ` (${discovery.counts.find((item) => item.year === year)!.count})` : ""}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="block text-sm space-y-2"><span>Max budget (₦)</span><Input name="budget" type="number" min="0" defaultValue={filters.budget} placeholder="Any budget" /></label>
            <label className="block text-sm space-y-2">
              <span>Service level</span>
              <select name="serviceLevel" defaultValue={filters.serviceLevel || ""} className="w-full rounded-md border bg-background p-2">
                <option value="">Any service level</option>
                {["standard", "family", "vip", "economy", "budget", "premium", "luxury"].map((level) => <option key={level} value={level}>{level}</option>)}
              </select>
            </label>
            <label className="block text-sm space-y-2"><span>Departure location</span><Input name="location" defaultValue={filters.location} placeholder="Any location" /></label>
            <label className="block text-sm space-y-2">
              <span>Departure month</span>
              <select name="month" defaultValue={filters.month || ""} className="w-full rounded-md border bg-background p-2">
                <option value="">Any month</option>
                {["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"].map((month) => <option key={month} value={month}>{month}</option>)}
              </select>
            </label>
            <button type="submit" className="rounded-lg bg-primary text-primary-foreground px-4 py-2">Apply filters</button>
            <Link href="/packages" className="ml-4 text-sm underline">Reset</Link>
          </form>
        </aside>
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl font-semibold mb-3">Browse packages</h1>
          {seasonal && filters.yearMode === "default" && (
            <p className="text-sm text-muted-foreground mb-4">
              {discovery.defaultYear ? `Selling season ${discovery.defaultYear}` : "No default selling season available"} · {discovery.source}
              {discovery.source === "fallback" && discovery.configuredYear != null && ` (configured: ${discovery.configuredYear})`}
            </p>
          )}
          {discovery.warnings.map((warning, index) => <p key={index} role="status" className="text-sm text-amber-700 mb-2">{warning}</p>)}
          <p className="text-sm text-muted-foreground mb-6">{initialPackages.length} packages on this page</p>
          {initialPackages.length ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{initialPackages.map((pkg) => <PackageCard key={pkg.id} pkg={pkg} />)}</div>
          ) : (
            <div className="rounded-xl border border-border p-12 text-center">
              <h2 className="text-lg font-medium mb-2">No packages match these filters</h2>
              <p className="text-muted-foreground mb-4">Try another selling season or view all upcoming years.</p>
              <Link href={allYearsHref} className="underline">View all upcoming years</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
