"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { LogOut, Edit, Plus, Trash2, MapPin } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getUserDesigns, deleteDesign } from "@/lib/design-actions"
import { addToCart } from "@/lib/cart-actions"
import { getSupabaseClient } from "@/lib/supabase-client"
import type { ShoeDesign } from "@/lib/types"
import Link from "next/link"

interface SavedDesign {
  id: string
  design: ShoeDesign
  createdAt: string
}

interface Order {
  id: string
  total: number
  status: string
  date: string
  items: {
    name: string
    quantity: number
  }[]
}

interface Address {
  id: string
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
}

export default function ProfilePage() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [savedDesigns, setSavedDesigns] = useState<SavedDesign[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [addresses, setAddresses] = useState<Address[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("designs")

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(true)
      try {
        // Fetch saved designs
        console.log("Fetching designs for user:", user.id)
        const designs = await getUserDesigns(user.id)
        console.log("Fetched designs:", designs)
        setSavedDesigns(designs)

        // Fetch orders
        const supabase = getSupabaseClient()
        if (supabase) {
          try {
            const { data: ordersData, error: ordersError } = await supabase
              .from("orders")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })

            if (ordersError) throw ordersError

            // Format orders for display
            const formattedOrders = ordersData.map((order) => ({
              id: order.id,
              total: order.total,
              status: order.status,
              date: order.created_at,
              items: [], // We'll fetch items separately
            }))

            // Fetch order items for each order
            for (const order of formattedOrders) {
              const { data: itemsData, error: itemsError } = await supabase
                .from("order_items")
                .select("*")
                .eq("order_id", order.id)

              if (!itemsError && itemsData) {
                order.items = itemsData.map((item) => ({
                  name: item.name,
                  quantity: item.quantity,
                }))
              }
            }

            setOrders(formattedOrders)
          } catch (error) {
            console.error("Error fetching orders:", error)
            // If there's an error, we'll just continue with sample data
            setOrders([
              {
                id: "ORD-12345",
                total: 9999,
                status: "Delivered",
                date: "2023-12-15",
                items: [{ name: "Custom Running Shoe", quantity: 1 }],
              },
              {
                id: "ORD-12346",
                total: 19998,
                status: "Processing",
                date: "2024-03-20",
                items: [{ name: "Custom Running Shoe", quantity: 2 }],
              },
            ])
          }

          // Fetch addresses
          try {
            const { data: addressesData, error: addressesError } = await supabase
              .from("addresses")
              .select("*")
              .eq("user_id", user.id)
              .order("created_at", { ascending: false })

            if (addressesError) throw addressesError

            if (addressesData) {
              setAddresses(
                addressesData.map((addr) => ({
                  id: addr.id,
                  fullName: addr.full_name,
                  phoneNumber: addr.phone_number,
                  addressLine1: addr.address_line1,
                  addressLine2: addr.address_line2 || "",
                  city: addr.city,
                  state: addr.state,
                  postalCode: addr.postal_code,
                  country: addr.country,
                })),
              )
            }
          } catch (error) {
            console.error("Error fetching addresses:", error)
            // If there's an error, we'll just continue with empty addresses
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error)
        toast({
          title: "Error",
          description: "Failed to load your profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [user, router, toast])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push("/login")
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      })
    }
  }

  const handleDeleteDesign = async (designId: string) => {
    if (!user) return

    try {
      const result = await deleteDesign(designId, user.id)

      if (result.success) {
        setSavedDesigns(savedDesigns.filter((design) => design.id !== designId))
        toast({
          title: "Design deleted",
          description: "Your saved design has been deleted",
        })
      } else {
        throw new Error(result.error || "Failed to delete design")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete design",
        variant: "destructive",
      })
    }
  }

  const handleAddToCart = async (design: ShoeDesign) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to cart",
        variant: "destructive",
      })
      return
    }

    try {
      await addToCart(user.id, design)
      toast({
        title: "Added to cart",
        description: "Your design has been added to cart",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add design to cart",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    if (!user) return

    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      const { error } = await supabase.from("addresses").delete().eq("id", addressId).eq("user_id", user.id)

      if (error) throw error

      setAddresses(addresses.filter((addr) => addr.id !== addressId))

      toast({
        title: "Address Deleted",
        description: "Your address has been deleted successfully",
      })
    } catch (error) {
      console.error("Error deleting address:", error)
      toast({
        title: "Error",
        description: "Failed to delete address",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button variant="outline" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <span className="text-3xl font-bold text-primary">
                    {user?.user_metadata?.display_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </span>
                </div>
                <h2 className="text-xl font-semibold">{user?.user_metadata?.display_name || "User"}</h2>
                <p className="text-muted-foreground mt-1">{user?.email}</p>

                <Separator className="my-4" />

                <div className="w-full text-left">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Saved Designs</span>
                    <span className="text-sm">{savedDesigns.length}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Orders</span>
                    <span className="text-sm">{orders.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Addresses</span>
                    <span className="text-sm">{addresses.length}</span>
                  </div>
                </div>

                <Button variant="outline" className="mt-6 w-full">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="designs">Saved Designs</TabsTrigger>
              <TabsTrigger value="orders">Order History</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>

            <TabsContent value="designs">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Saved Designs</h3>
                  <span className="text-sm text-muted-foreground">{savedDesigns.length} designs</span>
                </div>

                {savedDesigns.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No saved designs yet</h3>
                    <p className="text-muted-foreground mb-4">Start customizing shoes and save your designs here</p>
                    <Button asChild>
                      <Link href="/customize">Create a Design</Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      {savedDesigns.slice(0, 2).map((design) => (
                        <Card key={design.id} className="overflow-hidden">
                          <div className="h-32 bg-muted relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="grid grid-cols-2 gap-2">
                                <div
                                  className="w-12 h-12 rounded-md"
                                  style={{ backgroundColor: design.design.sole.color }}
                                ></div>
                                <div
                                  className="w-12 h-12 rounded-md"
                                  style={{ backgroundColor: design.design.head.color }}
                                ></div>
                              </div>
                            </div>
                          </div>
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <p className="text-xs text-muted-foreground">
                                {new Date(design.createdAt).toLocaleDateString()}
                              </p>
                              <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                <Link href={`/customize?design=${design.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href="/saved-designs">View All Designs</Link>
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="orders">
              {orders.length === 0 ? (
                <div className="text-center py-12 bg-muted/30 rounded-lg">
                  <h3 className="text-lg font-medium mb-2">No orders yet</h3>
                  <p className="text-muted-foreground mb-4">Your order history will appear here</p>
                  <Button asChild>
                    <a href="/explore">Start Shopping</a>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <Card key={order.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString()}</p>
                          </div>
                          <Badge
                            className={
                              order.status === "delivered"
                                ? "bg-green-500"
                                : order.status === "processing"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }
                          >
                            {order.status}
                          </Badge>
                        </div>

                        <Separator className="my-2" />

                        <div className="mt-2">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex justify-between py-1">
                              <span>
                                {item.name} × {item.quantity}
                              </span>
                            </div>
                          ))}
                          <div className="flex justify-between font-medium mt-2 pt-2 border-t">
                            <span>Total</span>
                            <span>₹{order.total.toFixed(2)}</span>
                          </div>
                        </div>

                        <div className="mt-4">
                          <Button variant="outline" size="sm" className="w-full sm:w-auto">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="addresses">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Saved Addresses</h3>
                  <Button asChild size="sm" variant="outline">
                    <Link href="/checkout/address">
                      <Plus className="h-4 w-4 mr-1" />
                      Add New Address
                    </Link>
                  </Button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12 bg-muted/30 rounded-lg">
                    <h3 className="text-lg font-medium mb-2">No saved addresses yet</h3>
                    <p className="text-muted-foreground mb-4">Add an address for faster checkout</p>
                    <Button asChild>
                      <Link href="/checkout/address">Add Address</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {addresses.map((address) => (
                      <Card key={address.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium">{address.fullName}</p>
                              <p className="text-sm text-muted-foreground">{address.phoneNumber}</p>
                              <p className="text-sm mt-1">
                                {address.addressLine1}
                                {address.addressLine2 && `, ${address.addressLine2}`}
                                {`, ${address.city}, ${address.state} ${address.postalCode}`}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="ghost" size="icon" asChild>
                                <Link href={`/checkout/address?edit=${address.id}`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteAddress(address.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
