"use server"

import { createServerClient } from "@/lib/supabase/server"
import { z } from "zod"

// Define the schema for validation
const volunteerFormSchema = z.object({
  role: z.enum(["trainer", "trainee"], {
    required_error: "Please select a role",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 characters.",
  }),
  country: z.string().min(2, {
    message: "Please select your country.",
  }),
  expertise: z.string().optional(),
  availability: z.string({
    required_error: "Please select your availability",
  }),
  motivation: z.string().min(50, {
    message: "Motivation must be at least 50 characters.",
  }),
  experience: z.string().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
})

export type VolunteerFormValues = z.infer<typeof volunteerFormSchema>

export async function submitCampRegistration(formData: VolunteerFormValues) {
  try {
    // Validate the form data
    const validatedData = volunteerFormSchema.parse(formData)

    // Create a Supabase client
    const supabase = createServerClient()

    // Insert the registration into the database
    const { data, error } = await supabase
      .from("camp_registrations")
      .insert({
        role: validatedData.role,
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        phone: validatedData.phone,
        country: validatedData.country,
        expertise: validatedData.expertise || null,
        availability: validatedData.availability,
        motivation: validatedData.motivation,
        experience: validatedData.experience || null,
        status: "pending",
      })
      .select()
    if (error) {
      console.error("Error submitting registration:", error)
      return {
        success: false,
        message: "Failed to submit your registration. Please try again.",
      }
    }

    return {
      success: true,
      message: "Your registration has been submitted successfully! We'll be in touch soon.",
      data,
    }
  } catch (error) {
    console.error("Error in submitCampRegistration:", error)
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form inputs and try again.",
        errors: error.errors,
      }
    }

    return {
      success: false,
      message: "An unexpected error occurred. Please try again later.",
    }
  }
}
