export default function ShippingPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Shipping Policy</h1>

      <div className="prose prose-lg max-w-none">
        <h2>Delivery Timeframes</h2>
        <p>
          At ShoeFusion, we strive to deliver your custom shoes as quickly as possible. Since each pair is custom-made
          to your specifications, please allow for the following timeframes:
        </p>
        <ul>
          <li>
            <strong>Processing Time:</strong> 3-5 business days for manufacturing your custom shoes
          </li>
          <li>
            <strong>Shipping Time:</strong> 2-7 business days depending on your location
          </li>
        </ul>

        <h2>Shipping Methods</h2>
        <p>We offer the following shipping methods:</p>
        <ul>
          <li>
            <strong>Standard Shipping:</strong> Free for all orders
          </li>
          <li>
            <strong>Express Shipping:</strong> ₹499 (2-3 business days)
          </li>
          <li>
            <strong>Next Day Delivery:</strong> ₹999 (available for select metro cities)
          </li>
        </ul>

        <h2>Shipping Coverage</h2>
        <p>
          We currently ship to all major cities and towns across India. For remote locations, additional shipping time
          and charges may apply.
        </p>

        <h2>Order Tracking</h2>
        <p>
          Once your order ships, you will receive a tracking number via email. You can track your order status at any
          time by visiting the{" "}
          <a href="/track-order" className="text-primary">
            Track Order
          </a>{" "}
          page or by logging into your account.
        </p>

        <h2>International Shipping</h2>
        <p>
          We currently do not offer international shipping. We are working on expanding our shipping network and will
          update this policy when international shipping becomes available.
        </p>

        <h2>Shipping Delays</h2>
        <p>Occasionally, shipping delays may occur due to factors beyond our control, such as:</p>
        <ul>
          <li>Extreme weather conditions</li>
          <li>Natural disasters</li>
          <li>Public holidays</li>
          <li>Courier service disruptions</li>
        </ul>
        <p>We will notify you of any significant delays and provide updated delivery estimates.</p>

        <h2>Address Changes</h2>
        <p>
          If you need to change your shipping address after placing an order, please contact our customer service team
          immediately. We can only accommodate address changes if the order has not yet been shipped.
        </p>

        <h2>Lost or Damaged Packages</h2>
        <p>
          In the rare event that your package is lost or damaged during transit, please contact our customer service
          team within 48 hours of the scheduled delivery date. We will work with the shipping carrier to locate your
          package or process a replacement order.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our shipping policy, please contact our customer service team at{" "}
          <a href="mailto:support@shoefusion.com" className="text-primary">
            support@shoefusion.com
          </a>{" "}
          or call us at{" "}
          <a href="tel:+919876543210" className="text-primary">
            +91 9876 543 210
          </a>
          .
        </p>
      </div>
    </div>
  )
}
