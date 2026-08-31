"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import PaystackPop from '@paystack/inline-js'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useSession } from "next-auth/react"
import { formatNaira } from "@/lib/packages"
import { ArrowLeft, CreditCard, ReceiptText, ShieldCheck, CheckCircle2, Clock, Wallet, Phone, MessageCircle, BadgeCheck, FileText, Image as ImageIcon, Upload, IdCard, HelpCircle, Loader2 } from "lucide-react"
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
import { PassportAssistanceModal } from "@/components/passport-assistance-modal"
export default function BookingDetailsPage({ params }: { params: any }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [payModalOpen, setPayModalOpen] = useState(false)
  const [assistanceModalOpen, setAssistanceModalOpen] = useState(false)
  const [installmentAmount, setInstallmentAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null)
  const [deletingDocType, setDeletingDocType] = useState<string | null>(null)
  const [showReusePrompt, setShowReusePrompt] = useState(true)
  const [ninInput, setNinInput] = useState("")

  const queryClient = useQueryClient()

  const { data: booking, isLoading } = useQuery({
    queryKey: ['booking', params?.id],
    queryFn: async () => {
      if (!session?.accessToken || !params?.id) return null
      
      const resolvedParams = (params && typeof params.then === 'function') ? await params : params
      const id = resolvedParams.id
      
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
    enabled: !!session?.accessToken && !!params,
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
      queryClient.invalidateQueries({ queryKey: ['booking', params?.id] })
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
      queryClient.invalidateQueries({ queryKey: ['booking', params?.id] })
    }
  })

  const reuseMutation = useMutation({
    mutationFn: async () => {
      if (!session?.accessToken || !booking?.id) throw new Error("No session or booking")
      const API_URL = (process.env.NEXT_PUBLIC_API_GATEWAY_URL || "http://localhost:8080") + "/api"
      const res = await fetch(`${API_URL}/bookings/${booking.id}/documents/reuse-from-profile`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${session.accessToken}`,
        },
      })
      if (!res.ok) throw new Error("Failed to reuse documents")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['booking', params?.id] })
      setShowReusePrompt(false)
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
      queryClient.invalidateQueries({ queryKey: ['booking', params?.id] })
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

  const balance = Number(booking.totalAmount) - Number(booking.amountPaid)
  const progressPercent = Math.min(100, Math.round((Number(booking.amountPaid) / Number(booking.totalAmount)) * 100))

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
        queryClient.invalidateQueries({ queryKey: ['booking', params?.id] })
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
    <div className="mx-auto max-w-4xl p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push("/bookings")} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Booking Details</h1>
          <p className="text-sm text-muted-foreground font-mono">Ref: {booking.bookingRef}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        
        {/* Left Column: Status & Timeline */}
        <div className="space-y-6">
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">{booking.packageName}</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-6">
              <div>
                <p className="text-muted-foreground">Operator</p>
                <p className="font-semibold">{booking.operatorName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Travellers</p>
                <p className="font-semibold">{booking.numberOfPilgrims}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Departure</p>
                <p className="font-semibold">{booking.departureDate}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Status</p>
                <p className="font-semibold text-primary">{booking.status}</p>
              </div>
            </div>
          </div>

          {/* Operator Contact */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4">Your Operator</h3>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 w-full">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary font-bold text-xl">{booking.operatorName.charAt(0)}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-base">{booking.operatorName}</p>
                    <BadgeCheck className="h-5 w-5 text-blue-500" />
                  </div>
                  <p className="text-sm text-muted-foreground">Verified Travel Partner</p>
                </div>
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                <Button variant="outline" className="flex-1 sm:flex-none rounded-xl text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 bg-blue-50/50">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
                <Button variant="outline" className="flex-1 sm:flex-none rounded-xl text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700 bg-green-50/50">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>

          {/* Required Documents */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-bold">Required Documents</h3>
                <p className="text-sm text-muted-foreground">Upload these to complete your booking</p>
              </div>
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200">
                Action Required
              </span>
            </div>

            {showReusePrompt && profile?.data && (profile.data.nin || profile.data.passportUrl || profile.data.photoUrl) && (!booking.nin || !booking.passportUrl || !booking.photoUrl) && (
              <div className="mb-4 bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-primary/20 rounded-full flex items-center justify-center shrink-0">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-primary">Saved Documents Found</h4>
                    <p className="text-xs text-primary/80">Would you like to reuse the documents you saved previously?</p>
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="flex-1 sm:flex-none text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
                    onClick={() => setShowReusePrompt(false)}
                    disabled={reuseMutation.isPending}
                  >
                    Dismiss
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 sm:flex-none rounded-xl"
                    onClick={() => reuseMutation.mutate()}
                    disabled={reuseMutation.isPending}
                  >
                    {reuseMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : "Reuse Documents"}
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                    <IdCard className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base">National ID (NIN)</h4>
                    <p className="text-sm text-muted-foreground">11-digit number</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  {booking.nin ? (
                    <div className="flex items-center gap-3 bg-secondary/30 px-3 py-2 rounded-lg w-full sm:w-auto justify-between border border-border/50">
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

              <div className="rounded-xl border border-border bg-secondary/20 overflow-hidden">
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
                  hideUpload={booking.passportAssistanceRequested}
                  noBorder
                />
                
                {booking.passportAssistanceRequested ? (
                  <div className="bg-blue-50/50 border-t border-blue-100 p-3 px-4 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                      <ShieldCheck className="h-4 w-4 shrink-0 text-blue-500" />
                      <span className="font-semibold">Assistance Requested</span>
                    </div>
                    <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-md">Processing</span>
                  </div>
                ) : (
                  <div className="bg-blue-50/50 border-t border-blue-100 p-3 px-4 flex items-start sm:items-center justify-between flex-col sm:flex-row gap-3">
                    <div className="flex items-center gap-2 text-blue-800 text-sm">
                      <HelpCircle className="h-4 w-4 shrink-0 text-blue-500" />
                      <span>Don't have an International Passport?</span>
                    </div>
                    <Button 
                      variant="link" 
                      className="h-auto p-0 text-blue-600 hover:text-blue-800 font-semibold text-sm"
                      onClick={() => setAssistanceModalOpen(true)}
                    >
                      Get Assistance
                    </Button>
                  </div>
                )}
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
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-6">Booking Timeline</h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
              
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-green-100 text-green-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm">Registered</div>
                    <time className="font-mono text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</time>
                  </div>
                  <div className="text-xs text-muted-foreground">₦50,000 Registration Fee paid. Slot secured.</div>
                </div>
              </div>

              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-blue-50 text-blue-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <Clock className="h-5 w-5" />
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-secondary/50 shadow-sm opacity-60">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-sm">Visa Processing</div>
                  </div>
                  <div className="text-xs text-amber-600 font-medium mt-1">Awaiting document submission.</div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Right Column: Financials */}
        <div className="space-y-6">
          <div className="bg-primary/5 border border-primary/20 p-6 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold mb-4 font-serif text-primary-foreground/90">Payment Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Total Price</span>
                <span className="font-bold">{formatNaira(booking.totalAmount)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Amount Paid</span>
                <span className="font-bold text-green-600">{formatNaira(booking.amountPaid)}</span>
              </div>

              <div className="h-2 w-full bg-secondary rounded-full overflow-hidden my-2">
                <div 
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-sm border-t border-primary/10 pt-4 mt-2">
                <span className="font-semibold">Balance Remaining</span>
                <span className="font-bold text-lg">{formatNaira(balance)}</span>
              </div>
            </div>

            {balance > 0 && (
              <Button 
                className="w-full mt-6 h-12 rounded-full font-semibold shadow-md"
                onClick={() => setPayModalOpen(true)}
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Pay Installment
              </Button>
            )}
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
            <h3 className="text-sm font-bold mb-4 uppercase tracking-wider text-muted-foreground">Payment History</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                    <ReceiptText className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Registration Fee</p>
                    <p className="text-xs text-muted-foreground">{new Date(booking.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="font-semibold text-green-600">₦50,000</span>
              </div>

              {booking.installments.map((inst: any) => (
                <div key={inst.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-50 flex items-center justify-center">
                      <ReceiptText className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Installment</p>
                      <p className="text-xs text-muted-foreground">{new Date(inst.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className="font-semibold text-green-600">{formatNaira(inst.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

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

      {booking && (
        <PassportAssistanceModal 
          isOpen={assistanceModalOpen}
          onClose={() => setAssistanceModalOpen(false)}
          bookingId={booking.id}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['booking', params?.id] })
          }}
        />
      )}
    </div>
  )
}

function DocumentRow({ 
  icon: Icon, title, subtitle, documentType, currentUrl, 
  onUpload, onDelete, isUploading, isDeleting, hideUpload, noBorder
}: any) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4", !noBorder && "rounded-xl border border-border bg-secondary/20")}>
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="font-semibold text-sm">{title}</p>
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
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
