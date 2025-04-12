"use client"
import { motion } from "framer-motion"
import CoffeeBean from "./coffee-bean" // Changed from { CoffeeBean } to CoffeeBean

interface StrategicCoffeeBeansProps {
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center-left" | "center-right"
  size?: number
  opacity?: number
  zIndex?: number
  animate?: boolean
  quantity?: 1 | 2 | 3
}

export function StrategicCoffeeBeans({
  position = "top-right",
  size = 30,
  opacity = 0.8,
  zIndex = 0,
  animate = true,
  quantity = 1,
}: StrategicCoffeeBeansProps) {
  // Define position classes
  const positionClasses = {
    "top-left": "absolute top-4 left-4",
    "top-right": "absolute top-4 right-4",
    "bottom-left": "absolute bottom-4 left-4",
    "bottom-right": "absolute bottom-4 right-4",
    "center-left": "absolute top-1/2 -translate-y-1/2 left-4",
    "center-right": "absolute top-1/2 -translate-y-1/2 right-4",
  }

  // Generate beans based on quantity
  const generateBeans = () => {
    const beans = []
    for (let i = 0; i < quantity; i++) {
      // Calculate offsets to prevent overlap
      const xOffset = i === 0 ? 0 : Math.random() * 20 - 10
      const yOffset = i === 0 ? 0 : Math.random() * 20 - 10
      const beanSize = size - i * 2 // Slightly decrease size for variety

      beans.push(
        <motion.div
          key={i}
          initial={{ rotate: 0, x: xOffset, y: yOffset }}
          animate={
            animate
              ? {
                  rotate: [0, 10, -10, 0],
                  x: [xOffset, xOffset + 5, xOffset - 5, xOffset],
                  y: [yOffset, yOffset - 5, yOffset + 5, yOffset],
                }
              : {}
          }
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            delay: i * 0.5,
          }}
          className="absolute"
          style={{ opacity: opacity - i * 0.1 }} // Slightly decrease opacity for depth
        >
          <CoffeeBean size={beanSize} />
        </motion.div>,
      )
    }
    return beans
  }

  return (
    <div
      className={`${positionClasses[position]} z-${zIndex} pointer-events-none`}
      style={{ width: size * 1.5, height: size * 1.5 }}
    >
      {generateBeans()}
    </div>
  )
}
