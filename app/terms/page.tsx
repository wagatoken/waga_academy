"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  const router = useRouter()

  return (
    <div className="container max-w-4xl py-12">
      <Card className="web3-card border-none shadow-lg bg-black/60 backdrop-blur-sm">
        <CardContent className="p-6 md:p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          <div className="prose prose-emerald dark:prose-invert">
            <p>
              Welcome to WAGA Academy. By accessing our website, you agree to be bound by these Terms of Service, all
              applicable laws and regulations, and agree that you are responsible for compliance with any applicable
              local laws.
            </p>

            <h2>1. Use License</h2>
            <p>
              Permission is granted to temporarily access the materials on WAGA Academy's website for personal,
              non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under
              this license you may not:
            </p>
            <ul>
              <li>modify or copy the materials;</li>
              <li>use the materials for any commercial purpose;</li>
              <li>attempt to decompile or reverse engineer any software contained on WAGA Academy's website;</li>
              <li>remove any copyright or other proprietary notations from the materials; or</li>
              <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
            </ul>

            <h2>2. Disclaimer</h2>
            <p>
              The materials on WAGA Academy's website are provided on an 'as is' basis. WAGA Academy makes no
              warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without
              limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
              non-infringement of intellectual property or other violation of rights.
            </p>

            <h2>3. Limitations</h2>
            <p>
              In no event shall WAGA Academy or its suppliers be liable for any damages (including, without limitation,
              damages for loss of data or profit, or due to business interruption) arising out of the use or inability
              to use the materials on WAGA Academy's website, even if WAGA Academy or a WAGA Academy authorized
              representative has been notified orally or in writing of the possibility of such damage.
            </p>

            <h2>4. Accuracy of Materials</h2>
            <p>
              The materials appearing on WAGA Academy's website could include technical, typographical, or photographic
              errors. WAGA Academy does not warrant that any of the materials on its website are accurate, complete or
              current. WAGA Academy may make changes to the materials contained on its website at any time without
              notice. However WAGA Academy does not make any commitment to update the materials.
            </p>

            <h2>5. Links</h2>
            <p>
              WAGA Academy has not reviewed all of the sites linked to its website and is not responsible for the
              contents of any such linked site. The inclusion of any link does not imply endorsement by WAGA Academy of
              the site. Use of any such linked website is at the user's own risk.
            </p>

            <h2>6. Modifications</h2>
            <p>
              WAGA Academy may revise these terms of service for its website at any time without notice. By using this
              website you are agreeing to be bound by the then current version of these terms of service.
            </p>

            <h2>7. Governing Law</h2>
            <p>
              These terms and conditions are governed by and construed in accordance with the laws of Ethiopia and you
              irrevocably submit to the exclusive jurisdiction of the courts in that location.
            </p>
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
