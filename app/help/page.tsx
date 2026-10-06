import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Mail, MessageSquare, PhoneCall, HelpCircle, ArrowRight, MapPin } from "lucide-react"

export default function SupportPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary pt-20 pb-32">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6 backdrop-blur-sm">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              How can we help?
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/90 font-light">
              Whether you have a question about a package, your booking, or becoming a partner, our team is here for you.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 -mt-16 z-20">
        <div className="container mx-auto px-4 pb-24">
          
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Contact Card 1 */}
              <div className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                  <Mail className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Email Support</h3>
                <p className="text-sm text-slate-500 mb-6">Best for detailed inquiries and sending documents.</p>
                <a href="mailto:support@ufitgo.ng" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                  support@ufitgo.ng <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Contact Card 2 */}
              <div className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a1c12]/5 text-[#0a1c12]">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Partner Relations</h3>
                <p className="text-sm text-slate-500 mb-6">For tour operators, agents, and guides partnering with us.</p>
                <a href="mailto:partners@ufitgo.ng" className="inline-flex items-center text-sm font-medium text-[#0a1c12] hover:opacity-80">
                  partners@ufitgo.ng <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Contact Card 3 */}
              <div className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Phone & WhatsApp</h3>
                <p className="text-sm text-slate-500 mb-6">For urgent issues and immediate assistance during travel.</p>
                <a href="tel:+2348148804448" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700">
                  +234 8148 804 448 <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

            <section className="mt-16 border-y border-slate-200 py-10">
              <div className="mb-8 max-w-2xl">
                <p className="text-sm font-semibold uppercase tracking-wide text-primary">Visit UfitGo</p>
                <h2 className="mt-2 text-3xl font-bold text-slate-900">Our offices</h2>
                <p className="mt-3 text-slate-600">Speak with our team in person at either Lagos location.</p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                <div className="border-l-2 border-primary pl-5">
                  <div className="flex items-center gap-2 text-slate-900">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Main Office</h3>
                  </div>
                  <address className="mt-3 not-italic leading-7 text-slate-600">
                    Shop 47 First Floor, Off Awodi-Ora Estate, Oja Market,<br />
                    Ajeromi-Ifelodun, Lagos.
                  </address>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Shop%2047%20First%20Floor%2C%20Off%20Awodi-Ora%20Estate%2C%20Oja%20Market%2C%20Ajeromi-Ifelodun%2C%20Lagos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Get directions <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>

                <div className="border-l-2 border-primary pl-5">
                  <div className="flex items-center gap-2 text-slate-900">
                    <MapPin className="h-5 w-5 text-primary" />
                    <h3 className="font-semibold">Branch Office</h3>
                  </div>
                  <address className="mt-3 not-italic leading-7 text-slate-600">
                    Suite F10, 23 Road Market, opposite Mobil Filling Station,<br />
                    Festac Town, Lagos.
                  </address>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Suite%20F10%2C%2023%20Road%20Market%2C%20Festac%20Town%2C%20Lagos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:underline"
                  >
                    Get directions <ArrowRight className="ml-1 h-4 w-4" />
                  </a>
                </div>
              </div>
            </section>

            {/* FAQ Section */}
            <div className="mt-24 rounded-3xl bg-white p-8 md:p-12 ring-1 ring-slate-100 shadow-sm animate-in fade-in duration-1000 delay-300">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-900">How do I verify my account?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    You can verify your account by navigating to your dashboard settings and uploading the required identification documents (NIN or International Passport).
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-900">What is your refund policy?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Refund policies vary depending on the tour operator and package selected. Please review the specific package's cancellation policy before finalizing your booking.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-900">Are payments secure?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Absolutely. We use industry-standard encryption and partner with leading payment gateways like Paystack and Flutterwave to ensure your funds are 100% secure.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-lg text-slate-900">How do I know operators are legit?</h4>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    We manually vet all tour operators, requiring valid NAHCON licenses, CAC registration, and references before they can list packages on UfitGo.
                  </p>
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
