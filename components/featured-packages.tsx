import { ArrowRight } from "lucide-react"
import { PackageCard } from "@/components/package-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { RetryButton } from "@/components/retry-button"
import { revalidatePackages } from "@/app/actions"
import { fetchPublicPackages } from "@/lib/api"
import { type Package } from "@/lib/packages"

export async function FeaturedPackages() {
  let packages: Package[] = []
  let error = false

  try {
    const data = await fetchPublicPackages(1, 3)
    // Format API data to match frontend Package interface
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
    <section id="packages" className="scroll-mt-20 bg-[#0a1c12] py-20 sm:py-24 dark text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="text-left mb-12">
          <p className="text-sm font-bold tracking-widest text-[#E5B611] uppercase mb-4">Featured Experiences</p>
          <h2 className="text-balance font-serif text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Discover Hajj & Umrah experiences offered by independent providers
          </h2>
          <p className="text-lg text-white/70 max-w-2xl">
            Browse available experiences, choose what works for you and make your booking through UfitGo.
          </p>
        </ScrollReveal>

        {error ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-red-400 mb-2">Failed to load packages. Please try again later.</p>
            <RetryButton action={revalidatePackages} />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {packages.map((pkg, i) => (
              <ScrollReveal key={pkg.id} delay={i * 150 + 100}>
                <PackageCard pkg={pkg} noImage />
              </ScrollReveal>
            ))}
          </div>
        )}

        <ScrollReveal delay={400} className="mt-12 flex justify-center">
          <a
            href="/packages"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-transparent px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse All Experiences
            <ArrowRight className="h-4 w-4" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
