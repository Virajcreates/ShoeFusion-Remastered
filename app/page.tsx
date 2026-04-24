"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CheckCircle } from "lucide-react"
import { stockDesigns } from "@/lib/stock-designs"
import { ProductCard } from "@/components/product-card"
import { ShoeViewer } from "@/components/shoe-viewer"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Pure Monochrome Default Design for Hero
const HERO_DESIGN = {
  sole: { color: "#000000", material: "rubber" }, // Pitch black sole
  trim: { color: "#FFFFFF", material: "leather" }, // Brilliant white trim
  head: { color: "#111111", material: "mesh" },    // Almost black upper
  laces: { color: "#FFFFFF", material: "canvas" }, // White laces
}

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [isLoaded, setIsLoaded] = useState(false)
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const filteredDesigns = activeCategory === "all" ? stockDesigns : stockDesigns.filter((design) => design.category === activeCategory)

  useGSAP(() => {
    // 1. Elegant Staggered Fade In for Editorial Content
    gsap.from(".editorial-content > *", {
      y: 40,
      opacity: 0,
      duration: 1.5,
      stagger: 0.15,
      ease: "power3.out"
    })
    
    // 2. Smooth Entry for the Shoe
    gsap.from(".editorial-shoe", {
      opacity: 0,
      x: 50,
      duration: 2,
      ease: "expo.out",
      delay: 0.2
    })
    
    gsap.from(".editorial-ui", { opacity: 0, duration: 1, delay: 1 })

    // 3. Minimalist Parallax Scroll (NO fading to 0 opacity to prevent any GSAP bugs. Pure spatial depth.)
    gsap.to(".editorial-content", {
      y: -120, // Drift upward slightly faster
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })
    
    gsap.to(".editorial-shoe", {
      y: 100, // Drift downward
      ease: "none",
      scrollTrigger: {
        trigger: ".hero-section",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    })

    // Other Sections
    gsap.from(".featured-header", { scrollTrigger: { trigger: ".featured-header", start: "top 80%" }, opacity: 0, y: 20, duration: 0.6 })
    gsap.from(".feature-card", { scrollTrigger: { trigger: ".feature-grid", start: "top 80%" }, opacity: 0, y: 30, duration: 0.6, stagger: 0.15 })
    gsap.from(".about-header", { scrollTrigger: { trigger: ".about-header", start: "top 80%" }, opacity: 0, y: 20, duration: 0.6 })
    gsap.from(".about-content", { scrollTrigger: { trigger: ".about-content", start: "top 80%" }, opacity: 0, duration: 0.8 })
    gsap.from(".testimonial-card", { scrollTrigger: { trigger: ".testimonial-grid", start: "top 80%" }, opacity: 0, y: 20, duration: 0.6, stagger: 0.1 })
    gsap.from(".cta-card", { scrollTrigger: { trigger: ".cta-card", start: "top 80%" }, opacity: 0, y: 20, duration: 0.6 })
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className={`transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}>
      {/* Layout A: The Editorial Split */}
      <section className="hero-section h-screen w-full relative bg-background overflow-hidden border-b border-border">
        
        {/* Extremely Subtle Background Texture */}
        <div className="absolute inset-0 opacity-10 pointer-events-none mix-blend-overlay" style={{ backgroundImage: "radial-gradient(hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "64px 64px" }}></div>

        {/* Editorial Layout Container */}
        <div className="relative z-10 w-full max-w-[1600px] mx-auto px-6 md:px-16 h-full flex flex-col md:flex-row items-center justify-between">
          
          {/* Left Column: Typography & Content (40%) */}
          <div className="w-full md:w-5/12 flex flex-col justify-center pt-32 md:pt-0 z-20 pointer-events-none">
            <div className="editorial-content pointer-events-auto">
              <p className="text-primary text-[10px] md:text-sm font-black tracking-[0.4em] uppercase mb-4 md:mb-6">
                01. Engineered Architecture
              </p>
              
              <h1 className="text-foreground text-6xl md:text-7xl lg:text-[8rem] font-black uppercase tracking-tighter leading-[0.85] mb-6 md:mb-10">
                SHOE<br/>
                <span className="text-transparent" style={{ WebkitTextStroke: "1px hsl(var(--foreground) / 0.4)" }}>FUSION</span>
              </h1>
              
              <p className="text-muted-foreground text-sm md:text-base font-medium max-w-sm leading-relaxed mb-10 md:mb-12 border-l border-border pl-4">
                Experience the next generation of performance footwear. Featuring bespoke materials, zero-gravity cushioning, and aggressive aerodynamic profiling. Available exclusively for customization.
              </p>
              
              <button className="group relative inline-flex items-center justify-center px-10 py-5 font-bold text-background text-sm uppercase tracking-widest bg-foreground border border-border hover:border-primary transition-all duration-300 overflow-hidden self-start">
                <span className="relative z-10 flex items-center gap-3">
                  Customize Now
                  <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-primary translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
              </button>
            </div>
          </div>

          {/* Right Column: 3D Shoe Viewer (60%) */}
          <div className="w-full md:w-7/12 h-[50vh] md:h-[90vh] absolute md:relative right-0 bottom-0 md:bottom-auto opacity-70 md:opacity-100 editorial-shoe cursor-grab active:cursor-grabbing pointer-events-auto z-10">
             <div className="w-full h-full scale-[1.3] md:scale-110 origin-center transition-transform duration-1000">
               <ShoeViewer design={HERO_DESIGN} height="100%" interactive={true} />
             </div>
             
             {/* Architectural Framing Lines */}
             <div className="hidden md:block absolute top-[15%] right-0 w-[1px] h-[70%] bg-gradient-to-b from-transparent via-foreground/20 to-transparent"></div>
             <div className="hidden md:block absolute bottom-[15%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-foreground/20 to-transparent"></div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-12 left-6 md:left-16 flex flex-col items-center gap-4 opacity-70 editorial-ui z-20 pointer-events-none">
          <div className="w-[1px] h-16 bg-gradient-to-b from-foreground to-transparent"></div>
          <span className="text-[10px] font-bold tracking-[0.3em] uppercase rotate-180 text-foreground" style={{ writingMode: 'vertical-rl' }}>Scroll</span>
        </div>
      </section>

      {/* Featured Designs */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6 featured-header border-b border-border pb-6">
            <h2 className="text-4xl font-black uppercase tracking-tight">The Collection</h2>
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full md:w-auto">
              <TabsList className="bg-transparent border border-border rounded-none p-0 h-12">
                <TabsTrigger value="all" className="rounded-none h-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background uppercase text-xs font-bold tracking-wider">All</TabsTrigger>
                <TabsTrigger value="running" className="rounded-none h-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background uppercase text-xs font-bold tracking-wider">Running</TabsTrigger>
                <TabsTrigger value="casual" className="rounded-none h-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background uppercase text-xs font-bold tracking-wider">Casual</TabsTrigger>
                <TabsTrigger value="sports" className="rounded-none h-full px-6 data-[state=active]:bg-foreground data-[state=active]:text-background uppercase text-xs font-bold tracking-wider">Sports</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-border">
            {filteredDesigns.map((design) => (
              <div key={design.id} className="border-r border-b border-border p-6 hover:bg-secondary/20 transition-colors">
                <ProductCard
                  id={design.id}
                  name={design.name}
                  price={design.price}
                  category={design.category}
                  design={design.design}
                  isNew={design.isNew}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Brutalist Features Section */}
      <section className="py-24 bg-foreground text-background border-y border-border">
        <div className="container">
          <div className="text-left mb-16 about-header max-w-3xl">
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-6">Absolute Control.</h2>
            <p className="text-xl text-background/70 font-light">
              We stripped out the middleman to give you pure, unadulterated access to the creation process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-t border-l border-background/20 feature-grid">
            <div className="feature-card border-r border-b border-background/20 p-10">
              <div className="w-12 h-12 mb-8 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"></path><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"></path><path d="M12 2v2"></path><path d="M12 22v-2"></path></svg>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Real-Time Engine</h3>
              <p className="text-background/60 font-light leading-relaxed">
                Watch every micro-adjustment render at 60 frames per second using our dedicated WebGL interface. No waiting.
              </p>
            </div>
            
            <div className="feature-card border-r border-b border-background/20 p-10">
              <div className="w-12 h-12 mb-8 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Raw Materials</h3>
              <p className="text-background/60 font-light leading-relaxed">
                Source leathers, brutalist canvas, and synthetic meshes engineered for concrete and asphalt performance.
              </p>
            </div>

            <div className="feature-card border-r border-b border-background/20 p-10">
              <div className="w-12 h-12 mb-8 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter"><path d="M5 7.2V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3.2M3 12h18M5 16.8V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-3.2M7 12h10"></path></svg>
              </div>
              <h3 className="text-2xl font-bold uppercase tracking-tight mb-4">Velocity Logistics</h3>
              <p className="text-background/60 font-light leading-relaxed">
                Direct-to-consumer pipelines ensure customized drops hit your doorstep in 7 days, fully tracked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Editorial Story */}
      <section className="py-32 bg-background border-b border-border">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center about-content">
            <div className="relative aspect-[3/4] overflow-hidden bg-foreground">
              <Image src="/white-shoe.jpg" alt="ShoeFusion Concrete" fill className="object-cover mix-blend-luminosity opacity-80" priority />
              <div className="absolute inset-0 border-[12px] border-background mix-blend-difference pointer-events-none"></div>
            </div>
            <div className="pl-0 lg:pl-12">
              <h2 className="text-[12vw] lg:text-[8vw] font-black uppercase tracking-tighter leading-[0.8] mb-12">
                BORN IN<br /><span className="text-primary">STYLE.</span>
              </h2>
              <div className="space-y-6 max-w-xl text-lg font-light text-foreground/80 leading-relaxed">
                <p>
                  ShoeFusion originated from a stark realization: mass-produced footwear lacks soul. We engineer platforms—not just shoes.
                </p>
                <p>
                  Our architecture leverages high-performance 3D modeling directly in the browser, eliminating the gap between the studio layout and your exact specifications.
                </p>
                <Button asChild className="mt-8 rounded-none px-8 py-6 uppercase font-bold tracking-widest text-xs bg-foreground text-background hover:bg-primary hover:text-white transition-colors">
                  <Link href="/about">Discover the Lab</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Matrix */}
      <section className="h-[70vh] relative bg-foreground text-background flex items-center justify-center overflow-hidden">
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')" }}></div>
        
        <div className="container relative z-10 text-center cta-card">
          <h2 className="text-[8vw] md:text-[6vw] font-black uppercase tracking-tighter leading-none mb-8 mix-blend-difference">
            INITIALIZE<br />PROTOCOL
          </h2>
          <Button asChild size="lg" className="rounded-none bg-primary text-white hover:bg-white hover:text-black transition-colors px-12 py-8 text-sm uppercase tracking-[0.2em] font-bold">
            <Link href="/customize">Start Design Engine</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
