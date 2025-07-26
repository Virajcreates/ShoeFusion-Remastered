export default function ShippingPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Shipping Information</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
          <p className="text-muted-foreground mb-4">
            At ShoeFusion, we strive to deliver your custom shoes as quickly as possible while maintaining the highest
            quality standards. Each pair of shoes is handcrafted based on your custom design, which requires time and
            precision.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
          <p className="text-muted-foreground mb-4">
            Custom shoes typically require 7-10 business days for manufacturing after your order is confirmed. During
            peak seasons, processing times may be slightly longer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Methods & Timeframes</h2>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Standard Shipping</h3>
              <p className="text-sm text-muted-foreground">3-5 business days for delivery across India</p>
              <p className="text-sm font-medium mt-2">Free on all orders</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Express Shipping</h3>
              <p className="text-sm text-muted-foreground">
                1-2 business days for delivery across major cities in India
              </p>
              <p className="text-sm font-medium mt-2">₹499 additional charge</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tracking Your Order</h2>
          <p className="text-muted-foreground mb-4">
            Once your order ships, you will receive a confirmation email with tracking information. You can also track
            your order status by logging into your account and visiting the Orders section.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
          <p className="text-muted-foreground mb-4">
            Currently, we only ship within India. We plan to expand our shipping services to international locations in
            the future.
          </p>
        </section>
      </div>
    </div>
  )
}
