"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Edit, Plus, Search, Trash2, MapPin, Users, Tag } from "lucide-react"
import Link from "next/link"
import { getPaginatedEvents, updateEvent, deleteEvent } from "@/app/api/events/actions"
import { toast } from "@/components/ui/toast"
import { DeleteButton } from "@/components/admin/delete-button"

export default function EventsAdmin() {
  const [events, setEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [typeFilter, setTypeFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch events with pagination
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      const { data, meta, error } = await getPaginatedEvents(currentPage, 5) // Fetch 5 items per page
      if (error) {
        toast({
          title: "Error fetching events ❌",
          description: error,
          variant: "destructive",
        })
      } else {
        setEvents(data)
        setTotalPages(meta.totalPages)
      }
      setIsLoading(false)
    }

    fetchEvents()
  }, [currentPage])

  const filteredEvents = events.filter((event) => {
    const matchesSearch = searchTerm === "" || event.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "" || statusFilter === "all" || event.status === statusFilter
    const matchesType = typeFilter === "" || typeFilter === "all" || event.type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const handleDelete = async (id: number) => {
    try {
      const { error } = await deleteEvent(id)
      if (error) {
        toast({
          title: "Delete failed ❌",
          description: error,
          variant: "destructive",
        })
      } else {
        setEvents(events.filter((event) => event.id !== id))
        toast({
          title: "Event deleted ✅",
          description: "The event has been successfully deleted.",
        })
      }
    } catch (err) {
      console.error("Error deleting event:", err)
      toast({
        title: "Unexpected error ❌",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = async (id: number, updatedData: any) => {
    try {
      const { error } = await updateEvent(id, updatedData)
      if (error) {
        toast({
          title: "Update failed ❌",
          description: error,
          variant: "destructive",
        })
      } else {
        setEvents(events.map((event) => (event.id === id ? { ...event, ...updatedData } : event)))
        toast({
          title: "Event updated ✅",
          description: "The event has been successfully updated.",
        })
      }
    } catch (err) {
      console.error("Error updating event:", err)
      toast({
        title: "Unexpected error ❌",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "Workshop":
        return "text-blue-500"
      case "Webinar":
        return "text-purple-500"
      case "Conference":
        return "text-emerald-500"
      case "Meetup":
        return "text-amber-500"
      case "Registration":
        return "text-rose-500"
      default:
        return "text-gray-500"
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1)
    }
  }

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold web3-gradient-text">Events Management</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Create, edit, and manage community events
          </p>
        </div>
        <Button className="web3-button-purple w-full sm:w-auto" asChild>
          <Link href="/admin/events/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
      </div>

      <Card className="border border-purple-500/30 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
          <CardTitle>Filter Events</CardTitle>
          <CardDescription>Search and filter the events calendar</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
        
            <div className="grid grid-cols-3 gap-3 md:grid-cols-1 md:col-span-2">
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-4">
            <div className="relative md:col-span-2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-500" />
              <Input
                placeholder="Search events..."
                className="pl-8 border-purple-500/30 focus-visible:ring-purple-500/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Draft">Draft</SelectItem>
                  <SelectItem value="Planning">Planning</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Workshop">Workshop</SelectItem>
                  <SelectItem value="Webinar">Webinar</SelectItem>
                  <SelectItem value="Conference">Conference</SelectItem>
                  <SelectItem value="Meetup">Meetup</SelectItem>
                  <SelectItem value="Registration">Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <p>Loading events...</p>
        ) : (
          filteredEvents.map((event) => (
            <Card
              key={event.id}
              className="overflow-hidden border-purple-600/30 hover:border-purple-600/60 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 p-3 md:p-4 flex items-center justify-center md:w-24">
                  <Calendar className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
                </div>
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-base md:text-lg">{event.title}</h3>
                        <span
                          className={`text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${
                            event.status === "Upcoming"
                              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                              : event.status === "Completed"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          }`}
                        >
                          {event.status}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 space-x-2 md:space-x-4 flex-wrap">
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center">
                            <Calendar className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-blue-500" />
                            {new Date(event.date_time).toLocaleString("en-US", {
                              weekday: "short", 
                              month: "short",   
                              day: "2-digit",   
                              year: "numeric",  
                              hour: "2-digit",  
                              minute: "2-digit",
                              hour12: false,    
                            })}
                          </span>
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-rose-500" /> {event.location}
                        </span>
                      </div>
                      <div className="flex items-center mt-1 space-x-2 md:space-x-4 flex-wrap">
                        <span className={`text-xs md:text-sm flex items-center ${getEventTypeColor(event.type)}`}>
                          <Tag className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> {event.type}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center">
                          <Users className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-green-500" />
                          {event.attendees > 0 ? `${event.attendees} attendees` : "No attendees yet"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end md:self-start mt-2 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 hover:bg-purple-500/10 h-8 px-2 md:px-3"
                        asChild
                      >
                        <Link href={`/admin/events/update/${event.id}`}>
                          <Edit className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2 text-purple-500" />
                          <span className="hidden md:inline">Update</span>
                        </Link>
                      </Button>
                       <DeleteButton
                  entityId={event.id}
              entityName={event.title}
              onDelete={handleDelete}
              entityType="Event"
                />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="border-purple-500/30 hover:bg-purple-500/10"
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="border-purple-500/30 hover:bg-purple-500/10"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
