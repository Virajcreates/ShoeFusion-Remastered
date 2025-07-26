export default function ReturnsPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Returns & Exchanges</h1>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Policy for Custom Shoes</h2>
          <p className="text-muted-foreground mb-4">
            Since our shoes are custom-made based on your specific design choices, we cannot accept returns or exchanges
            unless there is a manufacturing defect. We take great care to ensure that your custom shoes are made exactly
            to your specifications.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Manufacturing Defects</h2>
          <p className="text-muted-foreground mb-4">
            If you receive a product with a manufacturing defect, please contact our customer service team within 7 days
            of delivery. You will need to provide clear photos of the defect and your order number.
          </p>
          <p className="text-muted-foreground mb-4">
            If we confirm that there is a manufacturing defect, we will either repair the shoes, replace them, or
            provide a refund at our discretion.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Incorrect or Missing Items</h2>
          <p className="text-muted-foreground mb-4">
            If you receive an incorrect item or if an item is missing from your order, please contact our customer
            service team within 7 days of delivery. We will work to resolve the issue as quickly as possible.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Return Process for Defective Items</h2>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
            <li>Contact our customer service team within 7 days of receiving your order</li>
            <li>Provide your order number and clear photos of the defect</li>
            <li>Our team will review your claim and respond within 2 business days</li>
            <li>If approved, we will provide instructions for returning the item</li>
            <li>Once we receive the returned item, we will process your repair, replacement, or refund</li>
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
          <p className="text-muted-foreground mb-4">
            If you have any questions about our return policy, please contact our customer service team at:
          </p>
          <p className="text-muted-foreground">
            Email: support@shoefusion.com
            <br />
            Phone: +91 1234567890
            <br />
            Hours: Monday to Friday, 9:00 AM to 6:00 PM IST
          </p>
        </section>
      </div>
    </div>
  )
}
