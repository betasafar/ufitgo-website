import { notFound } from "next/navigation"

type MarketplaceDisclaimer = {
  title: string
  version: number
  content: string
  contentFormat?: "plain_text" | "rich_text"
  publishedAt?: string
}

async function getMarketplaceDisclaimer(): Promise<MarketplaceDisclaimer | null> {
  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.ufitgo.ng"
  const response = await fetch(`${gatewayUrl}/api/operator/policies/public/marketplace-disclaimer/latest`, {
    next: { revalidate: 300 },
  })
  if (!response.ok) return null
  const payload = await response.json()
  return payload?.data || null
}

export default async function MarketplacePolicyPage() {
  const disclaimer = await getMarketplaceDisclaimer()
  if (!disclaimer) notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-sm font-semibold text-emerald-700">UfitGo marketplace policy</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">{disclaimer.title}</h1>
      <p className="mt-2 text-sm text-slate-600">Version {disclaimer.version}{disclaimer.publishedAt ? ` · Published ${new Date(disclaimer.publishedAt).toLocaleDateString("en-NG")}` : ""}</p>
      <section className="mt-8 rounded-lg border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-800 shadow-sm">
        {disclaimer.contentFormat === "rich_text" ? <div className="policy-rich-text" dangerouslySetInnerHTML={{ __html: disclaimer.content }} /> : <div className="whitespace-pre-wrap">{disclaimer.content}</div>}
      </section>
    </main>
  )
}