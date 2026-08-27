import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { FileText } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0a1c12]/5 text-[#0a1c12] mb-6">
            <FileText className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Terms of Service</h1>
          <p className="text-slate-500">Last updated: August 2026</p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary hover:prose-a:text-primary/80">
            <p className="lead text-xl text-slate-600 mb-10">
              Welcome to UfitGo. These terms outline the rules and regulations for the use of our marketplace platform.
            </p>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the Service, you signify your agreement to be bound by these Terms. If you do not agree to these terms, you may not access or use the UfitGo platform.
            </p>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">2. User Responsibilities</h2>
            <p>
              When registering an account as a customer or a provider, you must provide accurate, current, and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
            </p>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">3. Platform Role</h2>
            <p>
              UfitGo acts as a digital marketplace connecting customers and independent service providers. We do not directly provide services. Contracts for these services are made directly between the customer and the provider. While we vet providers strictly, UfitGo is not liable for the operational delivery of third-party services.
            </p>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">4. Payments and Refunds</h2>
            <p>
              All payments made through UfitGo are processed using integrated third-party payment infrastructure. Refund eligibility and timelines are strictly governed by the specific cancellation policy of the independent provider associated with your booked service. UfitGo facilitates the refund process but the decision rests on the provider's predefined terms.
            </p>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">5. Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
            </p>

            <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Legal Enquiries</h3>
              <p className="text-slate-600 mb-4">Contact our legal team for any clarifications on these terms.</p>
              <a href="mailto:legal@ufitgo.com" className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50">
                legal@ufitgo.com
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
