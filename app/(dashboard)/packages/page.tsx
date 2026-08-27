import { BrowsePackagesClient } from "@/components/browse-packages-client"
import { packages } from "@/lib/packages"

export default function PackagesPage() {
  return (
    <div className="bg-background">
      <BrowsePackagesClient initialPackages={packages} />
    </div>
  )
}
