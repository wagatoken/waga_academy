import type * as React from "react"
import { EmailLayout } from "./components/email-layout"

interface WelcomeEmailProps {
  firstName: string
  verifyLink?: string
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({ firstName, verifyLink }) => {
  return (
    <EmailLayout>
      <h1>Welcome to WAGA Academy!</h1>
      <p>Hello {firstName},</p>
      <p>
        Thank you for joining WAGA Academy! We're excited to have you as part of our community dedicated to empowering
        the future of coffee through Web3 and blockchain technology.
      </p>
      <p>Here's what you can do next:</p>
      <ul>
        <li>Explore our courses on blockchain, coffee cultivation, and more</li>
        <li>Join our community forums to connect with other members</li>
        <li>Check out upcoming events and webinars</li>
      </ul>
      {verifyLink && (
        <div className="align-center" style={{ marginTop: "25px", marginBottom: "25px" }}>
          <a href={verifyLink} className="btn btn-primary">
            Verify Your Email
          </a>
        </div>
      )}
      <p>
        If you have any questions or need assistance, please don't hesitate to contact us at{" "}
        <a href="mailto:support@wagatoken.io">support@wagatoken.io</a>.
      </p>
      <p>
        Best regards,
        <br />
        The WAGA Academy Team
      </p>
    </EmailLayout>
  )
}
