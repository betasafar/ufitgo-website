import { Wallet, Crown, Users, Moon, Plane, ArrowUpRight } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const categories = [
  { label: "Economy", desc: "Value-first journeys", icon: Wallet },
  { label: "Premium", desc: "5-star, Haram views", icon: Crown },
  { label: "Family", desc: "Group-friendly stays", icon: Users },
  { label: "Ramadan", desc: "Blessed-month trips", icon: Moon },
  { label: "Upcoming Departures", desc: "Leaving soon", icon: Plane },
]

export function BrowseCategories() {
  return (
    <section className="bg-secondary/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal>
          <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Browse by category
          </h2>
          <p className="mt-3 max-w-lg text-pretty text-muted-foreground">
            Start from what matters most to you and narrow down the right journey.
          </p>
        </ScrollReveal>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <ScrollReveal key={cat.label} delay={i * 100}>
                <a
                  href="#packages"
                  className="group flex flex-col h-full rounded-2xl border border-border bg-card p-5 transition-colors hover:border-primary/40"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-primary" />
                  </div>
                  <p className="mt-4 font-medium text-foreground">{cat.label}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground flex-grow">{cat.desc}</p>
                </a>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
