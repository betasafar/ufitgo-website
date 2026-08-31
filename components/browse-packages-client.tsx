"use client"

import { useState, useMemo } from "react"
import { Search, SlidersHorizontal, ChevronDown, ChevronUp } from "lucide-react"
import { Package } from "@/lib/packages"
import { PackageCard } from "@/components/package-card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export function BrowsePackagesClient({ initialPackages }: { initialPackages: Package[] }) {
  const [searchQuery, setSearchQuery] = useState("")
  
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedMonths, setSelectedMonths] = useState<string[]>([])
  const [selectedCities, setSelectedCities] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [maxBudget, setMaxBudget] = useState<number | "">("")
  
  const [showFilters, setShowFilters] = useState(false)

  // Extract unique values for filters
  const types = Array.from(new Set(initialPackages.map((p) => p.type)))
  const months = Array.from(new Set(initialPackages.map((p) => {
    if (!p.departureDate) return "Unknown"
    try {
      return new Date(p.departureDate).toLocaleString('default', { month: 'long', year: 'numeric' })
    } catch {
      return "Unknown"
    }
  })))
  const cities = Array.from(new Set(initialPackages.map((p) => p.departureCity)))
  const categories = Array.from(new Set(initialPackages.map((p) => p.category)))

  const toggleFilter = (
    current: any[],
    setFn: (val: any[]) => void,
    item: any
  ) => {
    if (current.includes(item)) {
      setFn(current.filter((c) => c !== item))
    } else {
      setFn([...current, item])
    }
  }

  const filteredPackages = useMemo(() => {
    return initialPackages.filter((pkg) => {
      const monthStr = pkg.departureDate ? new Date(pkg.departureDate).toLocaleString('default', { month: 'long', year: 'numeric' }) : "Unknown"

      // Search
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchName = pkg.name.toLowerCase().includes(query)
        const matchOperator = pkg.operator?.name?.toLowerCase().includes(query)
        const matchCity = pkg.departureCity.toLowerCase().includes(query)
        const matchDate = pkg.departureDate?.toLowerCase().includes(query) || monthStr.toLowerCase().includes(query)
        
        if (!matchName && !matchOperator && !matchCity && !matchDate) {
          return false
        }
      }

      // Filters
      if (selectedTypes.length > 0 && !selectedTypes.includes(pkg.type)) return false
      if (selectedMonths.length > 0 && !selectedMonths.includes(monthStr)) return false
      if (selectedCities.length > 0 && !selectedCities.includes(pkg.departureCity)) return false
      if (selectedCategories.length > 0 && !selectedCategories.includes(pkg.category)) return false
      if (maxBudget !== "" && pkg.priceFrom > maxBudget) return false

      return true
    })
  }, [initialPackages, searchQuery, selectedTypes, selectedMonths, selectedCities, selectedCategories, maxBudget])

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
                placeholder="Search packages..."
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
              {/* Type Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Package Type</h4>
                <div className="space-y-2">
                  {types.map((type) => (
                    <label key={type} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedTypes.includes(type)}
                        onChange={() => toggleFilter(selectedTypes, setSelectedTypes, type)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="capitalize">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Budget Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Max Budget (₦)</h4>
                <Input
                  type="number"
                  placeholder="Any budget"
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(e.target.value === "" ? "" : Number(e.target.value))}
                />
              </div>

              {/* Month Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Departure Month</h4>
                <div className="space-y-2">
                  {months.map((month) => (
                    <label key={month} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedMonths.includes(month)}
                        onChange={() => toggleFilter(selectedMonths, setSelectedMonths, month)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>{month}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Category</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <label key={cat} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCategories.includes(cat)}
                        onChange={() => toggleFilter(selectedCategories, setSelectedCategories, cat)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span className="capitalize">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Departure City Filter */}
              <div>
                <h4 className="text-sm font-medium mb-3 text-muted-foreground">Departure City</h4>
                <div className="space-y-2">
                  {cities.map((city) => (
                    <label key={city} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={selectedCities.includes(city)}
                        onChange={() => toggleFilter(selectedCities, setSelectedCities, city)}
                        className="rounded border-input text-primary focus:ring-primary"
                      />
                      <span>{city}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          <div className="mb-4 flex items-center justify-between text-sm text-muted-foreground">
            <span>Showing {filteredPackages.length} package{filteredPackages.length !== 1 ? 's' : ''}</span>
          </div>

          {filteredPackages.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {filteredPackages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center">
              <p className="text-lg font-medium text-foreground">No packages found</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search query.</p>
              <button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedTypes([])
                  setSelectedMonths([])
                  setSelectedCities([])
                  setSelectedCategories([])
                  setMaxBudget("")
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
