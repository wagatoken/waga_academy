import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarDays, Users, MapPin, Award } from "lucide-react"

export function SummerCampPromo() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black/30 backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 z-0 web3-grid-bg"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-block rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-sm text-purple-300">
              Coming July 2024
            </div>
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-gradient-text">
              WAGA Summer Camp
            </h2>
            <p className="text-muted-foreground md:text-xl">
              Join our immersive volunteer program in Ethiopia's coffee-producing regions and help empower the next
              generation of smallholder farmers with Web3 technology
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="web3-button">
                <Link href="/summer-camp/register">Register Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-purple-500/30 hover:border-purple-500/60">
                <Link href="/summer-camp">Learn More</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="web3-card-purple">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                <CalendarDays className="h-8 w-8 text-purple-400 mb-2" />
                <h3 className="font-bold">July - September 2024</h3>
                <p className="text-sm text-muted-foreground">Flexible 2-4 week volunteer program</p>
              </CardContent>
            </Card>
            <Card className="web3-card-blue">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                <MapPin className="h-8 w-8 text-blue-400 mb-2" />
                <h3 className="font-bold">Ethiopia</h3>
                <p className="text-sm text-muted-foreground">Experience the birthplace of coffee</p>
              </CardContent>
            </Card>
            <Card className="web3-card-teal">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                <Users className="h-8 w-8 text-teal-400 mb-2" />
                <h3 className="font-bold">200+ Farmers</h3>
                <p className="text-sm text-muted-foreground">Train the next generation of coffee farmers</p>
              </CardContent>
            </Card>
            <Card className="web3-card-pink">
              <CardContent className="p-6 flex flex-col items-center text-center space-y-2">
                <Award className="h-8 w-8 text-pink-400 mb-2" />
                <h3 className="font-bold">WAGA Certification</h3>
                <p className="text-sm text-muted-foreground">Receive official recognition for your contribution</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

