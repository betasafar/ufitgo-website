import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

import faqData from "@/data/faq.json"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#0a1c12] pt-24 pb-32">
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary via-[#0a1c12] to-[#0a1c12]" />
        
        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
            <h1 className="font-serif text-5xl font-bold tracking-tight text-white md:text-6xl mb-6">
              Frequently Asked <span className="text-[#E5B611]">Questions</span>
            </h1>
            <p className="text-lg text-white/80 leading-relaxed font-light">
              Find answers to common questions about how UfitGo works.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 -mt-16 z-20">
        <div className="container mx-auto px-4 pb-24">
          
          <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-slate-100 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
            
            {faqData.categories.map((category) => (
              <div key={category.id} className="mb-12 last:mb-0">
                <h2 className="text-2xl font-bold font-serif text-slate-900 mb-6 pb-2 border-b border-slate-100">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="w-full">
                  {category.faqs.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${category.id}-${index}`}>
                      <AccordionTrigger className="text-left text-lg font-semibold text-slate-900">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-slate-600 leading-relaxed text-base">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}

          </div>
          
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
