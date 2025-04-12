"use server"

import { sendWelcomeEmail, sendCourseEnrollmentEmail } from "@/lib/email/send-email"
import { z } from "zod"

// Schema for welcome email
const welcomeEmailSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  verifyLink: z.string().url().optional(),
})

// Schema for course enrollment email
const courseEnrollmentEmailSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  courseName: z.string().min(1),
  courseLink: z.string().url(),
  startDate: z.string().optional(),
})

// Send welcome email action
export async function sendWelcomeEmailAction(data: z.infer<typeof welcomeEmailSchema>) {
  try {
    // Validate the data
    const validatedData = welcomeEmailSchema.parse(data)

    // Send the email
    const success = await sendWelcomeEmail({
      to: validatedData.email,
      firstName: validatedData.firstName,
      verifyLink: validatedData.verifyLink,
    })

    return { success, message: success ? "Welcome email sent successfully" : "Failed to send welcome email" }
  } catch (error) {
    console.error("Error sending welcome email:", error)
    return { success: false, message: "Failed to send welcome email" }
  }
}

// Send course enrollment email action
export async function sendCourseEnrollmentEmailAction(data: z.infer<typeof courseEnrollmentEmailSchema>) {
  try {
    // Validate the data
    const validatedData = courseEnrollmentEmailSchema.parse(data)

    // Send the email
    const success = await sendCourseEnrollmentEmail({
      to: validatedData.email,
      firstName: validatedData.firstName,
      courseName: validatedData.courseName,
      courseLink: validatedData.courseLink,
      startDate: validatedData.startDate,
    })

    return { success, message: success ? "Enrollment email sent successfully" : "Failed to send enrollment email" }
  } catch (error) {
    console.error("Error sending enrollment email:", error)
    return { success: false, message: "Failed to send enrollment email" }
  }
}
