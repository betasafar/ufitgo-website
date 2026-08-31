"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"

interface WhatsappActionProps {
  whatsappUrl: string
  operatorName: string
}

export function WhatsappAction({ whatsappUrl, operatorName }: WhatsappActionProps) {
  const { data: session } = useSession()
  const [isLoginOpen, setIsLoginOpen] = useState(false)

  const handleAction = (e: React.MouseEvent) => {
    if (!session?.user) {
      e.preventDefault()
      setIsLoginOpen(true)
    }
  }

  return (
    <>
      <a 
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAction}
      >
        <Button className="w-full h-12 gap-2 text-base rounded-xl bg-[#25D366] hover:bg-[#20b858] text-white">
          <MessageCircle className="h-5 w-5" />
          Inquire via WhatsApp
        </Button>
      </a>

      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md p-0 border-none shadow-2xl bg-transparent">
          <div className="bg-card rounded-2xl overflow-hidden">
            <div className="p-4 bg-primary/5 border-b border-border text-center">
              <p className="text-sm font-semibold text-foreground">
                Please sign in to contact {operatorName}
              </p>
            </div>
            <LoginForm onSuccess={() => {
              setIsLoginOpen(false)
              window.open(whatsappUrl, "_blank")
            }} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
