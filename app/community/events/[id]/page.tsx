"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  ArrowLeft,
  Calendar,
  Clock,
  Users,
  Video,
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Link2,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

// Sample event data - in a real app, this would be fetched based on the ID
const eventData = {
  id: 1,
  title: "Web3 for Coffee Traceability",
  type: "Webinar",
  date: "May 15, 2024",
  time: "3:00 PM UTC",
  duration: "1 hour",
  speakers: [
    {
      name: "Jane Doe",
      role: "Blockchain Specialist",
      avatar: "JD",
      bio: "Jane is a blockchain developer with 5+ years of experience implementing traceability solutions in agricultural supply chains.",
    },
    {
      name: "John Smith",
      role: "Coffee Industry Expert",
      avatar: "JS",
      bio: "John has worked with coffee cooperatives across East Africa to implement digital solutions for quality control and traceability.",
    },
  ],
  description:
    "Learn how blockchain technology can be used to create transparent and traceable coffee supply chains. We'll cover real-world examples and implementation challenges.",
  longDescription: `
    <p>In this webinar, we'll explore how blockchain technology is revolutionizing the coffee industry by enabling unprecedented levels of transparency and traceability from farm to cup.</p>
    
    <p>Our expert speakers will cover:</p>
    
    <ul>
      <li>The challenges of traditional coffee supply chains</li>
      <li>How blockchain addresses these challenges</li>
      <li>Real-world case studies from Ethiopia and Colombia</li>
      <li>Implementation strategies and common pitfalls</li>
      <li>The impact on farmer livelihoods and consumer trust</li>
    </ul>
    
    <p>Whether you're a coffee producer, roaster, retailer, or technology enthusiast, this webinar will provide valuable insights into the future of transparent coffee supply chains.</p>
    
    <p>The webinar will include a Q&A session where attendees can ask questions directly to our speakers.</p>
  `,
  image: "/placeholder.svg?height=400&width=800",
  platform: "Zoom",
  platformLink: "https://zoom.us/j/example",
  registeredCount: 87,
  maxAttendees: 200,
}

export default function EventPage({ params }: { params: { id: string } }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [isRegistering, setIsRegistering] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !name.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setIsRegistering(true)

    // Simulate API call
    setTimeout(() => {
      setIsRegistering(false)
      setIsRegistered(true)
      toast({
        title: "Registration successful!",
        description: "You've been registered for the event. Check your email for details.",
      })
    }, 1000)
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <Link href="/community/events" className="text-primary hover:underline mb-2 inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Events
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-[300px] rounded-xl overflow-hidden web3-card-featured">
                <Image
                  src={eventData.image || "/placeholder.svg"}
                  alt={eventData.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="bg-purple-500/80 text-white border-purple-500/30">{eventData.type}</Badge>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tighter web3-gradient-text">{eventData.title}</h1>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-purple-400" />
                    <span>{eventData.date}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-purple-400" />
                    <span>
                      {eventData.time} • {eventData.duration}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4 text-purple-400" />
                    <span>{eventData.platform}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span>{eventData.registeredCount} registered</span>
                  </div>
                </div>
              </div>

              <Card className="web3-card-purple">
                <CardHeader>
                  <CardTitle>About This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: eventData.longDescription }}
                  />
                </CardContent>
              </Card>

              <Card className="web3-card-blue">
                <CardHeader>
                  <CardTitle>Speakers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {eventData.speakers.map((speaker, index) => (
                      <div key={index} className="flex gap-4">
                        <Avatar className="h-12 w-12 ring-2 ring-blue-500/30">
                          <AvatarImage src={`/placeholder.svg?height=48&width=48`} alt={speaker.name} />
                          <AvatarFallback className="bg-blue-900/50">{speaker.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-medium">{speaker.name}</h3>
                          <p className="text-sm text-blue-300">{speaker.role}</p>
                          <p className="text-sm mt-2">{speaker.bio}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="web3-card-featured">
                <CardHeader>
                  <CardTitle>Register for This Event</CardTitle>
                  <CardDescription>Secure your spot for this exclusive community event</CardDescription>
                </CardHeader>
                <CardContent>
                  {isRegistered ? (
                    <div className="text-center space-y-4">
                      <div className="bg-primary/10 p-4 rounded-md inline-flex mx-auto">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-medium">You're Registered!</h3>
                      <p className="text-sm text-muted-foreground">
                        We've sent the event details to your email. You'll also receive a reminder 24 hours before the
                        event.
                      </p>
                      {eventData.platformLink && (
                        <Button asChild className="mt-4 web3-button" variant="outline">
                          <Link href={eventData.platformLink} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="mr-2 h-4 w-4" /> Join Event Platform
                          </Link>
                        </Button>
                      )}
                    </div>
                  ) : (
                    <form onSubmit={handleRegister} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Full Name
                        </label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Enter your full name"
                          className="web3-input"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">
                          Email
                        </label>
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Enter your email"
                          className="web3-input"
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full web3-button" disabled={isRegistering}>
                        {isRegistering ? "Registering..." : "Register Now"}
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        {eventData.registeredCount} out of {eventData.maxAttendees} spots filled
                      </p>
                    </form>
                  )}
                </CardContent>
              </Card>

              <Card className="web3-card-teal">
                <CardHeader>
                  <CardTitle>Share This Event</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-teal-500/30 hover:border-teal-500/60 bg-teal-500/10"
                    >
                      <Twitter className="h-4 w-4 text-teal-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-teal-500/30 hover:border-teal-500/60 bg-teal-500/10"
                    >
                      <Linkedin className="h-4 w-4 text-teal-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-teal-500/30 hover:border-teal-500/60 bg-teal-500/10"
                    >
                      <Facebook className="h-4 w-4 text-teal-400" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-teal-500/30 hover:border-teal-500/60 bg-teal-500/10"
                    >
                      <Link2 className="h-4 w-4 text-teal-400" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="web3-card-pink">
                <CardHeader>
                  <CardTitle>Related Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-pink-500/10 p-2 rounded-md">
                      <Calendar className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <Link href="/community/events/2" className="text-sm font-medium hover:text-primary">
                        Community AMA: WAGA Academy Roadmap
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">May 22, 2024</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="bg-pink-500/10 p-2 rounded-md">
                      <Calendar className="h-4 w-4 text-pink-400" />
                    </div>
                    <div>
                      <Link href="/community/events/3" className="text-sm font-medium hover:text-primary">
                        Coffee Tokenization: Use Cases & Opportunities
                      </Link>
                      <p className="text-xs text-muted-foreground mt-1">June 5, 2024</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

