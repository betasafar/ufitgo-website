import { resolvePackageImage } from "@/lib/package-image"

export type PilgrimageType = "umrah" | "hajj"

export type PackageAvailabilityStatus = "available" | "limited" | "sold_out" | "closed"
export type PackageSalesStatus = "open" | "paused" | "closed"

export type Operator = {
  id: number
  name: string
  companyName?: string
  logo?: string | null
  verified: boolean
  verificationStatus?: string
  description: string
  rating: number
  reviews: number
  trustScore?: number
  yearsOfExperience?: number
  location?: string
  activePackagesCount?: number
  totalBookings?: number
  tier?: string
  phone?: string
}

export type Package = {
  id: string // Using string for frontend routing ease, though API is number
  name: string // API: title
  type: PilgrimageType
  category: string // API: serviceLevel (premium, family, economy)
  operator: Operator
  priceFrom: number // API: price
  priceOnRequest?: boolean
  duration: number // API duration in days/nights
  departureDate: string
  departureCity: string
  highlights: string[] // API: inclusions
  heroImage: string
  cardImage: string
  capacity?: number
  booked?: number
  remainingSlots?: number
  salesStatus?: PackageSalesStatus
  availabilityStatus?: PackageAvailabilityStatus
  
  // Dynamic Pricing Fields
  registrationFeeEnabled?: boolean
  registrationFeeAmount?: number
  installmentEligible?: boolean
  initialDeposit?: number
  finalBalance?: number
  
  // Discount Fields
  discountEligible?: boolean
  discountPilgrimThreshold?: number
  discountPercentage?: number
}

export function hasInstallmentPlan(pkg: Pick<Package, "installmentEligible" | "initialDeposit" | "finalBalance">): boolean {
  return Boolean(pkg.installmentEligible) && Number(pkg.initialDeposit || 0) > 0 && Number(pkg.finalBalance || 0) > 0
}

export function getPackageAvailability(pkg: Pick<Package, "capacity" | "booked" | "remainingSlots" | "salesStatus" | "availabilityStatus">) {
  const remainingSlots = pkg.remainingSlots ?? Math.max(0, Number(pkg.capacity || 0) - Number(pkg.booked || 0))
  const status = pkg.salesStatus === "paused"
    ? "paused"
    : pkg.salesStatus === "closed"
      ? "closed"
      : pkg.availabilityStatus || "available"

  const label = status === "paused"
    ? "Sales paused"
    : status === "closed"
      ? "Sales closed"
      : status === "sold_out"
        ? "Sold out"
        : status === "limited"
          ? `Only ${remainingSlots} slots left`
          : `${remainingSlots} slots available`

  return {
    label,
    remainingSlots,
    status,
    isBookable: status === "available" || status === "limited",
  }
}

// Fallback for types and tests
export const packages: Package[] = []

export const featuredPackages = packages.slice(0, 3)

export async function getPackage(id: string): Promise<Package | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080"
    const res = await fetch(`${API_URL}/api/operator/packages/public/${id}`, { cache: 'no-store' })
    if (!res.ok) return null
    const json = await res.json()
    if (!json.success || !json.data) return null
    
    const p = json.data
    return {
      id: String(p.id),
      name: p.title,
      type: "umrah", // Hardcoded fallback or derive from title
      category: p.serviceLevel || "premium",
      operator: {
        id: p.operator?.id || 1,
        name: p.operator?.companyName || p.operator?.name || "Unknown Operator",
        verified: p.operator?.verificationStatus === 'approved',
        description: p.operator?.description || "",
        rating: p.operator?.trustScore ? Number(p.operator.trustScore) / 20 : 4.5,
        reviews: 0
      },
      priceFrom: Number(p.price || 0),
      duration: p.duration || 10,
      departureDate: p.departureDate || "TBD",
      departureCity: p.departingFrom || "Lagos",
      highlights: p.inclusions || [],
      heroImage: resolvePackageImage(p.images?.[0], p.title, p.slug),
      cardImage: resolvePackageImage(p.images?.[0], p.title, p.slug),
      capacity: p.capacity == null ? undefined : Number(p.capacity),
      booked: p.booked == null ? undefined : Number(p.booked),
      remainingSlots: p.remainingSlots == null ? undefined : Number(p.remainingSlots),
      salesStatus: p.salesStatus,
      availabilityStatus: p.availabilityStatus,
      registrationFeeEnabled: p.registrationFeeEnabled,
      registrationFeeAmount: Number(p.registrationFeeAmount || 0),
      installmentEligible: p.installmentEligible,
      initialDeposit: Number(p.initialDeposit || 0),
      finalBalance: Number(p.finalBalance || 0),
      discountEligible: p.discountEligible,
      discountPilgrimThreshold: Number(p.discountPilgrimThreshold || 0),
      discountPercentage: Number(p.discountPercentage || 0)
    }
  } catch (error) {
    console.error("Failed to fetch package:", error)
    return null
  }
}

export function formatNaira(amount: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(amount)
}

export const departureCities = ["Lagos", "Abuja", "Kano"]
export const packageTypes: { value: PilgrimageType; label: string }[] = [
  { value: "umrah", label: "Umrah" },
  { value: "hajj", label: "Hajj" },
]
export const categories = ["economy", "premium", "family", "standard"]
