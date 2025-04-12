"use client"

import { useEffect, useRef, useState } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, PresentationControls } from "@react-three/drei"
import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"
import Image from "next/image"

// Course category types
type CourseCategory =
  | "Web3 & IT Infrastructure"
  | "Finance & Accounting"
  | "Coffee Cultivation"
  | "Supply Chain Management"
  | "Marketing & Sales"
  | "Coffee Processing"
  | "Sustainability & Ethics"

interface CourseVisualProps {
  category: CourseCategory
  title: string
  isInteractive?: boolean
}

// 3D Models
const CoffeeBean = () => {
  return (
    <group rotation={[0, Math.PI / 4, 0]}>
      {/* Main bean body */}
      <mesh>
        <sphereGeometry args={[1, 32, 16]} />
        <meshStandardMaterial color="#5a3825" roughness={0.7} metalness={0.2} />
      </mesh>

      {/* Center indentation */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[0.1, 2, 0.5]} />
        <meshStandardMaterial color="#3d2518" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* Scale the entire bean to make it more ellipsoid-like */}
      <group scale={[1, 0.5, 0.75]} />
    </group>
  )
}

const BlockchainNode = () => {
  const group = useRef()

  return (
    <group ref={group}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#10b981" metalness={0.5} roughness={0.2} />
      </mesh>
      {/* Connection lines */}
      {[
        [-2, 1, 1],
        [2, -1, 1],
        [0, 2, -2],
      ].map((pos, i) => (
        <mesh key={i} position={[pos[0] / 2, pos[1] / 2, pos[2] / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 2, 8]} />
          <meshStandardMaterial color="#a855f7" metalness={0.8} />
        </mesh>
      ))}
      {/* Connected nodes */}
      {[
        [-2, 1, 1],
        [2, -1, 1],
        [0, 2, -2],
      ].map((pos, i) => (
        <mesh key={i + 3} position={pos}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial color="#10b981" metalness={0.5} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

const FarmScene = () => {
  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#2d4a25" />
      </mesh>

      {/* Coffee plants */}
      {[
        [-2, 0, 0],
        [0, 0, -2],
        [2, 0, 1],
        [-1, 0, 2],
        [1, 0, -1],
      ].map((pos, i) => (
        <group key={i} position={pos}>
          {/* Stem */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 1.5, 8]} />
            <meshStandardMaterial color="#5a3825" />
          </mesh>
          {/* Leaves */}
          <mesh position={[0, 0.8, 0]}>
            <sphereGeometry args={[0.6, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>
      ))}
    </group>
  )
}

const SupplyChainScene = () => {
  return (
    <group>
      {/* Path */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
        <planeGeometry args={[12, 2]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Nodes along the chain */}
      {[-4, -2, 0, 2, 4].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.8, 0.8, 0.8]} />
            <meshStandardMaterial color={i % 2 === 0 ? "#10b981" : "#a855f7"} metalness={0.5} roughness={0.2} />
          </mesh>
          {i < 4 && (
            <mesh position={[1, 0, 0]}>
              <cylinderGeometry args={[0.05, 0.05, 1.2, 8]} rotation={[0, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#64748b" />
            </mesh>
          )}
        </group>
      ))}
    </group>
  )
}

const FinanceScene = () => {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, -0.5, 0]}>
        <boxGeometry args={[5, 0.2, 3]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Chart bars */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => {
        const height = 0.5 + Math.random() * 2
        return (
          <group key={i} position={[x, height / 2 - 0.4, 0]}>
            <mesh>
              <boxGeometry args={[0.6, height, 0.6]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#10b981" : "#a855f7"} metalness={0.3} roughness={0.7} />
            </mesh>
          </group>
        )
      })}

      {/* Floating tokens */}
      {[
        [-1, 1.5, -1],
        [1, 2, 1],
        [0, 2.5, 0],
      ].map((pos, i) => (
        <mesh key={i} position={pos}>
          <cylinderGeometry args={[0.4, 0.4, 0.1, 32]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} />
        </mesh>
      ))}
    </group>
  )
}

// Illustration backgrounds for different categories
const getCategoryIllustration = (category: CourseCategory) => {
  switch (category) {
    case "Web3 & IT Infrastructure":
      return "/placeholder.svg?height=400&width=800&text=Blockchain+Infrastructure"
    case "Finance & Accounting":
      return "/placeholder.svg?height=400&width=800&text=DeFi+Solutions"
    case "Coffee Cultivation":
      return "/placeholder.svg?height=400&width=800&text=Sustainable+Farming"
    case "Supply Chain Management":
      return "/placeholder.svg?height=400&width=800&text=Supply+Chain"
    case "Marketing & Sales":
      return "/placeholder.svg?height=400&width=800&text=Digital+Marketing"
    case "Coffee Processing":
      return "/placeholder.svg?height=400&width=800&text=Coffee+Processing"
    case "Sustainability & Ethics":
      return "/placeholder.svg?height=400&width=800&text=Ethical+Sourcing"
    default:
      return "/placeholder.svg?height=400&width=800"
  }
}

// Get 3D scene based on category
const getCategoryScene = (category: CourseCategory) => {
  switch (category) {
    case "Web3 & IT Infrastructure":
      return <BlockchainNode />
    case "Finance & Accounting":
      return <FinanceScene />
    case "Coffee Cultivation":
      return <FarmScene />
    case "Supply Chain Management":
      return <SupplyChainScene />
    default:
      return <CoffeeBean />
  }
}

export function CourseVisual({ category, title, isInteractive = true }: CourseVisualProps) {
  const [showInteractive, setShowInteractive] = useState(false)
  const [clientReady, setClientReady] = useState(false)

  // Handle client-side rendering for Three.js
  useEffect(() => {
    setClientReady(true)
  }, [])

  return (
    <div className="relative h-[225px] sm:h-[400px] rounded-xl overflow-hidden web3-card-glow-border">
      {showInteractive && clientReady ? (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 to-purple-950">
          <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
            <PresentationControls
              global
              zoom={0.8}
              rotation={[0, 0, 0]}
              polar={[-Math.PI / 4, Math.PI / 4]}
              azimuth={[-Math.PI / 4, Math.PI / 4]}
            >
              {getCategoryScene(category)}
            </PresentationControls>
            <Environment preset="city" />
          </Canvas>

          <div className="absolute bottom-4 right-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowInteractive(false)}
              className="bg-black/30 border-emerald-500/30 hover:bg-black/50 hover:border-emerald-500/50"
            >
              Show Preview
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/80 to-purple-950/80 z-10" />
          <Image
            src={getCategoryIllustration(category) || "/placeholder.svg"}
            alt={title}
            fill
            className="object-cover z-0"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
            <div className="text-center px-4 mb-6">
              <h3 className="text-xl font-bold text-white mb-2 text-shadow-sm">{title}</h3>
              <p className="text-sm text-emerald-200 max-w-md">Preview the interactive course visualization</p>
            </div>
            {isInteractive && (
              <Button
                size="lg"
                className="bg-emerald-600/90 text-white hover:bg-emerald-600 animate-pulse"
                onClick={() => setShowInteractive(true)}
              >
                <Play className="h-5 w-5 mr-2" />
                Explore in 3D
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  )
}
