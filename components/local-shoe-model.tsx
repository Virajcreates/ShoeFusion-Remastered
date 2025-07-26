"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import type { ShoeDesign } from "@/lib/types"

interface LocalShoeModelProps {
  design: ShoeDesign
}

export function LocalShoeModel({ design }: LocalShoeModelProps) {
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
      <group>
        {/* Main sole */}
        <mesh castShadow receiveShadow material={soleMaterial}>
          <meshStandardMaterial color={design.sole.color} />
          <boxGeometry args={[1.8, 0.2, 4]} />
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[1.8, 0.05, 4]} />
          </mesh>
        </mesh>

        {/* Sole details - curved bottom */}
        <mesh castShadow receiveShadow material={soleMaterial} position={[0, -0.05, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 4, 32, 1, false, -Math.PI / 2, Math.PI]} />
          <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.1, 0.1, 1.8, 16]} />
          </mesh>
        </mesh>

        {/* Sole texture */}
        <group position={[0, -0.1, 0]}>
          {[-1.5, -1, -0.5, 0, 0.5, 1, 1.5].map((z, i) => (
            <mesh key={i} castShadow receiveShadow material={soleMaterial} position={[0, 0, z]}>
              <boxGeometry args={[1.7, 0.05, 0.1]} />
            </mesh>
          ))}
        </group>
      </group>

      {/* Shoe Body/Head */}
      <group position={[0, 0.4, 0]}>
        {/* Main body */}
        <mesh castShadow receiveShadow material={headMaterial}>
          <boxGeometry args={[1.6, 0.8, 3.8]} />
        </mesh>

        {/* Rounded top */}
        <mesh castShadow receiveShadow material={headMaterial} position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 1.6, 32, 1, false, 0, Math.PI]} rotation={[0, 0, Math.PI / 2]} />
        </mesh>

        {/* Toe cap */}
        <mesh castShadow receiveShadow material={headMaterial} position={[0, 0, 1.9]}>
          <sphereGeometry args={[0.8, 16, 16, 0, Math.PI, 0, Math.PI / 2]} />
        </mesh>

        {/* Heel */}
        <mesh castShadow receiveShadow material={headMaterial} position={[0, 0.2, -1.9]}>
          <boxGeometry args={[1.6, 1.2, 0.4]} />
        </mesh>
      </group>

      {/* Trim */}
      <group>
        {/* Ankle collar */}
        <mesh castShadow receiveShadow material={trimMaterial} position={[0, 0.9, -1.7]}>
          <cylinderGeometry args={[0.9, 0.8, 0.6, 32]} rotation={[Math.PI / 2, 0, 0]} />
        </mesh>

        {/* Side trim */}
        <mesh castShadow receiveShadow material={trimMaterial} position={[0.8, 0.4, 0]}>
          <boxGeometry args={[0.05, 0.6, 3.6]} />
        </mesh>

        <mesh castShadow receiveShadow material={trimMaterial} position={[-0.8, 0.4, 0]}>
          <boxGeometry args={[0.05, 0.6, 3.6]} />
        </mesh>

        {/* Logo on side */}
        <mesh castShadow receiveShadow material={trimMaterial} position={[0.83, 0.4, 0]}>
          <sphereGeometry args={[0.2, 16, 16]} />
        </mesh>
      </group>

      {/* Laces */}
      <group position={[0, 0.7, 0.3]}>
        {/* Lace holes */}
        {[-0.6, -0.2, 0.2, 0.6, 1.0].map((z, i) => (
          <group key={i} position={[0, 0, z]}>
            <mesh castShadow receiveShadow material={trimMaterial} position={[-0.4, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} rotation={[0, 0, Math.PI / 2]} />
            </mesh>
            <mesh castShadow receiveShadow material={trimMaterial} position={[0.4, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.3, 16]} rotation={[0, 0, Math.PI / 2]} />
            </mesh>
          </group>
        ))}

        {/* Laces */}
        {[-0.6, -0.2, 0.2, 0.6, 1.0].map((z, i) => (
          <group key={i} position={[0, 0, z]}>
            <mesh castShadow receiveShadow material={lacesMaterial}>
              <boxGeometry args={[0.9, 0.05, 0.1]} />
            </mesh>
          </group>
        ))}

        {/* Tongue */}
        <mesh castShadow receiveShadow material={headMaterial} position={[0, 0.1, 0.2]}>
          <boxGeometry args={[0.8, 0.1, 2.2]} />
        </mesh>
      </group>
    </group>
  )
}
