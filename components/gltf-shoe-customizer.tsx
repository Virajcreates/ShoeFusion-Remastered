"use client"

import { useEffect, useState, useRef } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { useGLTF } from "@react-three/drei"
import type { GLTF } from "three-stdlib"
import type { ShoeDesign } from "@/lib/types"
import { EnhancedShoeModel } from "./enhanced-shoe-model"

// TypeScript type extension for GLTF result with specific nodes
type GLTFResult = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    [key: string]: THREE.Material
  }
}

// Mapping object to match model parts with our design configuration
const PART_MAPPING = {
  sole: ["sole", "outsole", "midsole", "bottom", "base"],
  trim: ["trim", "accent", "detail", "logo", "swoosh", "side"],
  head: ["upper", "body", "main", "toe", "heel", "vamp"],
  laces: ["laces", "tongue", "string"],
}

// Debug function to log model structure
function debugModelStructure(scene: THREE.Object3D) {
  console.log("Model structure:")
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      console.log(`Mesh: ${object.name}`)
    }
  })
}

export function GLTFShoeModel({
  design,
  modelUrl = "/models/shoe.glb", // Changed to a more standard path
  scale = 2,
  animate = true,
}: {
  design: ShoeDesign
  modelUrl?: string
  scale?: number
  animate?: boolean
}) {
  const group = useRef<THREE.Group>(null)
  const [modelError, setModelError] = useState(false)
  const { scene, nodes, materials } = useGLTF<GLTFResult>(modelUrl)
  const [modelLoaded, setModelLoaded] = useState(false)

  useEffect(() => {
    if (scene) {
      setModelLoaded(true)
    }
  }, [scene])

  // Use a try-catch block to handle model loading errors

  // If we get here, the model loaded successfully
  useFrame((state) => {
    if (group.current && animate && modelLoaded) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  if (modelLoaded) {
    return (
      <group ref={group} dispose={null} scale={[scale, scale, scale]} rotation={[0.2, 0, 0]}>
        <primitive object={scene} />
      </group>
    )
  } else {
    // Log the error and use the enhanced model as fallback
    console.error("Error loading GLTF model or model not yet loaded")
    if (!modelError) {
      setModelError(true)
      console.log("Using enhanced fallback model instead")
    }

    // Return the enhanced model as fallback
    return <EnhancedShoeModel design={design} />
  }
}

// Pre-load the model - wrapped in try/catch to prevent errors
try {
  useGLTF.preload("/models/shoe.glb")
} catch (error) {
  console.error("Error preloading model:", error)
}
