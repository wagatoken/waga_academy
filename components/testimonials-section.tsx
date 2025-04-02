import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Quote } from "lucide-react"

const visionStatements = [
  {
    quote:
      "We envision a future where blockchain technology empowers coffee farmers to trace their beans from farm to cup, ensuring fair compensation and transparent supply chains.",
    name: "John Doe",
    role: "Founder & Executive Director",
    avatar: "JD",
  },
  {
    quote:
      "The intersection of Web3 and agriculture represents one of the most promising opportunities for real-world blockchain adoption, with potential to transform livelihoods across the coffee belt.",
    name: "Jane Doe",
    role: "Head of Web3 Education",
    avatar: "JD",
  },
  {
    quote:
      "By equipping the next generation with both agricultural knowledge and digital skills, we can create sustainable coffee communities that thrive in the digital economy.",
    name: "Alice Smith",
    role: "Coffee Value Chain Lead",
    avatar: "AS",
  },
]

export function TestimonialsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 z-0 web3-grid-bg"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-gradient-text-animated">
              Our Vision for Impact
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              How we see Web3 and education transforming the coffee industry
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 w-full pt-8">
            {visionStatements.map((statement, index) => {
              // Assign different card styles based on index
              const cardClasses = ["web3-card-purple", "web3-card-blue", "web3-card-teal"]
              const cardClass = cardClasses[index % cardClasses.length]

              return (
                <Card
                  key={index}
                  className={`${cardClass} text-center animate-float-slow animation-delay-${index * 200} animate-fade-in`}
                >
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 mx-auto mb-4 text-purple-400 opacity-50" />
                    <p className="text-muted-foreground">"{statement.quote}"</p>
                  </CardContent>
                  <CardFooter className="flex flex-col items-center pb-6">
                    <Avatar className="h-12 w-12 mb-2 ring-2 ring-purple-500/30">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={statement.name} />
                      <AvatarFallback className="bg-purple-900/50">{statement.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{statement.name}</p>
                      <p className="text-sm text-muted-foreground">{statement.role}</p>
                    </div>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

