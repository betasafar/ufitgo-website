import { BrowseOperatorsClient } from "@/components/browse-operators-client"
import { fetchPublicOperators } from "@/lib/api"
import { Operator } from "@/lib/packages"

export default async function OperatorsPage() {
  let operators: Operator[] = []
  let error = false

  try {
    const data = await fetchPublicOperators(1, 50)
    
    operators = data?.data?.map((apiOp: any) => ({
      id: apiOp.id,
      name: apiOp.name,
      companyName: apiOp.companyName,
      logo: apiOp.logo || apiOp.logoUrl,
      verified: apiOp.verificationStatus === 'approved',
      verificationStatus: apiOp.verificationStatus,
      description: apiOp.description || "",
      rating: Number(apiOp.trustScore || 0) / 20,
      reviews: 0,
      trustScore: apiOp.trustScore,
      yearsOfExperience: apiOp.yearsOfExperience,
      location: apiOp.location,
      activePackagesCount: apiOp.activePackagesCount,
      totalBookings: apiOp.totalBookings,
      tier: apiOp.tier,
      phone: apiOp.phone,
    })) || []
  } catch (e) {
    console.error("Failed to fetch operators for explore page", e)
    error = true
  }

  return (
    <div className="bg-background min-h-screen">
      {error ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-red-500 mb-4 text-lg">Failed to load operators. Please try again later.</p>
        </div>
      ) : (
        <BrowseOperatorsClient initialOperators={operators} />
      )}
    </div>
  )
}
