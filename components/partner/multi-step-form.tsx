"use client"

import { useState } from "react"
import { StepPartnerType } from "./step-partner-type"
import { StepCompanyInfo } from "./step-company-info"
import { StepDirectorInfo } from "./step-director-info"
import { StepUploadDocuments } from "./step-upload-documents"

export type PartnerType = "tour-operator" | "transport" | "sim-seller" | "tour-guide" | null

export interface PartnerFormData {
  // Step 2
  country: string;
  companyName: string;
  tradingName: string;
  cacNumber: string;
  yearEstablished: string;
  officeAddress: string;
  // Dynamic Step 2
  nahconLicense: string;
  capacity: string;
  // Transport
  transportReg: string;
  fleetSize: string;
  // SIM Seller
  telecomPermit: string;
  supportedNetworks: string;
  // Dynamic Step 2 (Tour Guide)
  guideLanguages: string;
  guideExperience: string;
  guideExpertise: string[];
  
  bdcLicense: string;
  dailyVolume: string;
  // Step 3
  directorTitle: string;
  directorName: string;
  directorPhone: string;
  directorWhatsApp: string;
  companyEmail: string;
  companyPhone: string;
  directorNin: string;
  description: string;
}

const initialFormData: PartnerFormData = {
  country: "Nigeria",
  companyName: "",
  tradingName: "",
  cacNumber: "",
  yearEstablished: "",
  officeAddress: "",
  nahconLicense: "",
  capacity: "",
  transportReg: "",
  fleetSize: "",
  telecomPermit: "",
  supportedNetworks: "",
  guideLanguages: "",
  guideExperience: "",
  guideExpertise: [],
  directorTitle: "Mr",
  directorName: "",
  directorPhone: "",
  directorWhatsApp: "",
  companyEmail: "",
  directorNin: "",
  description: "",
  bdcLicense: "",
  dailyVolume: "",
  companyPhone: ""
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [partnerType, setPartnerType] = useState<PartnerType>(null)
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = (fields: Partial<PartnerFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    setError(null)
    
    try {
      const payload: any = {
        partnerType: partnerType,
        companyName: formData.companyName,
        tradingName: formData.tradingName,
        email: formData.companyEmail,
        phone: formData.companyPhone,
        country: formData.country,
        cacNumber: formData.cacNumber,
        foundedAt: parseInt(formData.yearEstablished, 10) || null,
        officeAddress: formData.officeAddress,
        nahconLicense: formData.nahconLicense,
        capacity: formData.capacity,
        transportReg: formData.transportReg,
        fleetSize: formData.fleetSize,
        telecomPermit: formData.telecomPermit,
        supportedNetworks: formData.supportedNetworks,
        bdcLicense: formData.bdcLicense,
        dailyVolume: formData.dailyVolume,
        guideLanguages: formData.guideLanguages,
        guideExperience: formData.guideExperience,
        guideExpertise: formData.guideExpertise,
        directorTitle: formData.directorTitle,
        directorName: formData.directorName, // Note: backend expects firstName/lastName in register dto, let's split it below
        directorPhone: formData.directorPhone,
        directorWhatsApp: formData.directorWhatsApp,
        directorNin: formData.directorNin,
        password: "TempPassword123!", // Frontend needs a password field or default
      }

      // Splitting directorName into firstName and lastName for DTO compatibility
      const nameParts = formData.directorName.split(' ')
      if (nameParts.length > 0) {
        payload.firstName = nameParts[0]
        payload.lastName = nameParts.slice(1).join(' ') || nameParts[0]
      } else {
        payload.firstName = "Unknown"
        payload.lastName = "Unknown"
      }
      
      // If we don't have an email, use a temporary one based on phone for now since email is required by backend
      if (!payload.email) {
        const phoneToUse = formData.companyPhone || formData.directorPhone || "0000000000"
        payload.email = `${phoneToUse.replace(/\D/g, '')}@temp.ufitgo.com`
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_GATEWAY_URL || "https://api.ufitgo.ng"
      const res = await fetch(`${apiUrl}/api/operator/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to register partner")
      }
      
      alert("Application Submitted successfully!")
      // Reset or redirect here
    } catch (err: any) {
      console.error(err)
      setError(err.message)
      alert(`Registration failed: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative mx-auto max-w-3xl pt-8">
      {/* Progress Bar */}
      <div className="mb-8 hidden sm:block">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex flex-col items-center">
              <div 
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-500 ${
                  step === currentStep 
                    ? "border-[#2a7a4f] bg-[#2a7a4f] text-white" 
                    : step < currentStep 
                      ? "border-[#2a7a4f] bg-[#2a7a4f]/10 text-[#2a7a4f]" 
                      : "border-slate-200 bg-white text-slate-400"
                }`}
              >
                {step < currentStep ? "✓" : step}
              </div>
              <div className="mt-2 text-xs font-medium text-slate-500">
                {step === 1 && "Type"}
                {step === 2 && "Company"}
                {step === 3 && "Director"}
                {step === 4 && "Documents"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form Content */}
      <div className="w-full pb-12">
        {currentStep === 1 && (
          <StepPartnerType 
            selectedType={partnerType} 
            onSelect={(type) => {
              setPartnerType(type)
              handleNext()
            }} 
          />
        )}
        {currentStep === 2 && (
          <StepCompanyInfo 
            partnerType={partnerType} 
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}
        {currentStep === 3 && (
          <StepDirectorInfo 
            partnerType={partnerType}
            formData={formData}
            updateFormData={updateFormData}
            onNext={handleNext} 
            onBack={handleBack} 
          />
        )}
        {currentStep === 4 && (
          <StepUploadDocuments 
            partnerType={partnerType} 
            country={formData.country}
            onBack={handleBack} 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
          />
        )}
      </div>
    </div>
  )
}
