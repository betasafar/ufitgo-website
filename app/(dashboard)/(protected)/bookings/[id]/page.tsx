"use client"

import { use, useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import PaystackPop from '@paystack/inline-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from "next-auth/react"
import { formatNaira } from "@/lib/packages"
import { getBookingJourneyStep, getBookingStatusPresentation, isCancelledBooking } from "@/lib/booking"
import { ArrowLeft, CreditCard, ReceiptText, ShieldCheck, CheckCircle2, Wallet, BadgeCheck, FileText, Image as ImageIcon, Upload, IdCard, Loader2, Eye, EyeOff } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
export default function BookingDetailsPage({ params }: Readonly<{ params: Promise<{ id: string }> }>) {
  const router = useRouter()
  const { id } = use(params)
  const { data: session } = useSession()
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [installmentAmount, setInstallmentAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null)
  const [deletingDocType, setDeletingDocType] = useState<string | null>(null)
  const [reuseDialogOpen, setReuseDialogOpen] = useState(false)
  const [selectedDocumentTypes, setSelectedDocumentTypes] = useState<string[]>([])
  const [isNinVisible, setIsNinVisible] = useState(false)
  const [ninInput, setNinInput] = useState("")

  const queryClient = useQueryClient()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: async () => {
      if (!session?.accessToken) return null
      
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings/${id}`, {
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        }
      })
      if (!res.ok) throw new Error("Failed to fetch booking details")
      return res.json()
    },
    enabled: !!session?.accessToken && !!id,
  })

  useEffect(() => {
    if (booking?.nin) {
      setNinInput(booking.nin)
    }
  }, [booking?.nin])

  const { data: profile } = useQuery({
    queryKey: ['profile', booking?.userId],
    queryFn: async () => {
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/profile/${booking.userId}`, {
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`,
        }
      })
      if (!res.ok) return null
      return res.json()
    },
    enabled: !!session?.accessToken && !!booking?.userId,
  })

  const uploadMutation = useMutation({
    mutationFn: async ({ documentType, file }: { documentType: string, file: File }) => {
      if (!session?.accessToken || !booking?.id) throw new Error("No session or booking")
      const formData = new FormData()
      formData.append("documentType", documentType)
      formData.append("file", file)

      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings/${booking.id}/documents`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        },
        body: formData,
      })
      if (!res.ok) throw new Error("Failed to upload document")
      return res.json()
    },
    onMutate: (variables) => {
      setUploadingDocType(variables.documentType)
    },
    onSettled: () => {
      setUploadingDocType(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (documentType: string) => {
      if (!session?.accessToken || !booking?.id) throw new Error("No session or booking")
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings/${booking.id}/documents/${documentType}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        },
      })
      if (!res.ok) throw new Error("Failed to delete document")
      return res.json()
    },
    onMutate: (variables) => {
      setDeletingDocType(variables)
    },
    onSettled: () => {
      setDeletingDocType(null)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
    }
  })

  const reuseMutation = useMutation({
    mutationFn: async (documentTypes: string[]) => {
      if (!session?.accessToken || !booking?.id) throw new Error("No session or booking")
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings/${booking.id}/documents/reuse-from-profile`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ documentTypes }),
      })
      if (!res.ok) throw new Error("Failed to reuse documents")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
      setReuseDialogOpen(false)
    }
  })

  const saveNinMutation = useMutation({
    mutationFn: async (nin: string) => {
      if (!session?.accessToken || !booking?.id) throw new Error("No session or booking")
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings/${booking.id}/nin`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nin }),
      })
      if (!res.ok) throw new Error("Failed to save NIN")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', id] })
    }
  })

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-secondary/50"></div>
          <div>
            <div className="h-8 w-48 bg-secondary/50 rounded-md mb-2"></div>
            <div className="h-4 w-32 bg-secondary/30 rounded-md"></div>
          </div>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="h-64 bg-secondary/20 rounded-2xl border border-border"></div>
            <div className="h-48 bg-secondary/20 rounded-2xl border border-border"></div>
          </div>
          <div className="space-y-6">
            <div className="h-72 bg-secondary/20 rounded-2xl border border-border"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Booking not found</h2>
        <Button onClick={() => router.push("/bookings")}>Back to Bookings</Button>
      </div>
    )
  }

  if (isCancelledBooking(booking)) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-xl font-bold">Booking not available</h2>
        <p className="text-muted-foreground">This booking has been cancelled and is no longer active.</p>
        <Button onClick={() => router.push("/bookings")}>Back to Bookings</Button>
      </div>
    )
  }

  const paymentBreakdown = booking.paymentBreakdown
  const totalPrice = Number(paymentBreakdown?.totalAmountPayable ?? booking.totalAmount ?? 0)
  const amountPaid = Number(paymentBreakdown?.totalPaid ?? booking.amountPaid ?? 0)
  const balance = Math.max(0, Number(paymentBreakdown?.totalOutstanding ?? totalPrice - amountPaid))
  const progressPercent = totalPrice > 0 ? Math.min(100, Math.round((amountPaid / totalPrice) * 100)) : 0
  const registrationPaid = Number(paymentBreakdown?.registration?.paid ?? booking.registrationAmountPaid ?? 0)
  const installments = Array.isArray(booking.installments) ? booking.installments : []
  const journeyStep = getBookingJourneyStep(booking)
  const statusPresentation = getBookingStatusPresentation(booking)
  const journeySteps = [
    { title: "Secure Booking", subtitle: "Registration" },
    { title: "UfitGo Concierge", subtitle: "Documents" },
    { title: "Payment Plan", subtitle: "Installments" },
    { title: "Travel Ready", subtitle: "Fulfillment" },
  ]

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = parseInt(installmentAmount.replace(/,/g, ""))
    if (isNaN(amount) || amount <= 0 || amount > balance) return

    setIsProcessing(true)
    
    try {
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api";
      const callbackUrl = window.location.origin + `/dashboard/bookings/${booking.id}`
      const res = await fetch(`${API_URL}/bookings/${booking.id}/installments`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session?.accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, callbackUrl })
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("Payment Initialization Response:", data);
        
        if (data.checkoutMode === 'native' && data.accessCode) {
          const paystack = new PaystackPop();
          paystack.resumeTransaction(data.accessCode);
        } else if (data.paymentUrl || data.authorization_url) {
          window.location.href = data.paymentUrl || data.authorization_url;
        }

        // Invalidate cache to refetch
        queryClient.invalidateQueries({ queryKey: ['booking', id] })
        queryClient.invalidateQueries({ queryKey: ['bookings'] })
        
        setPayModalOpen(false);
        setInstallmentAmount("");
      } else {
        const err = await res.json();
        alert(err.message || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error", error);
      alert("An error occurred while processing the payment.");
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 lg:p-8">
      <div className="mb-8 flex items-center gap-4 border-b border-border pb-6">
        <Button variant="ghost" size="icon" onClick={() => router.push("/bookings")}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">My booking</p>
          <h1 className="mt-1 text-2xl font-bold text-foreground">{booking.packageName}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Reference <span className="font-mono text-foreground">{booking.bookingRef}</span></p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        
        <div className="min-w-0 space-y-8">
          <section className="border-b border-border pb-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Trip overview</p>
                <p className="mt-1 text-lg font-bold text-foreground">{booking.operatorName}</p>
              </div>
              <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusPresentation.className}`}>{statusPresentation.label}</span>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm sm:grid-cols-3">
              <div>
                <p className="text-xs font-medium text-muted-foreground">Travellers</p>
                <p className="mt-1 font-semibold text-foreground">{booking.numberOfPilgrims}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Departure</p>
                <p className="mt-1 font-semibold text-foreground">{booking.departureDate || "To be confirmed"}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground">Booking status</p>
                <p className="mt-1 font-semibold text-foreground">{statusPresentation.label}</p>
              </div>
            </div>
          </section>

          <section className="border-b border-border pb-8">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">Your journey</h2>
                <p className="text-sm text-muted-foreground">Follow each step as your pilgrimage plans progress.</p>
              </div>
            </div>
            <ol className="grid gap-4 sm:grid-cols-4">
              {journeySteps.map((step, index) => {
                const isComplete = index < journeyStep
                const isCurrent = index === journeyStep
                let stepClassName = "border-border bg-secondary text-muted-foreground"
                if (isComplete) stepClassName = "border-primary bg-primary text-primary-foreground"
                if (isCurrent) stepClassName = "border-primary bg-primary/10 text-primary"
                return (
                  <li key={step.title} className="flex items-center gap-3 sm:block">
                    <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-bold ${stepClassName}`}>
                      {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.subtitle}</p>
                    </div>
                  </li>
                )
              })}
            </ol>
            <div className="mt-5 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">
              {journeyStep === 0 && "Complete the required registration payment to secure your place."}
              {journeyStep === 1 && "Your booking is secured. A UfitGo Concierge will guide you through document preparation."}
              {journeyStep === 2 && "Your documents are progressing. Continue with your package payment plan when ready."}
              {journeyStep === 3 && "Your payment plan is complete. Your travel fulfilment updates will appear here."}
            </div>
          </section>

          {journeyStep === 1 && (
            <div className="border-l-2 border-emerald-600 bg-emerald-50/60 px-5 py-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <div>
                  <h3 className="font-bold text-emerald-950">Your booking is with Concierge</h3>
                  <p className="mt-1 text-sm leading-6 text-emerald-900/80">Submit your travel documents below. Your concierge will review them and keep you informed as your booking moves to the payment plan.</p>
                </div>
              </div>
            </div>
          )}

          {journeyStep === 3 && (
            <div className="border-l-2 border-green-600 bg-green-50/60 px-5 py-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
                <div>
                  <h3 className="font-bold text-green-950">Travel payment complete</h3>
                  <p className="mt-1 text-sm leading-6 text-green-900/80">Your booking is financially complete. Travel and fulfilment updates will be shared here as they become available.</p>
                </div>
              </div>
            </div>
          )}

          {/* Required Documents */}
          {journeyStep >= 1 && <section className="rounded-lg border border-border bg-card p-5 sm:p-6">
            <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Required documents</h2>
                <p className="text-sm text-muted-foreground">Upload these to complete your booking</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                Action Required
              </span>
            </div>

            {profile?.data && (profile.data.nin || profile.data.passportUrl || profile.data.photoUrl) && (!booking.nin || !booking.passportUrl || !booking.photoUrl) && (
              <div className="mb-6 grid gap-4 border-b border-border bg-secondary/40 p-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">Saved documents available</h4>
                    <p className="text-sm text-muted-foreground">Review the saved documents you want to add to this booking.</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-md"
                  onClick={() => {
                    setSelectedDocumentTypes([
                      ...(profile.data.nin ? ["nin"] : []),
                      ...(profile.data.passportUrl ? ["passport"] : []),
                      ...(profile.data.photoUrl ? ["photo"] : []),
                    ])
                    setReuseDialogOpen(true)
                  }}
                >
                  Review documents
                </Button>
              </div>
            )}

            <div className="divide-y divide-border border-y border-border">
              <div className="grid gap-4 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(240px,auto)] sm:items-center">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <IdCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">National ID (NIN)</h4>
                    <p className="text-sm text-muted-foreground">11-digit number</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:justify-end">
                  {booking.nin ? (
                    <div className="flex w-full items-center justify-between gap-3 bg-secondary/50 px-3 py-2 sm:w-auto">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground font-medium">Submitted NIN</span>
                        <span className="text-sm font-semibold tracking-wider font-mono">{booking.nin}</span>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                    </div>
                  ) : (
                    <div className="flex gap-2 w-full">
                      <Input 
                        placeholder="Enter 11-digit NIN" 
                        value={ninInput}
                        onChange={(e) => setNinInput(e.target.value.replace(/\D/g, '').slice(0, 11))}
                        className="font-mono text-sm"
                        maxLength={11}
                      />
                      <Button 
                        onClick={() => saveNinMutation.mutate(ninInput)} 
                        disabled={ninInput.length !== 11 || saveNinMutation.isPending}
                        className="shrink-0"
                      >
                        {saveNinMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-secondary/20">
                <DocumentRow 
                  title="International Passport"
                  subtitle="Bio-data page, PDF/JPG"
                  icon={FileText}
                  documentType="passport"
                  currentUrl={booking.passportUrl}
                  isUploading={uploadingDocType === "passport"}
                  isDeleting={deletingDocType === "passport"}
                  onUpload={(type: string, file: File) => uploadMutation.mutate({ documentType: type, file })}
                  onDelete={(type: string) => deleteMutation.mutate(type)}
                  noBorder
                />

                <div className="flex items-center gap-2 border-t border-blue-100 bg-blue-50/50 px-4 py-3 text-sm text-blue-800">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
                  <span>Ensure at least 6 months validity remains before your travel date.</span>
                </div>
              </div>

              <DocumentRow 
                title="Passport Photograph"
                subtitle="White background"
                icon={ImageIcon}
                documentType="photo"
                currentUrl={booking.photoUrl}
                isUploading={uploadingDocType === "photo"}
                isDeleting={deletingDocType === "photo"}
                onUpload={(type: string, file: File) => uploadMutation.mutate({ documentType: type, file })}
                onDelete={(type: string) => deleteMutation.mutate(type)}
              />
            </div>
          </section>}

          <Dialog open={reuseDialogOpen} onOpenChange={(open) => {
            setReuseDialogOpen(open)
            if (!open) setIsNinVisible(false)
          }}>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Review saved documents</DialogTitle>
                <DialogDescription>
                  Select the profile documents to add to this booking. Existing booking documents are only replaced when selected here.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {[
                  { type: "nin", label: "National ID (NIN)", available: Boolean(profile?.data?.nin), existing: Boolean(booking.nin), value: profile?.data?.nin },
                  { type: "passport", label: "International Passport", available: Boolean(profile?.data?.passportUrl), existing: Boolean(booking.passportUrl), url: profile?.data?.passportUrl },
                  { type: "photo", label: "Passport Photograph", available: Boolean(profile?.data?.photoUrl), existing: Boolean(booking.photoUrl), url: profile?.data?.photoUrl },
                ].filter((document) => document.available).map((document) => (
                  <div key={document.type} className="flex items-center justify-between gap-4 border border-border p-4">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{document.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {document.existing ? "Replaces the document currently on this booking" : "Adds your saved document to this booking"}
                      </p>
                      {document.type === "nin" && document.value && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="font-mono text-sm tracking-wider">{isNinVisible ? document.value : `${"*".repeat(Math.max(document.value.length - 3, 0))}${document.value.slice(-3)}`}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setIsNinVisible((visible) => !visible)}
                            aria-label={isNinVisible ? "Hide saved NIN" : "Reveal saved NIN"}
                            title={isNinVisible ? "Hide saved NIN" : "Reveal saved NIN"}
                          >
                            {isNinVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      )}
                      {document.type === "passport" && document.url && (
                        <a href={document.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline">
                          <Eye className="h-4 w-4" />
                          View saved passport
                        </a>
                      )}
                      {document.type === "photo" && document.url && (
                        <a href={document.url} target="_blank" rel="noopener noreferrer" className="mt-3 block w-fit" title="View saved passport photograph">
                          <img src={document.url} alt="Saved passport photograph" className="h-16 w-16 border border-border object-cover" />
                        </a>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocumentTypes.includes(document.type)}
                      onChange={(event) => setSelectedDocumentTypes((current) => event.target.checked
                        ? [...current, document.type]
                        : current.filter((type) => type !== document.type))}
                      className="h-4 w-4 shrink-0 accent-primary"
                      aria-label={`Reuse ${document.label}`}
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setReuseDialogOpen(false)} disabled={reuseMutation.isPending}>Cancel</Button>
                <Button onClick={() => reuseMutation.mutate(selectedDocumentTypes)} disabled={!selectedDocumentTypes.length || reuseMutation.isPending}>
                  {reuseMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Reuse selected documents
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Right Column: Financials */}
        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <div className="flex items-center justify-between bg-[#173c32] px-5 py-4 text-white">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-white/10">
                  <Wallet className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="text-sm font-bold">Payment plan</h3>
                  <p className="text-xs text-white/70">{progressPercent}% of your trip funded</p>
                </div>
              </div>
              <span className="rounded-full border border-white/20 px-2.5 py-1 text-xs font-semibold">{balance === 0 ? "Paid in full" : "In progress"}</span>
            </div>

            <div className="p-5">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Total trip cost</p>
                  <p className="mt-1 text-2xl font-bold tracking-normal text-foreground">{formatNaira(totalPrice)}</p>
                </div>
                <p className="text-right text-xs text-muted-foreground">Includes registered<br />payment stages</p>
              </div>

              <div className="mb-5 h-2 overflow-hidden rounded-full bg-secondary">
                <div className="h-full rounded-full bg-emerald-600 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="grid grid-cols-2 divide-x divide-border border-y border-border">
                <div className="py-4 pr-4">
                  <p className="text-xs font-medium text-muted-foreground">Paid so far</p>
                  <p className="mt-1 text-lg font-bold text-emerald-700">{formatNaira(amountPaid)}</p>
                </div>
                <div className="py-4 pl-4">
                  <p className="text-xs font-medium text-muted-foreground">Remaining</p>
                  <p className="mt-1 text-lg font-bold text-foreground">{formatNaira(balance)}</p>
                </div>
              </div>

              {balance > 0 && (journeyStep === 0 || journeyStep === 2) && (
                <Button className="mt-5 h-11 w-full rounded-md font-semibold" onClick={() => setPayModalOpen(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  {journeyStep === 0 ? "Complete Registration" : "Make a Payment"}
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground">Payment activity</h3>
              <span className="text-xs text-muted-foreground">{installments.length + (registrationPaid > 0 ? 1 : 0)} recorded</span>
            </div>
            <div className="divide-y divide-border">
              {registrationPaid > 0 && <div className="flex items-center justify-between py-3 text-sm first:pt-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50">
                    <ReceiptText className="h-4 w-4 text-emerald-700" />
                  </div>
                  <div>
                    <p className="font-medium">Registration payment</p>
                    <p className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-semibold text-emerald-700">{formatNaira(registrationPaid)}</span>
              </div>}

              {installments.map((inst: any) => (
                <div key={inst.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50">
                      <ReceiptText className="h-4 w-4 text-emerald-700" />
                    </div>
                    <div>
                      <p className="font-medium">Package payment</p>
                      <p className="text-xs text-muted-foreground">{new Date(inst.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-emerald-700">{formatNaira(inst.amount)}</span>
                </div>
              ))}
              {registrationPaid === 0 && installments.length === 0 && <p className="py-3 text-sm text-muted-foreground">No payments have been recorded yet.</p>}
            </div>
          </div>
          <BookingOperator operatorName={booking.operatorName} />
        </aside>

      </div>

      <Dialog open={payModalOpen} onOpenChange={setPayModalOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-3xl border-0 shadow-2xl">
          <div className="bg-gradient-to-br from-primary/10 to-primary/5 px-6 pt-8 pb-6 relative border-b border-primary/10 text-center">
            <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-primary/20 mb-4">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <DialogHeader className="sm:text-center">
              <DialogTitle className="text-2xl font-bold text-foreground">Make Payment</DialogTitle>
              <DialogDescription className="text-sm mt-1.5">
                Remaining balance: <span className="font-bold text-foreground">{formatNaira(balance)}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handlePayment} className="px-6 py-6 space-y-6 bg-card">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Amount (₦)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-2xl font-bold text-foreground">₦</span>
                  </div>
                  <Input 
                    type="text" 
                    placeholder="0" 
                    value={installmentAmount}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, "")
                      if (val) {
                        setInstallmentAmount(Number(val).toLocaleString())
                      } else {
                        setInstallmentAmount("")
                      }
                    }}
                    className="h-16 pl-10 text-3xl font-bold rounded-2xl border-border focus-visible:ring-primary bg-secondary/30 transition-all focus:bg-white"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: '25%', value: Math.round(balance * 0.25) },
                  { label: '50%', value: Math.round(balance * 0.5) },
                  { label: '75%', value: Math.round(balance * 0.75) },
                ].map((opt) => {
                  const amt = opt.value;
                  const disabled = amt <= 0;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      disabled={disabled}
                      onClick={() => setInstallmentAmount(amt.toLocaleString())}
                      className={cn(
                        "h-10 rounded-xl text-sm font-bold transition-all border",
                        disabled 
                          ? "opacity-40 cursor-not-allowed border-border bg-secondary/50 text-muted-foreground" 
                          : installmentAmount === amt.toLocaleString()
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                      )}
                    >
                      {opt.label}
                    </button>
                  )
                })}
                <button
                  type="button"
                  onClick={() => setInstallmentAmount(balance.toLocaleString())}
                  className={cn(
                    "h-10 rounded-xl text-sm font-bold transition-all border",
                    installmentAmount === balance.toLocaleString()
                      ? "border-primary bg-primary text-primary-foreground shadow-sm"
                      : "border-primary/20 bg-primary/5 text-primary hover:bg-primary/10"
                  )}
                >
                  Full
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full h-14 text-lg rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all bg-primary hover:bg-primary/90 text-primary-foreground mt-4" 
              disabled={isProcessing || !installmentAmount || parseInt(installmentAmount.replace(/,/g, "")) > balance}
            >
              {isProcessing ? "Processing..." : `Pay ${installmentAmount ? '₦' + installmentAmount : ''}`}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DocumentRow({ 
  icon: Icon, title, subtitle, documentType, currentUrl, 
  onUpload, onDelete, isUploading, isDeleting, hideUpload, noBorder
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn("flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center", !noBorder && "border-b border-border bg-secondary/20 last:border-b-0")}>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2 sm:justify-end">
        {currentUrl ? (
          <>
            <Button variant="outline" size="sm" className="rounded-xl h-9 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 hover:text-blue-700" asChild>
              <a href={currentUrl} target="_blank" rel="noopener noreferrer">View</a>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl h-9 text-red-600 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-700"
              disabled={isDeleting}
              onClick={() => onDelete(documentType)}
            >
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove"}
            </Button>
          </>
        ) : !hideUpload ? (
          <>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*,application/pdf"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onUpload(documentType, e.target.files[0])
                }
              }}
            />
            <Button 
              variant="outline" 
              size="sm" 
              className="rounded-xl h-9"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Upload className="h-4 w-4 mr-1.5" />
              )}
              Upload
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}

function BookingOperator({ operatorName }: Readonly<{ operatorName?: string }>) {
  const initial = operatorName?.trim().charAt(0).toUpperCase() || "U"

  return (
    <section className="border-t border-border pt-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Travel partner</p>
      <div className="mt-3 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-sm font-bold text-primary">
          {initial}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate text-sm font-semibold text-foreground">{operatorName || "Your operator"}</p>
            <BadgeCheck className="h-4 w-4 shrink-0 text-blue-600" />
          </div>
          <p className="text-xs text-muted-foreground">Verified travel partner</p>
        </div>
      </div>
    </section>
  )
}
