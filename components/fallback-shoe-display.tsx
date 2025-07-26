"use client"

import { useMemo } from "react"

interface FallbackShoeDisplayProps {
  design: {
    sole: { color: string; material: string }
    trim: { color: string; material: string }
    head: { color: string; material: string }
    laces: { color: string; material: string }
  }
  height?: string
}

export function FallbackShoeDisplay({ design, height = "300px" }: FallbackShoeDisplayProps) {
  // Create a simple SVG representation of a shoe with the design colors
  const svgContent = useMemo(() => {
    return `
      <svg width="100%" height="100%" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
        <!-- Sole -->
        <path d="M50,120 C100,140 200,140 250,120 L240,100 C200,115 100,115 60,100 Z" fill="${design.sole.color}" />
        
        <!-- Head/Upper -->
        <path d="M60,100 C100,85 200,85 240,100 L220,60 C180,40 120,40 80,60 Z" fill="${design.head.color}" />
        
        <!-- Trim -->
        <path d="M80,60 C120,40 180,40 220,60 L210,50 C170,30 130,30 90,50 Z" fill="${design.trim.color}" />
        
        <!-- Laces -->
        <path d="M140,45 L160,45 L155,95 L145,95 Z" fill="${design.laces.color}" />
        <path d="M130,55 L170,55 L165,65 L135,65 Z" fill="${design.laces.color}" />
        <path d="M135,75 L165,75 L160,85 L140,85 Z" fill="${design.laces.color}" />
      </svg>
    `
  }, [design])

  return (
    <div
      className="w-full flex items-center justify-center bg-gray-100 rounded-md"
      style={{ height }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
