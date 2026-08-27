import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Shield } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-4">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: August 2026</p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="prose prose-slate prose-lg max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-primary hover:prose-a:text-primary/80">
            <p className="lead text-xl text-slate-600 mb-10">
              At UfitGo, we consider your privacy to be of the utmost importance. This Privacy Policy details the steps we take to protect your personal information when you use our services.
            </p>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">1. Information We Collect</h2>
            <p>
              We collect information to provide better services to all our users. The types of personal information we collect include:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-3 rounded-full bg-primary flex-shrink-0" />
                <span><strong>Personal Data:</strong> Name, email address, phone number, and physical address provided during account creation.</span>
              </li>
              <li className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-3 rounded-full bg-primary flex-shrink-0" />
                <span><strong>Financial Data:</strong> Secure payment tokens and transaction history. We do not store raw credit card numbers.</span>
              </li>
              <li className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-3 rounded-full bg-primary flex-shrink-0" />
                <span><strong>Usage Data:</strong> Analytics on how you navigate our platform to help us improve the user experience.</span>
              </li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">2. How We Use Information</h2>
            <p>
              UfitGo utilizes your data strictly for operational enhancements and service delivery:
            </p>
            <ul className="space-y-3 mt-4">
              <li className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-3 rounded-full bg-slate-300 flex-shrink-0" />
                <span>Processing bookings and facilitating communication with tour operators.</span>
              </li>
              <li className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-3 rounded-full bg-slate-300 flex-shrink-0" />
                <span>Sending important alerts regarding your Hajj or Umrah itinerary.</span>
              </li>
              <li className="flex items-start">
                <span className="h-2 w-2 mt-2.5 mr-3 rounded-full bg-slate-300 flex-shrink-0" />
                <span>Fraud prevention and securing the UfitGo ecosystem.</span>
              </li>
            </ul>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100">3. Data Security</h2>
            <p>
              We implement state-of-the-art security measures. Your data is encrypted in transit using TLS and encrypted at rest on secure cloud servers. Access to your personal data is strictly limited to authorized personnel.
            </p>

            <div className="mt-16 p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
              <h3 className="font-semibold text-lg text-slate-900 mb-2">Have Questions?</h3>
              <p className="text-slate-600 mb-4">Our privacy team is available to address any concerns.</p>
              <a href="mailto:privacy@ufitgo.com" className="inline-flex items-center justify-center rounded-full bg-white border border-slate-200 px-6 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:bg-slate-50">
                Contact Privacy Team
              </a>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
