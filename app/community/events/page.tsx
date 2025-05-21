export const runtime = 'edge'

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Video, Clock } from "lucide-react"
import { getUpcomingEvents, getPastEvents } from "@/lib/services/event-service"



export default async function CommunityEventsPage() {
  const fetchEvents = async (type, limit) => {
    const res = await fetch(`/api/events?type=${type}&limit=${limit}`);
    if (!res.ok) {
      console.error(`Failed to fetch ${type} events:`, res.statusText);
      return [];
    }
    return res.json();
  };
  
  const upcomingEvents = await fetchEvents("upcoming", 6);
  const pastEvents = await fetchEvents("past", 6);

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter web3-dual-gradient-text-glow">Community Events</h1>
            <p className="text-muted-foreground">Join exclusive webinars, workshops, and discussions</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-purple-600/30 hover:border-purple-600/60">
              <Link href="/community/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="web3-button-purple">
              <Link href="/community/events/calendar">Calendar View</Link>
            </Button>
          </div>
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event, index) => {
                // Assign different card styles based on type
                let cardClass = "web3-card"
                if (event.type === "Webinar") cardClass = "web3-card-purple"
                else if (event.type === "Live Session") cardClass = "web3-card-blue"
                else if (event.type === "Workshop") cardClass = "web3-card-teal"
                else cardClass = "web3-card-pink"

                return (
                  <Card
                    key={event.slug}
                    className={`${cardClass} flex flex-col h-full hover:border-purple-500/40 transition-colors`}
                  >
                    <div className="relative h-48 w-full">
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-white">{event.type}</Badge>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                      <CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {(() => {
                              let dateDisplay = "Coming Soon";
                              if (event.date_time) {
                                const date = new Date(event.date_time);
                                dateDisplay = date.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              }
                              return dateDisplay;
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {(() => {
                              let timeDisplay = "To be announced";
                              if (event.date_time) {
                                const date = new Date(event.date_time);
                                timeDisplay = date.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              }
                              return `${timeDisplay} • ${event.duration}`;
                            })()}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                      <div className="mt-4">
                        <p className="text-sm font-medium">Speakers:</p>
                        <div className="flex items-center gap-2 mt-1">
                                            
                          {event.speakers && event.speakers.length > 0 ? (
                            event.speakers.map((speaker) => (
                              speaker.name ? (
                                <Badge key={speaker.id} variant="outline">
                                  {speaker.name}
                                </Badge>
                              ) : (
                                <p  key={speaker.id} className="text-sm text-muted-foreground">No speaker assigned</p>
                              )
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No speaker assigned</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full" style={{ zIndex:100 }}>
                        <Link href={`/community/events/${event.slug}`}>Register</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          <TabsContent value="past" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event, index) => {
                // Assign different card styles based on type
                let cardClass = "web3-card"
                if (event.type === "Webinar") cardClass = "web3-card-purple"
                else if (event.type === "Workshop") cardClass = "web3-card-blue"
                else cardClass = "web3-card-teal"

                return (
                  <Card
                    key={event.slug}
                    className={`${cardClass} flex flex-col h-full hover:border-purple-500/40 transition-colors`}
                  >
                    <div className="relative h-48 w-full">
                      
                      <Image
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        fill
                        className="object-cover rounded-t-lg"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-white">{event.type}</Badge>
                      </div>
                      {event.recording && (
                        <div className="absolute bottom-2 right-2">
                          <Badge variant="outline" className="bg-black/50 backdrop-blur border-white/20 text-white">
                            <Video className="mr-1 h-3 w-3" /> Recording Available
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{event.title}</CardTitle>
                        <CardDescription>
                        <div className="flex items-center gap-1 mt-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {(() => {
                              let dateDisplay = "Coming Soon";
                              if (event.date_time) {
                                const date = new Date(event.date_time);
                                dateDisplay = date.toLocaleDateString("en-US", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              }
                              return dateDisplay;
                            })()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {(() => {
                              let timeDisplay = "To be announced";
                              if (event.date_time) {
                                const date = new Date(event.date_time);
                                timeDisplay = date.toLocaleTimeString("en-US", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                });
                              }
                              return `${timeDisplay} • ${event.duration}`;
                            })()}
                          </span>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-2 flex-grow">
                      <p className="text-sm text-muted-foreground line-clamp-3">{event.description}</p>
                      <div className="mt-4">
                        <p className="text-sm font-medium">Speakers:</p>
                        <div className="flex items-center gap-2 mt-1">
                         {event.speakers && event.speakers.length > 0 ? (
                            event.speakers.map((speaker) => (
                              speaker.name ? (
                                <Badge key={speaker.id} variant="outline">
                                  {speaker.name}
                                </Badge>
                              ) : (
                                <p  key={speaker.id} className="text-sm text-muted-foreground">No speaker assigned</p>
                              )
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">No speaker assigned</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full" variant="outline" style={{ zIndex:100 }}>
                        <Link href={`/community/events/${event.slug}`}>View Recording</Link>
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
