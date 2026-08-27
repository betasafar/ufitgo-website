import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { ShieldCheck, UserCheck, FileCheck, Building2, Scale } from "lucide-react"

export default function TrustPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Header */}
      <div className="bg-[#0a1c12] py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />
        <div className="container relative z-10 mx-auto px-4">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-white mb-6 backdrop-blur-sm">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4 font-serif">Trust & Verification</h1>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            How UfitGo helps you make more informed decisions by reviewing providers before they are listed on our marketplace.
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 container mx-auto px-4 py-16 -mt-8 z-20">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 md:p-12 shadow-sm ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          <div className="prose prose-slate prose-lg max-w-none">
            <p className="lead text-xl text-slate-600 mb-12">
              Before a provider is listed on UfitGo, they may go through a review process relevant to the type of service they offer. This process is designed to reduce the uncertainty of dealing with unknown providers online.
            </p>

            <div className="grid sm:grid-cols-2 gap-8 mb-16">
              
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <UserCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Identity Review</h3>
                <p className="text-slate-600 text-sm">
                  Verification of the identity of the individual or business responsible for the service.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Building2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Business Information</h3>
                <p className="text-slate-600 text-sm">
                  Review of relevant business or organisational information where applicable to the service provided.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <FileCheck className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Service Eligibility</h3>
                <p className="text-slate-600 text-sm">
                  Review of information relevant to the provider's ability or eligibility to offer the specific listed service.
                </p>
              </div>

              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Scale className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Ongoing Platform Standards</h3>
                <p className="text-slate-600 text-sm">
                  Listed providers may be subject to ongoing platform requirements and can be reviewed, suspended, or removed where appropriate.
                </p>
              </div>

            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-r-xl my-8">
              <h4 className="text-yellow-800 font-bold mb-2">Important Disclaimer</h4>
              <p className="text-yellow-700 text-sm m-0">
                Provider review is designed to improve transparency and help users make more informed decisions. However, UfitGo does not guarantee the quality or outcome of any service. Users should still review provider information, ratings, and the specific terms of each service before proceeding with a booking or transaction.
              </p>
            </div>

            <h2 className="text-2xl mt-12 mb-6 pb-2 border-b border-slate-100 font-serif">Regulatory Status</h2>
            <p>
              For services that require specific regulatory authorisation (such as operating official Hajj packages or acting as a licensed Bureau De Change), relevant documentation or regulatory status may be reviewed where applicable. UfitGo explicitly requires providers to maintain their own valid licenses and operate within the bounds of local regulations.
            </p>
            
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
