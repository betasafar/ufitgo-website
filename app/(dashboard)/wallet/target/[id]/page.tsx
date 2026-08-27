"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { getSavingsTargetById, addMoneyToTarget, SavingsTarget } from "@/lib/mock-db"
import { formatNaira } from "@/lib/packages"
import { ArrowLeft, Target, Plus, Package } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TargetDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [target, setTarget] = useState<SavingsTarget | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isFunding, setIsFunding] = useState(false)

  useEffect(() => {
    if (id) {
      setTarget(getSavingsTargetById(id as string) || null)
      setIsLoaded(true)
    }
  }, [id])

  if (!isLoaded) return <div className="p-8">Loading target...</div>

  if (!target) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Target Not Found</h2>
        <Button onClick={() => router.push("/wallet")}>Back to Wallet</Button>
      </div>
    )
  }

  const progress = Math.min(100, (target.savedAmount / target.targetAmount) * 100)
  const remaining = target.targetAmount - target.savedAmount
  
  // Calculate suggested monthly
  const targetDate = new Date(`${target.targetDate}`)
  const now = new Date()
  let monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + targetDate.getMonth() - now.getMonth()
  monthsDiff = Math.max(1, monthsDiff) // Avoid division by zero
  const monthlySuggested = remaining > 0 ? Math.ceil(remaining / monthsDiff) : 0

  const handleSimulateFunding = () => {
    setIsFunding(true)
    setTimeout(() => {
      addMoneyToTarget("demo-user", target.id, 50000)
      setTarget(getSavingsTargetById(target.id) || null)
      setIsFunding(false)
    }, 1000)
  }

  return (
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <Link href="/wallet" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Wallet
        </Link>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{target.category.includes('Umrah') || target.category.includes('Hajj') ? '🕋' : '🎯'}</span>
          <h1 className="text-3xl font-serif font-bold text-foreground">{target.name}</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Progress Card */}
        <div className="md:col-span-2 rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-semibold text-muted-foreground mb-2">Target Progress</h2>
          <div className="flex items-end gap-2 mb-6">
            <span className="text-4xl sm:text-5xl font-serif font-bold text-foreground">
              {formatNaira(target.savedAmount)}
            </span>
            <span className="text-xl text-muted-foreground mb-1 font-serif">
              / {formatNaira(target.targetAmount)}
            </span>
          </div>

          <div className="w-full bg-secondary rounded-full h-4 mb-3">
            <div 
              className="bg-primary h-4 rounded-full transition-all duration-1000 ease-out relative" 
              style={{ width: `${progress}%` }}
            >
              {progress >= 10 && (
                <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-bold text-white">
                  {Math.round(progress)}%
                </span>
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-muted-foreground font-medium border-b border-border pb-6 mb-6">
            <span>{Math.round(progress)}% complete</span>
            <span>Remaining: <span className="text-foreground">{formatNaira(Math.max(0, remaining))}</span></span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleSimulateFunding} disabled={isFunding || remaining <= 0} className="w-full h-12 text-base font-semibold">
              <Plus className="mr-2 h-4 w-4" /> {isFunding ? "Adding..." : "Simulate +₦50k"}
            </Button>
            <Button variant="outline" className="w-full h-12 text-base font-semibold">
              Edit Target
            </Button>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="font-semibold text-muted-foreground mb-4">Your Savings Plan</h3>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Target Date</p>
                <p className="font-semibold text-lg">{target.targetDate}</p>
              </div>
              {remaining > 0 ? (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Suggested Monthly</p>
                  <p className="font-semibold text-lg text-primary">{formatNaira(monthlySuggested)}</p>
                  <p className="text-xs text-muted-foreground mt-1">To reach target by {target.targetDate.split(' ')[0]}</p>
                </div>
              ) : (
                <div className="bg-green-50 text-green-700 p-3 rounded-lg border border-green-100 font-medium text-sm text-center">
                  Target Reached! 🎉
                </div>
              )}
            </div>
          </div>

          {target.packageId && (
            <div className="rounded-2xl border border-border bg-primary/5 p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Package className="h-16 w-16" />
              </div>
              <h3 className="font-semibold text-primary mb-4 relative z-10">Linked Package</h3>
              <div className="space-y-1 relative z-10">
                <p className="text-sm font-medium">UfitGo Verified Package</p>
                <p className="text-xs text-muted-foreground">ID: {target.packageId.toUpperCase()}</p>
                <Link href={`/packages`}>
                  <Button variant="outline" size="sm" className="mt-4 w-full bg-white">
                    View Package
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
