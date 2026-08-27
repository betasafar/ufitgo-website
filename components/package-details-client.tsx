"use client"

import Image from "next/image"
import { useState } from "react"
import { 
  BadgeCheck, CalendarDays, Clock, Check, MapPin, 
  Bookmark, GitCompare, ArrowRight, ShieldCheck, Star 
} from "lucide-react"
import { type Package, formatNaira } from "@/lib/packages"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { RegistrationModal } from "@/components/registration-modal"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function PackageDetailsClient({ pkg }: { pkg: Package }) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"book" | "save">("book")

  return (
    <article className="pb-24">
      {/* Hero Section */}
      <div className="relative h-[40vh] min-h-[300px] w-full bg-zinc-950">
        <Image
          src={pkg.heroImage || pkg.cardImage || "/placeholder.svg"}
          alt={pkg.name}
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="mx-auto max-w-6xl">
            <div className="flex gap-2 mb-4">
              <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary-foreground">
                {pkg.type}
              </span>
              <span className="rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground capitalize">
                {pkg.category}
              </span>
            </div>
            <h1 className="font-serif text-3xl font-bold text-foreground sm:text-5xl lg:text-6xl mb-2">
              {pkg.name}
            </h1>
            <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
              By {pkg.operator.name}
              {pkg.operator.verified && (
                <BadgeCheck className="h-5 w-5 text-primary" />
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_360px] items-start">
          
          {/* Main Content (Left) */}
          <div className="space-y-12">
            
            {/* Overview Grid */}
            <section>
              <h2 className="text-xl font-bold mb-6 font-serif">Package Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 rounded-2xl bg-secondary/30 border border-border">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="h-4 w-4" /> Duration
                  </div>
                  <p className="font-medium">{pkg.duration} Days</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <CalendarDays className="h-4 w-4" /> Departure
                  </div>
                  <p className="font-medium">{pkg.departureDate}</p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" /> Departure City
                  </div>
                  <p className="font-medium">{pkg.departureCity}</p>
                </div>
              </div>
            </section>

            {/* Payment Schedule & Terms */}
            <section className="bg-primary/5 p-8 rounded-3xl border border-primary/20">
              <h2 className="text-xl font-bold mb-6 font-serif">Payment Schedule & Terms</h2>
              <div className="space-y-6">
                {pkg.registrationFeeEnabled && (
                  <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                    <div>
                      <h3 className="font-semibold text-foreground">Registration Fee</h3>
                      <p className="text-sm text-muted-foreground">Required to lock in your package</p>
                    </div>
                    <div className="font-bold text-lg">{formatNaira(pkg.registrationFeeAmount || 0)}</div>
                  </div>
                )}
                
                {pkg.installmentEligible ? (
                  <>
                    <div className="flex justify-between items-center border-b border-primary/10 pb-4">
                      <div>
                        <h3 className="font-semibold text-foreground">Initial Deposit</h3>
                        <p className="text-sm text-muted-foreground">Flexible monthly payments</p>
                      </div>
                      <div className="font-bold text-lg">{formatNaira(pkg.initialDeposit || 0)}</div>
                    </div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-foreground">Final Balance</h3>
                        <p className="text-sm text-muted-foreground">Due 45 days before departure</p>
                      </div>
                      <div className="font-bold text-lg">{formatNaira(pkg.finalBalance || 0)}</div>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-foreground">Full Package Price</h3>
                      <p className="text-sm text-muted-foreground">Due upon booking</p>
                    </div>
                    <div className="font-bold text-lg">{formatNaira(pkg.priceFrom || 0)}</div>
                  </div>
                )}
              </div>
            </section>

            {/* Inclusions / Highlights */}
            <section>
              <h2 className="text-xl font-bold mb-6 font-serif">What's Included</h2>
              <ul className="grid sm:grid-cols-2 gap-4">
                {pkg.highlights.map((highlight, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-card">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium text-foreground">{highlight}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* Operator Info */}
            <section className="bg-secondary/30 p-8 rounded-3xl border border-border">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">About the Operator</h2>
              <div className="flex items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground text-xl font-bold font-serif">
                  {pkg.operator.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-xl font-bold flex items-center gap-2">
                    {pkg.operator.name}
                    {pkg.operator.verified && <ShieldCheck className="h-5 w-5 text-primary" />}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-4 text-sm font-medium">
                    <Star className="h-4 w-4 fill-accent text-accent" />
                    {pkg.operator.rating} ({pkg.operator.reviews} reviews)
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{pkg.operator.description}</p>
                </div>
              </div>
            </section>

          </div>

          {/* Sticky CTA (Right) */}
          <aside className="sticky top-24">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-primary/5">
              <div className="mb-6">
                <p className="text-sm text-muted-foreground mb-1">Starting price per person</p>
                <div className="font-serif text-4xl font-bold text-foreground">
                  {formatNaira(pkg.priceFrom)}
                </div>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => {
                    if (!session?.user?.id) {
                      router.push(`/auth/login?callbackUrl=${encodeURIComponent(window.location.href)}`)
                      return
                    }
                    setModalMode("book")
                    setIsModalOpen(true)
                  }}
                  className={cn(buttonVariants({ size: "lg" }), "w-full h-auto py-3 flex-col items-center gap-1 shadow-md rounded-full")}
                >
                  <span className="text-base font-semibold">Register & Book</span>
                  <span className="text-xs font-normal text-primary-foreground/80">
                    {pkg.registrationFeeEnabled 
                      ? `Requires ${formatNaira(pkg.registrationFeeAmount || 0)} Registration Fee` 
                      : `Requires ${formatNaira(pkg.installmentEligible ? (pkg.initialDeposit || 0) : pkg.priceFrom)} Initial Payment`}
                  </span>
                </button>

                <Link href={`/wallet/target/new?packageId=${pkg.id}&packageName=${encodeURIComponent(pkg.name)}&targetAmount=${pkg.priceFrom}&category=${pkg.category}`} className="block">
                  <button className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full h-14 text-base font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 rounded-full")}>
                    Start Saving for This Package
                  </button>
                </Link>
                
                <div className="grid grid-cols-2 gap-3 mt-6 pt-4 border-t border-border/30">
                  <button
                    onClick={() => {
                      setModalMode("save")
                      setIsModalOpen(true)
                    }}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition-colors bg-card border-border hover:bg-secondary text-foreground"
                    )}
                  >
                    <Bookmark className="h-4 w-4" />
                    Save
                  </button>
                  
                  <Link
                    href={`/compare?id=${pkg.id}`}
                    className={cn(
                      "flex items-center justify-center gap-2 rounded-full border py-3 text-sm font-medium transition-colors bg-card border-border hover:bg-primary/5 hover:border-primary/30 hover:text-primary text-foreground"
                    )}
                  >
                    <GitCompare className="h-4 w-4" />
                    Compare
                  </Link>
                </div>
              </div>
            </div>
          </aside>
          
        </div>
      </div>

      <RegistrationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        pkg={pkg} 
      />
    </article>
  )
}
