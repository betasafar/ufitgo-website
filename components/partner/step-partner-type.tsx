import { type PartnerType } from "./multi-step-form"
import { Building2, Car, Wifi, MapPin } from "lucide-react"

interface StepPartnerTypeProps {
  selectedType: PartnerType
  onSelect: (type: PartnerType) => void
}

export function StepPartnerType({ selectedType, onSelect }: StepPartnerTypeProps) {
  const options: { id: PartnerType; title: string; subtitle: string; icon: React.ReactNode }[] = [
    {
      id: "tour-operator",
      title: "Tour Operator",
      subtitle: "Hajj & Umrah packages",
      icon: <Building2 className="h-6 w-6 text-primary" />,
    },
    {
      id: "transport",
      title: "Transport Provider",
      subtitle: "Vehicle & Fleet services",
      icon: <Car className="h-6 w-6 text-primary" />,
    },
    {
      id: "sim-seller",
      title: "SIM Seller",
      subtitle: "Connectivity services",
      icon: <Wifi className="h-6 w-6 text-primary" />,
    },
    {
      id: "tour-guide",
      title: "Tour Guide",
      subtitle: "Individual guiding",
      icon: <MapPin className="h-6 w-6 text-primary" />,
    },
  ]

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="flex items-center gap-2 text-xl font-bold tracking-tight text-slate-900">
          <span className="text-xl">🏢</span> Step 1: Select Partner Type
        </h2>
        <p className="text-sm text-muted-foreground mt-1">What type of service do you provide?</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => (
          <button
            key={option.id}
            onClick={() => onSelect(option.id)}
            className={`flex flex-col items-center justify-center gap-3 rounded-xl border p-6 text-center transition-all ${
              selectedType === option.id
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "border-border hover:border-primary/40 hover:bg-slate-50"
            }`}
          >
            <div className="rounded-full bg-white p-3 shadow-sm border">
              {option.icon}
            </div>
            <div>
              <p className="font-semibold text-sm">{option.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{option.subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
