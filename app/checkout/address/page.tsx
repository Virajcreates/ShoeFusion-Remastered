"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getCartItems } from "@/lib/cart-actions"
import { getSupabaseClient } from "@/lib/supabase-client"
import Link from "next/link"

interface Address {
  id?: string
  fullName: string
  phoneNumber: string
  addressLine1: string
  addressLine2: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
}

const initialAddress: Address = {
  fullName: "",
  phoneNumber: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
}

export default function CheckoutAddressPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [address, setAddress] = useState<Address>(initialAddress)
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)
  const [cartTotal, setCartTotal] = useState(0)

  useEffect(() => {
    const fetchData = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      setIsLoading(true)
      try {
        // Fetch cart items to calculate total
        const cartItems = await getCartItems(user.id)
        const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
        setCartTotal(total)

        // Fetch addresses from Supabase
        const supabase = getSupabaseClient()
        if (supabase) {
          const { data: addresses, error } = await supabase
            .from("addresses")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })

          if (error) {
            console.error("Error fetching addresses:", error)
          } else if (addresses && addresses.length > 0) {
            // Transform addresses to match our interface
            const formattedAddresses = addresses.map((addr) => ({
              id: addr.id,
              fullName: addr.full_name,
              phoneNumber: addr.phone_number,
              addressLine1: addr.address_line1,
              addressLine2: addr.address_line2 || "",
              city: addr.city,
              state: addr.state,
              postalCode: addr.postal_code,
              country: addr.country,
              isDefault: addr.is_default,
            }))

            setSavedAddresses(formattedAddresses)

            // Select the default address if available
            const defaultAddress = formattedAddresses.find((addr) => addr.isDefault)
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id)
              setAddress(defaultAddress)
            } else if (formattedAddresses.length > 0) {
              setSelectedAddressId(formattedAddresses[0].id)
              setAddress(formattedAddresses[0])
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load checkout data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [user, router, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
    // When editing, deselect any saved address
    setSelectedAddressId(null)
  }

  const selectAddress = (addressId: string) => {
    const selected = savedAddresses.find((addr) => addr.id === addressId)
    if (selected) {
      setAddress(selected)
      setSelectedAddressId(addressId)
    }
  }

  const saveAddress = async () => {
    if (!user) return

    // Validate address
    const requiredFields = ["fullName", "phoneNumber", "addressLine1", "city", "state", "postalCode"]
    const missingFields = requiredFields.filter((field) => !address[field as keyof Address])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      // Format address for database
      const addressData = {
        user_id: user.id,
        full_name: address.fullName,
        phone_number: address.phoneNumber,
        address_line1: address.addressLine1,
        address_line2: address.addressLine2 || null,
        city: address.city,
        state: address.state,
        postal_code: address.postalCode,
        country: address.country,
        is_default: address.isDefault,
      }

      if (selectedAddressId) {
        // Update existing address
        const { data, error } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("id", selectedAddressId)
          .eq("user_id", user.id)
          .select()

        if (error) throw error

        if (data && data.length > 0) {
          // Update the address in the saved addresses list
          setSavedAddresses(
            savedAddresses.map((addr) =>
              addr.id === selectedAddressId
                ? {
                    ...address,
                    id: selectedAddressId,
                  }
                : addr,
            ),
          )
        }
      } else {
        // Create new address
        const { data, error } = await supabase.from("addresses").insert([addressData]).select()

        if (error) throw error

        if (data && data.length > 0) {
          // Add the new address to the saved addresses list
          const newAddress = {
            id: data[0].id,
            fullName: data[0].full_name,
            phoneNumber: data[0].phone_number,
            addressLine1: data[0].address_line1,
            addressLine2: data[0].address_line2 || "",
            city: data[0].city,
            state: data[0].state,
            postalCode: data[0].postal_code,
            country: data[0].country,
            isDefault: data[0].is_default,
          }

          setSavedAddresses([newAddress, ...savedAddresses])
          setSelectedAddressId(newAddress.id)
        }
      }

      toast({
        title: "Address Saved",
        description: "Your address has been saved successfully",
      })
    } catch (error) {
      console.error("Error saving address:", error)
      toast({
        title: "Error",
        description: "Failed to save address",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const proceedToPayment = async () => {
    if (!user) return

    // Validate address
    const requiredFields = ["fullName", "phoneNumber", "addressLine1", "city", "state", "postalCode"]
    const missingFields = requiredFields.filter((field) => !address[field as keyof Address])

    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)
    try {
      // Save the current order with the selected address
      const cartItems = await getCartItems(user.id)

      // Create an order object
      const orderData = {
        user_id: user.id,
        total: cartTotal,
        tax: Math.round(cartTotal * 0.18),
        shipping: 0,
        status: "pending",
        payment_method: "card", // Default, will be updated in payment page
        shipping_address: {
          full_name: address.fullName,
          phone_number: address.phoneNumber,
          address_line1: address.addressLine1,
          address_line2: address.addressLine2,
          city: address.city,
          state: address.state,
          postal_code: address.postalCode,
          country: address.country,
        },
      }

      // Try to save to Supabase
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      const { data, error } = await supabase.from("orders").insert([orderData]).select()

      if (error) throw error

      if (!data || data.length === 0) {
        throw new Error("Failed to create order")
      }

      const orderId = data[0].id

      // Redirect to payment page with the order ID
      router.push(`/checkout/payment?orderId=${orderId}`)
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Link href="/cart" className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {savedAddresses.length > 0 && (
                <>
                  <div className="mb-6">
                    <h3 className="text-sm font-medium mb-3">Saved Addresses</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {savedAddresses.map((addr) => (
                        <div
                          key={addr.id}
                          className={`border rounded-md p-3 cursor-pointer hover:border-primary transition-colors ${
                            selectedAddressId === addr.id ? "border-primary bg-primary/5" : ""
                          }`}
                          onClick={() => selectAddress(addr.id!)}
                        >
                          <p className="font-medium">{addr.fullName}</p>
                          <p className="text-sm text-muted-foreground">{addr.phoneNumber}</p>
                          <p className="text-sm mt-1">
                            {addr.addressLine1}, {addr.addressLine2 && `${addr.addressLine2}, `}
                            {addr.city}, {addr.state} {addr.postalCode}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator className="my-6" />
                </>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={address.fullName}
                      onChange={handleInputChange}
                      required
                      className="border-input/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumber">Phone Number *</Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={address.phoneNumber}
                      onChange={handleInputChange}
                      required
                      className="border-input/60 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine1">Address Line 1 *</Label>
                  <Input
                    id="addressLine1"
                    name="addressLine1"
                    value={address.addressLine1}
                    onChange={handleInputChange}
                    required
                    className="border-input/60 focus:border-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressLine2">Address Line 2</Label>
                  <Input
                    id="addressLine2"
                    name="addressLine2"
                    value={address.addressLine2}
                    onChange={handleInputChange}
                    className="border-input/60 focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      required
                      className="border-input/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      name="state"
                      value={address.state}
                      onChange={handleInputChange}
                      required
                      className="border-input/60 focus:border-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={address.postalCode}
                      onChange={handleInputChange}
                      required
                      className="border-input/60 focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    name="country"
                    value={address.country}
                    onChange={handleInputChange}
                    disabled
                    className="bg-muted/50"
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={saveAddress} variant="outline" disabled={isSaving} className="rounded-full">
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Save Address
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="border-0 shadow-lg sticky top-24">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{Math.round(cartTotal * 0.18).toLocaleString("en-IN")}</span>
                </div>
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{(cartTotal + Math.round(cartTotal * 0.18)).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-full shadow-md"
                onClick={proceedToPayment}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Proceed to Payment
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
