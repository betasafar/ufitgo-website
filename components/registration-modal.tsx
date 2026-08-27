"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Package, formatNaira } from "@/lib/packages"
import { CheckCircle2, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface RegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  pkg: Package
}

export function RegistrationModal({ isOpen, onClose, pkg }: RegistrationModalProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const queryClient = useQueryClient()
  const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"

  const [step, setStep] = useState(1) // 1: Terms/Summary, 2: Travel Details, 3: Success
  const [phone, setPhone] = useState("")
  const [isEditingPhone, setIsEditingPhone] = useState(true)

  // Initialize phone from session if available
  useEffect(() => {
    if (session?.user && (session.user as any).phone) {
      setPhone((session.user as any).phone)
      setIsEditingPhone(false)
    }
  }, [session])
  const [travellers, setTravellers] = useState(1)
  const [specialRequests, setSpecialRequests] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [bookingRef, setBookingRef] = useState("")
  const [paymentUrl, setPaymentUrl] = useState("")
  const [selectedStepsCount, setSelectedStepsCount] = useState(1)
  
  const [promoCodeInput, setPromoCodeInput] = useState("")
  const [appliedPromoCode, setAppliedPromoCode] = useState("")
  const [promoDiscountAmount, setPromoDiscountAmount] = useState(0)
  const [isValidatingPromo, setIsValidatingPromo] = useState(false)
  const [promoError, setPromoError] = useState("")

  const basePackagePrice = (pkg.priceFrom || 0) * travellers
  const groupDiscountEligible = pkg.discountEligible && pkg.discountPilgrimThreshold && travellers >= pkg.discountPilgrimThreshold
  const groupDiscountAmount = groupDiscountEligible ? basePackagePrice * ((pkg.discountPercentage || 0) / 100) : 0
  
  const totalDiscountAmount = groupDiscountAmount + promoDiscountAmount
  const totalPackagePrice = Math.max(0, basePackagePrice - totalDiscountAmount)
  
  const hasRegFee = pkg.registrationFeeEnabled
  const totalRegFee = hasRegFee ? (pkg.registrationFeeAmount || 0) * travellers : 0
  
  const hasInstalment = pkg.installmentEligible
  const totalInitialDeposit = (pkg.initialDeposit || 0) * travellers
  const totalFinalBalance = Math.max(0, totalPackagePrice - totalInitialDeposit)
  
  const paymentSteps = []
  if (hasRegFee) {
    paymentSteps.push({ label: 'Registration Fee', amount: totalRegFee })
  }
  if (hasInstalment) {
    paymentSteps.push({ label: 'Initial Deposit', amount: totalInitialDeposit })
    paymentSteps.push({ label: 'Final Balance', amount: totalFinalBalance })
  } else {
    paymentSteps.push({ label: 'Full Package Price', amount: totalPackagePrice })
  }

  const amountDueToday = paymentSteps.slice(0, selectedStepsCount).reduce((sum, step) => sum + step.amount, 0)

  const handleValidatePromo = async () => {
    if (!promoCodeInput.trim()) return
    setIsValidatingPromo(true)
    setPromoError("")
    try {
      const res = await fetch(`${API_URL}/bookings/validate-promo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify({ code: promoCodeInput }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setPromoError(data.message || "Invalid promo code")
        setPromoDiscountAmount(0)
        setAppliedPromoCode("")
      } else {
        const promo = data.data
        let discountAmt = 0
        if (promo.type === 'percentage') {
          discountAmt = basePackagePrice * (promo.value / 100)
        } else {
          discountAmt = promo.value
        }
        setPromoDiscountAmount(discountAmt)
        setAppliedPromoCode(promo.code)
        setPromoError("")
      }
    } catch (err) {
      setPromoError("Failed to validate promo code")
    } finally {
      setIsValidatingPromo(false)
    }
  }

  // Load saved phone number if it exists
  useEffect(() => {
    if (isOpen) {
      setStep(1) // Reset step when opened
      const savedPhone = localStorage.getItem("ufitgo_phone")
      if (savedPhone) {
        setPhone(savedPhone)
      }
    }
  }, [isOpen])

  const handleNextToDetails = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(2)
  }

  const createBookingMutation = useMutation({
    mutationFn: async (bookingData: any) => {
      const res = await fetch(`${API_URL}/bookings`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.accessToken}`,
        },
        body: JSON.stringify(bookingData),
      })
      if (!res.ok) throw new Error("Failed to create booking")
      return res.json()
    },
    onSuccess: (data) => {
      setBookingRef(data.bookingRef || "")
      setIsSubmitting(false)
      setStep(3)
      queryClient.invalidateQueries({ queryKey: ["bookings"] })
    },
    onError: () => {
      setIsSubmitting(false)
    }
  })

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.id || !phone) return

    setIsSubmitting(true)
    
    createBookingMutation.mutate({
      packageId: parseInt(pkg.id, 10),
      packageName: pkg.name,
      operatorId: pkg.operator.id, // Assuming operator has id
      operatorName: pkg.operator.name,
      totalAmount: totalPackagePrice + totalRegFee,
      pilgrimPhone: phone,
      numberOfPilgrims: travellers,
      departureDate: pkg.departureDate,
      specialRequests,
      promoCode: appliedPromoCode || undefined,
    }, {
      onSuccess: async (data) => {
        try {
          const bookingId = data.bookingId || data.id || data.bookingRef;
          // Trigger payment
          const payRes = await fetch(`${API_URL}/bookings/${bookingId}/pay`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session as any)?.accessToken}`,
            },
            body: JSON.stringify({ amount: amountDueToday }),
          })
          const payData = await payRes.json()
          
          if (payRes.ok && payData.paymentUrl) {
            setPaymentUrl(payData.paymentUrl)
            // Redirect to Paystack Hosted Checkout
            window.location.href = payData.paymentUrl
          } else if (payRes.ok && payData.authorization_url) {
            setPaymentUrl(payData.authorization_url)
            window.location.href = payData.authorization_url
          } else {
            console.error("Payment initialization failed:", payData)
            // If payment init fails, just show the success screen with warning
            setStep(3)
          }
        } catch (error) {
          console.error("Failed to initialize payment:", error)
          setStep(3)
        }
      }
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0">
        <div className="bg-primary/5 px-6 pt-8 pb-6 border-b border-border">
          <DialogTitle className="text-xl font-bold font-serif mb-1">
            {step === 1 ? "Register & Lock In Package" : step === 2 ? "Traveller Details" : "Booking Confirmed"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Review the terms and proceed to secure your slot." 
              : step === 2 
              ? "Provide your contact and travel details."
              : "Your registration fee has been processed successfully."}
          </DialogDescription>
        </div>

        <div className="px-6 py-6 max-h-[70vh] overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <h4 className="font-semibold mb-2">{pkg.name}</h4>
                <div className="flex justify-between text-sm mb-1 text-muted-foreground">
                  <span>Starting Price</span>
                  <span className="font-medium text-foreground">{formatNaira(pkg.priceFrom)}</span>
                </div>
                <div className="flex justify-between font-bold mt-3 pt-3 border-t border-border">
                  <span>Amount Due Today</span>
                  <span className="text-primary">{formatNaira(amountDueToday)}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-3 text-blue-900">
                  <Info className="h-4 w-4 text-blue-600" />
                  What you are paying today:
                </h4>
                <ul className="space-y-2 text-sm text-blue-800">
                  {hasRegFee && (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong className="text-blue-900">Registration Fee ({formatNaira(totalRegFee)}):</strong> Officially secures your slot, non-refundable administrative fee.</span>
                    </li>
                  )}
                  {hasInstalment ? (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong className="text-blue-900">Initial Deposit ({formatNaira(totalInitialDeposit)}):</strong> Secures your flexible payment plan. Remaining balance can be paid later.</span>
                    </li>
                  ) : (
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
                      <span><strong className="text-blue-900">Full Package Price ({formatNaira(totalPackagePrice)}):</strong> Full payment required to secure booking.</span>
                    </li>
                  )}
                </ul>
              </div>

              <Button onClick={handleNextToDetails} className="w-full h-12 text-base font-semibold rounded-full">
                Accept Terms & Continue
              </Button>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Contact Phone Number</label>
                  {!isEditingPhone && (
                    <button
                      type="button"
                      onClick={() => setIsEditingPhone(true)}
                      className="text-xs text-primary font-semibold hover:underline"
                    >
                      Change contact
                    </button>
                  )}
                </div>
                
                {isEditingPhone ? (
                  <div className="flex">
                    <div className="flex items-center justify-center rounded-l-md border border-r-0 border-border bg-secondary px-3 text-sm text-muted-foreground">
                      +234
                    </div>
                    <Input 
                      type="tel" 
                      placeholder="800 000 0000" 
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value)
                        localStorage.setItem("ufitgo_phone", e.target.value)
                      }}
                      className="rounded-l-none h-12 focus-visible:ring-primary"
                      required
                      autoFocus={!((session?.user as any)?.phone)}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-between p-3 border border-border rounded-xl bg-secondary/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold text-sm">☎️</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{phone}</p>
                        <p className="text-xs text-muted-foreground">Saved contact will be used for booking</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Travellers Stepper */}
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                  <label className="text-sm font-medium">Number of travellers</label>
                  <span className="text-xs text-primary font-medium">Total Registration: {formatNaira(travellers * 50000)}</span>
                </div>
                
                <div className="flex items-center justify-between rounded-lg border border-border p-2">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    onClick={() => setTravellers(Math.max(1, travellers - 1))}
                    disabled={travellers <= 1}
                  >
                    -
                  </Button>
                  <span className="font-semibold">{travellers} {travellers === 1 ? 'traveller' : 'travellers'}</span>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    onClick={() => setTravellers(travellers + 1)}
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Payment Steps Selection */}
              <div className="space-y-3 pt-4 border-t border-border">
                <h4 className="font-semibold text-sm">Select what to pay today</h4>
                <div className="space-y-2">
                  {paymentSteps.map((step, index) => {
                    const isSelected = index < selectedStepsCount
                    const isDisabled = index > selectedStepsCount || (index === 0) || (index === paymentSteps.length - 1 && hasInstalment) // Can't unselect step 0. Can't select final balance today if it's an installment plan usually, but we'll allow it if they want. Let's just enforce sequential.
                    
                    // Actually, let's just make it a clean sequential selector.
                    return (
                      <div 
                        key={index} 
                        className={cn(
                          "flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all",
                          isSelected ? "border-primary bg-primary/5" : "border-border bg-card",
                          (index === 0) ? "opacity-100 cursor-default" : ""
                        )}
                        onClick={() => {
                          if (index === 0) return // Cannot unselect first step
                          
                          if (isSelected) {
                            // Unselect this and all subsequent steps
                            setSelectedStepsCount(index)
                          } else {
                            // Select this and all preceding steps
                            setSelectedStepsCount(index + 1)
                          }
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-5 h-5 rounded-full border flex items-center justify-center",
                            isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground"
                          )}>
                            {isSelected && <CheckCircle2 className="w-3 h-3" />}
                          </div>
                          <div>
                            <p className={cn("font-medium text-sm", isSelected ? "text-foreground" : "text-muted-foreground")}>{step.label}</p>
                          </div>
                        </div>
                        <div className="font-bold text-sm">
                          {formatNaira(step.amount)}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Discounts & Promos */}
              <div className="space-y-4 pt-2 border-t border-border">
                {groupDiscountAmount > 0 && (
                  <div className="flex justify-between text-sm bg-green-50 p-2 rounded text-green-700">
                    <span>Group Volume Discount</span>
                    <span className="font-bold">- {formatNaira(groupDiscountAmount)}</span>
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promo Code</label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter code" 
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      disabled={!!appliedPromoCode}
                    />
                    <Button 
                      type="button" 
                      variant={appliedPromoCode ? "outline" : "secondary"}
                      onClick={appliedPromoCode ? () => { setAppliedPromoCode(""); setPromoDiscountAmount(0); setPromoCodeInput(""); } : handleValidatePromo}
                      disabled={isValidatingPromo || (!promoCodeInput.trim() && !appliedPromoCode)}
                    >
                      {isValidatingPromo ? "..." : appliedPromoCode ? "Remove" : "Apply"}
                    </Button>
                  </div>
                  {promoError && <p className="text-xs text-red-500">{promoError}</p>}
                  {appliedPromoCode && <p className="text-xs text-green-600 font-medium">Promo code '{appliedPromoCode}' applied! (- {formatNaira(promoDiscountAmount)})</p>}
                </div>
                
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total Amount Due Today</span>
                  <span className="text-primary">{formatNaira(amountDueToday)}</span>
                </div>
              </div>

              {/* Special Requests */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Any special requests? (Optional)</label>
                <Textarea 
                  placeholder="e.g. Travelling with children, room preferences, wheelchair access..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="resize-none h-24"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full h-14 text-base font-semibold rounded-full shadow-md bg-primary hover:bg-primary/90" disabled={isSubmitting || !phone}>
                  {isSubmitting && !paymentUrl ? "Processing Payment..." : isSubmitting && paymentUrl ? "Redirecting to Paystack..." : `Pay ${formatNaira(amountDueToday)} & Register`}
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-3">
                  By clicking Pay, you will be redirected to complete your payment.
                </p>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center text-center py-4">
              <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold mb-2">Registration Logged!</h3>
              <p className="text-muted-foreground mb-6">
                Your booking reference has been created. Please complete your payment to secure the slot.
              </p>

              <div className="w-full bg-secondary/30 rounded-xl p-4 mb-8 text-left border border-border">
                <div className="text-sm text-muted-foreground mb-1">Booking Reference</div>
                <div className="font-mono text-lg font-bold text-foreground mb-4 tracking-wider">{bookingRef}</div>
                
                <div className="flex justify-between items-center text-sm">
                  <span>Amount Paid</span>
                  <span className="font-bold text-green-600">{formatNaira(amountDueToday)}</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                <Button 
                  onClick={() => router.push("/bookings")} 
                  className="w-full h-12 text-base font-semibold rounded-full"
                >
                  Track My Booking
                </Button>
                <Button 
                  variant="outline"
                  onClick={onClose} 
                  className="w-full h-12 text-base font-semibold rounded-full"
                >
                  Continue Exploring
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
