import { ExchangeWizard } from "@/components/exchange-wizard"

export const metadata = {
  title: "Travel Amenities - UfitGo",
  description: "Find verified local services and travel amenities.",
}

export default function ExchangePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Travel Amenities</h2>
          <p className="text-muted-foreground">Find trusted local services and essential destination guides.</p>
        </div>
      </div>
      
      <ExchangeWizard />
    </div>
  )
}
