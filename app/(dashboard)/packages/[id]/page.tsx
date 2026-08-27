import { notFound } from "next/navigation"
import { getPackage } from "@/lib/packages"
import { PackageDetailsClient } from "@/components/package-details-client"

export default async function PackagePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const pkg = await getPackage(resolvedParams.id)

  if (!pkg) {
    notFound()
  }

  return (
    <div className="bg-background">
      <PackageDetailsClient pkg={pkg} />
    </div>
  )
}
