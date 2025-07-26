"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Package, ShoppingBag, Clock, CheckCircle, AlertCircle, Eye } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ShoeViewer } from "@/components/shoe-viewer"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"

// Types
interface ShoeDesign {
  sole: PartDesign
  trim: PartDesign
  head: PartDesign
  laces: PartDesign
}
interface PartDesign {
  color: string
  material: string
}
interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  design: ShoeDesign
}
interface Order {
  id: string
  userId: string
  items: CartItem[]
  total: number
  tax: number
  shipping: number
  address: any
  status: string
  createdAt: string
  updatedAt?: string
}

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
const supabase = createClient(supabaseUrl, supabaseAnonKey)

function mapOrderFromSupabase(order: any): Order {
  return {
    id: order.id,
    userId: order.user_id,
    items: order.items,
    total: order.total,
    tax: order.tax,
    shipping: order.shipping,
    address: order.shipping_address || order.address,
    status: order.status,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
  }
}

export default function OrdersPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(true)
      try {
        // Fetch orders from Supabase
        const { data: orderData, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", user.uid)
          .order("created_at", { ascending: false })

        if (error) throw error
        if (orderData && orderData.length > 0) {
          setOrders(orderData.map(mapOrderFromSupabase))
          return
        }

        // Fallback to localStorage if no orders found
        const localOrders = JSON.parse(localStorage.getItem(`orders_${user.uid}`) || "[]")
        setOrders(localOrders)
      } catch (error) {
        console.error("Error fetching orders:", error)
        toast({
          title: "Error",
          description: "Failed to load your orders",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user, router, toast])

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
        return <ShoppingBag className="h-5 w-5 text-purple-500" />
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "cancelled":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5" />
    }
  }

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading your orders...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="grid grid-cols-5 w-full max-w-md">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="processing">Processing</TabsTrigger>
          <TabsTrigger value="shipped">Shipped</TabsTrigger>
          <TabsTrigger value="delivered">Delivered</TabsTrigger>
        </TabsList>
      </Tabs>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No orders found</h2>
          <p className="text-muted-foreground mb-6">
            {activeTab === "all" ? "You haven't placed any orders yet." : `You don't have any ${activeTab} orders.`}
          </p>
          <Button asChild>
            <Link href="/explore">Start Shopping</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <CardHeader className="bg-muted/30 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    Order #{order.id.slice(0, 8)}
                  </CardTitle>
                  <div className="text-sm text-muted-foreground mt-1">
                    Placed on {format(new Date(order.createdAt), "PPP")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(order.status)}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/orders/${order.id}`}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-3">Order Items</h3>
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-4">
                          <div className="w-20 h-20 bg-muted rounded-md overflow-hidden">
                            {item.design ? (
                              <ShoeViewer
                                design={item.design}
                                height="80px"
                                interactive={false}
                                showFullscreenButton={false}
                              />
                            ) : (
                              <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground">
                                No Image
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium">{item.name}</h4>
                            <div className="text-sm text-muted-foreground">Quantity: {item.quantity}</div>
                            <div className="text-sm font-medium mt-1">₹{item.price.toLocaleString("en-IN")}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-3">Order Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>₹{order.total.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Shipping</span>
                        <span>{order.shipping > 0 ? `₹${order.shipping.toLocaleString("en-IN")}` : "Free"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Tax</span>
                        <span>₹{order.tax.toLocaleString("en-IN")}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>₹{(order.total + order.tax + order.shipping).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t">
                      <h3 className="font-semibold mb-2">Shipping Address</h3>
                      <div className="text-sm">
                        <p>{order.address?.name}</p>
                        <p>{order.address?.street}</p>
                        <p>
                          {order.address?.city}, {order.address?.state} {order.address?.zip}
                        </p>
                        <p>{order.address?.country}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}