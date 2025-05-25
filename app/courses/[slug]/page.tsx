"use client"

export const runtime = 'edge'
import { useState, useEffect, use } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, BookOpen, Calendar, Coffee, Download } from "lucide-react"
import { CourseWaitlist } from "@/components/course-waitlist"
import { CourseCurriculumExpanded } from "@/components/course-curriculum-expanded"
import { CourseIllustration } from "@/components/course-illustration"

export default function CoursePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);

  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await fetch(`/api/courses/full/${slug}`)
        if (!response.ok) {
          throw new Error("Failed to fetch course data")
        }
        const apiData = await response.json()
        // Map API data to UI structure
        const data = apiData.data
        if (!data) throw new Error("No course data found")
        const mappedCourse = {
          ...data,
          category: data.category || "",
          level: data.difficulty_level || "",
          duration: data.duration || "",
          instructor: data.instructor || "",
          modules: Array.isArray(data.modules) ? data.modules.map((mod: any) => ({
            id: mod.module_id,
            title: mod.module_title,
            description: mod.module_description,
            order_index: mod.module_order_index,
            lessons: Array.isArray(mod.lessons) ? mod.lessons.map((lesson: any) => ({
              id: lesson.lesson_id,
              title: lesson.lesson_title,
              content: lesson.content,
              video_url: lesson.video_url,
              duration: lesson.lesson_duration,
              order_index: lesson.lesson_order_index,
            })) : [],
          })) : [],
          overview: {
            description: data.description ? [data.description] : [],
            learningOutcomes: data.learning_objectives ? data.learning_objectives.split('\n').filter(Boolean) : [],
            prerequisites: data.prerequisites || "",
          },
        }
        setCourse(mappedCourse)
        setError(null)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCourseData()
  }, [slug])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <Link href="/courses" className="link-emerald flex items-center mb-2">
                <ArrowLeft className="mr-1 h-4 w-4" /> Back to Courses
              </Link>
              <h1 className="text-3xl font-bold tracking-tighter web3-gradient-text-enhanced">{course.title}</h1>
              <p className="text-muted-foreground mt-2">{course.description}</p>
              <div className="mt-2">
                <Badge variant="outline" className="primary-gradient text-white animate-border-glow">
                  Coming Q4 2025
                </Badge>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="badge-emerald">
                {course.category}
              </Badge>
              <Badge variant="secondary" className="bg-emerald-500/10  border-emerald-500/30 text-emerald-300">
                {course.level}
              </Badge>
              <Badge variant="outline" className="bg-emerald-500/10 border-emerald-500/30 text-emerald-300">
                {course.duration}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt={course.instructor} />
                <AvatarFallback className="bg-emerald-900/50">{course.instructor}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{course.instructor}</p>
                <p className="text-sm text-emerald-400">{course.instructor}</p>
              </div>
            </div>

            <div id="course-illustration">
              <CourseIllustration category={course.category as any} title={course.title} />
            </div>

            <Tabs defaultValue="curriculum">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
              </TabsList>
              <TabsContent value="curriculum" className="mt-6">
                <div className="space-y-4">
                  <CourseCurriculumExpanded modules={course.modules} />
                </div>
              </TabsContent>
              <TabsContent value="overview" className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Course Overview</h2>
                  <div className="space-y-4">
                    {course.overview.description.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                    <h3 className="text-lg font-bold mt-6">What You'll Learn</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4">
                      {course.overview.learningOutcomes.map((outcome, index) => (
                        <li key={index}>{outcome}</li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-bold mt-6">Prerequisites</h3>
                    <p>{course.overview.prerequisites}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="resources" className="mt-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">Course Resources</h2>
                  <div className="space-y-4">
                    <Card className="web3-card-purple">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Course Slides</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-purple-400" />
                            <span className="text-sm">blockchain_traceability_slides.pdf</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-500/30 hover:border-purple-500/60"
                          >
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="web3-card-blue">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Sample Smart Contracts</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Download className="h-4 w-4 text-blue-400" />
                            <span className="text-sm">coffee_traceability_contracts.zip</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-purple-500/30 hover:border-purple-500/60"
                          >
                            Download
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="web3-card-teal">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Recommended Reading</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          <li className="text-sm">
                            <Link href="#" className="text-primary hover:underline">
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit
                            </Link>
                          </li>
                          <li className="text-sm">
                            <Link href="#" className="text-primary hover:underline">
                              Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
                            </Link>
                          </li>
                          <li className="text-sm">
                            <Link href="#" className="text-primary hover:underline">
                              Ut enim ad minim veniam, quis nostrud exercitation ullamco
                            </Link>
                          </li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <CourseWaitlist courseName={course.title} courseId={course.id} isWaitlisted={!!course.in_waitlist} />

            <Card className="web3-card-glass hover-lift">
              <CardHeader className="card-header-gradient">
                <CardTitle>Course Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="primary-gradient text-white animate-border-glow">
                      Coming Q4 2025
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4 icon-emerald" />
                    <span className="text-sm">Part of Coffee Value Chain curriculum</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 icon-emerald" />
                    <span className="text-sm">Estimated duration: {course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 icon-emerald" />
                    <span className="text-sm">Certificate upon completion</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="web3-card-glass hover-lift">
              <CardHeader className="card-header-gradient">
                <CardTitle>Related Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-6 w-6 icon-emerald" />
                    </div>
                    <div>
                      <Link href="/courses/coffee-tokenization" className="font-medium link-emerald">
                        Coffee Tokenization Fundamentals
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Learn how to tokenize coffee assets for fair pricing and market access
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-6 w-6 icon-emerald" />
                    </div>
                    <div>
                      <Link href="/courses/defi-coffee-farmers" className="font-medium link-emerald">
                        DeFi Solutions for Coffee Farmers
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Explore decentralized finance for yield-based lending and financial inclusion
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-md bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Coffee className="h-6 w-6 icon-emerald" />
                    </div>
                    <div>
                      <Link href="/courses/iot-coffee-monitoring" className="font-medium link-emerald">
                        IoT for Coffee Farm Monitoring
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">
                        Implement IoT solutions for real-time monitoring of coffee farms
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
