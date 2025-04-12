import nodemailer from "nodemailer"
import { renderToStaticMarkup } from "react-dom/server"
import { WelcomeEmail } from "@/emails/welcome-email"
import { CourseEnrollmentEmail } from "@/emails/course-enrollment"

// Configure the email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number.parseInt(process.env.EMAIL_PORT || "587"),
    secure: process.env.EMAIL_SECURE === "true",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  })
}

// Generic send email function
const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<boolean> => {
  try {
    const transporter = createTransporter()

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"WAGA Academy" <noreply@wagatoken.io>',
      to,
      subject,
      html,
    })

    console.log("Email sent:", info.messageId)
    return true
  } catch (error) {
    console.error("Error sending email:", error)
    return false
  }
}

// Send welcome email
export const sendWelcomeEmail = async ({
  to,
  firstName,
  verifyLink,
}: {
  to: string
  firstName: string
  verifyLink?: string
}): Promise<boolean> => {
  const emailHtml = renderToStaticMarkup(<WelcomeEmail firstName={firstName} verifyLink={verifyLink} />)

  return sendEmail({
    to,
    subject: "Welcome to WAGA Academy!",
    html: emailHtml,
  })
}

// Send course enrollment email
export const sendCourseEnrollmentEmail = async ({
  to,
  firstName,
  courseName,
  courseLink,
  startDate,
}: {
  to: string
  firstName: string
  courseName: string
  courseLink: string
  startDate?: string
}): Promise<boolean> => {
  const emailHtml = renderToStaticMarkup(
    <CourseEnrollmentEmail
      firstName={firstName}
      courseName={courseName}
      courseLink={courseLink}
      startDate={startDate}
    />,
  )

  return sendEmail({
    to,
    subject: `Enrollment Confirmation: ${courseName}`,
    html: emailHtml,
  })
}
