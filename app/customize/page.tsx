"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { ShoeCustomizer } from "@/components/shoe-customizer"
import { useAuth } from "@/components/auth-provider"
import { saveDesign, getDesignById } from "@/lib/design-actions"
import { addToCart } from "@/lib/cart-actions"
import { stockDesigns } from "@/lib/stock-designs"
import type { ShoeDesign } from "@/lib/types"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Loader, Save, ShoppingCart } from "lucide-react"

const shoeSizes = [
  { value: "6", label: "UK 6 / EU 40" },
  { value: "7", label: "UK 7 / EU 41" },
  { value: "8", label: "UK 8 / EU 42" },
  { value: "9", label: "UK 9 / EU 43" },
  { value: "10", label: "UK 10 / EU 44" },
  { value: "11", label: "UK 11 / EU 45" },
  { value: "12", label: "UK 12 / EU 46" },
]

// Default design to prevent undefined values
const defaultDesign: ShoeDesign = {
  name: "Custom Design",
  sole: { color: "#ffffff", material: "rubber" },
  trim: { color: "#00a8ff", material: "leather" },
  head: { color: "#333333", material: "mesh" },
  laces: { color: "#ffffff", material: "fabric" },
  size: "8",
}

export default function CustomizePage() {
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")
  const designId = searchParams.get("designId")

  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { toast } = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [activePart, setActivePart] = useState("sole")
  const [selectedSize, setSelectedSize] = useState("8")
  // Initialize with defaultDesign to prevent undefined values
  const [design, setDesign] = useState<ShoeDesign>(defaultDesign)
  const [isInitialized, setIsInitialized] = useState(false)
  const [loadingDesign, setLoadingDesign] = useState(true)

  // Load design
  useEffect(() => {
    const fetchDesign = async () => {
      setLoadingDesign(true)
      try {
        if (designId && user) {
          console.log("Fetching design with ID:", designId)
          const saved = await getDesignById(designId, user.id)
          console.log("Fetched design:", saved)

          if (saved) {
            // The saved design is already in the correct format
            setDesign({
              ...defaultDesign,
              id: saved.id,
              name: saved.name || "Custom Design",
              size: saved.size || "8",
              sole: {
                color: saved.sole?.color || defaultDesign.sole.color,
                material: saved.sole?.material || defaultDesign.sole.material,
              },
              trim: {
                color: saved.trim?.color || defaultDesign.trim.color,
                material: saved.trim?.material || defaultDesign.trim.material,
              },
              head: {
                color: saved.head?.color || defaultDesign.head.color,
                material: saved.head?.material || defaultDesign.head.material,
              },
              laces: {
                color: saved.laces?.color || defaultDesign.laces.color,
                material: saved.laces?.material || defaultDesign.laces.material,
              },
            })
            setSelectedSize(saved.size || "8")
            toast({ title: "Design Loaded", description: `You're editing "${saved.name || "Custom Design"}".` })
          }
        } else if (templateId) {
          const template = stockDesigns.find((d) => d.id === templateId)
          if (template) {
            // Ensure all required properties exist
            setDesign({
              ...defaultDesign,
              ...template.design,
              name: template.design.name || template.name || "Custom Design",
              size: template.design.size || "8",
            })
            setSelectedSize(template.design.size || "8")
            toast({ title: "Template Loaded", description: `You're customizing "${template.name}".` })
          }
        }
      } catch (error) {
        console.error("Error loading design:", error)
        toast({
          title: "Error Loading Design",
          description: "There was a problem loading your design. Starting with default options.",
          variant: "destructive",
        })
        // Keep the default design on error
      } finally {
        setIsInitialized(true)
        setLoadingDesign(false)
      }
    }

    fetchDesign()
  }, [templateId, designId, user, toast])

  const handleSaveDesign = async () => {
    if (!user || !design) return

    const designWithSize = { ...design, size: selectedSize }
    setIsLoading(true)
    try {
      const result = await saveDesign(user.id, designWithSize)
      console.log("Save result:", result)
      toast({
        title: "Design Saved",
        description: (
          <div>
            <span>Your design has been saved.</span>
            <Link href="/saved-designs" className="underline text-sm text-blue-500">
              View saved designs
            </Link>
          </div>
        ),
      })
    } catch (err) {
      console.error("Error saving design:", err)
      toast({ title: "Error", description: "Failed to save design", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddToCart = async () => {
    if (!user || !design) return

    setIsLoading(true)
    try {
      await addToCart(user.id, { ...design, size: selectedSize })
      toast({
        title: "Added to Cart",
        description: (
          <Link href="/cart" className="underline text-sm text-blue-500">
            Go to cart
          </Link>
        ),
      })
    } catch (err) {
      console.error("Error adding to cart:", err)
      toast({ title: "Error", description: "Failed to add to cart", variant: "destructive" })
    } finally {
      setIsLoading(false)
    }
  }

  // Ensure design name is always a string
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value || "" // Fallback to prevent empty string
    setDesign((prev) => ({ ...prev, name: newName }))
  }

  if (authLoading || loadingDesign) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading design...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Customize Your Shoe</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Shoe Viewer */}
        <div className="lg:col-span-2 order-2 lg:order-1">
          <ShoeCustomizer design={design} onChange={setDesign} />
        </div>

        {/* Controls */}
        <div className="lg:col-span-1 order-1 lg:order-2">
          <Card className="glassmorphism-card border-0 shadow-soft-xl overflow-hidden">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white pb-0">
              <CardHeader>
                <CardTitle>Customize Design</CardTitle>
              </CardHeader>
            </div>
            <CardContent className="p-6 space-y-6 pt-6">
              <div>
                <label className="block mb-1 text-sm font-medium text-foreground/90">Design Name</label>
                <input
                  type="text"
                  value={design.name || ""} // Ensure value is never undefined
                  onChange={handleNameChange}
                  className="input-default"
                />
              </div>

              {/* Size Picker */}
              <div>
                <h3 className="text-sm font-medium mb-3">Select Size</h3>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="grid grid-cols-2 gap-2">
                  {shoeSizes.map((size) => (
                    <div key={size.value} className="flex items-center space-x-2 border rounded-md p-2">
                      <RadioGroupItem value={size.value} id={`size-${size.value}`} />
                      <Label htmlFor={`size-${size.value}`}>{size.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="space-y-4 pt-4">
                <Button onClick={handleSaveDesign} className="w-full btn-outline" disabled={isLoading || !isInitialized}>
                  {isLoading ? <Loader className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                  Save Design
                </Button>
                <Button onClick={handleAddToCart} className="w-full btn-gradient py-6 text-lg font-bold" disabled={isLoading || !isInitialized}>
                  {isLoading ? <Loader className="animate-spin h-5 w-5 mr-2" /> : <ShoppingCart className="h-5 w-5 mr-3" />}
                  Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
