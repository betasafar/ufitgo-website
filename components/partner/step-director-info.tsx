import { type PartnerType, type PartnerFormData } from "./multi-step-form"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepDirectorInfoProps {
  partnerType: PartnerType
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepDirectorInfo({ partnerType, formData, updateFormData, onNext, onBack }: StepDirectorInfoProps) {
  const isGuide = partnerType === "tour-guide"
  
  // Validation logic
  let isValid = false
  if (isGuide) {
    isValid = formData.directorPhone.trim() !== "" && formData.companyEmail.trim() !== ""
  } else {
    isValid = formData.directorName.trim() !== "" && formData.directorPhone.trim() !== "" && formData.companyEmail.trim() !== ""
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <span className="text-xl">{isGuide ? "📱" : "👤"}</span> Step 3: {isGuide ? "Contact Details" : "Director & Contact"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {isGuide ? "How can we reach you?" : "Primary contact and director details"}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {!isGuide && (
          <>
            <div className="space-y-2">
              <label className="text-sm font-medium">Director Title</label>
              <select 
                value={formData.directorTitle}
                onChange={(e) => updateFormData({ directorTitle: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="Alhaji">Alhaji</option>
                <option value="Hajia">Hajia</option>
                <option value="Mr">Mr</option>
                <option value="Mrs">Mrs</option>
                <option value="Dr">Dr</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Director Full Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.directorName}
                onChange={(e) => updateFormData({ directorName: e.target.value })}
                placeholder="Full legal name" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
          </>
        )}
        
        <div className="space-y-2">
          <label className="text-sm font-medium">{isGuide ? "Phone Number" : "Director Phone"} <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            value={formData.directorPhone}
            onChange={(e) => updateFormData({ directorPhone: e.target.value })}
            placeholder="e.g. 08012345678" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">WhatsApp Number</label>
          <input 
            type="text" 
            value={formData.directorWhatsApp}
            onChange={(e) => updateFormData({ directorWhatsApp: e.target.value })}
            placeholder="WhatsApp number" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">{isGuide ? "Email Address" : "Company Email"} <span className="text-red-500">*</span></label>
          <input 
            type="email" 
            value={formData.companyEmail}
            onChange={(e) => updateFormData({ companyEmail: e.target.value })}
            placeholder={isGuide ? "your@email.com" : "info@company.com"}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">National ID / Iqama Number</label>
          <input 
            type="text" 
            value={formData.directorNin}
            onChange={(e) => updateFormData({ directorNin: e.target.value })}
            placeholder="ID Number" 
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
          />
        </div>

        {!isGuide && (
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">Brief description of your services</label>
            <textarea 
              rows={4} 
              value={formData.description}
              onChange={(e) => updateFormData({ description: e.target.value })}
              placeholder="Describe your company and services..." 
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
            />
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex items-center justify-between gap-4 border-t pt-6">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-2.5 text-sm font-medium shadow-sm transition-colors hover:bg-slate-50 hover:text-accent-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={!isValid}
          className="inline-flex items-center justify-center rounded-md bg-[#2a7a4f] px-6 py-2.5 text-sm font-medium text-white shadow transition-colors hover:bg-[#205d3b] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next: Upload Documents <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
