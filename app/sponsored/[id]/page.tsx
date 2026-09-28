import { notFound } from "next/navigation"
import { ExternalLink, ShieldCheck } from "lucide-react"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

type SponsoredAd = {
  id: string
  title: string
  description?: string | null
  imageUrl?: string | null
  redirectUrl?: string | null
  cta?: string | null
  businessName?: string | null
  businessLogo?: string | null
  isSponsored: boolean
}

async function getSponsoredAd(id: string): Promise<SponsoredAd | null> {
  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.ufitgo.ng"
  const response = await fetch(`${gatewayUrl}/api/operator/ads/${encodeURIComponent(id)}`, { cache: "no-store" })
  if (!response.ok) return null
  return response.json()
}

export default async function SponsoredPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const ad = await getSponsoredAd(id)
  if (!ad) notFound()

  const actionUrl = ad.redirectUrl && /^https:\/\//i.test(ad.redirectUrl) ? ad.redirectUrl : null

  return (
    <div className="flex min-h-screen flex-col bg-[#f4f8f6]">
      <SiteHeader />
      <main className="flex-1 pt-20">
        <section className="border-b border-[#dbe6e0] bg-[#0b3d31] py-10 text-white">
          <div className="mx-auto max-w-5xl px-5">
            <div className="inline-flex items-center gap-2 border border-white/30 bg-white/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em]"><ShieldCheck className="size-3.5" /> Sponsored on UfitGo</div>
            <p className="mt-5 text-sm text-white/75">Paid placement from</p>
            <h1 className="mt-1 font-serif text-4xl font-bold leading-tight sm:text-5xl">{ad.businessName || "UfitGo partner"}</h1>
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-14">
          <div className="overflow-hidden bg-[#dfeae5]">
            {ad.imageUrl ? <img src={ad.imageUrl} alt={ad.title} className="aspect-[16/10] h-full w-full object-cover" /> : <div className="flex aspect-[16/10] items-center justify-center bg-[#1d6a56] p-8 text-center font-serif text-3xl font-bold text-white">{ad.businessName || ad.title}</div>}
          </div>
          <div className="self-center">
            <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#0d7d5f]">Sponsored offer</p>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-[#17201c]">{ad.title}</h2>
            {ad.description && <p className="mt-5 text-base leading-7 text-[#52605a]">{ad.description}</p>}
            {actionUrl && <a href={actionUrl} rel="noreferrer" className="mt-7 inline-flex items-center gap-2 bg-[#0d7d5f] px-5 py-3 text-sm font-bold text-white hover:bg-[#0b6b51]">{ad.cta || "Learn more"}<ExternalLink className="size-4" /></a>}
            <p className="mt-8 border-t border-[#dbe6e0] pt-4 text-xs leading-5 text-[#78817d]">This is a paid placement. UfitGo displays sponsored offers but does not endorse or guarantee an advertiser&apos;s independent products or services.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  )
}