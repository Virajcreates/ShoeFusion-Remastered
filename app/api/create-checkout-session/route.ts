import { NextResponse } from "next/server";
import Stripe from "stripe";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase-server";
import type { CartItem } from "@/lib/types";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
});

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    if (!supabase) {
      return NextResponse.json({ error: "Failed to initialize Supabase client" }, { status: 500 });
    }

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: "You must be logged in to create a checkout session" }, { status: 401 });
    }

    const userId = session.user.id;

    const body = await request.json();
    const { cartItems, shippingAddress } = body as {
      cartItems: CartItem[];
      shippingAddress: {
        name: string;
        email: string;
        address: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
      };
    };

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ error: "Invalid cart items" }, { status: 400 });
    }

    if (!shippingAddress) {
      return NextResponse.json({ error: "Shipping address is required" }, { status: 400 });
    }

    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const tax = total * 0.1; // 10% tax as example
    const shipping = 500; // Rs. 500 fixed shipping charge

    const { data: orders, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId,
        status: "pending",
        shipping_address: shippingAddress,
        total,
        tax,
        shipping,
        payment_method: "stripe",
      })
      .select();

    if (orderError || !orders || orders.length === 0) {
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const order = orders[0];
    

    const orderItems = cartItems.map((item) => ({
      order_id: order.id,
      design_id: item.design, // assuming you have this
      quantity: item.quantity,
      price: item.price,
      size: item.size,
      design_data: item.design, // assuming you store full design JSON
    }));

    const { error: orderItemsError } = await supabase.from("order_items").insert(orderItems);

    if (orderItemsError) {
      return NextResponse.json({ error: "Failed to create order items" }, { status: 500 });
    }

    const lineItems = cartItems.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name || "Custom Shoe",
          description: `Size: ${item.size}`,
          images: [item.image || "/images/default.png"],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${request.headers.get("origin")}/checkout/success?session_id={CHECKOUT_SESSION_ID}&order_id=${order.id}`,
      cancel_url: `${request.headers.get("origin")}/cart`,
      metadata: {
        order_id: order.id,
        user_id: userId,
      },
      shipping_address_collection: {
        allowed_countries: ["IN", "US", "CA", "GB"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shipping * 100,
              currency: "inr",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: { unit: "business_day", value: 5 },
              maximum: { unit: "business_day", value: 7 },
            },
          },
        },
      ],
    });

    return NextResponse.json({ sessionId: stripeSession.id, orderId: order,id });
  } catch (error) {
    console.error("Checkout Error:", error);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
