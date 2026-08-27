import { ShieldCheck, UserCheck, LayoutDashboard, HeartHandshake, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const features = [
  {
    title: "Provider Review",
    description: "Providers may go through applicable identity, business, and eligibility checks before being listed.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Clear Provider Information",
    description: "See who you are dealing with before making a booking or transaction request.",
    icon: <UserCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Everything in One Place",
    description: "Discover services, manage bookings, and keep track of your activity from a single platform.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
  },
  {
    title: "Built for More Confidence",
    description: "UfitGo is designed to reduce the uncertainty of dealing with unknown providers online.",
    icon: <HeartHandshake className="h-6 w-6 text-primary" />,
  },
]

export function WhyUfitGo() {
  return (
    <section id="why" className="py-24 bg-secondary/30 scroll-mt-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <ScrollReveal className="lg:w-1/2">
            <p className="text-sm font-bold tracking-widest text-primary uppercase mb-4">Why UfitGo</p>
            <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight text-foreground mb-6">
              Don't just find a provider. Find one with more confidence.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
              Finding services online can be difficult. You may not know who to trust, whether a provider is legitimate, or who is actually behind the service.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mb-10 text-pretty">
              UfitGo helps simplify the process by bringing provider discovery, relevant information, booking, and transaction tracking into one platform.
            </p>
            
            <a
              href="/#packages"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors"
            >
              Explore Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </ScrollReveal>

          <div className="lg:w-1/2 grid sm:grid-cols-2 gap-6 w-full">
            {features.map((feature, idx) => (
              <ScrollReveal key={idx} delay={idx * 150} className="bg-card rounded-3xl p-6 border border-border shadow-sm">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </ScrollReveal>
            ))}
          </div>
          
        </div>
        
      </div>
    </section>
  )
}
