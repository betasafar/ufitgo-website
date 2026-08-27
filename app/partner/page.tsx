import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Store, TrendingUp, Users, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react"
import Link from "next/link"

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0a1c12] pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-4xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-6xl mb-6">
              Grow Your Business with <span className="text-[#E5B611]">UfitGo</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 leading-relaxed font-light max-w-3xl mx-auto mb-10">
              Join Nigeria's leading marketplace for Hajj, Umrah, and Ziyarah services. Connect directly with pilgrims, manage your offerings, and build your reputation.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/partner/apply" 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 w-full sm:w-auto shadow-lg"
              >
                Apply to be a Partner
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link 
                href="/partner-commission" 
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-white/20 border border-white/20 w-full sm:w-auto"
              >
                View Commercial Model
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 -mt-16 z-20">
        <div className="container mx-auto px-4 pb-24">
          
          <div className="mx-auto max-w-6xl rounded-3xl bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Partner with Us?</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                UfitGo provides the technology platform to help you reach more customers and manage your services efficiently.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10 mb-16">
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Users className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Reach More Customers</h3>
                <p className="text-slate-600 leading-relaxed">
                  List your services on a dedicated marketplace where customers are actively searching for reliable Hajj and Umrah experiences.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Store className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Full Control</h3>
                <p className="text-slate-600 leading-relaxed">
                  You are the independent provider. Manage your own listings, set your prices, and deliver the service directly to the customer.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">Trusted Platform</h3>
                <p className="text-slate-600 leading-relaxed">
                  Benefit from our integrated third-party payment infrastructure, ensuring secure and reliable transaction processing.
                </p>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-16">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-slate-900 mb-6">How It Works</h2>
                  <ul className="space-y-6">
                    {[
                      { title: "Apply to join", desc: "Submit your application to become a partner." },
                      { title: "Complete review", desc: "Complete our standard review and verification process." },
                      { title: "Get listed", desc: "Get your services listed on the UfitGo platform." },
                      { title: "Connect", desc: "Connect with customers and manage requests." },
                      { title: "Deliver service", desc: "Deliver your service directly to the customer." }
                    ].map((step, idx) => (
                      <li key={idx} className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <CheckCircle2 className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900">{idx + 1}. {step.title}</h4>
                          <p className="text-slate-600">{step.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Ready to start?</h3>
                  <p className="text-slate-600 mb-8">
                    Join hundreds of independent providers already using UfitGo to connect with customers.
                  </p>
                  <Link 
                    href="/partner/apply" 
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Start Your Application
                  </Link>
                </div>
              </div>
            </div>

          </div>
          
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
