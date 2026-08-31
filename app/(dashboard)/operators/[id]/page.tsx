import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, MapPin, Briefcase, Star, MessageCircle, ChevronLeft } from "lucide-react"
import { fetchOperatorDetails } from "@/lib/api"
import { PackageCard } from "@/components/package-card"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Button } from "@/components/ui/button"
import { WhatsappAction } from "@/components/whatsapp-action"

export const revalidate = 3600 // Revalidate every hour

export default async function OperatorDetailsPage({
  params,
}: {
  params: { id: string }
}) {
  let operatorDetails

  try {
    const res = await fetchOperatorDetails(params.id)
    operatorDetails = res.data
  } catch (error) {
    notFound()
  }

  if (!operatorDetails) {
    notFound()
  }

  const nameToDisplay = operatorDetails.companyName || operatorDetails.name || "Unknown Operator"
  const hasValidImage = operatorDetails.logo && operatorDetails.logo !== "/placeholder.svg"
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .substring(0, 2)
      .toUpperCase()
  }

  const isVerified = operatorDetails.verificationStatus === 'approved' || operatorDetails.verified
  
  // Try to format packages if they exist. The mobile app uses operatorDetails.packages.
  const packages = (operatorDetails.packages || []).map((apiPkg: any) => ({
    id: apiPkg.id?.toString() || Math.random().toString(),
    name: apiPkg.title || apiPkg.name,
    type: apiPkg.type || "Umrah",
    category: apiPkg.serviceLevel || apiPkg.category || "Standard",
    operator: {
      name: nameToDisplay,
      verified: isVerified
    },
    priceFrom: parseFloat(apiPkg.price || 0),
    duration: apiPkg.duration || 7,
    departureDate: apiPkg.departureDate || "Flexible",
    departureCity: apiPkg.departingFrom?.split(',')[0] || "Unknown",
    highlights: apiPkg.inclusions || [],
    heroImage: apiPkg.images?.[0] || "/placeholder.svg",
    cardImage: apiPkg.images?.[0] || "/placeholder.svg",
  }))

  const UFITGO_WHATSAPP = "+2348148804448"
  const whatsappMessage = `Hi Ufitgo Support, I am interested in booking with the operator: *${nameToDisplay}*. Can you help me?`
  const whatsappUrl = `https://wa.me/${UFITGO_WHATSAPP.replace("+", "")}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <div className="flex-1 bg-background pb-24">
      {/* Header Cover */}
      <div className="relative h-48 md:h-64 w-full bg-zinc-900 overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=1200&q=80" 
          alt="Cover"
          fill
          priority
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
        
        <div className="absolute top-4 left-4 z-10">
          <Link href="/operators">
            <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-background/50 backdrop-blur-md border-white/20 text-white hover:bg-background/80 hover:text-white">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Profile Section */}
        <div className="relative -mt-16 sm:-mt-20 flex flex-col items-center sm:items-start sm:flex-row gap-6">
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0 overflow-hidden rounded-full border-4 border-background bg-zinc-100 flex items-center justify-center shadow-xl">
            {hasValidImage ? (
              <Image
                src={operatorDetails.logo!}
                alt={`${nameToDisplay} logo`}
                fill
                sizes="160px"
                className="object-cover"
              />
            ) : (
              <span className="text-4xl sm:text-5xl font-bold text-primary/40 uppercase">
                {getInitials(nameToDisplay)}
              </span>
            )}
            
            {isVerified && (
              <div className="absolute bottom-1 right-1 h-8 w-8 rounded-full bg-background flex items-center justify-center shadow-sm">
                <ShieldCheck className="h-6 w-6 text-blue-500" />
              </div>
            )}
          </div>

          <div className="mt-2 sm:mt-16 flex-1 text-center sm:text-left">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
              {nameToDisplay}
            </h1>
            
            <div className="mt-3 flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-6">
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">{operatorDetails.location || 'Nigeria'}</span>
              </div>
              
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" />
                <span className="text-sm font-medium">{operatorDetails.rating ? operatorDetails.rating.toFixed(1) : "5.0"} Rating</span>
              </div>

              {isVerified && (
                <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 uppercase tracking-wide">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  UFITGO VERIFIED
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-10">
            {/* About */}
            <ScrollReveal>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-6 w-1.5 rounded-full bg-primary" />
                <h2 className="text-xl font-bold text-foreground">About {nameToDisplay}</h2>
              </div>
              <div className="prose prose-zinc dark:prose-invert max-w-none text-muted-foreground">
                <p className="leading-relaxed">
                  {operatorDetails.description || `${nameToDisplay} is a verified Hajj and Umrah operator on Ufitgo, dedicated to providing exceptional service and guidance for your spiritual journey. With ${operatorDetails.yearsOfExperience || 5}+ years of experience, they have established themselves as a trusted partner for pilgrims.`}
                </p>
              </div>
            </ScrollReveal>

            {/* Packages */}
            {packages.length > 0 && (
              <ScrollReveal delay={100}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-6 w-1.5 rounded-full bg-primary" />
                  <h2 className="text-xl font-bold text-foreground">Current Packages</h2>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  {packages.map((pkg: any) => (
                    <div key={pkg.id} className="h-full">
                      <PackageCard pkg={pkg} />
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ScrollReveal delay={200} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <h3 className="font-bold text-foreground mb-4">Operator Overview</h3>
              <dl className="space-y-4">
                <div>
                  <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">Years Active</dt>
                  <dd className="text-lg font-medium text-foreground">{operatorDetails.yearsOfExperience || 0} Years</dd>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Since {operatorDetails.foundedAt || new Date(operatorDetails.memberSince || Date.now()).getFullYear()}
                  </p>
                </div>
                <div className="border-t border-border pt-4">
                  <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">CAC Number</dt>
                  <dd className="text-lg font-medium text-foreground">{operatorDetails.cacNumber || 'N/A'}</dd>
                  <p className="text-xs text-muted-foreground mt-0.5">Corporate Registered</p>
                </div>
                {operatorDetails.nahconId && (
                  <div className="border-t border-border pt-4">
                    <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">NAHCON License</dt>
                    <dd className="text-lg font-medium text-foreground">{operatorDetails.nahconId}</dd>
                    <p className="text-xs text-muted-foreground mt-0.5">Officially Licensed</p>
                  </div>
                )}
                <div className="border-t border-border pt-4">
                  <dt className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">Office Location</dt>
                  <dd className="text-lg font-medium text-foreground">{operatorDetails.location || 'Nigeria'}</dd>
                  <p className="text-xs text-muted-foreground mt-0.5">{operatorDetails.address || 'Main Office'}</p>
                </div>
              </dl>
            </ScrollReveal>

            <ScrollReveal delay={300} className="rounded-2xl bg-primary/10 border border-primary/20 p-6 text-center">
              <h3 className="font-bold text-foreground mb-2">Ready to Book?</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Our support team is ready to assist you with booking {nameToDisplay}'s packages.
              </p>
              <WhatsappAction whatsappUrl={whatsappUrl} operatorName={nameToDisplay} />
            </ScrollReveal>
          </div>
        </div>
      </div>
    </div>
  )
}
