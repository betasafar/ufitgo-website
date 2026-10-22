export type DiscoveryFilters = {
  type?: string
  season?: "ramadan"
  seasonYear?: number
  year?: number
  yearMode?: "default" | "all" | "specific"
  title?: string
  budget?: string
  serviceLevel?: string
  location?: string
  month?: string
}

export type DiscoveryMetadata = {
  categories: { id: string; label: string }[]
  years: number[]
  defaultYear: number | null
  configuredYear: number | null
  source: "manual" | "automatic" | "fallback" | "all"
  counts: { year: number; count: number }[]
  warnings: string[]
}

export type HomeSection = {
  id: string
  kind: "recommendations" | "hajj" | "ramadan" | "featured" | "advert"
  title: string
  packages: any[]
  filters: Pick<DiscoveryFilters, "type" | "season" | "seasonYear" | "yearMode">
  source: string
  campaign?: { id: string; startsAt: string; endsAt: string }
}

export function discoveryQuery(filters: DiscoveryFilters) {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries(filters)) {
    if (value !== undefined && value !== "") query.set(key, String(value))
  }
  return query
}

export function packageCollectionHref(filters: DiscoveryFilters) {
  return `/packages?${discoveryQuery(filters)}`
}

// URL choices are explicit; configured defaults are resolved only by the API.
export function parseDiscoveryFilters(params: Record<string, string | string[] | undefined>): DiscoveryFilters {
  const value = (key: string) => typeof params[key] === "string" ? params[key] as string : ""
  const type = value("type") === "hajj" || value("type") === "umrah" ? value("type") : undefined
  const season = type === "umrah" && value("season") === "ramadan" ? "ramadan" as const : undefined
  const yearMode = value("yearMode") === "all" ? "all" : value("yearMode") === "specific" ? "specific" : "default"
  const seasonal = type === "hajj" || season === "ramadan"
  const rawYear = value(seasonal ? "seasonYear" : "year")
  const year = /^\d{4}$/.test(rawYear) && Number(rawYear) >= 2000 && Number(rawYear) <= 2200 ? Number(rawYear) : undefined
  const resolvedMode = yearMode === "specific" && year === undefined ? "default" : yearMode
  return {
    type, season, yearMode: resolvedMode,
    ...(resolvedMode === "specific" ? seasonal ? { seasonYear: year } : { year } : {}),
    ...Object.fromEntries(["title", "budget", "serviceLevel", "location", "month"]
      .map((key) => [key, value(key)]).filter(([, text]) => text)),
  }
}
