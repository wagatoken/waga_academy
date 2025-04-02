import Link from "next/link"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
      <div className="absolute inset-0 z-0 web3-grid-bg"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2 web3-card-glow p-8 rounded-xl">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none web3-gradient-text">
              WAGA Academy
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Empowering the future of coffee through Web3 and blockchain technology
            </p>
          </div>
          <div className="space-x-4">
            <Button asChild size="lg" className="web3-button">
              <Link href="/courses">Explore Courses</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-purple-500/30 hover:border-purple-500/60 backdrop-blur"
            >
              <Link href="/summer-camp">Join Summer Camp</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

