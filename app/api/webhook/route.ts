import { NextResponse } from "next/server"
import Stripe from "stripe"
import { createClient } from "@/lib/supabase-server"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const signature = request.headers.get("stripe-signature") as string

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (error: any) {
      console.error(`Webhook signature verification failed: ${error.message}`)
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 })
    }

    const supabase = createClient()

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session
        const { order_id } = session.metadata || {}

        if (!order_id) {
          console.error("No order ID found in session metadata")
          return NextResponse.json({ error: "No order ID found" }, { status: 400 })
        }

        // Update the order status to paid
        const { error } = await supabase
          .from("orders")
          .update({
            status: "paid",
            payment_status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", order_id)

        if (error) {
          console.error("Error updating order:", error)
          return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
        }

        break
      }
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find the order with this payment intent
        const { data: orders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("payment_intent", paymentIntent.id)
          .limit(1)

        if (error || !orders || orders.length === 0) {
          console.error("Error finding order:", error)
          return NextResponse.json({ error: "Failed to find order" }, { status: 500 })
        }

        // Update the order status
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "processing",
            payment_status: "completed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orders[0].id)

        if (updateError) {
          console.error("Error updating order:", updateError)
          return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
        }

        break
      }
      case "payment_intent.payment_failed": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent

        // Find the order with this payment intent
        const { data: orders, error } = await supabase
          .from("orders")
          .select("*")
          .eq("payment_intent", paymentIntent.id)
          .limit(1)

        if (error || !orders || orders.length === 0) {
          console.error("Error finding order:", error)
          return NextResponse.json({ error: "Failed to find order" }, { status: 500 })
        }

        // Update the order status
        const { error: updateError } = await supabase
          .from("orders")
          .update({
            status: "failed",
            payment_status: "failed",
            updated_at: new Date().toISOString(),
          })
          .eq("id", orders[0].id)

        if (updateError) {
          console.error("Error updating order:", updateError)
          return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
        }

        break
      }
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 })
  }
}

export const GET = async () => {
  return NextResponse.json({ message: "Webhook endpoint is working" })
}
