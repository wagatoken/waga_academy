"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface Lesson {
  title: string
  duration: string
}

interface Module {
  title: string
  lessons: Lesson[]
}

interface CourseCurriculumExpandedProps {
  modules: Module[]
}

export function CourseCurriculumExpanded({ modules }: CourseCurriculumExpandedProps) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-bold web3-dual-gradient-text-glow">Course Curriculum</h2>
        <div className="text-xs sm:text-sm text-gray-800 dark:text-muted-foreground flex flex-row gap-1 sm:gap-2 items-center">
          <span className="font-medium">{modules.reduce((total, module) => total + module.lessons.length, 0)}</span>{" "}
          <span>lessons</span>
          <span className="mx-1">•</span>
          <span className="font-medium">
            {Math.round(
              modules.reduce(
                (total, module) =>
                  total +
                  module.lessons.reduce((sum, lesson) => sum + Number.parseInt(lesson.duration.split(" ")[0]), 0),
                0,
              ) / 60,
            )}
          </span>{" "}
          <span>hours</span>
        </div>
      </div>

      {modules.map((module, moduleIndex) => (
        <Card
          key={moduleIndex}
          className="web3-card-animated backdrop-blur-md border-emerald-500/30 hover:border-purple-500/30 transition-all duration-500"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-base web3-dual-gradient-text-enhanced">{module.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {module.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lessonIndex}
                  className="flex flex-col sm-flex-row justify-between items-center p-3 rounded-md hover:bg-gradient-to-r hover:from-emerald-500/5 hover:to-purple-500/5 border border-emerald-500/10 hover:border-purple-500/20 transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full flex items-center justify-center border border-emerald-500/30 animate-purpleEmeraldPulse">
                      <span className="text-xs text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-purple-400">
                        {lessonIndex + 1}
                      </span>
                    </div>
                    <span className="group-hover:text-emerald-300 transition-colors duration-300">{lesson.title}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-800 dark:text-muted-foreground">
                    <Clock className="h-3 w-3 text-emerald-400 group-hover:text-purple-400 transition-colors duration-300" />
                    <span>{lesson.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
