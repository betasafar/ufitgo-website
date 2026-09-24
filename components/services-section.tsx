import { ArrowRight, IdCard, MapPin } from "lucide-react"
import { ScrollReveal } from "@/components/scroll-reveal"

const services = [
  {
    title: "Hajj & Umrah",
    description: "Book trusted group or private Hajj and Umrah experiences.",
    icon: <MapPin className="h-6 w-6 text-primary" />,
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Travel Amenities Directory",
    description: "Locate verified local services, specialized travel operators, and essential destination guides near you.",
    icon: <MapPin className="h-6 w-6 text-primary" />,
    span: "md:col-span-2 lg:col-span-2",
  },
  {
    title: "Passport Assistance",
    description: "Connect with verified immigration partners to process your international passport smoothly.",
    icon: <IdCard className="h-6 w-6 text-primary" />,
    span: "md:col-span-2 lg:col-span-2",
  },
  /*
  {
    title: "Transport",
    description: "Airport transfers, intercity trips, and reliable local transportation.",
    icon: <Car className="h-6 w-6 text-primary" />,
    href: "/services/transport",
    span: "md:col-span-1 lg:col-span-1",
  },
  {
    title: "SIM & Connectivity",
    description: "Get a Saudi SIM or eSIM ahead of time and stay connected instantly upon arrival.",
    icon: <Wifi className="h-6 w-6 text-primary" />,
    href: "/services/sim",
    span: "md:col-span-1 lg:col-span-1",
  },
  */
]

const whatsappNumber = "2348148804448"

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ScrollReveal className="mb-12 max-w-2xl">
          <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Everything You Need for Your Journey
          </h2>
          <p className="text-zinc-400 text-lg">
            From booking your package to landing safely in Saudi Arabia, UfitGo gives you access to a complete ecosystem of trusted pilgrim services.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ScrollReveal key={index} delay={index * 150} duration={600} className={service.span}>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi UfitGo, I am interested in ${service.title}.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-zinc-700 hover:bg-zinc-800/80 hover:shadow-2xl hover:shadow-primary/5"
              >
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 shadow-inner transition-colors group-hover:border-primary/30">
                  {service.icon}
                </div>

                <h3 className="mb-3 font-serif text-xl font-semibold tracking-tight text-white transition-colors group-hover:text-primary-foreground">
                  {service.title}
                </h3>

                <p className="mb-8 flex-grow text-sm leading-relaxed text-zinc-400">
                  {service.description}
                </p>

                <span className="mt-auto flex items-center text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
