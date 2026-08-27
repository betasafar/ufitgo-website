"use client"

import { useState } from "react"
import { ShieldCheck, ArrowRight, Loader2, Info, FilePlus, RefreshCcw, Phone, MapPin, Clock, Rocket } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { requestPassportAssistance } from "@/lib/mock-db"

export function PassportAssistanceModal({
  isOpen,
  onClose,
  bookingId,
  onSuccess
}: {
  isOpen: boolean
  onClose: () => void
  bookingId?: string
  onSuccess?: () => void
}) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState<"info" | "form" | "success">("info")
  const [form, setForm] = useState({
    type: "fresh",
    state: "lagos",
    speed: "normal",
    phone: ""
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API delay
    setTimeout(() => {
      if (bookingId) {
        const updated = requestPassportAssistance(bookingId)
        if (updated) {
          setIsSubmitting(false)
          setStep("success")
        }
      } else {
        setIsSubmitting(false)
        setStep("success")
      }
    }, 1500)
  }

  const handleClose = () => {
    onClose()
    setTimeout(() => setStep("info"), 300) // Reset after animation
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden sm:rounded-3xl border-0 shadow-2xl">
        {step === "info" && (
          <div className="p-6 sm:p-8">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-6 text-blue-600">
              <Info className="h-6 w-6" />
            </div>
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-2xl font-bold">Passport Assistance</DialogTitle>
              <DialogDescription className="text-base mt-2">
                UfitGo connects you with verified immigration partners to help process your International Passport smoothly and securely.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mb-8">
              <div className="flex gap-3 items-start">
                <ShieldCheck className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Verified Partners</p>
                  <p className="text-xs text-muted-foreground mt-0.5">We only work with trusted agencies.</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <ArrowRight className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm">Fast-Track Processing</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Options for urgent processing available.</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={handleClose}>
                Cancel
              </Button>
              <Button className="flex-1 h-12 rounded-xl" onClick={() => setStep("form")}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {step === "form" && (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-2xl font-bold">Request Details</DialogTitle>
              <DialogDescription className="text-sm mt-1">
                Help our partners understand what you need.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mb-8">
              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/80">Service Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${form.type === 'fresh' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:bg-secondary/50 hover:border-primary/30'}`}>
                    <input type="radio" name="type" className="sr-only" checked={form.type === 'fresh'} onChange={() => setForm({...form, type: 'fresh'})} />
                    <div className={`p-2 rounded-full shrink-0 transition-colors ${form.type === 'fresh' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      <FilePlus className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-sm">Fresh Passport</p>
                  </label>
                  <label className={`flex items-center gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${form.type === 'renewal' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:bg-secondary/50 hover:border-primary/30'}`}>
                    <input type="radio" name="type" className="sr-only" checked={form.type === 'renewal'} onChange={() => setForm({...form, type: 'renewal'})} />
                    <div className={`p-2 rounded-full shrink-0 transition-colors ${form.type === 'renewal' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      <RefreshCcw className="h-4 w-4" />
                    </div>
                    <p className="font-semibold text-sm">Renewal</p>
                  </label>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/80">Phone Number (For WhatsApp/Calls)</label>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input 
                    type="tel"
                    placeholder="e.g. 08012345678"
                    className="w-full h-12 rounded-xl border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-all"
                    value={form.phone}
                    onChange={(e) => setForm({...form, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/80">State of Residence</label>
                <Select value={form.state} onValueChange={(val) => setForm({...form, state: val || "lagos"})}>
                  <SelectTrigger className="w-full h-12 rounded-xl border-input focus:ring-2 focus:ring-ring focus:ring-offset-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <SelectValue placeholder="Select state" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="lagos">Lagos</SelectItem>
                    <SelectItem value="abuja">Abuja (FCT)</SelectItem>
                    <SelectItem value="kano">Kano</SelectItem>
                    <SelectItem value="kaduna">Kaduna</SelectItem>
                    <SelectItem value="other">Other State</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground/80">Processing Speed</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className={`flex items-start gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${form.speed === 'normal' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:bg-secondary/50 hover:border-primary/30'}`}>
                    <input type="radio" name="speed" className="sr-only" checked={form.speed === 'normal'} onChange={() => setForm({...form, speed: 'normal'})} />
                    <div className={`p-2 rounded-full shrink-0 transition-colors mt-0.5 ${form.speed === 'normal' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Normal</p>
                      <p className="text-xs text-muted-foreground mt-0.5">3-6 weeks</p>
                    </div>
                  </label>
                  <label className={`flex items-start gap-3 border-2 rounded-2xl p-4 cursor-pointer transition-all ${form.speed === 'urgent' ? 'border-primary bg-primary/5 ring-4 ring-primary/10' : 'border-border hover:bg-secondary/50 hover:border-primary/30'}`}>
                    <input type="radio" name="speed" className="sr-only" checked={form.speed === 'urgent'} onChange={() => setForm({...form, speed: 'urgent'})} />
                    <div className={`p-2 rounded-full shrink-0 transition-colors mt-0.5 ${form.speed === 'urgent' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      <Rocket className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">Urgent</p>
                      <p className="text-xs text-muted-foreground mt-0.5">1-2 weeks</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="button" variant="ghost" className="h-12 rounded-xl" onClick={() => setStep("info")}>
                Back
              </Button>
              <Button type="submit" className="flex-1 h-12 rounded-xl" disabled={isSubmitting}>
                {isSubmitting ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</>
                ) : "Submit Request"}
              </Button>
            </div>
          </form>
        )}

        {step === "success" && (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <DialogHeader className="sm:text-center mb-6">
              <DialogTitle className="text-2xl font-bold">Request Sent</DialogTitle>
              <DialogDescription className="text-base mt-2">
                Your passport assistance request has been forwarded to our partners. They will contact you shortly on how to proceed.
              </DialogDescription>
            </DialogHeader>
            <Button 
              className="w-full h-12 rounded-xl" 
              onClick={() => {
                onSuccess?.()
                handleClose()
              }}
            >
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
