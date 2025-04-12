"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  const router = useRouter()

  return (
    <div className="container max-w-4xl py-12">
      <Card className="web3-card border-none shadow-lg bg-black/60 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          <div className="prose prose-emerald dark:prose-invert">
            <p>
              Your privacy is important to us. It is WAGA Academy's policy to respect your privacy regarding any
              information we may collect from you across our website and other sites we own and operate.
            </p>

            <h2>1. Information We Collect</h2>
            <p>We collect information in the following ways:</p>
            <ul>
              <li>
                <strong>Information you provide to us directly:</strong> We may ask for certain information such as your
                username, real name, email address, and date of birth when you register for a WAGA Academy account, or
                if you correspond with us.
              </li>
              <li>
                <strong>Information we collect automatically:</strong> We may automatically collect certain information
                about the computer or devices you use to access our Services, including mobile devices, through commonly
                used technologies.
              </li>
            </ul>

            <h2>2. Use of Information</h2>
            <p>We use the information we collect in various ways, including to:</p>
            <ul>
              <li>Provide, operate, and maintain our Services</li>
              <li>Improve, personalize, and expand our Services</li>
              <li>Understand and analyze how you use our Services</li>
              <li>Develop new products, services, features, and functionality</li>
              <li>
                Communicate with you, either directly or through one of our partners, including for customer service, to
                provide you with updates and other information relating to the Service, and for marketing and
                promotional purposes
              </li>
              <li>Send you emails</li>
              <li>Find and prevent fraud</li>
            </ul>

            <h2>3. Security</h2>
            <p>
              We value your trust in providing us your personal information, thus we are striving to use commercially
              acceptable means of protecting it. But remember that no method of transmission over the internet, or
              method of electronic storage is 100% secure and reliable, and we cannot guarantee its absolute security.
            </p>

            <h2>4. Cookies</h2>
            <p>
              We use cookies and similar tracking technologies to track the activity on our Service and hold certain
              information. Cookies are files with small amount of data which may include an anonymous unique identifier.
            </p>
            <p>
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However,
              if you do not accept cookies, you may not be able to use some portions of our Service.
            </p>

            <h2>5. Third-Party Services</h2>
            <p>We may employ third-party companies and individuals due to the following reasons:</p>
            <ul>
              <li>To facilitate our Service;</li>
              <li>To provide the Service on our behalf;</li>
              <li>To perform Service-related services; or</li>
              <li>To assist us in analyzing how our Service is used.</li>
            </ul>
            <p>
              These third parties have access to your Personal Data only to perform these tasks on our behalf and are
              obligated not to disclose or use it for any other purpose.
            </p>

            <h2>6. Children's Privacy</h2>
            <p>
              Our Service does not address anyone under the age of 13. We do not knowingly collect personally
              identifiable information from children under 13. If you are a parent or guardian and you are aware that
              your child has provided us with personal data, please contact us.
            </p>

            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page. You are advised to review this Privacy Policy periodically for any changes.
            </p>

            <h2>8. Contact Us</h2>
            <p>If you have any questions about this Privacy Policy, please contact us at privacy@wagaacademy.org.</p>
          </div>
          <div className="mt-8">
            <Button onClick={() => router.back()} variant="outline" className="web3-button">
              Go Back
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
