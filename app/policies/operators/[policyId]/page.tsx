import { notFound } from "next/navigation"

type Policy = {
  id: string
  title: string
  version: number
  content: string
  publishedAt?: string
}

async function getPolicy(policyId: string): Promise<Policy | null> {
  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.ufitgo.ng"
  const response = await fetch(`${gatewayUrl}/api/operator/policies/public/${encodeURIComponent(policyId)}`, {
    next: { revalidate: 300 },
  })
  if (!response.ok) return null
  const payload = await response.json()
  return payload?.data || null
}

async function getMarketplaceDisclaimer(): Promise<Policy | null> {
  const gatewayUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.ufitgo.ng"
  const response = await fetch(`${gatewayUrl}/api/operator/policies/public/marketplace-disclaimer/latest`, {
    next: { revalidate: 300 },
  })
  if (!response.ok) return null
  const payload = await response.json()
  return payload?.data || null
}

export default async function OperatorPolicyPage({ params }: { params: Promise<{ policyId: string }> }) {
  const { policyId } = await params
  const [policy, marketplaceDisclaimer] = await Promise.all([getPolicy(policyId), getMarketplaceDisclaimer()])
  if (!policy) notFound()

  return (
    <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <p className="text-sm font-semibold text-emerald-700">UfitGo package policy</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-950">{policy.title}</h1>
      <p className="mt-2 text-sm text-slate-600">Version {policy.version}{policy.publishedAt ? ` · Published ${new Date(policy.publishedAt).toLocaleDateString("en-NG")}` : ""}</p>

      <section className="mt-8 whitespace-pre-wrap rounded-lg border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-800 shadow-sm">
        {policy.content}
      </section>

      {marketplaceDisclaimer && (
        <section className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-sm leading-7 text-slate-800">
          <h2 className="text-base font-bold text-slate-950">{marketplaceDisclaimer.title}</h2>
          <p className="mt-1 text-xs text-slate-600">UfitGo version {marketplaceDisclaimer.version}{marketplaceDisclaimer.publishedAt ? ` · Published ${new Date(marketplaceDisclaimer.publishedAt).toLocaleDateString("en-NG")}` : ""}</p>
          <div className="mt-3 whitespace-pre-wrap">{marketplaceDisclaimer.content}</div>
        </section>
      )}
    </main>
  )
}
