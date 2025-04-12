import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="container flex flex-col items-center justify-center min-h-[80vh] py-12 text-center">
      <div className="space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-red-500/10">
            <Shield className="h-16 w-16 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl web3-gradient-text">Access Denied</h1>

        <p className="text-muted-foreground">
          You don't have permission to access this page. If you believe this is an error, please contact the
          administrator.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button asChild className="web3-button">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline" className="web3-button-outline">
            <Link href="/contact">Contact Support</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
