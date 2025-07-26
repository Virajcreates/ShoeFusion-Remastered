"use client"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const faqs = [
  {
    question: "How does the shoe customization process work?",
    answer:
      "Our 3D customization tool allows you to design your perfect shoe by selecting colors, materials, and styles for different parts of the shoe. You can see your changes in real-time with our interactive 3D preview.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "We typically ship custom shoes within 7-10 business days after your order is confirmed. Shipping within India usually takes 3-5 business days depending on your location.",
  },
  {
    question: "Can I return my custom shoes?",
    answer:
      "Since custom shoes are made specifically for you, we cannot accept returns unless there is a manufacturing defect. If you receive a defective product, please contact our customer service within 7 days of delivery.",
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards, UPI payments, net banking, and wallet payments through our secure payment gateway powered by Stripe.",
  },
  {
    question: "How do I save my designs for later?",
    answer:
      "You need to create an account and be logged in to save your designs. Once logged in, you can save your designs from the customization page and access them later from your profile.",
  },
  {
    question: "Can I modify my order after it's placed?",
    answer:
      "Once an order is confirmed, we begin the manufacturing process immediately. Unfortunately, we cannot modify orders after they've been placed. Please review your order carefully before confirming.",
  },
  {
    question: "Do you ship internationally?",
    answer: "Currently, we only ship within India. We plan to expand to international shipping in the future.",
  },
  {
    question: "What materials do you use for your shoes?",
    answer:
      "We use premium quality materials including genuine leather, synthetic materials, mesh fabrics, and high-quality rubber for soles. All our materials are selected for durability and comfort.",
  },
]

export default function FAQPage() {
  return (
    <div className="container py-12">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
