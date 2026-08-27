import { type PartnerType, type PartnerFormData } from "./multi-step-form"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface StepCompanyInfoProps {
  partnerType: PartnerType
  formData: PartnerFormData
  updateFormData: (data: Partial<PartnerFormData>) => void
  onNext: () => void
  onBack: () => void
}

export function StepCompanyInfo({ partnerType, formData, updateFormData, onNext, onBack }: StepCompanyInfoProps) {
  const isSaudi = formData.country === "Saudi Arabia"
  const isGuide = partnerType === "tour-guide"

  const expertiseOptions = [
    "Mutawwif (Religious Guide)",
    "Historical Makkah Ziyarah",
    "Historical Madinah Ziyarah",
    "Tour Leader (Logistics)",
    "Shopping & Markets",
    "Culinary & Food Tours",
    "Museums & Exhibitions",
    "VIP & Executive Services"
  ]

  const toggleExpertise = (option: string) => {
    const current = formData.guideExpertise || []
    if (current.includes(option)) {
      updateFormData({ guideExpertise: current.filter((item) => item !== option) })
    } else {
      updateFormData({ guideExpertise: [...current, option] })
    }
  }

  // Validation logic
  let isValid = false
  if (isGuide) {
    isValid = formData.country.trim() !== "" && formData.companyName.trim() !== "" && formData.officeAddress.trim() !== ""
  } else {
    const isUniversalValid = formData.country.trim() !== "" && formData.companyName.trim() !== "" && formData.rcNumber.trim() !== "" && formData.officeAddress.trim() !== ""
    
    let isDynamicValid = true
    if (partnerType === "tour-operator" && formData.country === "Nigeria") {
      isDynamicValid = formData.nahconLicense.trim() !== ""
    }
    isValid = isUniversalValid && isDynamicValid
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <span className="text-xl">{isGuide ? "👤" : "🏢"}</span> Step 2: {isGuide ? "Guide Information" : "Company Information"}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{isGuide ? "Tell us about yourself and your expertise" : "Tell us about your organization"}</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <label className="text-sm font-medium">Country of Operation <span className="text-red-500">*</span></label>
          <select 
            value={formData.country}
            onChange={(e) => updateFormData({ country: e.target.value })}
            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="Saudi Arabia">Saudi Arabia</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {isGuide ? (
          <>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Full Legal Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.companyName}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
                placeholder="First and Last Name" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Base City / State <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.officeAddress}
                onChange={(e) => updateFormData({ officeAddress: e.target.value })}
                placeholder="e.g. Makkah, Saudi Arabia or Kano, Nigeria" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Languages Spoken</label>
              <input 
                type="text" 
                value={formData.guideLanguages}
                onChange={(e) => updateFormData({ guideLanguages: e.target.value })}
                placeholder="e.g. English, Arabic, Hausa" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Years of Experience</label>
              <select 
                value={formData.guideExperience}
                onChange={(e) => updateFormData({ guideExperience: e.target.value })}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">Select range</option>
                <option value="0-2">0 - 2 years</option>
                <option value="3-5">3 - 5 years</option>
                <option value="5+">5+ years</option>
              </select>
            </div>
            <div className="space-y-3 sm:col-span-2">
              <label className="text-sm font-medium">Areas of Expertise</label>
              <div className="flex flex-wrap gap-2">
                {expertiseOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggleExpertise(option)}
                    className={`inline-flex items-center rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                      formData.guideExpertise?.includes(option)
                        ? "border-[#2a7a4f] bg-[#2a7a4f] text-white"
                        : "border-input bg-background text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Universal Fields for Companies */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.companyName}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
                placeholder="e.g. UfitGo Travels Ltd" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Trading Name</label>
              <input 
                type="text" 
                value={formData.tradingName}
                onChange={(e) => updateFormData({ tradingName: e.target.value })}
                placeholder="Public-facing name" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">{isSaudi ? "Commercial Registration (CR) Number" : "RC Number (CAC)"} <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                value={formData.rcNumber}
                onChange={(e) => updateFormData({ rcNumber: e.target.value })}
                placeholder={isSaudi ? "e.g. 1010123456" : "e.g. RC123456"}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Year Established</label>
              <input 
                type="text" 
                value={formData.yearEstablished}
                onChange={(e) => updateFormData({ yearEstablished: e.target.value })}
                placeholder="e.g. 2015" 
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <label className="text-sm font-medium">Office Address <span className="text-red-500">*</span></label>
              <textarea 
                rows={3} 
                value={formData.officeAddress}
                onChange={(e) => updateFormData({ officeAddress: e.target.value })}
                placeholder="Full address including city and state" 
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
              />
            </div>

            {/* Dynamic Fields based on Partner Type */}
            {partnerType === "tour-operator" && (
              <>
                {!isSaudi && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">NAHCON License Number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      value={formData.nahconLicense}
                      onChange={(e) => updateFormData({ nahconLicense: e.target.value })}
                      placeholder="e.g. NAHCON/2024/001" 
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Pilgrims Per Year (Capacity)</label>
                  <select 
                    value={formData.capacity}
                    onChange={(e) => updateFormData({ capacity: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select range</option>
                    <option value="1-50">1 - 50</option>
                    <option value="50-200">50 - 200</option>
                    <option value="200+">200+</option>
                  </select>
                </div>
              </>
            )}

            {partnerType === "transport" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Transport Union Registration Number</label>
                  <input 
                    type="text" 
                    value={formData.transportReg}
                    onChange={(e) => updateFormData({ transportReg: e.target.value })}
                    placeholder="e.g. NURTW/001" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Fleet Size</label>
                  <select 
                    value={formData.fleetSize}
                    onChange={(e) => updateFormData({ fleetSize: e.target.value })}
                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <option value="">Select size</option>
                    <option value="1-5">1 - 5 Vehicles</option>
                    <option value="6-20">6 - 20 Vehicles</option>
                    <option value="20+">20+ Vehicles</option>
                  </select>
                </div>
              </>
            )}

            {partnerType === "sim-seller" && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Telecom Agency Permit</label>
                  <input 
                    type="text" 
                    value={formData.telecomPermit}
                    onChange={(e) => updateFormData({ telecomPermit: e.target.value })}
                    placeholder="Permit ID" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Supported Networks</label>
                  <input 
                    type="text" 
                    value={formData.supportedNetworks}
                    onChange={(e) => updateFormData({ supportedNetworks: e.target.value })}
                    placeholder="e.g. STC, Mobily, Zain" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2" 
                  />
                </div>
              </>
            )}
          </>
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
          Next: {isGuide ? "Contact Info" : "Director Info"} <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
