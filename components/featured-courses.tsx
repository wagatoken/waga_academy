import Link from "next/link"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StrategicCoffeeBeans } from "@/components/animations/strategic-coffee-beans"
import { toast } from "@/components/ui/toast"


export function FeaturedCourses() {
  const [featuredCourses, setFeaturedCourses] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchFeaturedCourses = async () => {
      try {
        const response = await fetch("/api/courses/getFeaturedCourse")
        if (!response.ok) {
          throw new Error(`Error: ${response.status} ${response.statusText}`)
        }
        const result = await response.json()
        if (result?.data) {
          setFeaturedCourses(result.data)
        }
      } catch (err) {
        setError(err.message)
        toast({
          title: "Failed to Load Courses",
          description: err.message,
          variant: "destructive",
        })
      }
    }

    fetchFeaturedCourses()
  }, [])

  

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-950/40 to-purple-950/40 z-0"></div>
      <div className="absolute inset-0 z-0 web3-grid-bg-animated"></div>

      {/* Animated background elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-emerald-500/5 rounded-full filter blur-3xl animate-float-slow"></div>
      <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full filter blur-3xl animate-float animation-delay-2000"></div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in relative">
            {/* Strategic coffee bean near the title */}
            <StrategicCoffeeBeans position="top-right" size={30} zIndex={5} />

            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-dual-gradient-text-glow">
              Featured Courses
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Preview our upcoming curriculum designed to empower you with the skills needed in the coffee value chain •
              Launching Q4 2025
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full pt-8 relative">
            {/* Strategic coffee bean in the grid */}
            <StrategicCoffeeBeans position="bottom-left" size={25} opacity={0.7} zIndex={5} />

            {featuredCourses.map((course, index) => {
              // Alternate between emerald and purple card styles
              const isEven = index % 2 === 0
              const cardClass = isEven ? "web3-card-glass" : "web3-card-purple"
              const buttonClass = isEven
                ? "web3-button-glow bg-gradient-to-r from-emerald-600 to-teal-600 border border-emerald-500/30 hover:border-emerald-500/50"
                : "purple-gradient border border-purple-500/30 hover:border-purple-500/50"
              const badgeClass = isEven
                ? "border-emerald-500/30 bg-emerald-500/10 animate-border-glow"
                : "border-purple-500/30 bg-purple-500/10 animate-purple-border-glow"
              const animationDelay = `animation-delay-${(index + 1) * 100}`

              // Add coffee bean to the first course (Blockchain for Coffee Traceability)
              const showCoffeeBean = index === 0

              return (
                <Card
                  key={course.id}
                  className={`${cardClass} flex flex-col h-full transition-all duration-300 animate-fade-in animate-float ${animationDelay} relative`}
                >
                  {showCoffeeBean && (
                    <div className="absolute top-2 right-2 z-10">
                      <StrategicCoffeeBeans position="top-right" size={20} animate={false} opacity={0.9} />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <Badge variant="outline" className={`mb-2 ${badgeClass} px-2 py-1 md:px-3 md:py-1.5 md:[font-size:0.65rem]`}>
                        {course.category}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`mb-2 ${isEven ? "bg-emerald-500/10 text-emerald-300" : "bg-purple-500/10 text-purple-300"} px-2 py-1 md:px-3 md:py-1.5 md:[font-size:0.65rem]`}
                      >
                        {course.difficulty_level}
                      </Badge>
                    </div>
                    <CardTitle className="line-clamp-2 lg:pt-4">{course.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <CardDescription className="line-clamp-4 text-muted-foreground">
                      {course.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/community/courses/${course.slug}`} className="w-full">
                      <Button className={`w-full ${buttonClass} relative z-20`}>View Course</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
          <Link href="/courses" className="mt-8">
            <Button
              variant="outline"
              className="border-opacity-30 hover:border-opacity-60 animate-fade-in animation-delay-500 animate-dual-border-glow bg-gradient-to-r from-emerald-950/30 to-purple-950/30 border-gradient relative z-20"
              style={{
                borderImage: "linear-gradient(to right, rgba(16, 185, 129, 0.5), rgba(147, 51, 234, 0.5))",
                borderImageSlice: 1,
              }}
            >
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
