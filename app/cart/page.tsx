"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Trash2, ShoppingBag, ArrowRight, Loader2, Plus, Minus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getCartItems, removeFromCart } from "@/lib/cart-actions"
import type { CartItem } from "@/lib/types"
import { loadStripe } from "@stripe/stripe-js"
import { ShoeViewer } from "@/components/shoe-viewer"

// Initialize Stripe with the publishable key
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
    "pk_test_51PiHVgRpvZCfjfCQoiojLgoEMNYG4rJYASuLHa1Avd6Vz0RPHU7BwfgCMcaXOm9nSQCKHDS5r46LiH5gh4XOURJI00RZuopmpU",
)

export default function CartPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingCart, setIsLoadingCart] = useState(true)
  const [removingItemId, setRemovingItemId] = useState<string | null>(null)

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) {
        setIsLoadingCart(false)
        return
      }

      setIsLoadingCart(true)
      try {
        const items = await getCartItems(user.uid)
        setCartItems(items)
      } catch (error) {
        console.error("Error fetching cart:", error)
        toast({
          title: "Error",
          description: "Failed to load cart items",
          variant: "destructive",
        })
      } finally {
        setIsLoadingCart(false)
      }
    }

    fetchCart()
  }, [user, toast])

  const handleRemoveItem = async (itemId: string) => {
    if (!user) return

    setRemovingItemId(itemId)
    try {
      await removeFromCart(user.uid, itemId)
      setCartItems(cartItems.filter((item) => item.id !== itemId))
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart",
      })
    } catch (error) {
      console.error("Error removing item:", error)
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setRemovingItemId(null)
    }
  }

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setCartItems(cartItems.map((item) => (item.id === itemId ? { ...item, quantity: newQuantity } : item)))
  }

  const calculateItemTotal = (item: CartItem) => {
    return item.price * item.quantity
  }

  const calculateSubtotal = () => {
    if (cartItems.length === 0) return 0
    return cartItems.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  const calculateTax = () => {
    return Math.round(calculateSubtotal() * 0.18) // Round to nearest integer for cleaner display
  }

  const calculateShipping = () => {
    return 0 // Free shipping
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateShipping()
  }

  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to checkout",
        variant: "destructive",
      })
      return
    }

    // Navigate to checkout address page
    router.push("/checkout/address")
  }

  // Sample cart items for demonstration
  const sampleCartItems: CartItem[] = [
    {
      id: "classic-runner",
      name: "Classic Runner",
      price: 9999,
      quantity: 1,
      image: "/placeholder.svg",
      design: {
        sole: { color: "#ffffff", material: "rubber" },
        trim: { color: "#00a8ff", material: "leather" },
        head: { color: "#333333", material: "mesh" },
        laces: { color: "#ffffff", material: "fabric" },
      },
    },
  ]

  // Use sample data if no real data is available
  const displayItems = cartItems.length > 0 ? cartItems : sampleCartItems

  if (isLoadingCart) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your cart...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {displayItems.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Looks like you haven't added any items to your cart yet.</p>
          <Button asChild>
            <Link href="/explore">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {displayItems.map((item) => (
              <Card key={item.id} className="mb-4">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="w-full sm:w-24 h-24 bg-muted rounded-md overflow-hidden">
                      {item.design ? (
                        <ShoeViewer design={item.design} height="96px" interactive={false} />
                      ) : (
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.name}</h3>
                      <div className="text-sm text-muted-foreground mt-1">Custom Design</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center border rounded-md">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-r-none"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-l-none"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{calculateItemTotal(item).toLocaleString("en-IN")}</div>
                      <div className="text-xs text-muted-foreground">₹{item.price.toLocaleString("en-IN")} each</div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="mt-2"
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={removingItemId === item.id}
                      >
                        {removingItemId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div>
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2">
                  {displayItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} × {item.quantity}
                      </span>
                      <span>₹{calculateItemTotal(item).toLocaleString("en-IN")}</span>
                    </div>
                  ))}

                  <Separator className="my-2" />

                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>₹{calculateSubtotal().toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax (18% GST)</span>
                    <span>₹{calculateTax().toLocaleString("en-IN")}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{calculateTotal().toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <Button className="w-full" onClick={handleCheckout} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    {isLoading ? "Processing..." : "Proceed to Checkout"}
                    {!isLoading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>

                  <div className="text-xs text-muted-foreground text-center">
                    <p>We accept all major credit/debit cards and UPI payments</p>
                    <div className="flex justify-center gap-2 mt-2">
                      <div className="w-8 h-5 bg-[#1434CB] rounded"></div>
                      <div className="w-8 h-5 bg-[#FF5F00] rounded"></div>
                      <div className="w-8 h-5 bg-[#5C2D91] rounded"></div>
                      <div className="w-8 h-5 bg-[#6772E5] rounded"></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
