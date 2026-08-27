"use client"

import { useState } from "react"
import { IdCard, CheckCircle2, FileText, ArrowRight, ShieldCheck, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PassportAssistanceModal } from "@/components/passport-assistance-modal"

export default function PassportPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [requested, setRequested] = useState(false)

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8 pt-6">
      <div className="flex items-center gap-4 border-b border-border pb-6">
        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
          <IdCard className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">Passport Assistance</h1>
          <p className="text-muted-foreground text-sm">Get help processing your international passport</p>
        </div>
      </div>

      {requested ? (
        <div className="bg-secondary/20 border border-border rounded-2xl p-8 text-center max-w-2xl mx-auto mt-12">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-600">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Request Received!</h2>
          <p className="text-muted-foreground mb-8">
            Your request for passport assistance has been sent to our verified immigration partners. They will contact you shortly to begin the process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" className="h-12 rounded-xl px-8" onClick={() => window.history.back()}>
              Go Back
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h2 className="text-xl font-bold">Why use UfitGo Partners?</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-1">
                  <ShieldCheck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Verified Partners</h3>
                  <p className="text-sm text-muted-foreground">We only work with trusted, vetted immigration agencies to ensure your documents are safe.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-1">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Fast-Track Options</h3>
                  <p className="text-sm text-muted-foreground">Choose between normal processing (3-6 weeks) or urgent processing (1-2 weeks).</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center shrink-0 mt-1">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1">Hassle-Free Process</h3>
                  <p className="text-sm text-muted-foreground">Avoid the long queues and let experts handle the complicated paperwork for you.</p>
                </div>
              </div>
            </div>

            <Button onClick={() => setModalOpen(true)} className="h-14 rounded-xl w-full sm:w-auto px-8 text-base shadow-lg shadow-primary/20 mt-4">
              Request Assistance <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          <div className="bg-secondary/20 border border-border rounded-2xl p-6 h-fit">
            <h3 className="font-bold mb-4">What you'll need</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>NIN (National Identification Number)</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Local Government Letter of Identification</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Birth Certificate or Age Declaration</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />
                <span>Two Passport Photographs</span>
              </li>
            </ul>
            <div className="mt-6 p-4 bg-primary/5 rounded-xl border border-primary/10">
              <p className="text-sm text-primary font-medium">Don't have all these? Our partners will guide you on how to obtain them.</p>
            </div>
          </div>
        </div>
      )}

      <PassportAssistanceModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onSuccess={() => setRequested(true)} 
      />
    </div>
  )
}
