import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageSquare, Users, Coffee, Globe, Lightbulb } from "lucide-react"

const upcomingEvents = [
  {
    id: 1,
    title: "Web3 for Coffee Traceability",
    type: "Webinar",
    date: "May 15, 2024",
    time: "3:00 PM UTC",
    speakers: ["Jane Doe", "John Smith"],
  },
  {
    id: 2,
    title: "Community AMA: WAGA Academy Roadmap",
    type: "Live Session",
    date: "May 22, 2024",
    time: "4:00 PM UTC",
    speakers: ["WAGA Team"],
  },
  {
    id: 3,
    title: "Coffee Tokenization: Use Cases & Opportunities",
    type: "Workshop",
    date: "June 5, 2024",
    time: "2:00 PM UTC",
    speakers: ["Alice Johnson", "Bob Williams"],
  },
]

const discussionTopics = [
  {
    id: 1,
    title: "How can blockchain improve coffee farmer incomes?",
    author: "CoffeeChain",
    avatar: "CC",
    replies: 24,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    title: "Summer Camp 2024: What to expect?",
    author: "EthioExplorer",
    avatar: "EE",
    replies: 18,
    lastActive: "5 hours ago",
  },
  {
    id: 3,
    title: "DeFi lending models for smallholder farmers",
    author: "CryptoFarmer",
    avatar: "CF",
    replies: 32,
    lastActive: "1 day ago",
  },
  {
    id: 4,
    title: "Introducing myself: Coffee roaster from Colombia",
    author: "BeanMaster",
    avatar: "BM",
    replies: 15,
    lastActive: "2 days ago",
  },
]

const resources = [
  {
    id: 1,
    title: "Blockchain for Agriculture: A Primer",
    type: "PDF Guide",
    icon: <Globe className="h-8 w-8 text-purple-400" />,
  },
  {
    id: 2,
    title: "Coffee Value Chain Explained",
    type: "Video Series",
    icon: <Coffee className="h-8 w-8 text-blue-400" />,
  },
  {
    id: 3,
    title: "Setting Up a Crypto Wallet",
    type: "Tutorial",
    icon: <Lightbulb className="h-8 w-8 text-teal-400" />,
  },
]

export default function CommunityDashboard() {
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter web3-gradient-text">Community Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the WAGA Early Access Community</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-purple-500/30 hover:border-purple-500/60">
              <Link href="/community/profile">My Profile</Link>
            </Button>
            <Button asChild className="web3-button">
              <Link href="/community/forums">Community Forums</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="web3-card-purple">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Community Members</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">247</div>
              <p className="text-xs text-muted-foreground">Growing every day</p>
            </CardContent>
          </Card>
          <Card className="web3-card-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">In the next 30 days</p>
            </CardContent>
          </Card>
          <Card className="web3-card-teal">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Join the conversation</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 web3-card-featured">
            <CardHeader>
              <CardTitle className="web3-gradient-text">Upcoming Community Events</CardTitle>
              <CardDescription>Join us for these exclusive early access events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingEvents.map((event, index) => {
                  // Assign different background colors based on event type
                  let bgClass = "bg-purple-500/10"
                  if (event.type === "Live Session") bgClass = "bg-blue-500/10"
                  if (event.type === "Workshop") bgClass = "bg-teal-500/10"

                  return (
                    <div key={event.id} className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-purple-500/20">
                      <div className="sm:w-1/4">
                        <div className={`${bgClass} p-4 rounded-md text-center`}>
                          <p className="text-sm font-medium">{event.date}</p>
                          <p className="text-xs text-muted-foreground">{event.time}</p>
                        </div>
                      </div>
                      <div className="sm:w-3/4 space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="font-medium">{event.title}</h3>
                          <Badge variant="outline" className={`${bgClass} border-purple-500/30 text-purple-300`}>
                            {event.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Speakers: {event.speakers.join(", ")}</p>
                        <Button
                          asChild
                          size="sm"
                          variant="outline"
                          className="border-purple-500/30 hover:border-purple-500/60"
                        >
                          <Link href={`/community/events/${event.id}`}>Register</Link>
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-purple-500/30 hover:border-purple-500/60">
                <Link href="/community/events">View All Events</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="web3-card-purple">
            <CardHeader>
              <CardTitle className="web3-gradient-text">Latest Resources</CardTitle>
              <CardDescription>Exclusive content for community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resources.map((resource, index) => {
                  // Assign different card styles based on index
                  const bgClasses = ["bg-purple-500/10", "bg-blue-500/10", "bg-teal-500/10"]
                  const bgClass = bgClasses[index % bgClasses.length]

                  return (
                    <div key={resource.id} className="flex items-start gap-4 pb-4 border-b border-purple-500/20">
                      <div className={`${bgClass} p-2 rounded-md`}>{resource.icon}</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{resource.title}</p>
                        <Badge variant="outline" className={`text-xs ${bgClass} border-purple-500/30 text-purple-300`}>
                          {resource.type}
                        </Badge>
                        <div className="pt-1">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-purple-500/30 hover:border-purple-500/60"
                          >
                            <Link href={`/community/resources/${resource.id}`}>Access</Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-purple-500/30 hover:border-purple-500/60">
                <Link href="/community/resources">View All Resources</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 web3-gradient-text">Active Discussions</h2>
          <div className="space-y-4">
            {discussionTopics.map((topic, index) => {
              // Assign different card styles based on index
              const cardClasses = ["web3-card-purple", "web3-card-blue", "web3-card-teal", "web3-card-pink"]
              const cardClass = cardClasses[index % cardClasses.length]

              return (
                <Card key={topic.id} className={`${cardClass} hover:border-purple-500/40 transition-colors`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={topic.author} />
                          <AvatarFallback className="bg-purple-900/50">{topic.avatar}</AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/community/forums/topics/${topic.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">By {topic.author}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">Last active {topic.lastActive}</span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {topic.replies} replies
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild className="web3-button">
              <Link href="/community/forums">View All Discussions</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

