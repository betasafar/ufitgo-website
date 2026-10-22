import { ArrowRight } from "lucide-react"
import { PackageCard } from "@/components/package-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { RetryButton } from "@/components/retry-button"
import { revalidatePackages } from "@/app/actions"
import { fetchPublicHomeFeed } from "@/lib/api"
import { mapPublicPackage } from "@/lib/packages"
import { type HomeSection, packageCollectionHref } from "@/lib/package-discovery"

export async function FeaturedPackages() {
  let sections: HomeSection[] = []
  let error = false

  try {
    const data = await fetchPublicHomeFeed()
    // This is the website's existing experience placement, not a mobile Home replacement.
    sections = data.sections.filter((section) => section.kind !== "advert")
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
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.id}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="text-2xl font-serif font-semibold">{section.title}</h3>
                  <a href={packageCollectionHref(section.filters)} className="inline-flex items-center gap-2 text-sm">
                    See all <ArrowRight className="h-4 w-4" />
                  </a>
                </div>
                {section.packages.length ? (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {section.packages.map(mapPublicPackage).map((pkg, i) => (
                      <ScrollReveal key={pkg.id} delay={i * 150 + 100} className="h-full">
                        <PackageCard pkg={pkg} noImage />
                      </ScrollReveal>
                    ))}
                  </div>
                ) : <p className="text-white/70">No experiences currently available in this collection.</p>}
              </div>
            ))}
            {!sections.length && <p className="text-white/70">No featured experiences currently available.</p>}
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
