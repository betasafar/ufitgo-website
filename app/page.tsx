import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WhyUfitGo } from "@/components/why-ufitgo"
import { ServicesSection } from "@/components/services-section"
// import { FeaturedPackages } from "@/components/featured-packages"
import { HowItWorks } from "@/components/how-it-works"
import { OperatorCta } from "@/components/operator-cta"
import { MobileAppCta } from "@/components/mobile-app-cta"
import { SiteFooter } from "@/components/site-footer"
// import { TargetSavingsCta } from "@/components/target-savings-cta"

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'UfitGo',
    url: 'https://ufitgo.ng',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://ufitgo.ng/compare?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
    publisher: {
      '@type': 'Organization',
      name: 'UfitGo',
      url: 'https://ufitgo.ng',
      logo: 'https://ufitgo.ng/logo.png', // Update with actual absolute logo URL
    },
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparentOnTop={true} />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Hero />
        {/* <FeaturedPackages /> */}
        <ServicesSection />
        <WhyUfitGo />
        <HowItWorks />
        {/* <TargetSavingsCta /> */}
        <MobileAppCta />
        <OperatorCta />
      </main>
      <SiteFooter />
    </div>
  )
}
