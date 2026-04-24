"use client"

import { useRef } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"

interface MaterialSelectorProps {
  activePart: string
  selectedMaterial: string
  onChange: (material: string) => void
}

export default function MaterialSelector({
  activePart,
  selectedMaterial = "rubber", // Default value to prevent undefined
  onChange,
}: MaterialSelectorProps) {
  // Different material options based on the active part
  const getMaterialOptions = () => {
    switch (activePart) {
      case "sole":
        return [
          { value: "rubber", label: "Rubber", description: "Durable and flexible for everyday wear" },
          { value: "plastic", label: "Plastic", description: "Lightweight and waterproof" },
          { value: "foam", label: "Foam", description: "Extra cushioned for maximum comfort" },
        ]
      case "trim":
        return [
          { value: "leather", label: "Leather", description: "Premium genuine leather for a classic look" },
          { value: "synthetic", label: "Synthetic", description: "Sustainable and easy to clean" },
          { value: "canvas", label: "Canvas", description: "Breathable and casual texture" },
        ]
      case "head":
        return [
          { value: "mesh", label: "Mesh", description: "Breathable and lightweight" },
          { value: "leather", label: "Leather", description: "Premium look and durability" },
          { value: "knit", label: "Knit", description: "Stretchy and comfortable fit" },
        ]
      case "laces":
        return [
          { value: "fabric", label: "Fabric", description: "Standard laces with good grip" },
          { value: "rope", label: "Rope", description: "Thick and durable for outdoor use" },
          { value: "elastic", label: "Elastic", description: "No-tie convenience and comfort" },
        ]
      default:
        return [{ value: "rubber", label: "Rubber", description: "Durable and flexible for everyday wear" }]
    }
  }

  const materials = getMaterialOptions()

  // Ensure we have a valid material selected
  const safeMaterial = selectedMaterial || materials[0].value

  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    gsap.from(".material-item", {
      opacity: 0,
      y: 10,
      duration: 0.3,
      stagger: 0.05,
      ease: "power2.out",
      clearProps: "all"
    })
  }, { scope: containerRef, dependencies: [activePart] })

  return (
    <div ref={containerRef}>
      <RadioGroup value={safeMaterial} onValueChange={onChange} className="space-y-3">
        {materials.map((material) => (
          <div key={material.value} className="material-item">
            <div
              className={`flex items-center space-x-3 border p-3 rounded-lg transition-all duration-200 cursor-pointer ${
                safeMaterial === material.value ? "border-primary bg-primary/5" : "hover:border-gray-400"
              }`}
              onClick={() => onChange(material.value)}
            >
              <RadioGroupItem value={material.value} id={material.value} className="mt-0.5" />
              <div>
                <Label htmlFor={material.value} className="font-medium cursor-pointer">
                  {material.label}
                </Label>
                <p className="text-xs text-muted-foreground mt-0.5">{material.description}</p>
              </div>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
