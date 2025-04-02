import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const featuredCourses = [
  {
    id: 1,
    title: "Blockchain for Coffee Traceability",
    description:
      "Learn how blockchain technology helps record production data for transparency and traceability in the coffee supply chain.",
    category: "Web3 & IT Infrastructure",
    level: "Beginner",
    href: "/courses/blockchain-coffee-traceability",
  },
  {
    id: 2,
    title: "DeFi Solutions for Coffee Farmers",
    description:
      "Understand how decentralized finance can provide yield-based lending and financial inclusion for smallholder farmers.",
    category: "Finance & Accounting",
    level: "Intermediate",
    href: "/courses/defi-coffee-farmers",
  },
  {
    id: 3,
    title: "Sustainable Coffee Farming Practices",
    description:
      "Master agroecology, smart farming tools, and sustainable coffee production methods for improved yields and quality.",
    category: "Coffee Cultivation",
    level: "All Levels",
    href: "/courses/sustainable-coffee-farming",
  },
  {
    id: 4,
    title: "Coffee Tokenization Fundamentals",
    description:
      "Explore how coffee assets can be tokenized to enable fair pricing, financial resources, and global market access.",
    category: "Web3 & IT Infrastructure",
    level: "Intermediate",
    href: "/courses/coffee-tokenization",
  },
]

export function FeaturedCourses() {
  // Update the return statement to use different card styles for each course
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-black/30 backdrop-blur relative overflow-hidden">
      <div className="absolute inset-0 z-0 web3-grid-bg"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight web3-gradient-text-animated">
              Featured Courses
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Preview our upcoming curriculum designed to empower you with the skills needed in the coffee value chain •
              Launching Q4 2025
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 w-full pt-8">
            {featuredCourses.map((course, index) => (
              <Card
                key={course.id}
                className={`${
                  index === 0
                    ? "web3-card-purple animate-float animation-delay-100"
                    : index === 1
                      ? "web3-card-blue animate-float animation-delay-200"
                      : index === 2
                        ? "web3-card-teal animate-float animation-delay-300"
                        : "web3-card-pink animate-float animation-delay-400"
                } flex flex-col h-full transition-all duration-300 animate-fade-in`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="mb-2 border-purple-500/30 bg-purple-500/10">
                      {course.category}
                    </Badge>
                    <Badge variant="secondary" className="mb-2 bg-indigo-500/10 text-indigo-300">
                      {course.level}
                    </Badge>
                  </div>
                  <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <CardDescription className="line-clamp-4 text-muted-foreground">{course.description}</CardDescription>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full web3-button">
                    <Link href={course.href}>View Course</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          <Button
            asChild
            variant="outline"
            className="mt-8 border-purple-500/30 hover:border-purple-500/60 animate-fade-in animation-delay-500"
          >
            <Link href="/courses">View All Courses</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

