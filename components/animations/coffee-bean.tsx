"use client"

import { useEffect, useRef } from "react"

interface CoffeeBeanProps {
  size?: number
  color?: string
  className?: string
  rotationSpeed?: number
  floatSpeed?: number
  delay?: number
  xOffset?: number
  yOffset?: number
}

export default function CoffeeBean({
  size = 24,
  color = "#8B4513",
  className = "",
  rotationSpeed = 1,
  floatSpeed = 1,
  delay = 0,
  xOffset = 0,
  yOffset = 0,
}: CoffeeBeanProps) {
  const beanRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!beanRef.current) return

    const bean = beanRef.current
    const startTime = Date.now() + delay
    let animationFrameId: number

    const animate = () => {
      const elapsed = Date.now() - startTime
      const floatY = Math.sin((elapsed * 0.001 * floatSpeed) % (2 * Math.PI)) * 10
      const floatX = Math.sin((elapsed * 0.0015 * floatSpeed) % (2 * Math.PI)) * 5
      const rotation = (elapsed * 0.02 * rotationSpeed) % 360

      bean.style.transform = `translate(${floatX + xOffset}px, ${floatY + yOffset}px) rotate(${rotation}deg)`
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [delay, floatSpeed, rotationSpeed, xOffset, yOffset])

  return (
    <svg
      ref={beanRef}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`absolute ${className}`}
      style={{ transition: "transform 0.1s ease-out" }}
    >
      {/* Main bean shape with center crease */}
      <path d="M12 4C8 4 5 7 5 11C5 15 8 18 12 18C16 18 19 15 19 11C19 7 16 4 12 4Z" fill={color} />
      {/* Center crease/dividing line */}
      <path d="M12 4C10 4 8 7 8 11C8 15 10 18 12 18C14 18 16 15 16 11C16 7 14 4 12 4Z" fill="#5D341A" />
      {/* Highlight on the left side */}
      <path d="M9 6.5C8.2 7.5 7.5 9 7.5 11C7.5 13 8.2 14.5 9 15.5" stroke="#A67C52" strokeWidth="0.7" opacity="0.8" />
      {/* Deeper shadow in the center */}
      <path d="M12 6C11.3 7 11 9 11 11C11 13 11.3 15 12 16" stroke="#3A1D0E" strokeWidth="0.7" opacity="0.6" />
    </svg>
  )
}
