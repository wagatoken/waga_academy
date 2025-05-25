"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/toast"

interface CourseWaitlistProps {
  courseId: string;
  courseName?: string;
  isWaitlisted?: boolean;
}

export function CourseWaitlist({ courseId, courseName, isWaitlisted }: CourseWaitlistProps) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(!!isWaitlisted)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const res = await fetch("/api/courses/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, course_id: courseId, message }),
      })
      const data = await res.json()
      // Show a specific error if missing required fields (400 or 200)
      const errorMsg = typeof data.error === 'string' ? data.error : '';
      // Show a specific error if missing required fields
      if ((res.status === 400 || res.status === 200) && errorMsg.toLowerCase().includes('missing')) {
        toast({
          title: "Missing Information",
          description: errorMsg || data.message,
          variant: "destructive",
        })
        setIsSubmitting(false)
        return
      }
      // Show a toast if already registered (duplicate email/user)
      if ((res.status === 400 || res.status === 200) && errorMsg.toLowerCase().includes('already')) {
        toast({
          title: "Already Registered",
          description: errorMsg || data.message,
          variant: "default",
        })
        setIsSubmitted(true)
        setIsSubmitting(false)
        return
      }
      if (!res.ok || data.error) {
        toast({
          title: "Failed to join waitlist 😕",
          description: errorMsg || data.message || "Failed to join waitlist",
          variant: "default",
        })
        setIsSubmitting(false)
        return
      }

      setIsSubmitted(true)
      toast({
        title: "Success!",
        description: data.message || "You've been added to the waitlist. We'll notify you when the course is available.",
      })
    } catch (error) {
      // Handle error gracefully
      toast({
        title: "Something went wrong",
        description: "Please try again later",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="web3-card-glass hover-lift">
      <CardHeader className="card-header-gradient">
        <CardTitle>Join the Waitlist</CardTitle>
        <CardDescription>Be the first to know when this course launches</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        {isSubmitted ? (
          <div className="text-center space-y-4">
            <div className="bg-emerald-500/10 p-4 rounded-full inline-flex mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-emerald-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h3 className="font-medium">You're on the list!</h3>
            <p className="text-sm text-muted-foreground">
              We'll notify you when this course becomes available. In the meantime, check out our other courses.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="web3-input-glow focus-emerald"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="web3-input-glow focus-emerald"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us why you're interested in this course"
                className="web3-input-glow focus-emerald"
              />
            </div>
            <Button type="submit" className="w-full web3-button-purple" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Join Waitlist"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  )
}
