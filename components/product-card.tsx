"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Heart, Eye, Loader2 } from "lucide-react"
import { ShoeDisplay } from "@/components/shoe-display"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { addToCart } from "@/lib/cart-actions"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

interface ProductCardProps {
  id: string
  name: string
  price: number
  category: string
  design: any
  isNew?: boolean
  rating?: number
}

export function ProductCard({ id, name, price, category, design, isNew, rating = 4.8 }: ProductCardProps) {
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAddToCart = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await addToCart(user.uid, design)
      toast({
        title: "Added to cart",
        description: `${name} has been added to your cart`,
      })
    } catch (error) {
      console.error("Error adding to cart:", error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSaveDesign = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save designs",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Design saved",
        description: "The design has been saved to your profile",
      })
    }, 800)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="h-full"
    >
      <Card className="overflow-hidden border-0 shadow-soft h-full">
        <div className="relative h-72 bg-gradient-to-br from-gray-900 to-gray-800 product-card">
          {isNew && <Badge className="absolute top-3 left-3 z-10 bg-primary hover:bg-primary">New</Badge>}
          <ShoeDisplay design={design} height="288px" interactive={false} showControls={false} />
          <div className="product-actions">
            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/90 hover:bg-white"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full bg-white/90 hover:bg-white"
                onClick={handleSaveDesign}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-white/90 hover:bg-white" asChild>
                <Link href={`/customize?template=${id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <CardContent className="p-5">
          <div className="flex justify-between items-center mb-2">
            <div>
              <h3 className="font-semibold text-lg">{name}</h3>
              <p className="text-sm text-muted-foreground capitalize">{category}</p>
            </div>
            <div className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-4 h-4 text-yellow-400"
              >
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-sm">{rating}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-lg">₹{price.toLocaleString()}</span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <Link href={`/customize?template=${id}`}>Customize</Link>
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-primary hover:bg-primary-600"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <Loader2 className="animate-spin mr-2 h-4 w-4" />
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
