"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/hooks/use-toast"
import { Bell, Wallet } from "lucide-react"
import { useWallet } from "@/context/wallet-context"
import { Badge } from "@/components/ui/badge"

// Update the component to use the wallet state
export function CourseWaitlist({ courseName }: { courseName: string }) {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { isConnected, address, openConnectModal } = useWallet()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Added to waitlist!",
        description: `You'll be notified when "${courseName}" becomes available.`,
      })
      setEmail("")
      setIsSubmitting(false)
    }, 1000)
  }

  const handleWalletSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call with wallet address
    setTimeout(() => {
      toast({
        title: "Added to waitlist!",
        description: `Your wallet (${address?.slice(0, 6)}...${address?.slice(-4)}) has been added to the waitlist for "${courseName}".`,
      })
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <Card className="web3-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <CardTitle>Join the Waitlist</CardTitle>
        </div>
        <CardDescription>Be the first to know when this course becomes available</CardDescription>
      </CardHeader>
      <CardContent>
        {isConnected && address ? (
          <div className="space-y-4">
            <div className="p-3 bg-purple-500/10 rounded-md border border-purple-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-4 w-4 text-purple-400" />
                <span className="text-sm">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </span>
              </div>
              <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Connected
              </Badge>
            </div>
            <Button className="w-full web3-button" disabled={isSubmitting} onClick={handleWalletSubmit}>
              {isSubmitting ? "Adding you to waitlist..." : "Join Waitlist with Wallet"}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You'll receive updates via your connected wallet
            </p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="web3-input"
                />
              </div>
              <Button type="submit" className="w-full web3-button" disabled={isSubmitting}>
                {isSubmitting ? "Adding you to waitlist..." : "Join Waitlist"}
              </Button>
            </form>
            <div className="mt-4 pt-4 border-t border-purple-500/20">
              <p className="text-xs text-center text-muted-foreground mb-3">
                Or join with your wallet for exclusive benefits
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-500/30 hover:border-purple-500/60"
                onClick={openConnectModal}
              >
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        We'll only use your information to notify you about this course.
      </CardFooter>
    </Card>
  )
}

