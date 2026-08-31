"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { createSavingsTarget } from "@/lib/mock-db"
import { formatNaira } from "@/lib/packages"
import { ArrowLeft, Target, CalendarDays, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"

function CreateTargetForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const initialPackageId = searchParams.get("packageId")
  const initialPackageName = searchParams.get("packageName")
  const initialTargetAmount = searchParams.get("targetAmount")
  const initialCategory = searchParams.get("category") || "Umrah"

  const [step, setStep] = useState(initialPackageId ? 3 : 1)
  const [category, setCategory] = useState<"Umrah" | "Hajj" | "Family Umrah" | "Custom Goal">(initialCategory as any)
  const [customName, setCustomName] = useState(initialPackageName || "")
  const [targetAmount, setTargetAmount] = useState(initialTargetAmount ? parseInt(initialTargetAmount) : 0)
  const [targetMonth, setTargetMonth] = useState("")
  const [targetYear, setTargetYear] = useState("")
  const [frequency, setFrequency] = useState<"Monthly" | "Weekly" | "Manual">("Monthly")

  const [isCreating, setIsCreating] = useState(false)

  const handleNext = () => setStep((s) => Math.min(s + 1, 5))
  const handleBack = () => setStep((s) => Math.max(s - 1, 1))

  const handleCreate = () => {
    setIsCreating(true)
    setTimeout(() => {
      const name = customName || (category === "Custom Goal" ? "My Target" : `My ${category}`)
      const date = `${targetMonth} ${targetYear}`
      
      const newTarget = createSavingsTarget({
        userId: "demo-user", // In real app, from session
        name,
        category,
        targetAmount,
        targetDate: date,
        packageId: initialPackageId || undefined
      })
      
      router.push(`/wallet/target/${newTarget.id}`)
    }, 1000)
  }

  // Calculate savings plan
  let suggestedAmount = 0
  let planText = ""
  if (targetAmount > 0 && targetMonth && targetYear) {
    const targetDate = new Date(`${targetMonth} 1, ${targetYear}`)
    const now = new Date()
    const monthsDiff = (targetDate.getFullYear() - now.getFullYear()) * 12 + targetDate.getMonth() - now.getMonth()
    
    if (monthsDiff > 0) {
      if (frequency === "Monthly") {
        suggestedAmount = Math.ceil(targetAmount / monthsDiff)
        planText = `Save approximately ${formatNaira(suggestedAmount)} every month`
      } else if (frequency === "Weekly") {
        const weeksDiff = Math.max(1, Math.round(monthsDiff * 4.33))
        suggestedAmount = Math.ceil(targetAmount / weeksDiff)
        planText = `Save approximately ${formatNaira(suggestedAmount)} every week`
      }
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <button onClick={() => {
          if (step > 1 && !initialPackageId) handleBack()
          else router.back()
        }} className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {step > 1 && !initialPackageId ? "Back" : "Cancel"}
        </button>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-foreground">Create Savings Target</h1>
        <div className="flex gap-2 mt-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-secondary"}`} />
          ))}
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
        {/* STEP 1: Goal */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <Target className="h-5 w-5 text-primary" /> What are you saving for?
              </h2>
              <p className="text-muted-foreground text-sm">Select the purpose of your savings.</p>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              {["Umrah", "Hajj", "Family Umrah", "Custom Goal"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat as any)}
                  className={`p-4 rounded-xl border-2 text-left font-semibold transition-all ${
                    category === cat ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/30"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{cat.includes('Umrah') || cat.includes('Hajj') ? '🕋' : '🎯'}</span>
                  {cat}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1.5">Target Name (Optional)</label>
              <input 
                type="text" 
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={`e.g. My ${category} 2027`}
                className="w-full rounded-lg border border-input bg-transparent px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button onClick={handleNext} className="w-full h-12 text-base mt-4">Continue</Button>
          </div>
        )}

        {/* STEP 2: Amount */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <Coins className="h-5 w-5 text-primary" /> Set Your Target Amount
              </h2>
              <p className="text-muted-foreground text-sm">How much do you need to save?</p>
            </div>
            
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">₦</span>
              <input 
                type="number" 
                value={targetAmount || ""}
                onChange={(e) => setTargetAmount(parseInt(e.target.value) || 0)}
                placeholder="1,850,000"
                className="w-full rounded-xl border-2 border-primary/20 bg-primary/5 px-10 py-6 text-3xl font-bold outline-none focus:border-primary transition-colors"
              />
            </div>

            <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed">
              <strong>Tip:</strong> Don't worry if you're not sure about the exact amount. You can always update your target amount later as package prices become clearer.
            </div>

            <Button onClick={handleNext} disabled={targetAmount <= 0} className="w-full h-12 text-base mt-4">Continue</Button>
          </div>
        )}

        {/* STEP 3: Date */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2 mb-1">
                <CalendarDays className="h-5 w-5 text-primary" /> When do you plan to travel?
              </h2>
              <p className="text-muted-foreground text-sm">This helps us calculate your savings plan.</p>
            </div>

            {initialPackageId && (
              <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl mb-6 flex items-start gap-3">
                <span className="text-xl">🕋</span>
                <div>
                  <p className="font-semibold text-primary">Linked to {initialPackageName}</p>
                  <p className="text-sm text-primary/80">Target automatically set to {formatNaira(targetAmount)}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <select 
                value={targetMonth} 
                onChange={(e) => setTargetMonth(e.target.value)}
                className="w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Select Month</option>
                {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "Ramadan"].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>

              <select 
                value={targetYear} 
                onChange={(e) => setTargetYear(e.target.value)}
                className="w-full rounded-xl border border-input bg-transparent px-4 py-3 outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="" disabled>Select Year</option>
                {[2025, 2026, 2027, 2028].map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <Button onClick={handleNext} disabled={!targetMonth || !targetYear} className="w-full h-12 text-base mt-4">Continue</Button>
          </div>
        )}

        {/* STEP 4: Savings Plan */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-xl font-bold mb-1">Choose a Savings Plan</h2>
              <p className="text-muted-foreground text-sm">How often do you want to save?</p>
            </div>
            
            <div className="space-y-3">
              {["Monthly", "Weekly", "Manual"].map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq as any)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between font-medium transition-all ${
                    frequency === freq ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-border hover:border-primary/30"
                  }`}
                >
                  {freq}
                  {frequency === freq && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              ))}
            </div>

            {frequency !== "Manual" && planText && (
              <div className="bg-green-50 text-green-800 p-4 rounded-xl text-center border border-green-100">
                <p className="text-sm font-medium uppercase tracking-wider text-green-600/80 mb-1">Suggested Plan</p>
                <p className="font-bold text-lg">{planText}</p>
                <p className="text-xs text-green-700/70 mt-1">to reach your target by {targetMonth} {targetYear}</p>
              </div>
            )}

            <Button onClick={handleNext} className="w-full h-12 text-base mt-4">Review Target</Button>
          </div>
        )}

        {/* STEP 5: Review */}
        {step === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-center mb-6">Ready to start saving?</h2>
              
              <div className="bg-secondary/30 rounded-2xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-muted-foreground">Target Name</span>
                  <span className="font-semibold">{customName || (category === "Custom Goal" ? "My Target" : `My ${category}`)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-muted-foreground">Target Amount</span>
                  <span className="font-bold text-lg text-primary">{formatNaira(targetAmount)}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border pb-4">
                  <span className="text-muted-foreground">Travel Date</span>
                  <span className="font-semibold">{targetMonth} {targetYear}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Savings Plan</span>
                  <span className="font-semibold text-right">
                    {frequency !== "Manual" && planText ? (
                      <>
                        <span className="block">{frequency}</span>
                        <span className="text-sm font-normal text-muted-foreground">{formatNaira(suggestedAmount)} / {frequency === "Monthly" ? "mo" : "wk"}</span>
                      </>
                    ) : (
                      "Manual saving"
                    )}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleCreate} 
              disabled={isCreating}
              className="w-full h-14 text-lg font-semibold mt-4"
            >
              {isCreating ? "Creating Target..." : "Create My Target"}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function CreateTargetPage() {
  return (
    <Suspense fallback={<div className="p-8">Loading...</div>}>
      <CreateTargetForm />
    </Suspense>
  )
}
