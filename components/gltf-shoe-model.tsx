"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js"
import type { GLTF } from "three-stdlib"
import type { ShoeDesign } from "@/lib/types"
import { EnhancedShoeModel } from "./enhanced-shoe-model"

// Define the model URL - use a relative path instead of blob URL
const MODEL_URL = "/models/shoe_2.glb"

// Default design values to use as fallback
const DEFAULT_DESIGN = {
  sole: { color: "#000000", material: "rubber" },
  trim: { color: "#FFFFFF", material: "leather" },
  head: { color: "#CCCCCC", material: "mesh" },
  laces: { color: "#FF0000", material: "fabric" },
}

// Mapping object to match model parts with our design configuration
const PART_MAPPING = {
  sole: ["sole", "outsole", "midsole", "bottom", "base"],
  trim: ["trim", "accent", "detail", "logo", "swoosh", "side"],
  head: ["upper", "body", "main", "toe", "heel", "vamp"],
  laces: ["laces", "tongue", "string"],
}

interface GLTFShoeModelProps {
  design: ShoeDesign | undefined
  highlight?: string
  onError?: () => void
}

export function GLTFShoeModel({ design, highlight = "", onError }: GLTFShoeModelProps) {
  const group = useRef<THREE.Group>(null)
  const [modelError, setModelError] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [gltf, setGltf] = useState<GLTF | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(0)

  // Use the provided design or fall back to default values
  const safeDesign = useMemo(() => {
    if (!design) return DEFAULT_DESIGN

    return {
      sole: design.sole || DEFAULT_DESIGN.sole,
      trim: design.trim || DEFAULT_DESIGN.trim,
      head: design.head || DEFAULT_DESIGN.head,
      laces: design.laces || DEFAULT_DESIGN.laces,
    }
  }, [design])

  // Store references to mesh parts
  const meshRefs = useRef<{
    [key: string]: THREE.Mesh | null
  }>({
    sole: null,
    trim: null,
    head: null,
    laces: null,
  })

  // Create materials based on design
  const materials = useMemo(() => {
    return {
      sole: new THREE.MeshStandardMaterial({
        color: new THREE.Color(safeDesign.sole.color),
        roughness: safeDesign.sole.material === "rubber" ? 0.9 : 0.5,
        metalness: safeDesign.sole.material === "rubber" ? 0 : 0.2,
        emissive: highlight === "sole" ? new THREE.Color(safeDesign.sole.color) : new THREE.Color(0x000000),
        emissiveIntensity: highlight === "sole" ? 0.3 : 0,
      }),
      trim: new THREE.MeshStandardMaterial({
        color: new THREE.Color(safeDesign.trim.color),
        roughness: safeDesign.trim.material === "leather" ? 0.6 : 0.3,
        metalness: safeDesign.trim.material === "leather" ? 0.1 : 0.4,
        emissive: highlight === "trim" ? new THREE.Color(safeDesign.trim.color) : new THREE.Color(0x000000),
        emissiveIntensity: highlight === "trim" ? 0.3 : 0,
      }),
      head: new THREE.MeshStandardMaterial({
        color: new THREE.Color(safeDesign.head.color),
        roughness: safeDesign.head.material === "mesh" ? 0.8 : 0.4,
        metalness: safeDesign.head.material === "mesh" ? 0 : 0.2,
        emissive: highlight === "head" ? new THREE.Color(safeDesign.head.color) : new THREE.Color(0x000000),
        emissiveIntensity: highlight === "head" ? 0.3 : 0,
      }),
      laces: new THREE.MeshStandardMaterial({
        color: new THREE.Color(safeDesign.laces.color),
        roughness: safeDesign.laces.material === "fabric" ? 0.9 : 0.5,
        metalness: safeDesign.laces.material === "fabric" ? 0 : 0.1,
        emissive: highlight === "laces" ? new THREE.Color(safeDesign.laces.color) : new THREE.Color(0x000000),
        emissiveIntensity: highlight === "laces" ? 0.3 : 0,
      }),
    }
  }, [safeDesign, highlight])

  // Load the model using GLTFLoader
  useEffect(() => {
    // Skip loading if we already have an error
    if (modelError) return

    const loader = new GLTFLoader()

    // Reset state
    setModelError(false)
    setErrorMessage(null)
    setModelLoaded(false)
    setLoadingProgress(0)

    try {
      // Use a try-catch block to handle any errors during loading
      const loadModel = async () => {
        try {
          // First try to load the model from the public directory
          loader.load(
            MODEL_URL,
            (gltfData) => {
              setGltf(gltfData)
              setLoadingProgress(100)
            },
            (progress) => {
              // Calculate loading progress
              if (progress.lengthComputable) {
                const progressPercentage = Math.round((progress.loaded / progress.total) * 100)
                setLoadingProgress(progressPercentage)
              }
            },
            (error) => {
              console.error("Error loading model:", error)
              setErrorMessage(error.message || "Failed to load model")
              setModelError(true)
              setLoadingProgress(0)
              if (onError) onError()
            },
          )
        } catch (error: any) {
          console.error("Exception during model loading:", error)
          setErrorMessage(error.message || "Error loading model")
          setModelError(true)
          if (onError) onError()
        }
      }

      loadModel()
    } catch (error: any) {
      console.error("Exception in useEffect:", error)
      setErrorMessage(error.message || "Error loading model")
      setModelError(true)
      if (onError) onError()
    }

    // Cleanup function
    return () => {
      // Cancel loading if component unmounts
      loader.manager.onProgress = () => {}
      loader.manager.onError = () => {}
    }
  }, [onError, modelError])

  // Initialize and map model parts
  useEffect(() => {
    if (!gltf || modelError) return

    try {
      // Map meshes to parts based on their names
      let partsFound = 0
      gltf.scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return

        const name = object.name.toLowerCase()

        // Try to match by name patterns
        for (const [part, keywords] of Object.entries(PART_MAPPING)) {
          if (keywords.some((keyword) => name.includes(keyword))) {
            meshRefs.current[part as keyof typeof meshRefs.current] = object
            partsFound++
            break
          }
        }
      })

      // If no parts were found with specific names, try to assign based on position or size
      if (partsFound === 0) {
        const meshes: THREE.Mesh[] = []
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            meshes.push(object)
          }
        })

        if (meshes.length > 0) {
          // Sort meshes by Y position (lowest is likely the sole)
          meshes.sort((a, b) => {
            const boxA = new THREE.Box3().setFromObject(a)
            const boxB = new THREE.Box3().setFromObject(b)
            return boxA.min.y - boxB.min.y
          })

          // Assign parts based on position
          if (meshes.length >= 1) {
            meshRefs.current.sole = meshes[0]
            partsFound++
          }

          if (meshes.length >= 2) {
            meshRefs.current.head = meshes[1]
            partsFound++
          }

          if (meshes.length >= 3) {
            meshRefs.current.trim = meshes[2]
            partsFound++
          }

          if (meshes.length >= 4) {
            meshRefs.current.laces = meshes[3]
            partsFound++
          }
        }
      }

      // If we still don't have all parts, assign any remaining meshes to parts that are still null
      if (partsFound < 4) {
        const unassignedMeshes: THREE.Mesh[] = []
        gltf.scene.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            const isAssigned = Object.values(meshRefs.current).includes(object)
            if (!isAssigned) {
              unassignedMeshes.push(object)
            }
          }
        })

        // Assign unassigned meshes to missing parts
        for (const [part, mesh] of Object.entries(meshRefs.current)) {
          if (mesh === null && unassignedMeshes.length > 0) {
            const nextMesh = unassignedMeshes.shift()
            if (nextMesh) {
              meshRefs.current[part as keyof typeof meshRefs.current] = nextMesh
              partsFound++
            }
          }
        }
      }

      // Apply materials to the found parts
      Object.entries(meshRefs.current).forEach(([part, mesh]) => {
        if (mesh) {
          const materialKey = part as keyof typeof materials
          if (materials[materialKey]) {
            mesh.material = materials[materialKey]
          }
        }
      })

      // If we found at least one part, consider the model loaded
      if (partsFound > 0) {
        setModelLoaded(true)
      } else {
        setErrorMessage("No parts could be mapped in the model")
        setModelError(true)
        if (onError) onError()
      }
    } catch (error: any) {
      console.error("Error processing model:", error)
      setErrorMessage(error.message || "Error processing model")
      setModelError(true)
      if (onError) onError()
    }
  }, [gltf, modelError, materials, onError])

  // Update materials when design changes
  useEffect(() => {
    if (!modelLoaded || !gltf) return

    try {
      // Apply materials to the found parts
      Object.entries(meshRefs.current).forEach(([part, mesh]) => {
        if (mesh) {
          const materialKey = part as keyof typeof materials
          if (materials[materialKey]) {
            mesh.material = materials[materialKey]
          }
        }
      })
    } catch (error) {
      // Silently handle errors during updates
      console.error("Error updating materials:", error)
    }
  }, [materials, modelLoaded, gltf])

  // Gentle rotation animation
  useFrame((state) => {
    if (group.current) {
      group.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1
    }
  })

  // If there's an error or no gltf, use the fallback model
  if (modelError || !gltf) {
    return <EnhancedShoeModel design={safeDesign} highlight={highlight} />
  }

  return (
    <group
      ref={group}
      dispose={null}
      rotation={[0.2, 0, 0]} // Slight rotation to show the shoe better
      scale={[1.5, 1.5, 1.5]} // Scale the model to fit the view
    >
      <primitive object={gltf.scene} />
    </group>
  )
}
