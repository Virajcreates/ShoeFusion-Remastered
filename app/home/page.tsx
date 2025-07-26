"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import { stockDesigns } from "@/lib/stock-designs"
import { ProductCard } from "@/components/product-card"
import { motion } from "framer-motion"
import { useEventListener } from "@/hooks/use-event-listener"

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Set loaded state after mount
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Use our custom hook for the scroll event
  const handleScroll = () => {
    if (typeof window !== "undefined") {
      setIsScrolled(window.scrollY > 10)
    }
  }

  useEventListener("scroll", handleScroll)

  // Initialize scroll state on mount
  useEffect(() => {
    handleScroll()
  }, [])

  const filteredDesigns =
    activeCategory === "all" ? stockDesigns : stockDesigns.filter((design) => design.category === activeCategory)

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const stagger = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  return (
    <div className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center overflow-hidden bg-black">
  <div className="absolute inset-0 z-0">
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10"></div>
    
    {/* Shoe Image */}
    <div className="absolute inset-0 flex items-center justify-end pr-16 z-5">
      <div className="relative w-[80vw] h-[85vh]">
        <Image src="/red-shoe.jpg" alt="ShoeFusion Hero" fill className="object-cover" priority />
      </div>
    </div>
  </div>

  {/* Text Content */}
  <div className="container relative z-10">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="max-w-2xl"
    >
      <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
        Step Into <span className="text-gradient bg-gradient-to-r from-blue-400 to-blue-600">Your Style</span>
      </h1>
      <p className="text-xl text-white/90 mb-8 max-w-xl">
        Discover our collection of premium customizable shoes designed for comfort and style. Create your perfect
        pair today.
      </p>
      <div className="flex flex-wrap gap-4">
        <Button asChild size="lg" className="rounded-full px-8 bg-primary hover:bg-primary-600">
          <Link href="/customize">Customize Now</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="rounded-full px-8 bg-white/10 text-white border-white/30 hover:bg-white/20"
        >
          <Link href="/explore">Explore Designs</Link>
        </Button>

      
      </div>
    </motion.div>
  </div>
</section>

      {/* Featured Designs */}
      <section className="py-16">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4"
        >
          <h2 className="text-3xl font-bold">Featured Designs</h2>
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
            <TabsList className="rounded-full p-1">
              <TabsTrigger value="all" className="rounded-full">
                All
              </TabsTrigger>
              <TabsTrigger value="running" className="rounded-full">
                Running
              </TabsTrigger>
              <TabsTrigger value="casual" className="rounded-full">
                Casual
              </TabsTrigger>
              <TabsTrigger value="sports" className="rounded-full">
                Sports
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredDesigns.map((design) => (
            <ProductCard
              key={design.id}
              id={design.id}
              name={design.name}
              price={design.price}
              category={design.category}
              design={design.design}
              isNew={design.isNew}
            />
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl my-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Why Choose ShoeFusion</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine cutting-edge technology with premium materials to create the perfect shoes for you
          </p>
        </motion.div>
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 container-tight"
        >
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-soft h-full hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path>
                    <path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path>
                    <path d="M12 2v2"></path>
                    <path d="M12 22v-2"></path>
                    <path d="m17 20.66-1-1.73"></path>
                    <path d="M11 10.27 7 3.34"></path>
                    <path d="m20.66 17-1.73-1"></path>
                    <path d="m3.34 7 1.73 1"></path>
                    <path d="M14 12h8"></path>
                    <path d="M2 12h2"></path>
                    <path d="m20.66 7-1.73 1"></path>
                    <path d="m3.34 17 1.73-1"></path>
                    <path d="m17 3.34-1 1.73"></path>
                    <path d="m7 20.66-1-1.73"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">3D Customization</h3>
                <p className="text-muted-foreground mb-6">
                  Design your perfect shoe with our interactive 3D customization tool. See your changes in real-time.
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Real-time 3D preview</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Multiple color options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Various material choices</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-soft h-full hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Premium Materials</h3>
                <p className="text-muted-foreground mb-6">
                  Choose from a variety of high-quality materials for comfort and durability that lasts.
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Genuine leather options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Breathable mesh fabrics</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Durable rubber soles</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={fadeIn}>
            <Card className="border-0 shadow-soft h-full hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-8 flex flex-col items-center text-center h-full">
                <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-primary"
                  >
                    <path d="M5 7.2V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3.2M3 12h18M5 16.8V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.2M7 12h10"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">Fast Delivery</h3>
                <p className="text-muted-foreground mb-6">
                  Get your custom shoes delivered to your doorstep within 7-10 business days, guaranteed.
                </p>
                <ul className="space-y-2 text-left">
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Nationwide shipping</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Order tracking</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Secure packaging</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* About Us Section */}
      <section className="py-16">
  <motion.h2
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-3xl font-bold mb-10 text-center"
  >
    About Us
  </motion.h2>

  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
  >
    {/* Image Section */}
    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-soft-xl bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-full h-full">
          <Image src="/white-shoe.jpg" alt="ShoeFusion White Shoe" fill className="object-cover" priority />
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
        <div className="p-8">
          <h3 className="text-2xl font-bold text-white mb-2">Our Passion</h3>
          <p className="text-white/90">Creating shoes that are as unique as you are</p>
        </div>
      </div>
    </div>

    {/* Text Content Section */}
    <div>
      <h3 className="text-2xl font-semibold mb-6">Our Story</h3>
      <p className="text-muted-foreground mb-6">
        ShoeFusion was founded in 2023 with a simple mission: to revolutionize the way people buy and customize
        their footwear. We believe that everyone deserves shoes that are not just comfortable and stylish, but
        also a true reflection of their personality.
      </p>
      <p className="text-muted-foreground mb-6">
        Our team of designers and engineers have worked tirelessly to create a platform that makes shoe
        customization accessible to everyone. Using cutting-edge 3D technology, we've made it possible for you to
        design your dream shoes from the comfort of your home.
      </p>
      <p className="text-muted-foreground mb-8">
        Today, ShoeFusion is proud to serve customers across India, delivering premium quality custom shoes that
        stand out from the crowd.
      </p>
      <Button asChild className="rounded-full">
        <Link href="/about">
          Learn More About Us
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </Button>
    </div>
  </motion.div>
</section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50 rounded-3xl my-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Don't just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="container-tight">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Priya Sharma",
                role: "Fashion Designer",
                quote:
                  "The customization options are incredible! I was able to design shoes that perfectly match my style and the quality is outstanding.",
                avatar: "/images/black-red-shoe.png",
              },
              {
                name: "Rahul Patel",
                role: "Marathon Runner",
                quote:
                  "As a professional runner, I need shoes that are both comfortable and durable. ShoeFusion delivered exactly what I needed with their custom running shoes.",
                avatar: "/images/white-shoe.png",
              },
              {
                name: "Ananya Gupta",
                role: "College Student",
                quote:
                  "The 3D customization tool is so fun to use! I created unique shoes that no one else has, and they arrived faster than expected.",
                avatar: "/images/black-red-shoe.png",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-soft h-full hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-6">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 bg-gray-100">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5 inline-block text-yellow-400"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <p className="text-muted-foreground">"{testimonial.quote}"</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 mb-16">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Card className="border-0 overflow-hidden rounded-3xl shadow-colored">
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 text-white">
              <CardContent className="p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-center md:text-left">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to design your perfect shoe?</h2>
                  <p className="text-white/90 text-lg max-w-xl">
                    Start customizing now and create a shoe that's uniquely yours. Express your style with every step.
                  </p>
                </div>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="rounded-full px-8 whitespace-nowrap bg-white text-primary hover:bg-gray-100"
                >
                  <Link href="/customize">
                    Start Designing
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </CardContent>
            </div>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
