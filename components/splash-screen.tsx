"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Logo } from "./logo"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function SplashScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleExplore = () => {
    router.push("/explore")
  }

  const handleCustomize = () => {
    router.push("/customize")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex flex-col">
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Logo size="lg" />
          </motion.div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "60%" }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="h-1 bg-gradient-to-r from-primary-400 to-secondary-400 rounded-full max-w-md"
          />
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <header className="container mx-auto py-6">
            <Logo />
          </header>
          <main className="flex-1 container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-12">
            <div className="flex flex-col justify-center space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text"
              >
                Design Your Perfect Shoes
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-lg md:text-xl text-gray-700 dark:text-gray-300"
              >
                Customize every detail of your shoes with our interactive 3D designer. Create unique styles that express
                your personality.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 pt-4"
              >
                <Button onClick={handleExplore} size="lg" className="bg-primary hover:bg-primary-600">
                  Explore Designs
                </Button>
                <Button
                  onClick={handleCustomize}
                  size="lg"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary-50"
                >
                  Start Customizing
                </Button>
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7 }}
              className="relative flex items-center justify-center"
            >
              <div className="relative w-full h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/red-shoe.jpg?height=500&width=600"
                  alt="Custom shoe design"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex flex-col justify-end p-6">
                  <span className="text-white text-xl font-bold">Premium Materials</span>
                  <span className="text-white/80">Crafted for comfort and style</span>
                </div>
              </div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 rounded-full bg-accent/20 backdrop-blur-md p-4 flex items-center justify-center">
                <span className="text-accent-700 font-bold text-center">100% Customizable</span>
              </div>
            </motion.div>
          </main>
          <footer className="container mx-auto py-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { title: "Premium Quality", description: "Durable materials built to last" },
              { title: "Custom Fit", description: "Perfect fit for your unique style" },
              { title: "Fast Delivery", description: "From design to doorstep quickly" },
              { title: "Satisfaction Guaranteed", description: "Love your shoes or get a refund" },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm"
              >
                <h3 className="font-bold text-primary">{feature.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </footer>
        </div>
      )}
    </div>
  )
}
