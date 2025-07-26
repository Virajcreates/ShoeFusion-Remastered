"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ChevronLeft, CreditCard, CheckCircle2, Smartphone } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import Link from "next/link"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { clearCart } from "@/lib/cart-actions"
import { getSupabaseClient } from "@/lib/supabase-client"

export default function CheckoutPaymentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [order, setOrder] = useState<any>(null)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })
  const [upiId, setUpiId] = useState("")
  const orderId = searchParams.get("orderId")
  const canceled = searchParams.get("canceled")

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/login")
        return
      }

      if (!orderId) {
        router.push("/cart")
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

        if (error) {
          console.error("Error fetching order:", error)
          throw error
        }

        if (orderData) {
          console.log("Order found:", orderData)
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
        router.push("/cart")
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()

    // Show toast if payment was canceled
    if (canceled) {
      toast({
        title: "Payment Canceled",
        description: "Your payment was canceled. You can try again when you're ready.",
        variant: "destructive",
      })
    }
  }, [user, router, orderId, canceled, toast])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCardDetails((prev) => ({ ...prev, [name]: value }))
  }

  const handleExpiryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target
    // Remove non-digits
    value = value.replace(/\D/g, "")

    // Format as MM/YY
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`
    }

    setCardDetails((prev) => ({ ...prev, expiry: value }))
  }

  const handleCardNumberInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { value } = e.target
    // Remove non-digits
    value = value.replace(/\D/g, "")

    // Add spaces every 4 digits
    let formattedValue = ""
    for (let i = 0; i < value.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += " "
      }
      formattedValue += value[i]
    }

    setCardDetails((prev) => ({ ...prev, number: formattedValue }))
  }

  const handleUpiInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value)
  }

  const validatePaymentDetails = () => {
    if (paymentMethod === "card") {
      const { number, name, expiry, cvc } = cardDetails
      if (!number || !name || !expiry || !cvc) {
        toast({
          title: "Missing Information",
          description: "Please fill in all card details",
          variant: "destructive",
        })
        return false
      }
    } else if (paymentMethod === "upi") {
      if (!upiId || !upiId.includes("@")) {
        toast({
          title: "Invalid UPI ID",
          description: "Please enter a valid UPI ID (e.g., name@upi)",
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const handlePayment = async () => {
    if (!user || !order) return

    // Validate payment details
    if (!validatePaymentDetails()) return

    setIsProcessing(true)
    try {
      // For demo purposes, we'll simulate a successful payment
      // In a real app, you would integrate with a payment gateway here

      // Update order status in Supabase
      const supabase = getSupabaseClient()
      if (!supabase) throw new Error("Supabase client not initialized")

      // Update only the fields that exist in the schema
      const { error } = await supabase
        .from("orders")
        .update({
          status: "paid", // Use the existing status field instead of payment_status
          payment_method: paymentMethod,
          paid_at: new Date().toISOString(), // Use paid_at to track payment time
          // Remove payment_status as it doesn't exist in the schema
        })
        .eq("id", orderId)
        .eq("user_id", user.id)

      if (error) throw error

      // Clear the cart
      await clearCart(user.id)

      // Simulate processing time
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Redirect to success page
      router.push(`/checkout/success?orderId=${orderId}`)
    } catch (error) {
      console.error("Payment error:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground">Loading payment details...</p>
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
            <Link href="/cart">Return to Cart</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="flex items-center mb-6">
        <Link href={`/checkout/address`} className="flex items-center text-muted-foreground hover:text-foreground">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Shipping
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Payment</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent">
              <CardTitle>Payment Method</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
                <div
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "card" ? "border-primary bg-primary/5" : ""}`}
                >
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="h-5 w-5 mr-2" />
                    <span>Credit / Debit Card</span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "upi" ? "border-primary bg-primary/5" : ""}`}
                >
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi" className="flex items-center cursor-pointer flex-1">
                    <Smartphone className="h-5 w-5 mr-2" />
                    <span>UPI Payment</span>
                  </Label>
                </div>

                <div
                  className={`flex items-center space-x-2 border rounded-lg p-4 ${paymentMethod === "cod" ? "border-primary bg-primary/5" : ""}`}
                >
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod" className="cursor-pointer flex-1">
                    Cash on Delivery
                  </Label>
                </div>
              </RadioGroup>

              {paymentMethod === "card" && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      name="number"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={handleCardNumberInput}
                      maxLength={19}
                      className="border-input/60 focus:border-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      name="name"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={handleInputChange}
                      className="border-input/60 focus:border-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardExpiry">Expiry Date</Label>
                      <Input
                        id="cardExpiry"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleExpiryInput}
                        maxLength={5}
                        className="border-input/60 focus:border-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardCvc">CVC</Label>
                      <Input
                        id="cardCvc"
                        name="cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={handleInputChange}
                        maxLength={3}
                        className="border-input/60 focus:border-primary"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "upi" && (
                <div className="mt-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="upiId">UPI ID</Label>
                    <Input
                      id="upiId"
                      placeholder="yourname@upi"
                      value={upiId}
                      onChange={handleUpiInput}
                      className="border-input/60 focus:border-primary"
                    />
                    <p className="text-sm text-muted-foreground">Enter your UPI ID (e.g., name@okicici, name@ybl)</p>
                  </div>

                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium">Secure UPI Payment</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Pay directly from your bank account using UPI. Fast, secure, and convenient.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === "cod" && (
                <div className="mt-6 p-4 bg-muted/30 rounded-lg">
                  <div className="flex items-start">
                    <CheckCircle2 className="h-5 w-5 text-primary mr-2 mt-0.5" />
                    <div>
                      <p className="font-medium">Cash on Delivery Available</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Pay with cash when your order is delivered. A small COD fee of ₹40 will apply.
                      </p>
                    </div>
                  </div>
                </div>
              )}
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
                  <span>₹{order.total?.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (18% GST)</span>
                  <span>₹{order.tax?.toLocaleString("en-IN")}</span>
                </div>
                {paymentMethod === "cod" && (
                  <div className="flex justify-between">
                    <span>COD Fee</span>
                    <span>₹40.00</span>
                  </div>
                )}
                <Separator className="my-3" />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{(order.total + order.tax + (paymentMethod === "cod" ? 40 : 0)).toLocaleString("en-IN")}</span>
                </div>
              </div>

              <Button
                className="w-full mt-6 bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 rounded-full shadow-md"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>Complete Payment</>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
