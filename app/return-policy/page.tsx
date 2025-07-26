export default function ReturnPolicyPage() {
  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Return Policy</h1>

      <div className="prose prose-lg max-w-none">
        <h2>Return Eligibility</h2>
        <p>
          At ShoeFusion, we want you to be completely satisfied with your purchase. We accept returns under the
          following conditions:
        </p>
        <ul>
          <li>Returns must be initiated within 30 days of delivery</li>
          <li>Items must be unworn, undamaged, and in their original packaging</li>
          <li>Original receipt or proof of purchase must be provided</li>
        </ul>

        <h2>Custom-Designed Shoes</h2>
        <p>
          Since our custom-designed shoes are made specifically for you based on your design choices, they are not
          eligible for returns unless there is a manufacturing defect or the item received is significantly different
          from what was ordered.
        </p>

        <h2>Manufacturing Defects</h2>
        <p>
          If you receive a product with a manufacturing defect, please contact our customer service team within 7 days
          of delivery. We will arrange for a return and replacement at no additional cost to you.
        </p>

        <h2>Return Process</h2>
        <p>To initiate a return, please follow these steps:</p>
        <ol>
          <li>Log in to your account and go to the Orders section</li>
          <li>Select the order containing the item you wish to return</li>
          <li>Click on "Return Item" and follow the instructions</li>
          <li>Print the return shipping label (if provided)</li>
          <li>Pack the item securely in its original packaging</li>
          <li>Attach the return shipping label to the package</li>
          <li>Drop off the package at the nearest courier service point</li>
        </ol>

        <h2>Refund Process</h2>
        <p>
          Once we receive and inspect the returned item, we will process your refund. Refunds will be issued to the
          original payment method used for the purchase.
        </p>
        <ul>
          <li>
            <strong>Credit/Debit Card:</strong> 5-7 business days
          </li>
          <li>
            <strong>UPI:</strong> 3-5 business days
          </li>
          <li>
            <strong>Store Credit:</strong> Immediate
          </li>
        </ul>

        <h2>Return Shipping</h2>
        <p>
          For returns due to manufacturing defects or incorrect items, we will provide a prepaid return shipping label.
          For all other eligible returns, the customer is responsible for return shipping costs.
        </p>

        <h2>Exchanges</h2>
        <p>
          We do not offer direct exchanges. If you wish to exchange an item, please return the original item for a
          refund and place a new order for the desired item.
        </p>

        <h2>Non-Returnable Items</h2>
        <p>The following items cannot be returned:</p>
        <ul>
          <li>Custom-designed shoes (except for manufacturing defects)</li>
          <li>Items marked as "Final Sale" or "Non-Returnable"</li>
          <li>Items that show signs of wear or use</li>
          <li>Items without original packaging</li>
        </ul>

        <h2>Damaged or Incorrect Items</h2>
        <p>
          If you receive a damaged item or an item different from what you ordered, please contact our customer service
          team within 48 hours of delivery with photos of the item and packaging. We will arrange for a return and
          replacement at no additional cost to you.
        </p>

        <h2>Contact Us</h2>
        <p>
          If you have any questions about our return policy, please contact our customer service team at{" "}
          <a href="mailto:returns@shoefusion.com" className="text-primary">
            returns@shoefusion.com
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
