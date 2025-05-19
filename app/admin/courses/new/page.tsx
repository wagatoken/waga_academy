"use client"
export const runtime = 'edge';

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ImageIcon, Plus, Save } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/toast"
import { updateCourse } from "@/app/api/courses/actions"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface Lesson {
  order_index: number
  id: string
  title: string
  content: string
  video_url: string
  duration: string
}

interface Module {
  order_index: number
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

export default function NewCourse() {
  const [isSaving, setIsSaving] = useState(false)
  const [coverImage, setCoverImage] = useState("")
  const [currentTab, setCurrentTab] = useState("basic")
  const [courseId, setCourseId] = useState<string | null>(null)
  const router = useRouter()

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    instructor: "",
    difficulty_level: "",
    category: "",
    duration: "",
    language: "english",
    image_url: "",
    prerequisites: "",
    target_audience: "",
    learning_objectives: "",
    tags: "",
    status: "Draft",
    visibility: "public",
    certificate: true,
    is_published: false,
    additional_resources: "",
  })

  console.log(formData.duration)

  const [modules, setModules] = useState<Module[]>([
    {
      order_index: 1,
      id: "1",
      title: "Introduction",
      description: "An overview of the course and its objectives",
      lessons: [
        {
          order_index: 1,
          id: "1.1",
          title: "Course Overview",
          content: "This lesson provides an overview of the course.",
          video_url: "",
          duration: "10:00",
        },
        {
          order_index: 2,
          id: "1.2",
          title: "Introduction to Blockchain",
          content: "This lesson introduces blockchain technology.",
          video_url: "",
          duration: "15:00",
        },
      ],
    },
    {
      order_index: 2,
      id: "2",
      title: "Coffee Supply Chain Basics",
      description: "Learn about the fundamentals of coffee supply chains",
      lessons: [],
    },
  ])

  const [courseContentJson, setCourseContentJson] = useState<Module[]>(modules)

  const syncCourseContentJson = (updatedModules: Module[]) => {
    setCourseContentJson(updatedModules)
  }

  const [editingModuleId, setEditingModuleId] = useState<string | null>(null)
  const [editingModuleTitle, setEditingModuleTitle] = useState("")
  const [editingDescriptionModuleId, setEditingDescriptionModuleId] = useState<string | null>(null)
  const [editingModuleDescription, setEditingModuleDescription] = useState("")

  const [isLessonDialogOpen, setIsLessonDialogOpen] = useState(false)
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null)
  const [editingLessonId, setEditingLessonId] = useState<string | null>(null)
  const [lessonForm, setLessonForm] = useState({
    title: "",
    content: "",
    video_url: "",
    duration: "",
  })

  const handleModuleTitleEdit = (moduleId: string, title: string) => {
    setEditingModuleId(moduleId)
    setEditingModuleTitle(title)
  }

  const saveModuleTitle = (moduleId: string) => {
    const updatedModules = modules.map((module) => (module.id === moduleId ? { ...module, title: editingModuleTitle } : module))
    setModules(updatedModules)
    syncCourseContentJson(updatedModules)
    setEditingModuleId(null)
  }

  const handleModuleDescriptionEdit = (moduleId: string, description: string) => {
    setEditingDescriptionModuleId(moduleId)
    setEditingModuleDescription(description)
  }

  const saveModuleDescription = (moduleId: string) => {
    const updatedModules = modules.map((module) => (module.id === moduleId ? { ...module, description: editingModuleDescription } : module))
    setModules(updatedModules)
    syncCourseContentJson(updatedModules)
    setEditingDescriptionModuleId(null)
  }

  const cancelModuleDescriptionEdit = () => {
    setEditingDescriptionModuleId(null)
  }

  const openAddLessonDialog = (moduleId: string) => {
    setCurrentModuleId(moduleId)
    setEditingLessonId(null)
    setLessonForm({
      title: "",
      content: "",
      video_url: "",
      duration: "",
    })
    setIsLessonDialogOpen(true)
  }

  const openEditLessonDialog = (moduleId: string, lesson: Lesson) => {
    setCurrentModuleId(moduleId)
    setEditingLessonId(lesson.id)
    setLessonForm({
      title: lesson.title,
      content: lesson.content,
      video_url: lesson.video_url,
      duration: lesson.duration,
    })
    setIsLessonDialogOpen(true)
  }

  const handleLessonFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setLessonForm((prev) => ({ ...prev, [name]: value }))
  }

  // Helper to reorder modules by order_index
  const reorderModules = (modules: Module[]): Module[] => {
    const sortedModules = [...modules].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    sortedModules.forEach((mod, idx) => {
      mod.order_index = idx + 1
    })
    return sortedModules
  }

  // Helper to reorder lessons by order_index
  const reorderLessons = (lessons: Lesson[]): Lesson[] => {
    const sortedLessons = [...lessons].sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    sortedLessons.forEach((lesson, idx) => {
      lesson.order_index = idx + 1
    })
    return sortedLessons
  }

  const saveLesson = () => {
    if (!currentModuleId) return
    let updatedModules: Module[] = []
    if (editingLessonId) {
      updatedModules = modules.map((module) =>
        module.id === currentModuleId
          ? {
              ...module,
              lessons: reorderLessons(module.lessons.map((lesson, idx) => {
                if (lesson.id === editingLessonId) {
                  // Update lesson and regenerate ID if needed
                  const newId = `${module.order_index}.${lesson.order_index}`
                  return { ...lesson, ...lessonForm, id: newId }
                }
                // Ensure ID is correct for all lessons
                const correctId = `${module.order_index}.${lesson.order_index}`
                return { ...lesson, id: correctId }
              })),
            }
          : module,
      )
    } else {
      updatedModules = modules.map((module) => {
        if (module.id === currentModuleId) {
          const nextLessonIndex = module.lessons.length + 1
          const newLesson = {
            order_index: nextLessonIndex,
            id: `${module.order_index}.${nextLessonIndex}`,
            ...lessonForm,
          }
          // Reorder all lessons and fix IDs
          const allLessons = reorderLessons([...module.lessons, newLesson]).map((lesson, idx) => ({
            ...lesson,
            order_index: idx + 1,
            id: `${module.order_index}.${idx + 1}`,
          }))
          return {
            ...module,
            lessons: allLessons,
          }
        }
        return module
      })
    }
    setModules(updatedModules)
    syncCourseContentJson(updatedModules)
    setIsLessonDialogOpen(false)
  }

  const deleteModule = (moduleId: string) => {
    const updatedModules = modules.filter((module) => module.id !== moduleId)
    const reordered = reorderModules(updatedModules)
    setModules(reordered)
    syncCourseContentJson(reordered)
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    const updatedModules = modules.map((module) =>
      module.id === moduleId
        ? {
            ...module,
            lessons: reorderLessons(module.lessons.filter((lesson) => lesson.id !== lessonId)),
          }
        : module,
    )
    setModules(updatedModules)
    syncCourseContentJson(updatedModules)
  }

  const addModule = () => {
    const updatedModules = [
      ...modules,
      {
        order_index: modules.length + 1,
        id: `${Date.now()}`,
        title: `Module ${modules.length + 1}`,
        description: "Add a description for this module",
        lessons: [],
      },
    ]
    const reordered = reorderModules(updatedModules)
    setModules(reordered)
    syncCourseContentJson(reordered)
  }

  const handleNextTab = async (nextTab: string) => {
    if (currentTab === "basic") {
      if (!formData.title || !formData.description || !formData.difficulty_level) {
        toast({
          title: "Validation Error ❌",
          description: "Please fill in all required fields in the Basic Info tab, including Difficulty Level.",
          variant: "destructive",
        })
        return
      }

      try {
        setIsSaving(true)

        const formDataInstance = new FormData()
        Object.entries(formData).forEach(([key, value]) => {
          formDataInstance.append(key, value as string)
        })

        let result
        if (courseId) {
          // Still use the function for update (or you can refactor to use API as well)
          formDataInstance.append("courseId", courseId)
                  const res = await fetch("/api/courses/update", {
                    method: "POST",
                    body: formDataInstance,
                  })
                  result = await res.json()
                  if (result?.data) {
                    toast({
                      title: "Success 🎉",
                      description: "Course updated successfully!",
                      variant: "default",
                    })
                  } else {
                    throw new Error(result?.error || "Failed to update course.")
                  }
        } else {
          // Use API endpoint for creation
          const res = await fetch("/api/courses/create", {
            method: "POST",
            body: formDataInstance,
          })
          const data = await res.json()
          result = data
        }

        if (result?.data) {
          toast({
            title: "Success 🎉",
            description: courseId ? "Course updated successfully!" : "Course created successfully!",
            variant: "default",
          })
          if (!courseId) setCourseId(result.data.id)
        } else {
          throw new Error(result?.error?.message || "Failed to save course.")
        }
      } catch (error) {
        console.error("Error saving course:", error)
        toast({
          title: "Error ❌",
          description: "An error occurred while saving the course.",
          variant: "destructive",
        })
        return
      } finally {
        setIsSaving(false)
      }
    }

    if (currentTab === "content") {
      // Save modules/lessons to backend
      if (!courseId) {
        toast({
          title: "Error ❌",
          description: "You must create the course before saving content.",
          variant: "destructive",
        })
        return
      }
      try {
        setIsSaving(true)
        const res = await fetch("/api/courses/update-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId, modules: courseContentJson }),
        })
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        toast({
          title: "Modules Saved 🎉",
          description: "Modules have been saved successfully.",
          variant: "default",
        })
      } catch (error) {
        console.error("Error saving modules:", error)
        toast({
          title: "Error ❌",
          description: "An error occurred while saving modules.",
          variant: "destructive",
        })
        return
      } finally {
        setIsSaving(false)
      }
    }

    if (currentTab === "requirements") {
      try {
        setIsSaving(true)
        const res = await fetch("/api/courses/update-requirements", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            prerequisites: formData.prerequisites,
            target_audience: formData.target_audience,
            learning_objectives: formData.learning_objectives,
          }),
        })
        const data = await res.json()
        if (data.error) {
          throw new Error(data.error)
        }
        toast({
          title: "Requirements Updated 🎉",
          description: "Requirements have been updated successfully.",
          variant: "default",
        })
      } catch (error) {
        console.error("Error updating requirements:", error)
        toast({
          title: "Error ❌",
          description: "An error occurred while updating requirements.",
          variant: "destructive",
        })
        return
      } finally {
        setIsSaving(false)
      }
    }

    setCurrentTab(nextTab)
  }

  const handleSelectChange = (id: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0])
      setFormData((prev) => ({
        ...prev,
        image_url: imageUrl,
      }))
    }
  }

  const handleSubmitSettings = async () => {
    try {
      setIsSaving(true)
      const res = await fetch("/api/courses/update-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId,
          status: formData.status,
          visibility: formData.visibility,
          certificate: formData.certificate,
          additional_resources: formData.additional_resources,
        }),
      })
      const data = await res.json()
      if (data.error) {
        throw new Error(data.error)
      }
      toast({
        title: "Settings Updated 🎉",
        description: "Course settings have been updated successfully.",
        variant: "default",
      })
      router.push("/admin/courses")
    } catch (error) {
      console.error("Error updating settings:", error)
      toast({
        title: "Error ❌",
        description: "An error occurred while updating settings.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold web3-gradient-text">Create New Course</h1>
        <p className="text-muted-foreground mt-2">Design and publish a new educational course</p>
      </div>

      <Tabs defaultValue="basic" value={currentTab} onValueChange={(value) => setCurrentTab(value)}>
        <TabsList className="grid w-full grid-cols-4 border border-purple-500/30 bg-background p-1">
          <TabsTrigger
            value="basic"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-foreground"
          >
            Basic Info
          </TabsTrigger>
          <TabsTrigger
            value="content"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-foreground"
          >
            Content
          </TabsTrigger>
          <TabsTrigger
            value="requirements"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-foreground"
          >
            Requirements
          </TabsTrigger>
          <TabsTrigger
            value="settings"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-foreground"
          >
            Settings
          </TabsTrigger>
        </TabsList>

        <form>
          <TabsContent value="basic">
            <Card className="border border-purple-500/30 shadow-md">
              <CardHeader>
                <CardTitle>Course Information</CardTitle>
                <CardDescription>Provide the basic details about your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Course Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter course title"
                    required
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.title}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Course Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of this course"
                    rows={4}
                    required
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="instructor">Instructor</Label>
                    <Input
                      id="instructor"
                      placeholder="Instructor name"
                      required
                      className="border-purple-500/30 focus:ring-purple-500/30"
                      value={formData.instructor}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      required
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange("category", value)}
                    >
                      <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                       <SelectContent>
                                               <SelectItem value="Coffee Processing">Blockchain</SelectItem>
                                               <SelectItem value="Coffee Cultivation">Coffee Cultivation</SelectItem>
                                               <SelectItem value="Finance & Accounting">Finance & Accounting</SelectItem>
                                               <SelectItem value="Web3 & IT Infrastructure">Web3 & IT Infrastructure</SelectItem>
                                               <SelectItem value="Supply Chain Management">Supply Chain Management</SelectItem>
                                               <SelectItem value="Marketing & Sales">Marketing & Sales</SelectItem>
                                               <SelectItem value="Sustainability & Ethics">Sustainability & Ethics</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="difficulty_level">Difficulty Level</Label>
                    <Select
                      required
                      value={formData.difficulty_level}
                      onValueChange={(value) => handleSelectChange("difficulty_level", value)}
                    >
                      <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      placeholder="e.g., 4 weeks"
                      required
                      className="border-purple-500/30 focus:ring-purple-500/30"
                      value={formData.duration}
                      type="text"
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      defaultValue="english"
                      value={formData.language}
                      onValueChange={(value) => handleSelectChange("language", value)}
                    >
                      <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="portuguese">Portuguese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Cover Image</Label>
                  <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-purple-500/5 transition-colors">
                    {formData.image_url ? (
                      <div className="space-y-4 flex flex-col items-center">
                        <img
                          src={formData.image_url || "/placeholder.svg"}
                          alt="Course cover"
                          className="rounded-md max-h-40 object-cover"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                        >
                          Change Image
                        </Button>
                      </div>
                    ) : (
                      <>
                        <ImageIcon className="h-10 w-10 text-muted-foreground mb-4" />
                        <div className="text-center space-y-2">
                          <p className="text-sm text-muted-foreground">
                            Drag and drop an image here, or click to browse
                          </p>
                          <p className="text-xs text-muted-foreground">Recommended size: 1280x720px (16:9 ratio)</p>
                          <div>
                            <label className="cursor-pointer">
                              <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                              <Button type="button" variant="outline" size="sm">
                                Browse Images
                              </Button>
                            </label>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="blockchain, coffee, farming, etc."
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.tags}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => window.history.back()}
                  className="border-purple-600/30 hover:border-purple-600/60"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="web3-button-purple"
                  onClick={() => handleNextTab("content")}
                >
                  Next: Course Content
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="content">
            <Card className="border border-purple-500/30 shadow-md">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
                <CardDescription>Organize your course into modules and lessons</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Modules</h2>
                  <Button type="button" variant="outline" className="border-purple-500/30" onClick={addModule}>
                    <Plus className="mr-2 h-4 w-4" /> Add Module
                  </Button>
                </div>
                <div className="space-y-6">
                  {reorderModules(modules).map((module) => (
                    <Card key={module.id} className="border border-purple-500/30 shadow-sm hover:shadow-md transition-shadow">
                      <CardHeader className="bg-purple-500/10 py-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            {editingModuleId === module.id ? (
                              <div className="flex gap-2 items-center">
                                <Input
                                  value={editingModuleTitle}
                                  onChange={(e) => setEditingModuleTitle(e.target.value)}
                                  className="bg-transparent border-none focus:outline-none text-lg font-medium w-[300px] focus:border-b focus:border-b-primary/50 p-2"
                                  onBlur={() => saveModuleTitle(module.id)}
                                  onKeyDown={(e) => e.key === "Enter" && saveModuleTitle(module.id)}
                                  autoFocus
                                />
                              </div>
                            ) : (
                              <>
                                <h3 className="text-lg font-medium">
                                  Module {module.order_index}: {module.title}
                                </h3>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleModuleTitleEdit(module.id, module.title)}
                                >
                                  Edit
                                </Button>
                              </>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" className="border-purple-500/30" onClick={() => deleteModule(module.id)}>
                              Delete
                            </Button>
                          </div>
                        </div>
                        <div className="mt-2">
                          {editingDescriptionModuleId === module.id ? (
                            <div className="flex flex-col gap-2">
                              <Textarea
                                value={editingModuleDescription}
                                onChange={(e) => setEditingModuleDescription(e.target.value)}
                                placeholder="Enter module description"
                                className="min-h-[60px] bg-transparent resize-none text-sm border-purple-500/30"
                                autoFocus
                              />
                              <div className="flex justify-end gap-2">
                                <Button size="sm" variant="outline" className="border-purple-500/30" onClick={cancelModuleDescriptionEdit}>
                                  Cancel
                                </Button>
                                <Button size="sm" className="web3-button-purple" onClick={() => saveModuleDescription(module.id)}>
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div
                              className="text-sm text-muted-foreground p-2 hover:bg-purple-500/10 rounded cursor-pointer"
                              onClick={() => handleModuleDescriptionEdit(module.id, module.description)}
                            >
                              {module.description || "Add a description for this module..."}
                            </div>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="py-4">
                        <div className="flex justify-between items-center mb-4">
                          <h4 className="font-medium">Lessons</h4>
                          <Button size="sm" variant="outline" className="border-purple-500/30" onClick={e => { e.preventDefault(); openAddLessonDialog(module.id); }}>
                            <Plus className="mr-2 h-4 w-4" /> Add Lesson
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {reorderLessons(module.lessons).map((lesson) => (
                            <div key={lesson.id} className="flex justify-between items-center p-3 border rounded-md border-purple-500/20">
                              <div>
                                <span className="font-medium">
                                  {module.order_index}.{lesson.order_index} {lesson.title}
                                </span>
                                <div className="text-xs text-muted-foreground mt-1">Duration: {lesson.duration}</div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={e => { e.preventDefault(); openEditLessonDialog(module.id, lesson); }}
                                >
                                  Edit
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteLesson(module.id, lesson.id)}>
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                          {module.lessons.length === 0 && (
                            <div className="text-center py-4 text-muted-foreground">
                              No lessons yet. Click "Add Lesson" to create one.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleNextTab("basic")}
                  className="border-purple-600/30 hover:border-purple-600/60"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="web3-button-purple"
                  onClick={() => handleNextTab("requirements")}
                >
                  Next: Requirements
                </Button>
              </CardFooter>
            </Card>
            <Dialog open={isLessonDialogOpen} onOpenChange={setIsLessonDialogOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>{editingLessonId ? "Edit Lesson" : "Add New Lesson"}</DialogTitle>
                  <DialogDescription>
                    {editingLessonId ? "Update the lesson details below" : "Fill in the details for your new lesson"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={lessonForm.title}
                      onChange={handleLessonFormChange}
                      placeholder="Enter lesson title"
                      className="border-purple-500/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      name="content"
                      value={lessonForm.content}
                      onChange={handleLessonFormChange}
                      placeholder="Enter lesson content or description"
                      rows={4}
                      className="border-purple-500/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="video_url">Video URL</Label>
                    <Input
                      id="video_url"
                      name="video_url"
                      value={lessonForm.video_url}
                      onChange={handleLessonFormChange}
                      placeholder="Enter video URL"
                      className="border-purple-500/30"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={lessonForm.duration}
                      onChange={handleLessonFormChange}
                      placeholder="e.g. 10:00"
                      className="border-purple-500/30"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" className="border-purple-500/30" onClick={() => setIsLessonDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="web3-button-purple" onClick={saveLesson}>{editingLessonId ? "Update Lesson" : "Add Lesson"}</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="requirements">
            <Card className="border border-purple-500/30 shadow-md">
              <CardHeader>
                <CardTitle>Course Requirements</CardTitle>
                <CardDescription>Specify what students need to know before taking this course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="prerequisites">Prerequisites</Label>
                  <Textarea
                    id="prerequisites"
                    placeholder="What should students know before taking this course?"
                    rows={4}
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.prerequisites}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target_audience">Target Audience</Label>
                  <Textarea
                    id="target_audience"
                    placeholder="Who is this course designed for?"
                    rows={4}
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.target_audience}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="learning_objectives">Learning Objectives</Label>
                  <Textarea
                    id="learning_objectives"
                    placeholder="What will students learn by the end of this course?"
                    rows={4}
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.learning_objectives}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleNextTab("content")}
                  className="border-purple-600/30 hover:border-purple-600/60"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="web3-button-purple"
                  onClick={() => handleNextTab("settings")}
                >
                  Next: Settings
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border border-purple-500/30 shadow-md">
              <CardHeader>
                <CardTitle>Course Settings</CardTitle>
                <CardDescription>Configure additional settings for your course</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="status">Publication Status</Label>
                    <Select
                      defaultValue="Draft"
                      value={formData.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Published">Published</SelectItem>
                        <SelectItem value="Scheduled">Scheduled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="visibility">Visibility</Label>
                    <Select
                      defaultValue="public"
                      value={formData.visibility}
                      onValueChange={(value) => handleSelectChange("visibility", value)}
                    >
                      <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="private">Private (Invitation Only)</SelectItem>
                        <SelectItem value="unlisted">Unlisted (Hidden from Browse)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificate">Certificate</Label>
                  <Select
                    defaultValue="yes"
                    value={formData.certificate ? "yes" : "no"}
                    onValueChange={(value) => handleSelectChange("certificate", value === "yes")}
                  >
                    <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Issue Certificate on Completion</SelectItem>
                      <SelectItem value="no">No Certificate</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="additional_resources">Additional Resources</Label>
                  <Textarea
                    id="additional_resources"
                    placeholder="Any additional resources or materials for this course"
                    rows={4}
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.additional_resources}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => handleNextTab("requirements")}
                  className="border-purple-600/30 hover:border-purple-600/60"
                >
                  Back
                </Button>
                <Button
                  className="web3-button-purple"
                  type="button"
                  onClick={() => handleSubmitSettings()}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                      Saving...
                    </>
                  ) : (
                    <>
                       Final: Save Settings
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </form>
      </Tabs>
    </div>
  )
}