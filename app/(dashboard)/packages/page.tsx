import { BrowsePackagesClient } from "@/components/browse-packages-client"
import { fetchPublicPackages } from "@/lib/api"
import { RetryButton } from "@/components/retry-button"
import { revalidatePackages } from "@/app/actions"
import { Package } from "@/lib/packages"
import { resolvePackageImage } from "@/lib/package-image"

export default async function PackagesPage() {
  let packages: Package[] = []
  let error = false

  try {
    // Fetch a large limit for the browse page, or handle pagination
    const data = await fetchPublicPackages(1, 50)
    
    const uniquePackages = Array.from(
      (data?.data || []).reduce((unique: Map<string, any>, apiPkg: any) => {
        const key = [
          apiPkg.operator?.id || apiPkg.operatorId || "unknown",
          apiPkg.title || "untitled",
          apiPkg.type || "unknown",
          apiPkg.serviceLevel || "standard",
          apiPkg.departureDate || "undated",
        ].join("|")
        const existing = unique.get(key)

        if (!existing || Number(apiPkg.capacity || 0) > Number(existing.capacity || 0)) {
          unique.set(key, apiPkg)
        }
        return unique
      }, new Map<string, any>()).values(),
    )

    packages = uniquePackages.map((apiPkg: any) => ({
      id: apiPkg.id.toString(),
      name: apiPkg.title,
      type: apiPkg.type,
      category: apiPkg.serviceLevel,
      operator: apiPkg.operator,
      priceFrom: Number(apiPkg.price) || 0,
      priceOnRequest: Boolean(apiPkg.priceOnRequest) || (Number(apiPkg.price) <= 0 && !(apiPkg.tiers || []).some((tier: any) => Number(tier?.price) > 0)),
      duration: apiPkg.duration,
      departureDate: apiPkg.departureDate,
      departureCity: apiPkg.departingFrom?.split(',')[0] || "Unknown",
      highlights: apiPkg.inclusions || [],
      heroImage: resolvePackageImage(apiPkg.images?.[0], apiPkg.title, apiPkg.slug),
      cardImage: resolvePackageImage(apiPkg.images?.[0], apiPkg.title, apiPkg.slug),
      capacity: apiPkg.capacity == null ? undefined : Number(apiPkg.capacity),
      booked: apiPkg.booked == null ? undefined : Number(apiPkg.booked),
      remainingSlots: apiPkg.remainingSlots == null ? undefined : Number(apiPkg.remainingSlots),
      salesStatus: apiPkg.salesStatus,
      availabilityStatus: apiPkg.availabilityStatus,
    })) || []
  } catch (e) {
    error = true
  }

  return (
    <div className="bg-background min-h-screen">
      {error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-500 mb-4 text-lg">Failed to load packages. Please try again later.</p>
          <RetryButton action={revalidatePackages} />
        </div>
      ) : (
        <BrowsePackagesClient initialPackages={packages} />
      )}
    </div>
  )
}
