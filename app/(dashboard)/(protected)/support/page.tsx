import Link from "next/link"
import { Phone, Mail, MessageSquare, FileText, ChevronRight, HelpCircle, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I create a savings target?",
      answer: "Navigate to the 'Target Savings' section from your dashboard, click on 'Create Target', and specify your goal amount and duration."
    },
    {
      question: "What is the process for Umrah package requests?",
      answer: "Once you browse and select a package, submit an availability request. Our team will contact the operator and update your request status within 24 hours."
    },
    {
      question: "Can I withdraw my UfitGo Wallet balance?",
      answer: "Yes, you can withdraw your balance at any time to your saved bank account via the Wallet page. Ensure your Security PIN is set up first."
    }
  ]

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-6 lg:p-8 space-y-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
          Travel Support
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          We're here to assist you with your journey. How can we help today?
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Contact Options */}
        <div className="md:col-span-2 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            
            <a href="https://wa.me/2340000000000" target="_blank" rel="noopener noreferrer" className="group p-6 bg-card border border-border rounded-3xl hover:border-green-500/50 transition-all shadow-sm block">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">WhatsApp Support</h3>
              <p className="text-sm text-muted-foreground font-medium">Get instant help from our agents.</p>
            </a>
            
            <a href="mailto:support@ufitgo.com" className="group p-6 bg-card border border-border rounded-3xl hover:border-primary/50 transition-all shadow-sm block">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg mb-1">Email Us</h3>
              <p className="text-sm text-muted-foreground font-medium">support@ufitgo.com</p>
            </a>
            
          </div>

          {/* Ticket Form */}
          <div className="bg-card border border-border rounded-[2rem] p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-secondary/50 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-bold text-lg">Submit a Request</h3>
                <p className="text-sm text-muted-foreground font-medium">We'll get back to you within 24 hours.</p>
              </div>
            </div>
            
            <form className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Subject</label>
                <input 
                  type="text" 
                  placeholder="What do you need help with?"
                  className="flex h-12 w-full rounded-xl border-transparent bg-secondary/30 px-4 py-2 text-sm shadow-sm transition-colors focus:bg-transparent focus:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider ml-1">Message</label>
                <textarea 
                  rows={4}
                  placeholder="Describe your issue in detail..."
                  className="flex w-full rounded-xl border-transparent bg-secondary/30 px-4 py-3 text-sm shadow-sm transition-colors focus:bg-transparent focus:border-primary/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 font-medium resize-none"
                ></textarea>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl h-12 mt-2">
                Send Message
              </Button>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          
          {/* FAQs */}
          <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-lg mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-primary" /> FAQs
            </h3>
            <div className="space-y-5">
              {faqs.map((faq, index) => (
                <div key={index} className="group cursor-pointer">
                  <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors">{faq.question}</h4>
                  <p className="text-sm text-muted-foreground font-medium leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
            <Link href="/faq" className="mt-6 flex items-center justify-center gap-1 text-sm font-bold text-primary hover:underline">
              View all FAQs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Office Info */}
          <div className="bg-slate-50 border border-border border-dashed rounded-3xl p-6 text-center">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <MapPin className="w-5 h-5 text-muted-foreground" />
            </div>
            <h4 className="font-bold mb-1">Our Office</h4>
            <p className="text-sm text-muted-foreground font-medium mb-4">
              123 UfitGo Tower,<br/>
              Lagos, Nigeria
            </p>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Working Hours
            </p>
            <p className="text-sm font-bold mt-1">
              Mon - Fri: 9AM - 5PM
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}
