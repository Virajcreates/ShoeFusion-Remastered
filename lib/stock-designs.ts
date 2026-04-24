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
      id: "noir-assassin",
      name: "Noir Assassin",
      design: {
        sole: { color: "#0A0A0A", material: "rubber" },
        trim: { color: "#111111", material: "leather" },
        head: { color: "#1A1A1A", material: "mesh" },
        laces: { color: "#ff0000", material: "rope" },
      },
      price: 12500,
      category: "sports",
      isNew: true,
    },
    {
      id: "desert-ops",
      name: "Desert Ops",
      design: {
        sole: { color: "#8B7355", material: "rubber" },
        trim: { color: "#D2B48C", material: "suede" },
        head: { color: "#F5DEB3", material: "canvas" },
        laces: { color: "#8B4513", material: "rope" },
      },
      price: 9500,
      category: "casual",
    },
    {
      id: "cyber-punk",
      name: "Cyber Punk X",
      design: {
        sole: { color: "#00FF00", material: "foam" },
        trim: { color: "#FF00FF", material: "synthetic" },
        head: { color: "#000000", material: "mesh" },
        laces: { color: "#00FFFF", material: "elastic" },
      },
      price: 11400,
      category: "running",
      isNew: true,
    },
    {
      id: "neon-drift",
      name: "Neon Drift",
      design: {
        sole: { color: "#2E2E2E", material: "rubber" },
        trim: { color: "#FF4500", material: "leather" },
        head: { color: "#FFA500", material: "knit" },
        laces: { color: "#FFFF00", material: "fabric" },
      },
      price: 8800,
      category: "running",
    },
    {
      id: "ghost-phantom",
      name: "Ghost Phantom",
      design: {
        sole: { color: "#F0F8FF", material: "foam" },
        trim: { color: "#E6E6FA", material: "leather" },
        head: { color: "#FFFFFF", material: "mesh" },
        laces: { color: "#DCDCDC", material: "elastic" },
      },
      price: 13000,
      category: "sports",
    },
    {
      id: "crimson-peak",
      name: "Crimson Peak",
      design: {
        sole: { color: "#800000", material: "rubber" },
        trim: { color: "#DC143C", material: "suede" },
        head: { color: "#FF0000", material: "mesh" },
        laces: { color: "#8B0000", material: "rope" },
      },
      price: 10500,
      category: "sports",
    },
    {
      id: "midnight-run",
      name: "Midnight Run",
      design: {
        sole: { color: "#000080", material: "foam" },
        trim: { color: "#191970", material: "leather" },
        head: { color: "#0F0F0F", material: "knit" },
        laces: { color: "#0000FF", material: "fabric" },
      },
      price: 9200,
      category: "running",
    },
    {
      id: "emerald-city",
      name: "Emerald City",
      design: {
        sole: { color: "#006400", material: "rubber" },
        trim: { color: "#2E8B57", material: "synthetic" },
        head: { color: "#3CB371", material: "mesh" },
        laces: { color: "#00FF7F", material: "rope" },
      },
      price: 8500,
      category: "casual",
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
