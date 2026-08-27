import { ExchangeWizard } from "@/components/exchange-wizard"

export const metadata = {
  title: "Money Exchange - UfitGo",
  description: "Exchange your Naira for local cash seamlessly.",
}

export default function ExchangePage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2 mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Money Exchange</h2>
          <p className="text-muted-foreground">Find a trusted agent and get local cash securely.</p>
        </div>
      </div>
      
      <ExchangeWizard />
    </div>
  )
}
