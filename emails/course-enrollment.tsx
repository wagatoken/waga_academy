import type * as React from "react"
import { EmailLayout } from "./components/email-layout"

interface CourseEnrollmentEmailProps {
  firstName: string
  courseName: string
  courseLink: string
  startDate?: string
}

export const CourseEnrollmentEmail: React.FC<CourseEnrollmentEmailProps> = ({
  firstName,
  courseName,
  courseLink,
  startDate,
}) => {
  return (
    <EmailLayout>
      <h1>Course Enrollment Confirmation</h1>
      <p>Hello {firstName},</p>
      <p>
        Congratulations! You have successfully enrolled in <strong>{courseName}</strong>.
      </p>
      {startDate && (
        <p>
          The course will begin on <strong>{startDate}</strong>. We'll send you a reminder as the date approaches.
        </p>
      )}
      <p>Here's what you can expect:</p>
      <ul>
        <li>Access to all course materials and resources</li>
        <li>Interactive learning experiences with practical examples</li>
        <li>Community discussions with fellow students and instructors</li>
        <li>Certificates upon successful completion</li>
      </ul>
      <div className="align-center" style={{ marginTop: "25px", marginBottom: "25px" }}>
        <a href={courseLink} className="btn btn-primary">
          Access Your Course
        </a>
      </div>
      <p>
        If you have any questions about the course or need technical assistance, please contact us at{" "}
        <a href="mailto:courses@wagatoken.io">courses@wagatoken.io</a>.
      </p>
      <p>
        Happy learning!
        <br />
        The WAGA Academy Team
      </p>
    </EmailLayout>
  )
}
