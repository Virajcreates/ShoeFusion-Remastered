"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { CheckCircle, Loader2, Package, ShoppingBag } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getSupabaseClient } from "@/lib/supabase-client"
import { format } from "date-fns"

export default function CheckoutSuccessPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [order, setOrder] = useState<any>(null)
  const orderId = searchParams.get("orderId")

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      if (!orderId) {
        router.push("/")
        return
      }

      setIsLoading(true)
      try {
        // Try to get order from Supabase
        const supabase = getSupabaseClient()
        if (!supabase) throw new Error("Supabase client not initialized")

        const { data: orderData, error } = await supabase
          .from("orders")
          .select("*")
          .eq("id", orderId)
          .eq("user_id", user.id)
          .single()

        if (error) throw error

        if (orderData) {
          setOrder(orderData)
        } else {
          throw new Error("Order not found")
        }
      } catch (error) {
        console.error("Error fetching order:", error)
        toast({
          title: "Error",
          description: "Could not find your order. Please try again.",
          variant: "destructive",
        })
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [user, router, orderId, toast])

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading order details...</p>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="text-xl font-semibold mb-4">Order not found</p>
          <Button asChild>
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your order. We've received your payment and will begin processing your order right away.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Order #{order.id.slice(0, 8)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Date</span>
                  <span>{format(new Date(order.created_at), "PPP")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Order Status</span>
                  <span className="capitalize">{order.status}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="capitalize">{order.payment_method || "Card"}</span>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Items</h3>
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-2">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex justify-between">
                        <span>
                          {item.name} × {item.quantity}
                        </span>
                        <span>₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No items found</p>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <address className="not-italic text-sm">
                  {order.shipping_address?.full_name}
                  <br />
                  {order.shipping_address?.address_line1}
                  <br />
                  {order.shipping_address?.address_line2 && (
                    <>
                      {order.shipping_address.address_line2}
                      <br />
                    </>
                  )}
                  {order.shipping_address?.city}, {order.shipping_address?.state} {order.shipping_address?.postal_code}
                  <br />
                  {order.shipping_address?.country}
                  <br />
                  {order.shipping_address?.phone_number}
                </address>
              </div>

              <Separator />

              <div>
                <div className="flex justify-between mb-1">
                  <span>Subtotal</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Shipping</span>
                  <span>{order.shipping > 0 ? `₹${order.shipping.toLocaleString("en-IN")}` : "Free"}</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>Tax (18% GST)</span>
                  <span>₹{order.tax.toLocaleString("en-IN")}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{(order.total + order.tax + (order.shipping || 0)).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/orders">
              <Package className="mr-2 h-4 w-4" />
              View All Orders
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/explore">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
