"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Operator } from "@/lib/packages"
import { OperatorCard } from "@/components/operator-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function BrowseOperatorsClient({ initialOperators }: { initialOperators: Operator[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  const filteredOperators = useMemo(() => {
    return initialOperators.filter((op) => {
      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const nameToDisplay = op.companyName || op.name || ""
        const matchName = nameToDisplay.toLowerCase().includes(query)
        
        if (!matchName) {
          return false
        }
      }

      // Filters
      if (showVerifiedOnly && !(op.verificationStatus === 'approved' || op.verified)) return false

      return true
    })
  }, [initialOperators, searchQuery, showVerifiedOnly])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </span>
            {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={cn(
          "w-full lg:w-64 shrink-0 space-y-8 border-b border-border pb-8 lg:border-b-0 lg:border-r lg:pr-8 lg:pb-0",
          showFilters ? "block" : "hidden lg:block"
        )}>
          <div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search operators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          <div>
            <h3 className="mb-4 flex items-center gap-2 font-medium">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </h3>

            <div className="space-y-6">
              {/* Verification Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Status</h4>
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={showVerifiedOnly}
                        onChange={(e) => setShowVerifiedOnly(e.target.checked)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>Verified Only</span>
                    </label>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredOperators.length} operator{filteredOperators.length !== 1 ? 's' : ''}</span>
          </div>

          {filteredOperators.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredOperators.map((op) => (
                <OperatorCard key={op.id} operator={op} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-lg font-medium text-foreground">No operators found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setShowVerifiedOnly(false)
                }}
                className="mt-4 text-sm font-medium text-primary hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
