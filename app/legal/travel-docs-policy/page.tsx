import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck } from "lucide-react"

export default function TravelDocsPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />

      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">
            Travel Documents Policy
          </h1>
          <p className="text-slate-500">Version 1.0.0 · Nigeria Data Protection Act (NDPA) Compliant</p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm ring-1 ring-slate-100">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900">
            <p className="lead text-xl text-slate-600 mb-10">
              The UfitGo Travel Docs Vault is designed to help you securely store and manage your International Passport, Visa, and Health Card for Hajj and Umrah journeys while keeping you in complete control of who can view them.
            </p>

            <h2 className="text-2xl mt-10 mb-4 pb-2 border-b border-slate-100">
              1. Encrypted Storage & Access Protection
            </h2>
            <p>
              All documents uploaded to your Travel Docs Vault are transmitted over TLS and stored in encrypted cloud storage with time-limited signed access URLs. Inside the UfitGo mobile app, access to your vault is protected by your 4-digit Transaction PIN and/or biometric authentication (Face ID / Touch ID).
            </p>

            <h2 className="text-2xl mt-10 mb-4 pb-2 border-b border-slate-100">
              2. Explicit Operator Sharing Only
            </h2>
            <p>
              Your travel documents are private by default. No tour operator, travel agent, or third party can view your uploaded documents unless you explicitly select an operator and authorize sharing for a specific booking or pilgrimage inquiry.
            </p>

            <h2 className="text-2xl mt-10 mb-4 pb-2 border-b border-slate-100">
              3. Your Right to Replace or Delete
            </h2>
            <p>
              You retain full ownership of your documents. You may replace an outdated document or permanently delete any document from your Travel Docs Vault at any time directly within the UfitGo app.
            </p>

            <h2 className="text-2xl mt-10 mb-4 pb-2 border-b border-slate-100">
              4. Account Security Responsibility
            </h2>
            <p>
              Keeping your UfitGo account credentials and 4-digit Transaction PIN confidential remains your responsibility. If you suspect unauthorized access to your device or account, reset your Transaction PIN immediately in Security Settings or contact <a href="mailto:privacy@ufitgo.ng">privacy@ufitgo.ng</a>.
            </p>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
