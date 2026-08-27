import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { WhyUfitGo } from "@/components/why-ufitgo"
import { ServicesSection } from "@/components/services-section"
import { FeaturedPackages } from "@/components/featured-packages"
import { HowItWorks } from "@/components/how-it-works"
import { OperatorCta } from "@/components/operator-cta"
import { MobileAppCta } from "@/components/mobile-app-cta"
import { SiteFooter } from "@/components/site-footer"
import { TargetSavingsCta } from "@/components/target-savings-cta"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparentOnTop={true} />
      <main>
        <Hero />
        <FeaturedPackages />
        <ServicesSection />
        <WhyUfitGo />
        <HowItWorks />
        <TargetSavingsCta />
        <MobileAppCta />
        <OperatorCta />
      </main>
      <SiteFooter />
    </div>
  )
}
