import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CheckCircle2 } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0a1c12] pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-7xl mb-6">
              About <span className="text-[#E5B611]">UfitGo</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto">
              UfitGo is a digital marketplace and booking platform designed to make it easier for users to discover and connect with independent service providers.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 -mt-16 z-20">
        <div className="container mx-auto px-4 pb-24">
          
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            <p className="text-xl text-slate-700 leading-relaxed mb-12 text-center">
              Through UfitGo, users can explore available services, compare options, make bookings and manage their activity in one place.
            </p>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Role</h2>
                <div className="prose prose-lg text-slate-600">
                  <p>
                    We build the technology that connects customers and providers.
                  </p>
                  <p>
                    Independent providers are responsible for the services they offer and deliver through the platform.
                  </p>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Platform</h2>
                <p className="text-lg text-slate-600 mb-6">
                  UfitGo provides tools for:
                </p>
                <ul className="space-y-4">
                  {[
                    "Service discovery",
                    "Provider listings",
                    "Booking",
                    "Transaction tracking",
                    "Customer and provider interaction"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
                      <span className="text-slate-700 text-lg">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
