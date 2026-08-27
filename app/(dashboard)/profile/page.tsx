"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { User, Pencil, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProfilePage() {
  const { data: session } = useSession()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: session?.user?.name?.split(" ")[0] || "Ahmad",
    surname: session?.user?.name?.split(" ")[1] || "Ibrahim",
    phone: "08080209060",
    whatsapp: "",
    stateOfOrigin: "Lagos"
  })

  // Provide mock data since actual data isn't in session yet based on the screenshot
  const fullName = `${formData.firstName} ${formData.surname}`.trim()
  const userInitials = fullName
    ? fullName.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    : "AI"
    
  const email = session?.user?.email || "ahmadibrahim@yopmail.com"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    // In a real app, you would save this to your backend via API
    setIsEditing(false)
  }

  const handleCancel = () => {
    // Revert changes or just close the form. For simplicity, we just close.
    setIsEditing(false)
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-orange-500 border border-orange-100">
          <User className="h-5 w-5" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Profile</h1>
      </div>

      <div className="space-y-6">
        {/* Top User Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FCE8B2] text-[#B8860B] mb-6">
            <span className="text-2xl font-bold">{userInitials}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{fullName}</h2>
          <p className="text-slate-500 text-sm mb-2">{email}</p>
          <p className="text-slate-400 text-xs">Member since August 2026</p>
        </div>

        {/* Personal Information Card */}
        <div className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900 mb-6">Personal Information</h3>
          
          <div className="space-y-8 divide-y divide-slate-100">
            {/* Row 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4 first:pt-0">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">First Name</p>
                {isEditing ? (
                  <input 
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">{formData.firstName}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Surname</p>
                {isEditing ? (
                  <input 
                    type="text"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">{formData.surname}</p>
                )}
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">Phone</p>
                {isEditing ? (
                  <input 
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">{formData.phone}</p>
                )}
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">WhatsApp</p>
                {isEditing ? (
                  <input 
                    type="tel"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="Same as phone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                ) : (
                  <p className={formData.whatsapp ? "text-sm font-medium text-slate-900" : "text-sm font-medium text-slate-400"}>
                    {formData.whatsapp || "—"}
                  </p>
                )}
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 gap-8 pt-6">
              <div>
                <p className="text-xs font-medium text-slate-400 mb-2 uppercase tracking-wide">State of Origin</p>
                {isEditing ? (
                  <input 
                    type="text"
                    name="stateOfOrigin"
                    value={formData.stateOfOrigin}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                ) : (
                  <p className="text-sm font-medium text-slate-900">{formData.stateOfOrigin}</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end gap-3 border-t border-slate-100 pt-6">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel} className="gap-2 h-10 px-6 rounded-lg text-slate-700">
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button onClick={handleSave} className="gap-2 h-10 px-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
                  <Check className="h-4 w-4" />
                  Save Changes
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)} className="gap-2 h-10 px-6 rounded-lg text-slate-700">
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
      
    </div>
  )
}
