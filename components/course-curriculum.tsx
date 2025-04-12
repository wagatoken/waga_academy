"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Clock } from "lucide-react"

interface Lesson {
  title: string
  duration: string
}

interface Module {
  title: string
  lessons: Lesson[]
}

interface CourseCurriculumProps {
  modules: Module[]
}

export function CourseCurriculum({ modules }: CourseCurriculumProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold web3-gradient-text">Course Curriculum</h2>
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{modules.reduce((total, module) => total + module.lessons.length, 0)}</span>{" "}
          lessons •{" "}
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
          hours
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {modules.map((module, moduleIndex) => (
          <AccordionItem
            key={moduleIndex}
            value={`module-${moduleIndex}`}
            className="web3-card-glass mb-2 border-emerald-500/30 hover-lift"
          >
            <AccordionTrigger className="px-2">
              <div className="flex justify-between items-center w-full pr-4">
                <span className="text-base web3-gradient-text">{module.title}</span>
                <span className="text-sm text-muted-foreground">{module.lessons.length} lessons</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pt-2">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lessonIndex}
                    className="flex justify-between items-center p-3 rounded-md hover:bg-emerald-500/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center border border-emerald-500/30"></div>
                      <span>{lesson.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3 icon-emerald" />
                      <span>{lesson.duration}</span>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
