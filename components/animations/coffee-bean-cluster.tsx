"use client"

import CoffeeBean from "./coffee-bean"

interface CoffeeBeanClusterProps {
  position?: "left" | "center" | "right"
  className?: string
}

export default function CoffeeBeanCluster({ position = "center", className = "" }: CoffeeBeanClusterProps) {
  // Generate different configurations based on position
  const getPositionClass = () => {
    switch (position) {
      case "left":
        return "-left-4 sm:-left-8"
      case "right":
        return "-right-4 sm:-right-8"
      default:
        return "left-1/2 -translate-x-1/2"
    }
  }

  return (
    <div className={`absolute ${getPositionClass()} ${className} w-36 h-36 pointer-events-none`}>
      {/* Reduced to just 1 bean with increased size by 50% */}
      <CoffeeBean size={30} color="#8B4513" rotationSpeed={0.8} floatSpeed={1.2} delay={0} xOffset={0} yOffset={0} />
    </div>
  )
}
