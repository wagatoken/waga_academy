"use client"

import { useRouter } from "next/navigation" // Import useRouter
import { useState } from "react"
import { toast } from "@/components/ui/toast" // Import toast
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { createEvent } from "@/app/api/events/actions"
import { Save } from "lucide-react"

export default function NewEvent() {
  const router = useRouter() // Initialize the router
  const [isSaving, setIsSaving] = useState(false)
  const [isVirtual, setIsVirtual] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    date: "",
    startTime: "",
    duration: "",
    location: "",
    meetingLink: "",
    capacity: "",
    platform: "",
    recording: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior
    setIsSaving(true)
    const dateTime = `${formData.date}T${formData.startTime}:00`; // Combine date and time
    const formattedDateTime = new Date(dateTime).toISOString().replace("T", " ").replace("Z", "+00");

    try {
      // Create a FormData instance
      const eventFormData = new FormData()
      eventFormData.append("title", formData.title)
      eventFormData.append("description", formData.description)
      eventFormData.append("type", formData.type)
      eventFormData.append("date_time", formattedDateTime) // Combine date and time
      eventFormData.append("duration", formData.duration)
      eventFormData.append("location", isVirtual ? "" : formData.location)
      eventFormData.append("is_virtual", isVirtual.toString())
      eventFormData.append("platform_link", isVirtual ? formData.meetingLink : "")
      eventFormData.append("platform", isVirtual ? formData.platform : "")
      eventFormData.append("max_participants", formData.capacity ? formData.capacity.toString() : "")
      eventFormData.append("recording", formData.recording.toString())

      // Call the createEvent function
      const { error } = await createEvent(eventFormData)
      if (error) {
        toast({
          title: "Error ❌",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Event Created ✅",
          description: "The event has been successfully created.",
        })
        // Display success toast before redirect
        setTimeout(() => {
          router.push("/admin/events") // Redirect to the events page
        }, 1500)
      }
    } catch (err) {
      console.error("Error creating event:", err)
      toast({
        title: "Unexpected Error ❌",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold web3-gradient-text">Create New Event</h1>
        <p className="text-muted-foreground mt-2">Schedule and organize a community event</p>
      </div>

      <Card className="border border-purple-500/30 shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>Provide information about the event you're creating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Event Title</Label>
                <Input
                  id="title"
                  placeholder="Enter event title"
                  required
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Event Type</Label>
                <Select
                  required
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                    <SelectValue placeholder="Select event type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                    <SelectItem value="Conference">Conference</SelectItem>
                    <SelectItem value="Meetup">Meetup</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Event Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of this event"
                rows={4}
                required
                className="border-purple-500/30 focus:ring-purple-500/30"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="date">Event Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  required
                  value={formData.date}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time</Label>
                <Input
                  id="startTime"
                  type="time"
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  required
                  value={formData.startTime}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="Enter duration (e.g., 2 hours)"
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="isVirtual"
                checked={isVirtual}
                onCheckedChange={(checked) => setIsVirtual(checked as boolean)}
                className="border-purple-500/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <Label htmlFor="isVirtual" className="cursor-pointer">
                This is a virtual event
              </Label>
            </div>

            {isVirtual && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform</Label>
                  <Input
                    id="platform"
                    placeholder="Enter platform (e.g., Zoom, Google Meet)"
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.platform}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="meetingLink">Meeting Link</Label>
                  <Input
                    id="meetingLink"
                    placeholder="Enter virtual meeting link"
                    className="border-purple-500/30 focus:ring-purple-500/30"
                    value={formData.meetingLink}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            )}

            {!isVirtual && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="Enter physical location"
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="capacity">Maximum Capacity</Label>
                <Input
                  id="capacity"
                  type="number"
                  min="1"
                  placeholder="Enter maximum attendees"
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  value={formData.capacity}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="recording"
                checked={formData.recording}
                onCheckedChange={(checked) => setFormData({ ...formData, recording: checked as boolean })}
                className="border-purple-500/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <Label htmlFor="recording" className="cursor-pointer">
                Will this event be recorded?
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.history.back()}
              className="border-purple-600/30 hover:border-purple-600/60"
              disabled={isSaving}
            >
              {isSaving ? "Loading..." : "Cancel"}
            </Button>
            <Button className="web3-button-purple" type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Create Event
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
