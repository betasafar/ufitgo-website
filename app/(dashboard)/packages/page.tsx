import { BrowsePackagesClient } from "@/components/browse-packages-client"
import { fetchPublicPackages } from "@/lib/api"
import { RetryButton } from "@/components/retry-button"
import { revalidatePackages } from "@/app/actions"
import { Package } from "@/lib/packages"

export default async function PackagesPage() {
  let packages: Package[] = []
  let error = false

  try {
    // Fetch a large limit for the browse page, or handle pagination
    const data = await fetchPublicPackages(1, 50)
    
    packages = data?.data?.map((apiPkg: any) => ({
      id: apiPkg.id.toString(),
      name: apiPkg.title,
      type: apiPkg.type,
      category: apiPkg.serviceLevel,
      operator: apiPkg.operator,
      priceFrom: parseFloat(apiPkg.price),
      duration: apiPkg.duration,
      departureDate: apiPkg.departureDate,
      departureCity: apiPkg.departingFrom?.split(',')[0] || "Unknown",
      highlights: apiPkg.inclusions || [],
      heroImage: apiPkg.images?.[0] || "/placeholder.svg",
      cardImage: apiPkg.images?.[0] || "/placeholder.svg",
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
