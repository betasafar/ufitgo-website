import { ShieldCheck, UserCheck, LayoutDashboard, HeartHandshake, ArrowRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const features = [
  {
    title: "NAHCON-Licensed Providers",
    description: "Every package and travel operator is strictly vetted and verified against national licensing boards.",
    icon: <ShieldCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Secure Tier-1 Banking",
    description: "Your bookings and savings are securely held in trust via regulated banking partners, ensuring maximum financial protection.",
    icon: <UserCheck className="h-6 w-6 text-primary" />,
  },
  {
    title: "Complete Travel Ecosystem",
    description: "From visa assistance to in-country logistics, manage your entire journey confidently from a single platform.",
    icon: <LayoutDashboard className="h-6 w-6 text-primary" />,
  },
  {
    title: "Verified Local Amenities",
    description: "Connect instantly with approved local services, reducing the uncertainty of international travel.",
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
              Don't just travel. Travel with absolute security and verified partners.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 text-pretty">
              Booking travel logistics and essential services should be seamless and safe. UfitGo guarantees peace of mind by partnering exclusively with NAHCON-licensed providers and securing your funds through regulated tier-1 banking infrastructure.
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
