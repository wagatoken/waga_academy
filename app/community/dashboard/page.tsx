import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MessageSquare, Users, Coffee, Globe } from "lucide-react"
import { createServerClientInstance } from "@/lib/supabase/server"
import { getUpcomingEvents, MinimalEvent } from "@/lib/services/event-service"

// Fetch resources from the database
async function getResources() {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from("resources")
    .select(`
      id,
      title,
      description,
      resource_type,
      file_url,
      thumbnail_url,
      created_at,
      created_by
    `)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching resources:", error)
    return []
  }

  return data || []
}
// Fetch discussion topics
async function getDiscussionTopics() {
  const supabase = await createServerClientInstance()

  const { data, error } = await supabase
    .from("forum_topics")
    .select(`
      id,
      title,
      created_at,
      user_id:profiles(id, first_name, last_name, avatar_url)
    `)
    .order("created_at", { ascending: false })
    .limit(3)

  if (error) {
    console.error("Error fetching discussion topics:", error)
    return []
  }

  return data || []
}

// Get community member count
// async function getCommunityMemberCount() {
//   const supabase = await createServerClientInstance()

//   const { count, error } = await supabase.from("profiles").select("*", { count: "exact", head: true })

//   if (error) {
//     console.error("Error fetching member count:", error)
//     return 0
//   }

//   return count || 0
// }

async function getStats(){
   const supabase = await createServerClientInstance()
  const { data, error } = await supabase.from("community_stats").select("*").single();
  if (error) {
    console.error("Error fetching stats")
    return 0
  }

  return data
  
}
export default async function CommunityDashboard() {
  // Fetch data
  const [resources, discussionTopics, stats] = await Promise.all([
    getResources(),
    getDiscussionTopics(),
    getStats(),
  ])

  const {data: upcomingEvents} = await getUpcomingEvents();
  const { member_count=0, upcoming_event_count=0, discussion_count=0 } = stats || {};
  
  // Fallback data if no resources are found
  const resourcesData =
    resources.length > 0
      ? resources
      : [
          {
            id: 1,
            title: "Getting Started with WAGA Academy",
            resource_type: "Guide",
            icon: <Globe className="h-8 w-8 text-purple-400" />,
          },
          {
            id: 2,
            title: "Introduction to Blockchain",
            resource_type: "Coming Soon",
            icon: <Coffee className="h-8 w-8 text-blue-400" />,
          },
        ]

  // Fallback data if no events are found


  // Fallback data if no discussion topics are found
  const topicsData =
    discussionTopics.length > 0
      ? discussionTopics
      : [
          {
            id: 1,
            title: "Welcome to the WAGA Academy Community",
            author: "WAGATeam",
            avatar: "WT",
            replies: 0,
            lastActive: "Just now",
          },
        ]

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter web3-dual-gradient-text-glow">Community Dashboard</h1>
            <p className="text-muted-foreground">Welcome to the WAGA Academy Community</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-purple-600/30 hover:border-purple-600/60">
              <Link href="/community/profile">My Profile</Link>
            </Button>
            <Button asChild className="web3-button-purple">
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
              <div className="text-2xl font-bold">{member_count || 1}</div>
              <p className="text-xs text-muted-foreground">
                {member_count > 1 ? "Active members and growing!" : "You're the first one here!"}
              </p>
            </CardContent>
          </Card>
          <Card className="web3-card-blue">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
              <Calendar className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{upcoming_event_count}</div>
               <p className="text-xs text-muted-foreground">
                {upcoming_event_count > 0 ? "Exciting events ahead!" : "No events yet. Stay tuned!"}
                </p>
            </CardContent>
          </Card>
          <Card className="web3-card-teal">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Discussions</CardTitle>
              <MessageSquare className="h-4 w-4 text-teal-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{discussion_count}</div>
               <p className="text-xs text-muted-foreground">
                  {discussion_count > 0 ? "Discussion happening now!!" : "Start a new discussion!"}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 web3-card-featured">
            <CardHeader>
              <CardTitle className="web3-gradient-text">Upcoming Community Events</CardTitle>
              <CardDescription>Join us for these exclusive events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event: MinimalEvent, index: number) => {
                  // Assign different background colors based on event type
                  let bgClass = "bg-purple-500/10"
                  if (event.is_virtual === false) bgClass = "bg-blue-500/10"

                  // Format date and time
                  let dateDisplay = "Coming Soon"
                  let timeDisplay = "To be announced"

                  if (event.date_time) {
                    const date = new Date(event.date_time)
                    dateDisplay = date.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    })
                    timeDisplay = date.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    })
                  }

                  return (
                    <div key={event.id} className="flex flex-col sm:flex-row gap-4 pb-4 border-b border-purple-500/20">
                    <div className="sm:w-1/4">
                      <div className={`${bgClass} p-4 rounded-md text-center`}>
                      <p className="text-sm font-medium">{dateDisplay}</p>
                      <p className="text-xs text-muted-foreground">{timeDisplay}</p>
                      </div>
                    </div>
                    <div className="sm:w-3/4 space-y-2">
                      <div className="flex justify-between items-start">
                      <h3 className="font-medium">{event.title}</h3>
                      <Badge variant="outline" className={`${bgClass} border-purple-500/30 text-purple-300`}>
                        {event.is_virtual ? "Virtual" : "In Person"}
                      </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                      {event.description
                        ? event.description.substring(0, 100) + "..."
                        : "Join us for this exciting event!"}
                      </p>
                      <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="border-purple-600/30 hover:border-purple-600/60"
                      >
                      <Link href={`/community/events/${event.id}`}>
                        {new Date(event.date_time) > new Date() ? "Register Now" : "Stay Tuned"}
                      </Link>
                      </Button>
                    </div>
                    </div>
                  )
                  })
                ) : (
                  <div className="text-center text-sm text-muted-foreground">
                  No upcoming events. Stay tuned for updates!
                  </div>
                )}

              
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild variant="outline" className="w-full border-purple-600/30 hover:border-purple-600/60">
                <Link href="/community/events">View All Events</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="web3-card-purple">
            <CardHeader>
              <CardTitle className="web3-gradient-text">Latest Resources</CardTitle>
              <CardDescription>Content for community members</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resourcesData.map((resource, index) => {
                  // Assign different card styles based on index
                  const bgClasses = ["bg-purple-500/10", "bg-blue-500/10", "bg-teal-500/10"]
                  const bgClass = bgClasses[index % bgClasses.length]

                  // Determine icon based on resource type
                  let icon = <Globe className="h-8 w-8 text-purple-400" />
                  if (resource.resource_type === "Video") icon = <Coffee className="h-8 w-8 text-blue-400" />
                  if (resource.resource_type === "PDF") icon = <Coffee className="h-8 w-8 text-teal-400" />

                  // Use provided icon if available
                  if (resource.icon) icon = resource.icon

                  return (
                    <div key={resource.id} className="flex items-start gap-4 pb-4 border-b border-purple-500/20">
                      <div className={`${bgClass} p-2 rounded-md`}>{icon}</div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{resource.title}</p>
                        <Badge variant="outline" className={`text-xs ${bgClass} border-purple-500/30 text-purple-300`}>
                          {resource.resource_type || "Resource"}
                        </Badge>
                        <div className="pt-1">
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="border-purple-600/30 hover:border-purple-600/60"
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
              <Button asChild variant="outline" className="w-full border-purple-600/30 hover:border-purple-600/60">
                <Link href="/community/resources">View All Resources</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-6 web3-gradient-text">Community Discussions</h2>
          <div className="space-y-4">
            {topicsData.map((topic, index) => {
              // Assign different card styles based on index
              const cardClasses = ["web3-card-purple", "web3-card-blue", "web3-card-teal", "web3-card-pink"]
              const cardClass = cardClasses[index % cardClasses.length]

              // Get author info
              const author = topic.user_id
                ? `${topic.user_id.first_name || ""} ${topic.user_id.last_name || ""}`.trim()
                : topic.author || "WAGA Team"

              // Get avatar
              const avatar = topic.user_id?.avatar_url || topic.avatar || author.substring(0, 2)

              return (
                <Card key={topic.id} className={`${cardClass} hover:border-purple-500/40 transition-colors`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                          <AvatarImage
                            src={typeof avatar === "string" ? avatar : `/placeholder.svg?height=40&width=40`}
                            alt={author}
                          />
                          <AvatarFallback className="bg-purple-900/50">
                            {typeof avatar === "string" ? avatar.substring(0, 2).toUpperCase() : "WT"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/community/forums/topics/${topic.id}`}
                            className="font-medium hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">By {author}</span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {topic.created_at
                                ? `Posted on ${new Date(topic.created_at).toLocaleDateString()}`
                                : topic.lastActive || "Just now"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {topic.replies || 0} replies
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          <div className="mt-6 flex justify-center">
            <Button asChild className="web3-button-purple">
              <Link href="/community/forums/new">Start a Discussion</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
