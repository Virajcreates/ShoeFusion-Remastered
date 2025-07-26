"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { ShoppingCart, Heart, Search, SlidersHorizontal, X, Loader2 } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { useAuth } from "@/components/auth-provider"
import { stockDesigns } from "@/lib/stock-designs"
import { ShoeDisplay } from "@/components/shoe-display"
import { addToCart } from "@/lib/cart-actions"
import Link from "next/link"

export default function ExplorePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [priceRange, setPriceRange] = useState([7000, 13000])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [showNewOnly, setShowNewOnly] = useState(false)
  const [sortBy, setSortBy] = useState("featured")
  const [loadingDesignId, setLoadingDesignId] = useState<string | null>(null)

  // Filter designs based on criteria
  const filteredDesigns = stockDesigns.filter((design) => {
    // Search query filter
    if (searchQuery && !design.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Price range filter
    if (design.price < priceRange[0] || design.price > priceRange[1]) {
      return false
    }

    // Category filter
    if (selectedCategories.length > 0 && !selectedCategories.includes(design.category)) {
      return false
    }

    // New only filter
    if (showNewOnly && !design.isNew) {
      return false
    }

    return true
  })

  // Sort designs
  const sortedDesigns = [...filteredDesigns].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "newest":
        return a.isNew ? -1 : b.isNew ? 1 : 0
      default:
        return 0
    }
  })

  const handleAddToCart = async (designId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      return
    }

    setLoadingDesignId(designId)
    try {
      const stockDesign = stockDesigns.find((d) => d.id === designId)
      if (stockDesign) {
        await addToCart(user.uid, stockDesign.design)
        toast({
          title: "Added to cart",
          description: `${stockDesign.name} has been added to your cart`,
        })
      }
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setLoadingDesignId(null)
    }
  }

  const handleSaveDesign = (designId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save designs",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Design saved",
      description: "The design has been saved to your profile",
    })
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
    )
  }

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) => (prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]))
  }

  const clearFilters = () => {
    setSearchQuery("")
    setPriceRange([7000, 13000])
    setSelectedCategories([])
    setSelectedColors([])
    setShowNewOnly(false)
    setSortBy("featured")
  }

  const categories = ["running", "casual", "sports"]
  const availableColors = ["black", "white", "red", "blue", "green", "gray", "orange", "brown"]

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Explore Designs</h1>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search designs..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="flex gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md overflow-y-auto">
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-medium mb-4">Price Range</h3>
                  <div className="px-2">
                    <Slider defaultValue={priceRange} min={7000} max={13000} step={500} onValueChange={setPriceRange} />
                    <div className="flex justify-between mt-2 text-sm">
                      <span>₹{priceRange[0].toLocaleString()}</span>
                      <span>₹{priceRange[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Categories */}
                <div>
                  <h3 className="font-medium mb-4">Categories</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox
                          id={`category-${category}`}
                          checked={selectedCategories.includes(category)}
                          onCheckedChange={() => handleCategoryChange(category)}
                        />
                        <Label htmlFor={`category-${category}`} className="capitalize">
                          {category}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Colors */}
                <div>
                  <h3 className="font-medium mb-4">Colors</h3>
                  <div className="flex flex-wrap gap-2">
                    {availableColors.map((color) => (
                      <div
                        key={color}
                        className={`w-8 h-8 rounded-full cursor-pointer border-2 ${
                          selectedColors.includes(color) ? "border-primary" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => handleColorChange(color)}
                      />
                    ))}
                  </div>
                </div>

                {/* New Only */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="new-only"
                    checked={showNewOnly}
                    onCheckedChange={(checked) => setShowNewOnly(!!checked)}
                  />
                  <Label htmlFor="new-only">New arrivals only</Label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={clearFilters}>
                    Clear All
                  </Button>
                  <SheetClose asChild>
                    <Button className="flex-1">Apply Filters</Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <select
            className="h-10 rounded-md border border-input bg-background px-3 py-2"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="featured">Featured</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(selectedCategories.length > 0 || selectedColors.length > 0 || showNewOnly) && (
        <div className="flex flex-wrap gap-2 mb-6">
          {selectedCategories.map((category) => (
            <div key={category} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <span className="capitalize">{category}</span>
              <Button
                variant="ghost"
                size="icon"
                className="h-4 w-4 ml-1"
                onClick={() => handleCategoryChange(category)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {selectedColors.map((color) => (
            <div key={color} className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <div className="w-3 h-3 rounded-full mr-1" style={{ backgroundColor: color }} />
              <span className="capitalize">{color}</span>
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => handleColorChange(color)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {showNewOnly && (
            <div className="flex items-center bg-muted px-3 py-1 rounded-full text-sm">
              <span>New Only</span>
              <Button variant="ghost" size="icon" className="h-4 w-4 ml-1" onClick={() => setShowNewOnly(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          \
          <Button variant="ghost" size="sm" className="text-sm" onClick={() => clearFilters()}>
            Clear All
          </Button>
        </div>
      )}

      {/* Results */}
      {sortedDesigns.length === 0 ? (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No designs found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your filters or search query</p>
          <Button onClick={clearFilters}>Clear Filters</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedDesigns.map((design) => (
            <Card key={design.id} className="overflow-hidden group">
              <div className="relative h-64 bg-muted">
                {design.isNew && (
                  <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full z-10">
                    New
                  </div>
                )}
                <ShoeDisplay design={design.design} height="256px" interactive={false} showControls={true} />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleAddToCart(design.id)}
                      disabled={loadingDesignId === design.id}
                    >
                      {loadingDesignId === design.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                    </Button>
                    <Button variant="secondary" size="icon" onClick={() => handleSaveDesign(design.id)}>
                      <Heart className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-lg">{design.name}</h3>
                <p className="text-muted-foreground text-sm">{design.category}</p>
                <div className="mt-2 flex items-center justify-between">
                  <div>₹{design.price.toLocaleString()}</div>
                  
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
