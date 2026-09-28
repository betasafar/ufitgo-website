import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Building2, CircleAlert, HandHeart, Landmark, Scale, ShieldCheck } from "lucide-react"

const commitments = [
  {
    icon: HandHeart,
    title: "No interest on Target Savings",
    description: "UfitGo does not pay or charge interest on balances held in UfitGo Target Savings.",
  },
  {
    icon: Landmark,
    title: "Purpose-led saving",
    description: "Target Savings is designed to help customers plan and save towards a specific journey or service on UfitGo.",
  },
  {
    icon: Building2,
    title: "Regulated account infrastructure",
    description: "Account services are provided through FCMB Microfinance Bank's banking-as-a-service infrastructure. UfitGo is a technology platform, not a bank.",
  },
]

export default function ShariahPage() {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <SiteHeader />

      <section className="relative overflow-hidden bg-[#0a1c12] py-20 text-center">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />
        <div className="container relative mx-auto px-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-[#e5b611] backdrop-blur-sm">
            <Scale className="h-8 w-8" />
          </div>
          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#e5b611]">Our Shariah Approach</p>
          <h1 className="mt-3 font-serif text-4xl font-bold tracking-tight text-white md:text-5xl">A clear approach to Target Savings</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
            We design our savings experience to be Shariah-conscious, transparent, and focused on helping customers prepare for meaningful journeys.
          </p>
        </div>
      </section>

      <main className="container mx-auto flex-1 px-4 py-14 sm:py-16">
        <div className="mx-auto max-w-4xl space-y-10">
          <section className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <h2 className="font-serif text-3xl font-bold text-slate-950">What this means</h2>
            <p className="mt-5 text-lg leading-8 text-slate-700">
              UfitGo is not an Islamic bank and does not present itself as a Shariah-certified financial institution. Our commitment is to build a product experience that avoids interest in the way UfitGo designs and operates Target Savings, while being open about the regulated infrastructure that supports it.
            </p>
          </section>

          <section>
            <h2 className="font-serif text-3xl font-bold text-slate-950">Our product commitments</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {commitments.map(({ icon: Icon, title, description }) => (
                <article key={title} className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-50 text-emerald-800">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-slate-950">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-7 shadow-sm sm:p-10">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-emerald-700" />
              <div>
                <h2 className="text-2xl font-bold text-slate-950">Our role and our banking partner&apos;s role</h2>
                <p className="mt-3 leading-7 text-slate-700">
                  UfitGo provides the technology and customer experience for planning, saving, and paying for services. FCMB Microfinance Bank provides the account infrastructure. UfitGo does not control or represent the wider operations of any banking partner.
                </p>
                <p className="mt-3 leading-7 text-slate-700">
                  We do not claim that using conventional banking infrastructure makes that institution&apos;s entire operations Shariah-compliant. Our statement is limited to UfitGo&apos;s product design, including the fact that we do not pay or charge interest on Target Savings balances.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-amber-200 bg-amber-50 p-7 sm:p-8">
            <div className="flex items-start gap-4">
              <CircleAlert className="mt-1 h-6 w-6 shrink-0 text-amber-800" />
              <div>
                <h2 className="text-xl font-bold text-amber-950">Independent review</h2>
                <p className="mt-2 leading-7 text-amber-900">
                  We welcome independent Shariah review of our contracts, fund flows, fees, and customer disclosures. When a formal review or advisory opinion is completed, we will publish its scope, date, and the reviewer&apos;s credentials here. Until then, this page explains our approach; it is not a fatwa or a Shariah certification.
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-lg bg-[#0a1c12] p-7 text-white sm:p-10">
            <h2 className="font-serif text-3xl font-bold">Have a question about Target Savings?</h2>
            <p className="mt-3 max-w-2xl leading-7 text-white/75">Our support team can explain how Target Savings works and direct feedback to the right team.</p>
            <a href="/help" className="mt-6 inline-flex rounded-md bg-[#e5b611] px-5 py-3 text-sm font-bold text-slate-950 transition-colors hover:bg-[#f3c536]">Contact support</a>
          </section>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
