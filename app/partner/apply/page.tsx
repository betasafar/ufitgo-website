import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"
import { MultiStepForm } from "@/components/partner/multi-step-form"
import { UfitGoLogo } from "@/components/ufitgo-logo"

export default function PartnerApplyPage() {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-white">
      {/* Left Column: Branding & Value Prop (Sticky on Desktop) */}
      <div className="relative flex flex-col justify-between bg-[#0a1c12] p-8 text-white md:w-5/12 lg:w-1/3 md:sticky md:top-0 md:h-screen lg:p-12">
        
        {/* Background Pattern/Gradient */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />

        <div className="relative z-10">
          <Link href="/" className="inline-block mb-16 transition-opacity hover:opacity-80">
            {/* Using a bright/white version of the logo if possible, but UfitGoLogo works */}
            <div className="brightness-0 invert">
              <UfitGoLogo className="h-8 w-auto" />
            </div>
          </Link>
          
          <h1 className="font-serif text-4xl font-bold leading-tight mb-6 lg:text-5xl">
            Partner with <br className="hidden md:block" />
            <span className="text-[#E5B611]">UfitGo</span>
          </h1>
          
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Join Nigeria's fastest-growing Hajj and Umrah marketplace. Connect your services with thousands of ready pilgrims seamlessly.
          </p>

          <div className="space-y-6">
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Reach More Pilgrims</h3>
                <p className="text-sm text-white/70 mt-1">Access a massive audience actively looking for trusted services.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Streamlined Bookings</h3>
                <p className="text-sm text-white/70 mt-1">Manage all your requests and payments in one unified dashboard.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-white">Verified Trust</h3>
                <p className="text-sm text-white/70 mt-1">Build your reputation on a platform trusted by Nigerian pilgrims.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-12 md:mt-0">
          <p className="text-xs text-white/50">
            &copy; {new Date().getFullYear()} UfitGo. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Column: The Form */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:px-20 xl:px-32">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        
        <div className="mx-auto w-full max-w-2xl">
          <MultiStepForm />
        </div>
      </div>
    </div>
  )
}
