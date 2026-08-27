import { type PartnerType } from "./multi-step-form"
import { ArrowLeft, FileText, UploadCloud, FileBadge, ShieldCheck, UserCircle } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface StepUploadDocumentsProps {
  partnerType: PartnerType
  country: string
  onBack: () => void
  onSubmit: () => void
}

function UploadBox({ label, required = false, icon: Icon, hint }: { label: string, required?: boolean, icon: any, hint: string }) {
  const [uploaded, setUploaded] = useState(false)
  
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold">{label} {required && <span className="text-red-500">*</span>}</label>
      <div 
        onClick={() => setUploaded(!uploaded)}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition-all hover:bg-slate-50",
          uploaded ? "border-[#2a7a4f] bg-[#2a7a4f]/5" : "border-slate-200"
        )}
      >
        <div className={cn("mb-3 rounded-full p-3", uploaded ? "bg-[#2a7a4f]/10 text-[#2a7a4f]" : "bg-slate-100 text-slate-500")}>
          <Icon className="h-6 w-6" />
        </div>
        <p className="font-medium text-slate-900">{label}</p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        
        {uploaded && (
          <div className="absolute bottom-3 flex items-center gap-1.5 text-xs font-semibold text-[#2a7a4f]">
            <ShieldCheck className="h-3.5 w-3.5" /> Uploaded successfully
          </div>
        )}
      </div>
    </div>
  )
}

export function StepUploadDocuments({ partnerType, country, onBack, onSubmit }: StepUploadDocumentsProps) {
  const [agreed, setAgreed] = useState(false)
  const isSaudi = country === "Saudi Arabia"
  const isGuide = partnerType === "tour-guide"

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <span className="text-xl">📋</span> Step 4: Upload Documents
        </h2>
        <p className="text-sm text-muted-foreground mt-1">Upload required documents (PDF or image, max 5MB each)</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {isGuide ? (
          <>
            <UploadBox 
              label={isSaudi ? "Saudi Iqama / National ID" : "National ID (NIN) / Passport"} 
              required 
              icon={FileText} 
              hint="Valid Government ID • Max 5MB" 
            />
            <UploadBox 
              label="Professional Profile Photo" 
              required
              icon={UserCircle} 
              hint="Clear headshot • Max 2MB" 
            />
            <UploadBox 
              label="Tour Guide License (Optional)" 
              icon={FileBadge} 
              hint="Ministry of Tourism license if available" 
            />
          </>
        ) : (
          <>
            {/* Universal Documents for Companies */}
            <UploadBox 
              label={isSaudi ? "Commercial Registration (CR)" : "CAC Certificate"} 
              required 
              icon={FileText} 
              hint="PDF or Image • Max 5MB" 
            />

            {/* Dynamic Documents */}
            {partnerType === "tour-operator" && !isSaudi && (
              <UploadBox 
                label="NAHCON License" 
                required 
                icon={FileBadge} 
                hint="For Tour Operators • Max 5MB" 
              />
            )}
            {partnerType === "transport" && (
              <UploadBox 
                label="Vehicle Insurance / Fleet Cert" 
                required 
                icon={FileBadge} 
                hint="Fleet Certification • Max 5MB" 
              />
            )}
            {partnerType === "sim-seller" && (
              <UploadBox 
                label="Telecom Reseller Permit" 
                required 
                icon={FileBadge} 
                hint="Reseller Agreement • Max 5MB" 
              />
            )}

            <UploadBox 
              label="Director ID Card" 
              required 
              icon={FileText} 
              hint="ID, Passport or Driver License" 
            />
            <UploadBox 
              label="Company Logo" 
              icon={UploadCloud} 
              hint="PNG or JPG • Max 2MB" 
            />
          </>
        )}
      </div>

      <div className="mt-8 rounded-lg border bg-slate-50 p-4">
        <label className="flex items-start gap-3 cursor-pointer">
          <input 
            type="checkbox" 
            className="mt-1 h-4 w-4 rounded border-gray-300 text-[#2a7a4f] focus:ring-[#2a7a4f]"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span className="text-sm text-slate-700 leading-relaxed">
            I confirm all information is accurate. I agree to UfitGo's <a href="#" className="font-semibold text-[#2a7a4f] hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-[#2a7a4f] hover:underline">Partner Agreement</a>. False information may result in rejection or termination.
          </span>
        </label>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex items-center justify-between gap-4 border-t pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!agreed}
          className="inline-flex items-center justify-center rounded-md bg-[#2a7a4f] px-6 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-[#205d3b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          🚀 Submit Application
        </button>
      </div>
    </div>
  )
}
