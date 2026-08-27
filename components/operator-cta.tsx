import { ArrowRight, Check } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ScrollReveal } from "@/components/scroll-reveal"

const benefits = [
  "Reach thousands of verified pilgrims actively preparing for their journey",
  "Real-time dashboard with full analytics and booking management",
  "Integrated payment processing — receive payouts instantly and securely",
  "Expand your offerings: list packages, exchange services, transport, or SIMs",
  "Build trust with a 'Verified Partner' badge and our transparent review system",
]

export function OperatorCta() {
  return (
    <section id="operators" className="scroll-mt-20">
      <div className="grid lg:grid-cols-2 min-h-[500px]">
        {/* Left Side - Pitch */}
        <div className="bg-[#0b1f15] text-white p-12 sm:p-16 lg:p-24 flex flex-col justify-center relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 60%)' }}></div>
          
          <ScrollReveal className="relative z-10 max-w-xl lg:ml-auto w-full">
            <p className="text-sm font-bold tracking-widest text-[#E5B611] uppercase mb-4">For Partners</p>
            <h2 className="text-balance font-serif text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-[1.15]">
              Are you a Tour Operator or Service Provider?
            </h2>
            <p className="text-lg text-white/80 leading-relaxed mb-10 max-w-md text-pretty">
              Join Nigeria's fastest-growing pilgrim marketplace. Whether you offer Hajj & Umrah packages, currency exchange, transport, or travel SIMs, UfitGo connects you directly with ready travelers.
            </p>
            <a
              href="/partner"
              className={cn(
                buttonVariants({ size: "lg" }),
                "h-14 gap-2 rounded-full bg-[#E5B611] px-8 text-base font-bold text-black hover:bg-[#c99f0e] shadow-xl shadow-[#E5B611]/10 w-fit",
              )}
            >
              Apply as Partner
              <ArrowRight className="h-5 w-5" />
            </a>
          </ScrollReveal>
        </div>

        {/* Right Side - Benefits */}
        <div className="bg-primary text-primary-foreground p-12 sm:p-16 lg:p-24 flex flex-col justify-center">
          <ScrollReveal delay={150} className="max-w-xl w-full">
            <p className="text-sm font-bold tracking-widest text-primary-foreground/80 uppercase mb-8">Partner Benefits</p>
            <ul className="space-y-6">
              {benefits.map((benefit, index) => (
                <li key={index} className="flex items-start gap-4">
                  <div className="mt-1 flex-shrink-0 flex h-6 w-6 items-center justify-center rounded-full bg-primary-foreground/20 backdrop-blur-sm">
                    <Check className="h-4 w-4 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <span className="text-lg text-primary-foreground/95 leading-snug">{benefit}</span>
                </li>
              ))}
            </ul>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
