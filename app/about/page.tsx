import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Sparkles, Palette, Recycle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto py-12 px-4 space-y-16">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text">Redefining Custom Footwear</h1>
            <p className="text-lg text-gray-700 dark:text-gray-300">
              At ShoeFusion, we're passionate about giving you the power to create shoes that are uniquely yours. Our
              innovative 3D customization platform lets you design every aspect of your footwear, from materials to
              colors to fit.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button className="bg-primary hover:bg-primary-600">Our Story</Button>
              <Button variant="outline" className="border-primary text-primary hover:bg-primary-50">
                Join Our Team
              </Button>
            </div>
          </div>
          <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
            <Image src="/red-shoe.jpg?height=400&width=600" alt="ShoeFusion team" fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white text-xl font-bold">Crafting the future of footwear since 2024</span>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Values</h2>
            <p className="text-gray-700 dark:text-gray-300">
              We believe everyone deserves shoes that perfectly match their style, needs, and personality. Our mission
              is to democratize custom footwear through technology and innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Palette className="h-8 w-8 text-primary" />,
                title: "Creative Freedom",
                description: "We empower you with tools to express your unique style through footwear design.",
              },
              {
                icon: <ShieldCheck className="h-8 w-8 text-primary" />,
                title: "Quality Craftsmanship",
                description: "Every pair is meticulously crafted with premium materials and attention to detail.",
              },
              {
                icon: <Recycle className="h-8 w-8 text-primary" />,
                title: "Sustainability",
                description: "We're committed to eco-friendly practices and reducing waste in footwear production.",
              },
              {
                icon: <Sparkles className="h-8 w-8 text-primary" />,
                title: "Innovation",
                description: "We constantly push the boundaries of what's possible in custom footwear technology.",
              },
            ].map((value, index) => (
              <Card
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-none shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-3 bg-primary/10 rounded-full">{value.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Our Story Timeline */}
        <section className="space-y-8">
          <h2 className="text-3xl font-bold text-center">Our Journey</h2>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary/20"></div>

            <div className="space-y-12">
              {[
                {
                  year: "2023",
                  title: "The Beginning",
                  description:
                    "ShoeFusion was founded with a vision to revolutionize how people shop for and customize footwear.",
                  image: "/j.jpg?height=200&width=300",
                },
                {
                  year: "2023",
                  title: "Launch of 3D Platform",
                  description:
                    "We introduced our groundbreaking 3D customization technology, allowing customers to design shoes in real-time.",
                  image: "/o.jpg?height=200&width=300",
                },
                {
                  year: "2024",
                  title: "Expanding Horizons",
                  description:
                    "ShoeFusion continues to grow, with new materials, designs, and features being added regularly.",
                  image: "/h.jpg?height=200&width=300",
                },
              ].map((milestone, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}
                >
                  <div className="md:w-1/2 relative">
                    <div
                      className={`p-6 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-xl shadow-md ${index % 2 === 0 ? "md:text-right" : "md:text-left"}`}
                    >
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-2">
                        {milestone.year}
                      </span>
                      <h3 className="text-xl font-bold mb-2">{milestone.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{milestone.description}</p>
                    </div>
                    {/* Timeline dot */}
                    <div className="absolute top-8 left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-gray-800"></div>
                  </div>
                  <div className="md:w-1/2 h-[200px] relative rounded-xl overflow-hidden shadow-md">
                    <Image
                      src={milestone.image || "/placeholder.svg"}
                      alt={milestone.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-gray-700 dark:text-gray-300">
              The passionate individuals behind ShoeFusion are dedicated to creating the best custom footwear
              experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Satwik Walke & Viraj Naik",
                role: "Founder & CEO",
                bio: "Footwear industry veteran with a passion for technology and design.",
                image: "/vs.jpg?height=300&width=300",
              },
              {
                name: "Kishor H R",
                role: "Head of Design",
                bio: "Award-winning designer with experience at top footwear brands.",
                image: "/kushal.jpg?height=300&width=300",
              },
              {
                name: "Kushal Gowda & Sujeeth Kumar DS",
                role: "CTO",
                bio: "Tech innovator specializing in 3D modeling and interactive experiences.",
                image: "/KS.jpg?height=300&width=300",
              },
              {
                name: "Manoj Shivakumar Angadi",
                role: "Customer Experience",
                bio: "Dedicated to ensuring every customer's journey is seamless and satisfying.",
                image: "/manja.jpg?height=300&width=300",
              },
            ].map((member, index) => (
              <Card
                key={index}
                className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-none shadow-md overflow-hidden"
              >
                <div className="h-[200px] relative">
                  <Image src={member.image || "/placeholder.svg"} alt={member.name} fill className="object-cover" />
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold">{member.name}</h3>
                  <p className="text-primary font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="space-y-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-700 dark:text-gray-300">
              Have questions about ShoeFusion? Find answers to common inquiries below.
            </p>
          </div>

          <Tabs defaultValue="product" className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="product">Product</TabsTrigger>
              <TabsTrigger value="ordering">Ordering</TabsTrigger>
              <TabsTrigger value="company">Company</TabsTrigger>
            </TabsList>
            <TabsContent value="product" className="space-y-4">
              {[
                {
                  question: "How does the 3D customization work?",
                  answer:
                    "Our platform allows you to manipulate a 3D model of your shoes in real-time. You can change colors, materials, and design elements with immediate visual feedback.",
                },
                {
                  question: "What materials do you use?",
                  answer:
                    "We use premium, ethically-sourced materials including genuine leather, sustainable fabrics, and high-performance synthetic materials.",
                },
                {
                  question: "Can I save my designs for later?",
                  answer:
                    "Yes! Create an account to save your designs and return to them anytime. You can also share them with friends for feedback.",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-none shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="ordering" className="space-y-4">
              {[
                {
                  question: "How long does production take?",
                  answer:
                    "Once your design is finalized, production typically takes 7-10 business days before shipping.",
                },
                {
                  question: "Do you ship internationally?",
                  answer: "Yes, we ship to most countries worldwide. Shipping times and costs vary by location.",
                },
                {
                  question: "What is your return policy?",
                  answer:
                    "We offer a 30-day satisfaction guarantee. If you're not happy with your shoes, contact us for return options.",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-none shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
            <TabsContent value="company" className="space-y-4">
              {[
                {
                  question: "Where is ShoeFusion based?",
                  answer: "Our headquarters are in San Francisco, with production facilities in Portugal and Vietnam.",
                },
                {
                  question: "Are you hiring?",
                  answer:
                    "We're always looking for talented individuals to join our team. Check our careers page for current openings.",
                },
                {
                  question: "What makes ShoeFusion different?",
                  answer:
                    "Our combination of cutting-edge technology, premium materials, and commitment to customer satisfaction sets us apart in the custom footwear market.",
                },
              ].map((faq, index) => (
                <Card key={index} className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-none shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>
        </section>

        <section className="relative rounded-2xl overflow-hidden border border-white/5">
          <div className="absolute inset-0">
            <Image src="/cta_bg.png" alt="Custom shoes futuristic macro" fill className="object-cover" />
            <div className="absolute inset-0 bg-[#040405]/70 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#040405] via-transparent to-[#040405] opacity-90"></div>
          </div>
          <div className="relative py-16 px-6 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Design Your Perfect Shoes?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have created their dream footwear with ShoeFusion.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                Start Designing
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Explore Gallery
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
