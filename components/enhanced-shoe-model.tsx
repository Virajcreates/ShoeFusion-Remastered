"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"
import type { ShoeDesign } from "@/lib/types"

// Default design values
const DEFAULT_DESIGN = {
  sole: { color: "#000000", material: "rubber" },
  trim: { color: "#FFFFFF", material: "leather" },
  head: { color: "#CCCCCC", material: "mesh" },
  laces: { color: "#FF0000", material: "fabric" },
}

interface EnhancedShoeModelProps {
  design?: ShoeDesign
  highlight?: string
}

export function EnhancedShoeModel({ design, highlight = "" }: EnhancedShoeModelProps) {
  // Use the provided design or fall back to default values
  const safeDesign = design || DEFAULT_DESIGN

  const group = useRef<THREE.Group>(null)
  const sole = useRef<THREE.Mesh>(null)
  const upper = useRef<THREE.Mesh>(null)
  const trim = useRef<THREE.Mesh>(null)
  const laces = useRef<THREE.Mesh>(null)

  // Gentle rotation animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  return (
    <group ref={group} dispose={null} scale={[1.5, 1.5, 1.5]} position={[0, -1, 0]}>
      {/* Sole */}
      <mesh ref={sole} position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.2, 3]} />
        <meshStandardMaterial
          color={safeDesign.sole.color}
          roughness={safeDesign.sole.material === "rubber" ? 0.9 : 0.5}
          metalness={safeDesign.sole.material === "rubber" ? 0 : 0.2}
          emissive={highlight === "sole" ? safeDesign.sole.color : "#000000"}
          emissiveIntensity={highlight === "sole" ? 0.3 : 0}
        />
      </mesh>

      {/* Upper (main body) */}
      <mesh ref={upper} position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.5, 0.6, 2.8]} />
        <meshStandardMaterial
          color={safeDesign.head.color}
          roughness={safeDesign.head.material === "mesh" ? 0.8 : 0.4}
          metalness={safeDesign.head.material === "mesh" ? 0 : 0.2}
          emissive={highlight === "head" ? safeDesign.head.color : "#000000"}
          emissiveIntensity={highlight === "head" ? 0.3 : 0}
        />
      </mesh>

      {/* Trim */}
      <mesh ref={trim} position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.1, 2.9]} />
        <meshStandardMaterial
          color={safeDesign.trim.color}
          roughness={safeDesign.trim.material === "leather" ? 0.6 : 0.3}
          metalness={safeDesign.trim.material === "leather" ? 0.1 : 0.4}
          emissive={highlight === "trim" ? safeDesign.trim.color : "#000000"}
          emissiveIntensity={highlight === "trim" ? 0.3 : 0}
        />
      </mesh>

      {/* Laces */}
      <mesh ref={laces} position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 0.1, 1.5]} />
        <meshStandardMaterial
          color={safeDesign.laces.color}
          roughness={safeDesign.laces.material === "fabric" ? 0.9 : 0.5}
          metalness={safeDesign.laces.material === "fabric" ? 0 : 0.1}
          emissive={highlight === "laces" ? safeDesign.laces.color : "#000000"}
          emissiveIntensity={highlight === "laces" ? 0.3 : 0}
        />
      </mesh>
    </group>
  )
}
