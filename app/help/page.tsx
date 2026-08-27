import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Mail, MessageSquare, PhoneCall, HelpCircle, ArrowRight } from "lucide-react"

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
                <a href="mailto:support@ufitgo.com" className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700">
                  support@ufitgo.com <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Contact Card 2 */}
              <div className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#0a1c12]/5 text-[#0a1c12]">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Partner Relations</h3>
                <p className="text-sm text-slate-500 mb-6">For tour operators, agents, and guides partnering with us.</p>
                <a href="mailto:partners@ufitgo.com" className="inline-flex items-center text-sm font-medium text-[#0a1c12] hover:opacity-80">
                  partners@ufitgo.com <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>

              {/* Contact Card 3 */}
              <div className="rounded-2xl bg-white p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 transition-all hover:-translate-y-1 hover:shadow-md animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <PhoneCall className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-slate-900">Phone & WhatsApp</h3>
                <p className="text-sm text-slate-500 mb-6">For urgent issues and immediate assistance during travel.</p>
                <a href="tel:+2348000000000" className="inline-flex items-center text-sm font-medium text-green-600 hover:text-green-700">
                  +234 800 UFITGO <ArrowRight className="ml-1 h-4 w-4" />
                </a>
              </div>
            </div>

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
