import { Search, UserCheck, FileText, CalendarCheck, Settings, ArrowRight, ArrowDown } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const customerSteps = [
  { icon: Search, title: "Explore verified services", desc: "Discover travel packages and amenities from strictly vetted, licensed operators." },
  { icon: UserCheck, title: "Select your journey", desc: "Choose the provider and logistics that best suit your travel needs." },
  { icon: FileText, title: "Review secure terms", desc: "Review transparent service details and banking-backed guarantees." },
  { icon: CalendarCheck, title: "Submit secure booking", desc: "Lock in your request using our secure banking-integrated booking infrastructure." },
  { icon: Settings, title: "Travel with confidence", desc: "Manage your itinerary and tracking effortlessly through the UfitGo platform." },
]

const providerSteps = [
  { icon: FileText, title: "Apply to join", desc: "Submit your application to become a partner." },
  { icon: UserCheck, title: "Complete review", desc: "Complete the required review process." },
  { icon: Search, title: "Get listed", desc: "Get listed on the platform." },
  { icon: CalendarCheck, title: "Connect", desc: "Connect with customers." },
  { icon: Settings, title: "Deliver service", desc: "Deliver your service directly to the customer." },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-20 bg-secondary/50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="max-w-2xl mx-auto text-center">
          <p className="text-sm font-medium text-primary">How it works</p>
          <h2 className="mt-2 text-balance font-serif text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Connecting customers and independent providers
          </h2>
        </ScrollReveal>

        <div className="mt-12">
          <Tabs defaultValue="customers" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="customers">For Customers</TabsTrigger>
                <TabsTrigger value="providers">For Providers</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="customers">
              <div className="grid gap-4 md:grid-cols-5">
                {customerSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <ScrollReveal key={step.title} delay={i * 100} className="h-full">
                      <div className="flex flex-col items-center text-center p-4 bg-card rounded-2xl border border-border h-full">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 text-sm">{i + 1}. {step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
              <ScrollReveal delay={600} className="mt-10 flex justify-center">
                <a
                  href="/#packages"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Explore Services
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </ScrollReveal>
            </TabsContent>

            <TabsContent value="providers">
              <div className="grid gap-4 md:grid-cols-5">
                {providerSteps.map((step, i) => {
                  const Icon = step.icon
                  return (
                    <ScrollReveal key={step.title} delay={i * 100} className="h-full">
                      <div className="flex flex-col items-center text-center p-4 bg-card rounded-2xl border border-border h-full">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary mb-4">
                          <Icon className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-2 text-sm">{i + 1}. {step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                    </ScrollReveal>
                  )
                })}
              </div>
              <ScrollReveal delay={600} className="mt-10 flex justify-center">
                <a
                  href="/partner"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-foreground px-8 text-sm font-semibold text-background transition-colors hover:bg-foreground/90"
                >
                  Become a Partner
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </ScrollReveal>
            </TabsContent>
          </Tabs>
        </div>

        <ScrollReveal delay={500} className="mt-16 flex flex-col items-center">
          <div className="bg-card p-6 rounded-3xl border border-border w-full max-w-3xl flex flex-col md:flex-row items-center justify-between text-center md:text-left gap-6">
            <div className="flex flex-col items-center w-full">
              <span className="font-semibold text-foreground">Customer</span>
            </div>
            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground flex-shrink-0" />
            <ArrowDown className="block md:hidden h-6 w-6 text-muted-foreground flex-shrink-0" />
            
            <div className="flex flex-col items-center w-full">
              <span className="font-semibold text-primary">UfitGo Platform</span>
            </div>
            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground flex-shrink-0" />
            <ArrowDown className="block md:hidden h-6 w-6 text-muted-foreground flex-shrink-0" />
            
            <div className="flex flex-col items-center w-full">
              <span className="font-semibold text-foreground">Independent Provider</span>
            </div>
            <ArrowRight className="hidden md:block h-6 w-6 text-muted-foreground flex-shrink-0" />
            <ArrowDown className="block md:hidden h-6 w-6 text-muted-foreground flex-shrink-0" />
            
            <div className="flex flex-col items-center w-full">
              <span className="font-semibold text-foreground">Service Delivered</span>
            </div>
          </div>
          
          <p className="mt-6 text-sm text-muted-foreground bg-secondary/80 px-4 py-2 rounded-full text-center">
            All bookings and target savings made through UfitGo are securely processed and held in trust by regulated banking partners.
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}
