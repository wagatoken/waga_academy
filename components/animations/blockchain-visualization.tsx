"use client"

import BlockchainCube from "./blockchain-cube"
import BlockchainCubeAdvanced from "./blockchain-cube-advanced"
import BlockchainBoxGrid from "./blockchain-box-grid"
import CoffeeBeanCluster from "./coffee-bean-cluster"
import CoffeeBean from "./coffee-bean"

export default function BlockchainVisualization() {
  return (
    <div className="mt-12 sm:mt-16 md:mt-24 pt-8 sm:pt-12 md:pt-16 relative">
      {/* Blockchain hash connection - using alternating emerald-purple gradient */}
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-0.5 h-full max-h-16 sm:max-h-24 md:max-h-32 bg-gradient-to-b from-emerald-500 via-purple-500 to-emerald-500/5 animate-pulse-slow"></div>

      {/* Hash nodes - using emerald-purple gradient border */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500/50 via-purple-500/50 to-emerald-500/50 rounded-md blur-[1px] opacity-70 animate-gradient-x"></div>
          <div className="relative px-2 sm:px-3 py-1 bg-black/30 rounded-md backdrop-blur-sm">
            <span className="text-[10px] sm:text-xs bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent font-mono">
              0x7f9e8d...
            </span>
          </div>
        </div>
      </div>

      {/* Blockchain cubes with connecting elements and coffee beans */}
      <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12 xl:gap-24 px-2 sm:px-4 relative">
        {/* Hash connection lines - using emerald-purple gradient */}
        <div className="absolute top-1/2 left-1/4 right-1/4 h-px bg-gradient-to-r from-emerald-500/40 via-purple-500/40 to-emerald-500/40 hidden sm:block"></div>
        <div className="absolute top-1/2 left-1/3 w-px h-4 bg-gradient-to-b from-emerald-500/40 to-purple-500/40 hidden sm:block"></div>
        <div className="absolute top-1/2 right-1/3 w-px h-4 bg-gradient-to-b from-purple-500/40 to-emerald-500/40 hidden sm:block"></div>

        {/* Coffee bean clusters */}
        <CoffeeBeanCluster position="left" className="top-1/2 -translate-y-1/2" />
        <CoffeeBeanCluster position="center" className="top-1/4" />
        <CoffeeBeanCluster position="right" className="top-1/2 -translate-y-1/2" />
        <CoffeeBeanCluster position="center" className="bottom-0" />

        {/* Blockchain cubes - properly positioned and sized for mobile */}
        <div className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 scale-75 relative">
          <BlockchainCube />
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono">
            <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">01</span>
          </div>
        </div>
        <div className="h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14 scale-90 relative">
          <BlockchainCubeAdvanced />
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono">
            <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">02</span>
          </div>
        </div>
        <div className="h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16 relative">
          <BlockchainBoxGrid />
          <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] sm:text-xs font-mono">
            <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">03</span>
          </div>
        </div>
      </div>

      {/* Additional floating coffee beans */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <CoffeeBean
          size={20}
          color="#8B4513"
          className="top-1/4 left-1/4"
          rotationSpeed={0.7}
          floatSpeed={1.4}
          delay={300}
        />
        <CoffeeBean
          size={16}
          color="#A0522D"
          className="top-1/3 right-1/4"
          rotationSpeed={1.1}
          floatSpeed={0.8}
          delay={800}
        />
        <CoffeeBean
          size={14}
          color="#6F4E37"
          className="bottom-1/4 left-1/3"
          rotationSpeed={0.9}
          floatSpeed={1.2}
          delay={1200}
        />
        <CoffeeBean
          size={18}
          color="#704214"
          className="bottom-1/3 right-1/3"
          rotationSpeed={1.2}
          floatSpeed={1}
          delay={1600}
        />
      </div>
    </div>
  )
}
