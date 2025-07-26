"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ChevronLeft, Package, Clock, CheckCircle, AlertCircle, Truck, Download, Share2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ShoeViewer } from "@/components/shoe-viewer"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

export default function OrderDetailPage() {
  const { id } = useParams()
  const orderId = Array.isArray(id) ? id[0] : id
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(true)
      try {
        // Try to get order from Supabase
        try {
          const { data: orderData, error } = await supabase
            .from("orders")
            .select("*")
            .eq("id", orderId)
            .eq("userId", user.uid)
            .single()

          if (error) throw error
          if (orderData) {
            setOrder(orderData)
            return
          }
        } catch (supabaseError) {
          console.warn("Supabase error, trying localStorage:", supabaseError)
        }

        // Fallback to localStorage
        const localOrders = JSON.parse(localStorage.getItem(`orders_${user.uid}`) || "[]")
        const localOrder = localOrders.find((o: any) => o.id === orderId)

        if (localOrder) {
          setOrder(localOrder)
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
        router.push("/orders")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [user, router, orderId, toast])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-300">
            Pending
          </Badge>
        )
      case "processing":
        return (
          <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
            Processing
          </Badge>
        )
      case "shipped":
        return (
          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
            Shipped
          </Badge>
        )
      case "delivered":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 border-green-300">
            Delivered
          </Badge>
        )
      case "cancelled":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 border-red-300">
            Cancelled
          </Badge>
        )
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "processing":
        return <Package className="h-5 w-5 text-blue-500" />
      case "shipped":
        return <Truck className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const handleShareOrder = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Order #${orderId.slice(0, 8)}`,
          text: `Check out my order from ShoeFusion!`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link Copied",
        description: "Order link copied to clipboard",
      })
    }
  }

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
            <Link href="/orders">Return to Orders</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Link href="/orders" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            {getStatusIcon(order.status)}
            Order #{orderId.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground mt-1">Placed on {format(new Date(order.createdAt), "PPP")}</p>
        </div>
        <div className="flex items-center gap-2">
          {getStatusBadge(order.status)}
          <Button variant="outline" size="sm" onClick={handleShareOrder}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {order.items.map((item: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4 pb-4 border-b last:border-0 last:pb-0">
                    <div className="w-full sm:w-32 h-32 bg-muted rounded-md overflow-hidden">
                      {item.design ? (
                        <ShoeViewer design={item.design} height="128px" interactive={true} />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                          No Image
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-2">
                        <div>
                          <span className="text-sm text-muted-foreground">Quantity:</span>
                          <span className="ml-2 font-medium">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">Price:</span>
                          <span className="ml-2 font-medium">₹{item.price.toLocaleString("en-IN")}</span>
                        </div>
                        {item.design && (
                          <>
                            <div>
                              <span className="text-sm text-muted-foreground">Upper:</span>
                              <span className="ml-2 capitalize">{item.design.head.material}</span>
                            </div>
                            <div>
                              <span className="text-sm text-muted-foreground">Sole:</span>
                              <span className="ml-2 capitalize">{item.design.sole.material}</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/customize?design=${encodeURIComponent(JSON.stringify(item.design))}`}>
                            Customize Again
                          </Link>
                        </Button>
                        <Button variant="ghost" size="sm">
                          Add to Cart
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="relative border-l border-muted">
                <li className="mb-6 ml-6">
                  <span className="absolute flex items-center justify-center w-6 h-6 bg-primary/10 rounded-full -left-3 ring-8 ring-background">
                    <CheckCircle className="w-3 h-3 text-primary" />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">
                    Order Placed
                    <Badge variant="outline" className="ml-3 bg-green-100 text-green-800 border-green-300">
                      Completed
                    </Badge>
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                    {format(new Date(order.createdAt), "PPP 'at' p")}
                  </time>
                  <p className="text-sm">Your order has been received and is being processed.</p>
                </li>
                <li className="mb-6 ml-6">
                  <span
                    className={`absolute flex items-center justify-center w-6 h-6 ${
                      order.status === "pending" ? "bg-muted" : "bg-primary/10"
                    } rounded-full -left-3 ring-8 ring-background`}
                  >
                    <Package
                      className={`w-3 h-3 ${order.status === "pending" ? "text-muted-foreground" : "text-primary"}`}
                    />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">
                    Processing
                    {order.status === "processing" && (
                      <Badge variant="outline" className="ml-3 bg-blue-100 text-blue-800 border-blue-300">
                        Current
                      </Badge>
                    )}
                    {order.status !== "pending" && order.status !== "processing" && (
                      <Badge variant="outline" className="ml-3 bg-green-100 text-green-800 border-green-300">
                        Completed
                      </Badge>
                    )}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                    {order.status !== "pending"
                      ? format(new Date(order.updatedAt || order.createdAt), "PPP 'at' p")
                      : "Pending"}
                  </time>
                  <p className="text-sm">
                    {order.status === "pending"
                      ? "Your order will be processed soon."
                      : "Your order is being prepared for shipping."}
                  </p>
                </li>
                <li className="mb-6 ml-6">
                  <span
                    className={`absolute flex items-center justify-center w-6 h-6 ${
                      order.status === "pending" || order.status === "processing" ? "bg-muted" : "bg-primary/10"
                    } rounded-full -left-3 ring-8 ring-background`}
                  >
                    <Truck
                      className={`w-3 h-3 ${
                        order.status === "pending" || order.status === "processing"
                          ? "text-muted-foreground"
                          : "text-primary"
                      }`}
                    />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">
                    Shipped
                    {order.status === "shipped" && (
                      <Badge variant="outline" className="ml-3 bg-purple-100 text-purple-800 border-purple-300">
                        Current
                      </Badge>
                    )}
                    {order.status === "delivered" && (
                      <Badge variant="outline" className="ml-3 bg-green-100 text-green-800 border-green-300">
                        Completed
                      </Badge>
                    )}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                    {order.status === "shipped" || order.status === "delivered"
                      ? format(new Date(order.updatedAt || order.createdAt), "PPP 'at' p")
                      : "Pending"}
                  </time>
                  <p className="text-sm">
                    {order.status === "shipped" || order.status === "delivered"
                      ? "Your order has been shipped and is on its way to you."
                      : "Your order will be shipped soon."}
                  </p>
                </li>
                <li className="ml-6">
                  <span
                    className={`absolute flex items-center justify-center w-6 h-6 ${
                      order.status === "delivered" ? "bg-primary/10" : "bg-muted"
                    } rounded-full -left-3 ring-8 ring-background`}
                  >
                    <CheckCircle
                      className={`w-3 h-3 ${order.status === "delivered" ? "text-primary" : "text-muted-foreground"}`}
                    />
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold">
                    Delivered
                    {order.status === "delivered" && (
                      <Badge variant="outline" className="ml-3 bg-green-100 text-green-800 border-green-300">
                        Completed
                      </Badge>
                    )}
                  </h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-muted-foreground">
                    {order.status === "delivered"
                      ? format(new Date(order.updatedAt || order.createdAt), "PPP 'at' p")
                      : "Pending"}
                  </time>
                  <p className="text-sm">
                    {order.status === "delivered"
                      ? "Your order has been delivered. Enjoy your new shoes!"
                      : "Your order will be delivered soon."}
                  </p>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{order.total.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{order.shipping > 0 ? `₹${order.shipping.toLocaleString("en-IN")}` : "Free"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{order.tax.toLocaleString("en-IN")}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{(order.total + order.tax + order.shipping).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Shipping Address</h3>
                  <div className="text-sm">
                    <p>{order.address?.name}</p>
                    <p>{order.address?.street}</p>
                    <p>
                      {order.address?.city}, {order.address?.state} {order.address?.zip}
                    </p>
                    <p>{order.address?.country}</p>
                    <p className="mt-1">{order.address?.phone}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <div className="text-sm">
                    <p>
                      {order.paymentMethod === "card"
                        ? "Credit/Debit Card"
                        : order.paymentMethod === "upi"
                          ? "UPI Payment"
                          : "Cash on Delivery"}
                    </p>
                    {order.paymentStatus && (
                      <Badge
                        variant="outline"
                        className={
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 border-green-300 mt-1"
                            : "bg-yellow-100 text-yellow-800 border-yellow-300 mt-1"
                        }
                      >
                        {order.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    )}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button className="w-full" asChild>
                    <Link href="/track-order">Track Order</Link>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Need Help?
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
