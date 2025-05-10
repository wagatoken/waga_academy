"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StrategicCoffeeBeans } from "@/components/animations/strategic-coffee-beans"
import { getAllCourses } from "@/app/api/courses/actions"

const categoryMap = {
  all: "",
  web3: "Web3 & IT Infrastructure",
  finance: "Finance & Accounting",
  cultivation: "Coffee Cultivation",
  processing: "Coffee Processing",
  supply: "Supply Chain Management",
  marketing: "Marketing & Sales",
  sustainability: "Sustainability & Ethics",
}

const levelMap = {
  all: "",
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
}

export default function CoursesPage() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("category") || "all"

  // State for filters
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLevel, setSelectedLevel] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredCourses, setFilteredCourses] = useState([])
  const [activeTab, setActiveTab] = useState(defaultTab)

  useEffect(() => {
    const fetchCourses = async () => {
      const result = await getAllCourses()
      if (result?.data) {
        setFilteredCourses(result.data)
      }
    }

    fetchCourses()
  }, [])

  // Filter courses based on all criteria
  useEffect(() => {
    let result = [...filteredCourses]

    // Apply category filter from dropdown
    if (selectedCategory !== "all") {
      const categoryValue = categoryMap[selectedCategory as keyof typeof categoryMap]
      if (categoryValue) {
        result = result.filter((course) => course.category === categoryValue)
      }
    }

    // Apply level filter
    if (selectedLevel !== "all") {
      const levelValue = levelMap[selectedLevel as keyof typeof levelMap]
      if (levelValue) {
        result = result.filter((course) => course.level === levelValue || course.level === "All Levels")
      }
    }

    // Apply search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (course) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query),
      )
    }

    // Apply tab filter (this overrides the category dropdown)
    if (activeTab !== "all") {
      if (activeTab === "cultivation") {
        result = result.filter((course) => course.category === "Coffee Cultivation")
      } else if (activeTab === "processing") {
        result = result.filter((course) => course.category === "Coffee Processing")
      } else if (activeTab === "distribution") {
        result = result.filter((course) => course.category === "Supply Chain Management")
      } else if (activeTab === "web3") {
        result = result.filter((course) => course.category === "Web3 & IT Infrastructure")
      }
    }

    setFilteredCourses(result)
  }, [selectedCategory, selectedLevel, searchQuery, activeTab])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    // Reset category dropdown when changing tabs to avoid confusion
    if (value !== "all") {
      setSelectedCategory("all")
    }
  }

  // Render course card with appropriate styling
  const renderCourseCard = (course: any, index: number) => {
    // Assign different card styles based on category
    let cardClass = "web3-card"
    if (course.category === "Web3 & IT Infrastructure") cardClass = "web3-card-purple"
    else if (course.category === "Finance & Accounting") cardClass = "web3-card-blue"
    else if (course.category === "Coffee Cultivation") cardClass = "web3-card-teal"
    else if (course.category === "Supply Chain Management") cardClass = "web3-card-amber"
    else if (course.category === "Marketing & Sales") cardClass = "web3-card-pink"
    else if (course.category === "Sustainability & Ethics") cardClass = "web3-card-emerald"
    else if (course.category === "Coffee Processing") cardClass = "web3-card-blue"

    // Add coffee bean to specific courses
    const showCoffeeBean = course.category === "Coffee Cultivation" || index === 0

    return (
      <Card key={course.id} className={`${cardClass} flex flex-col h-full relative`}>
        {showCoffeeBean && (
          <div className="absolute top-2 right-2 z-10">
            <StrategicCoffeeBeans position="top-right" size={20} animate={false} opacity={0.9} />
          </div>
        )}
        <CardHeader>
          <div className="flex justify-between items-start">
            <Badge variant="outline" className="mb-2">
              {course.category}
            </Badge>
            <Badge variant="secondary" className="mb-2 bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Coming Soon
            </Badge>
          </div>
          <CardTitle className="line-clamp-2 bg-gradient-to-r from-purple-400 via-blue-400 to-teal-400 bg-clip-text text-transparent">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm">Duration: {course.duration}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription className="line-clamp-4">{course.description}</CardDescription>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full web3-button-purple">
            <Link href="">Join Waitlist</Link>
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div className="container py-12 md:py-24 relative">
      {/* Strategic coffee beans */}
      <StrategicCoffeeBeans position="top-right" size={30} zIndex={5} />
      <StrategicCoffeeBeans position="bottom-left" size={25} opacity={0.7} zIndex={5} quantity={2} />

      <div className="space-y-12">
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl web3-dual-gradient-text-glow">
            Courses
          </h1>
          <p className="text-muted-foreground md:text-xl">
            Browse our upcoming curriculum designed around the coffee value chain
          </p>
          <div className="inline-block rounded-lg bg-purple-500/20 border border-purple-500/30 px-3 py-1 text-sm text-purple-300">
            Pre-registration open • Launching Q4 2025
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="web3-input"
            />
          </div>
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px] web3-input">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur border border-purple-500/30 shadow-lg">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="web3">Web3 & IT</SelectItem>
                <SelectItem value="finance">Finance & Accounting</SelectItem>
                <SelectItem value="cultivation">Coffee Cultivation</SelectItem>
                <SelectItem value="processing">Coffee Processing</SelectItem>
                <SelectItem value="supply">Supply Chain</SelectItem>
                <SelectItem value="marketing">Marketing & Sales</SelectItem>
                <SelectItem value="sustainability">Sustainability</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-[180px] web3-input">
                <SelectValue placeholder="Level" />
              </SelectTrigger>
              <SelectContent className="bg-background/95 backdrop-blur border border-purple-500/30 shadow-lg">
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="cultivation">Cultivation</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="distribution">Distribution</TabsTrigger>
            <TabsTrigger value="web3">Web3</TabsTrigger>
          </TabsList>

          {/* All tabs now use the filtered courses */}
          <TabsContent value="all" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => renderCourseCard(course, index))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No courses match your filters. Try adjusting your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 web3-button-outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedLevel("all")
                      setSearchQuery("")
                      setActiveTab("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* These tabs now just change the active tab state, which triggers filtering */}
          <TabsContent value="cultivation" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => renderCourseCard(course, index))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No courses match your filters. Try adjusting your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 web3-button-outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedLevel("all")
                      setSearchQuery("")
                      setActiveTab("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="processing" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => renderCourseCard(course, index))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No courses match your filters. Try adjusting your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 web3-button-outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedLevel("all")
                      setSearchQuery("")
                      setActiveTab("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => renderCourseCard(course, index))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No courses match your filters. Try adjusting your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 web3-button-outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedLevel("all")
                      setSearchQuery("")
                      setActiveTab("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="web3" className="mt-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course, index) => renderCourseCard(course, index))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground text-lg">
                    No courses match your filters. Try adjusting your criteria.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 web3-button-outline"
                    onClick={() => {
                      setSelectedCategory("all")
                      setSelectedLevel("all")
                      setSearchQuery("")
                      setActiveTab("all")
                    }}
                  >
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
