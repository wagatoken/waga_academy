import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Coffee, Truck, Factory, ShoppingBag, BarChart3 } from "lucide-react"

const valueChainStages = [
  {
    icon: <Coffee className="h-8 w-8 text-primary" />,
    title: "Coffee Cultivation",
    description: "Sustainable farming practices and blockchain for production data traceability",
    href: "/courses?category=cultivation",
  },
  {
    icon: <Factory className="h-8 w-8 text-primary" />,
    title: "Coffee Processing",
    description: "Quality control, grading, and supply chain management for coffee processing",
    href: "/courses?category=processing",
  },
  {
    icon: <Truck className="h-8 w-8 text-primary" />,
    title: "Logistics & Distribution",
    description: "International trade, logistics management, and blockchain for supply chain",
    href: "/courses?category=distribution",
  },
  {
    icon: <ShoppingBag className="h-8 w-8 text-primary" />,
    title: "Roasting & Branding",
    description: "Roasting techniques, digital marketing, and consumer engagement with blockchain",
    href: "/courses?category=marketing",
  },
  {
    icon: <BarChart3 className="h-8 w-8 text-primary" />,
    title: "Sales & Distribution",
    description: "E-commerce, online sales, and blockchain for product authenticity",
    href: "/courses?category=web3",
  },
]

export function ValueChainSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0 web3-grid-bg"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-gradient-text-animated">
              Global Value Chain Approach
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Our curriculum is structured around the coffee value chain, providing comprehensive training for every
              stage from farm to cup
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 w-full pt-8">
            {valueChainStages.map((stage, index) => {
              // Assign different card styles based on index
              const cardClasses = [
                "web3-card-purple",
                "web3-card-blue",
                "web3-card-teal",
                "web3-card-amber",
                "web3-card-emerald",
              ]
              const cardClass = cardClasses[index % cardClasses.length]

              return (
                <Card
                  key={index}
                  className={`${cardClass} flex flex-col h-full transition-all duration-300 animate-float animation-delay-${index * 100} animate-fade-in`}
                >
                  <CardHeader>
                    <div className="flex justify-center mb-4">{stage.icon}</div>
                    <CardTitle className="web3-gradient-text">{stage.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="text-center text-muted-foreground">{stage.description}</CardDescription>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button
                      asChild
                      variant="outline"
                      className="w-full border-purple-500/30 hover:border-purple-500/60"
                    >
                      <Link href={stage.href}>Explore Courses</Link>
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

