import Link from "next/link"
import { BrowsePackagesClient } from "@/components/browse-packages-client"
import { fetchPackageDiscovery, fetchPublicPackages } from "@/lib/api"
import { RetryButton } from "@/components/retry-button"
import { revalidatePackages } from "@/app/actions"
import { mapPublicPackage } from "@/lib/packages"
import { packageCollectionHref, parseDiscoveryFilters } from "@/lib/package-discovery"

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const filters = parseDiscoveryFilters(params)
  const page = Math.max(1, Number.parseInt(String(params.page || "1"), 10) || 1)
  try {
    const [result, discovery] = await Promise.all([
      fetchPublicPackages(page, 12, undefined, filters),
      fetchPackageDiscovery(filters),
    ])
    if (!result.success) throw new Error("Failed to load packages")
    const packages = (result.data || []).map(mapPublicPackage)
    const total = Number(result.meta?.total ?? result.pagination?.total ?? result.total)
    const hasNext = Number.isFinite(total) ? page * 12 < total : packages.length === 12
    const pageHref = (target: number) => `${packageCollectionHref(filters)}&page=${target}`
    return (
      <div className="bg-background min-h-screen">
        <BrowsePackagesClient key={JSON.stringify(filters)} initialPackages={packages} discovery={discovery} filters={filters} />
        <nav aria-label="Package pages" className="mx-auto max-w-7xl px-6 pb-10 flex justify-end gap-6">
          {page > 1 && <Link href={pageHref(page - 1)}>Previous</Link>}
          <span>Page {page}</span>
          {hasNext && <Link href={pageHref(page + 1)}>Next</Link>}
        </nav>
      </div>
    )
  } catch {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-red-500 mb-4 text-lg">Failed to load packages or discovery options. Please try again.</p>
        <RetryButton action={revalidatePackages} />
      </div>
    )
  }
}
