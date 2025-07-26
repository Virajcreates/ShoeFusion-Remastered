"use client"

interface ColorPickerProps {
  color: string
  onChange: (color: string) => void
}

export default function ColorPicker({ color = "#FFFFFF", onChange }: ColorPickerProps) {
  // Ensure color is always a valid string
  const safeColor = color || "#FFFFFF"

  const colors = [
    "#FF5733", // Coral
    "#33FF57", // Lime
    "#3357FF", // Blue
    "#33A8FF", // Light Blue
    "#FF33A8", // Pink
    "#33FFF5", // Cyan
    "#F5FF33", // Yellow
    "#FF33F5", // Magenta
    "#FFFFFF", // White
    "#000000", // Black
    "#808080", // Gray
    "#A52A2A", // Brown
  ]

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-6 gap-2">
        {colors.map((colorOption) => (
          <button
            key={colorOption}
            className={`w-8 h-8 rounded-full border-2 ${
              safeColor === colorOption ? "border-primary" : "border-transparent"
            }`}
            style={{ backgroundColor: colorOption }}
            onClick={() => onChange(colorOption)}
            aria-label={`Select color ${colorOption}`}
          />
        ))}
      </div>

      <div className="flex items-center space-x-2">
        <div className="w-10 h-10 rounded-full border" style={{ backgroundColor: safeColor }} />
        <input
          type="color"
          value={safeColor}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 cursor-pointer"
        />
      </div>
    </div>
  )
}
