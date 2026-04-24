"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ShoppingCart, Heart, Eye, Loader2 } from "lucide-react"
import { ShoeDisplay } from "@/components/shoe-display"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { addToCart } from "@/lib/cart-actions"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
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
  const containerRef = useRef<HTMLDivElement>(null)

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
    <div
      ref={containerRef}
      className="h-full group hover:-translate-y-1 transition-transform duration-300"
    >
      <Card className="overflow-hidden border-0 shadow-none h-full bg-transparent">
        <div className="relative h-[25rem] bg-secondary border-b transition-colors product-card overflow-hidden">
          {isNew && <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground rounded-none px-3 py-1 uppercase tracking-widest text-[10px] font-bold">New Release</Badge>}
          
          <div className="absolute inset-0 flex items-center justify-center mix-blend-screen opacity-90">
            <ShoeDisplay design={design} height="350px" interactive={false} showControls={false} />
          </div>

          {/* Brutalist overlay UI */}
          <div className="absolute bottom-0 left-0 w-full overflow-hidden h-0 group-hover:h-16 transition-all duration-300 bg-background/90 backdrop-blur-sm border-t border-border flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none hover:bg-foreground hover:text-background h-10 w-10 transition-colors"
                onClick={handleAddToCart}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShoppingCart className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-none hover:bg-foreground hover:text-background h-10 w-10 transition-colors"
                onClick={handleSaveDesign}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-none hover:bg-foreground hover:text-background h-10 w-10 transition-colors" asChild>
                <Link href={`/customize?template=${id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
          </div>
        </div>
        
        <CardContent className="px-0 py-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-black text-2xl uppercase tracking-tighter leading-none mb-1">{name}</h3>
              <p className="text-xs tracking-widest uppercase text-foreground/50">{category}</p>
            </div>
            <span className="font-bold text-xl tracking-tight">₹{price.toLocaleString()}</span>
          </div>
          
          <div className="flex gap-3">
            <Button asChild variant="outline" size="sm" className="flex-1 rounded-none uppercase tracking-widest text-xs font-bold border-foreground/20 hover:bg-foreground hover:text-background transition-colors h-10">
              <Link href={`/customize?template=${id}`}>EDIT</Link>
            </Button>
            <Button
              size="sm"
              className="flex-1 rounded-none bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold hover:bg-secondary hover:text-secondary-foreground transition-colors h-10"
              onClick={handleAddToCart}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="animate-spin h-4 w-4" />
              ) : (
                "BUY"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
