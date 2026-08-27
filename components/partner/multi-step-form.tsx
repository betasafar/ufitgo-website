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
  rcNumber: string;
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
  
  // Step 3
  directorTitle: string;
  directorName: string;
  directorPhone: string;
  directorWhatsApp: string;
  companyEmail: string;
  directorNin: string;
  description: string;
}

const initialFormData: PartnerFormData = {
  country: "Nigeria",
  companyName: "",
  tradingName: "",
  rcNumber: "",
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
  description: ""
}

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [partnerType, setPartnerType] = useState<PartnerType>(null)
  const [formData, setFormData] = useState<PartnerFormData>(initialFormData)

  const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
  const handleBack = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

  const updateFormData = (fields: Partial<PartnerFormData>) => {
    setFormData((prev) => ({ ...prev, ...fields }))
  }

  return (
    <div className="flex flex-col items-center">
      {/* Progress Dots */}
      <div className="mb-8 w-full max-w-md">
        <div className="relative flex items-center justify-between">
          <div className="absolute left-0 top-1/2 -z-10 h-0.5 w-full -translate-y-1/2 bg-gray-200">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            />
          </div>
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`flex h-3 w-3 items-center justify-center rounded-full transition-colors ${
                step <= currentStep ? "bg-primary" : "bg-gray-200"
              }`}
            />
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
            onSubmit={() => alert("Application Submitted!")} 
          />
        )}
      </div>
    </div>
  )
}
