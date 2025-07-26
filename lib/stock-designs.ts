import type { ShoeDesign } from "./types"

// Collection of pre-designed shoes for display
export const stockDesigns: Array<{
  id: string
  name: string
  design: ShoeDesign
  price: number
  category: string
  isNew?: boolean
}> = [
  {
    id: "classic-runner",
    name: "Classic Runner",
    design: {
      sole: { color: "#ffffff", material: "rubber" },
      trim: { color: "#00a8ff", material: "leather" },
      head: { color: "#333333", material: "mesh" },
      laces: { color: "#ffffff", material: "fabric" },
    },
    price: 9999,
    category: "running",
    isNew: true,
  },
  {
    id: "urban-stepper",
    name: "Urban Stepper",
    design: {
      sole: { color: "#222222", material: "rubber" },
      trim: { color: "#ff3860", material: "synthetic" },
      head: { color: "#444444", material: "leather" },
      laces: { color: "#ff3860", material: "fabric" },
    },
    price: 8999,
    category: "casual",
  },
  {
    id: "trail-blazer",
    name: "Trail Blazer",
    design: {
      sole: { color: "#3d3d3d", material: "rubber" },
      trim: { color: "#4CAF50", material: "synthetic" },
      head: { color: "#607D8B", material: "mesh" },
      laces: { color: "#4CAF50", material: "rope" },
    },
    price: 10999,
    category: "running",
  },
  {
    id: "street-fusion",
    name: "Street Fusion",
    design: {
      sole: { color: "#ffffff", material: "foam" },
      trim: { color: "#9C27B0", material: "canvas" },
      head: { color: "#ffffff", material: "knit" },
      laces: { color: "#9C27B0", material: "elastic" },
    },
    price: 7999,
    category: "casual",
    isNew: true,
  },
  {
    id: "court-master",
    name: "Court Master",
    design: {
      sole: { color: "#f5f5f5", material: "rubber" },
      trim: { color: "#FFD700", material: "leather" },
      head: { color: "#ffffff", material: "leather" },
      laces: { color: "#FFD700", material: "fabric" },
    },
    price: 11999,
    category: "sports",
  },
  {
    id: "daily-pacer",
    name: "Daily Pacer",
    design: {
      sole: { color: "#e0e0e0", material: "foam" },
      trim: { color: "#FF5722", material: "synthetic" },
      head: { color: "#f5f5f5", material: "mesh" },
      laces: { color: "#FF5722", material: "elastic" },
    },
    price: 8499,
    category: "casual",
  },
]
