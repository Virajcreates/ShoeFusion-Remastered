"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { ShoeDesign } from "@/lib/types"

export function SimpleShoeModel({ design }: { design: ShoeDesign }) {
  const group = useRef<THREE.Group>(null)

  // Gentle rotation animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  // Create materials based on design
  const soleMaterial = new THREE.MeshStandardMaterial({
    color: design.sole.color,
    roughness: design.sole.material === "rubber" ? 0.7 : 0.3,
    metalness: design.sole.material === "rubber" ? 0 : 0.5,
  })

  const trimMaterial = new THREE.MeshStandardMaterial({
    color: design.trim.color,
    roughness: design.trim.material === "leather" ? 0.5 : 0.2,
    metalness: design.trim.material === "leather" ? 0.1 : 0.6,
  })

  const headMaterial = new THREE.MeshStandardMaterial({
    color: design.head.color,
    roughness: design.head.material === "mesh" ? 0.8 : 0.3,
    metalness: design.head.material === "mesh" ? 0 : 0.4,
  })

  const lacesMaterial = new THREE.MeshStandardMaterial({
    color: design.laces.color,
    roughness: design.laces.material === "fabric" ? 0.9 : 0.4,
    metalness: design.laces.material === "fabric" ? 0 : 0.3,
  })

  return (
    <group ref={group} position={[0, -0.5, 0]} dispose={null}>
      {/* Sole */}
      <mesh castShadow receiveShadow material={soleMaterial} position={[0, 0, 0]}>
        <boxGeometry args={[1.8, 0.2, 4]} />
      </mesh>

      {/* Main body */}
      <mesh castShadow receiveShadow material={headMaterial} position={[0, 0.5, 0]}>
        <boxGeometry args={[1.6, 0.8, 3.8]} />
      </mesh>

      {/* Trim */}
      <mesh castShadow receiveShadow material={trimMaterial} position={[0, 0.5, 1.9]}>
        <boxGeometry args={[1.6, 0.8, 0.1]} />
      </mesh>

      <mesh castShadow receiveShadow material={trimMaterial} position={[0, 0.5, -1.9]}>
        <boxGeometry args={[1.6, 0.8, 0.1]} />
      </mesh>

      {/* Laces */}
      <mesh castShadow receiveShadow material={lacesMaterial} position={[0, 0.9, 0]}>
        <boxGeometry args={[0.4, 0.1, 2]} />
      </mesh>
    </group>
  )
}
