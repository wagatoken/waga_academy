"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react"
import { toast } from "@/hooks/use-toast"

type Registration = {
  id: string
  created_at: string
  role: "trainer" | "trainee"
  first_name: string
  last_name: string
  email: string
  phone: string
  country: string
  expertise: string | null
  availability: string
  motivation: string
  experience: string | null
  status: "pending" | "approved" | "rejected"
}

export default function SummerCampAdminPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("all")
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    fetchRegistrations()
  }, [])

  const fetchRegistrations = async () => {
    setLoading(true)
    try {
      const supabase = getSupabaseBrowserClient()
      const { data, error } = await supabase
        .from("camp_registrations")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      setRegistrations(data as Registration[])
    } catch (error) {
      console.error("Error fetching registrations:", error)
      toast({
        title: "Error",
        description: "Failed to load registrations. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const updateRegistrationStatus = async (id: string, status: "approved" | "rejected") => {
    setProcessingId(id)
    try {
      const supabase = getSupabaseBrowserClient()
      const { error } = await supabase.from("camp_registrations").update({ status }).eq("id", id)

      if (error) {
        throw error
      }

      // Update local state
      setRegistrations(registrations.map((reg) => (reg.id === id ? { ...reg, status } : reg)))

      toast({
        title: "Success",
        description: `Registration ${status === "approved" ? "approved" : "rejected"} successfully.`,
      })
    } catch (error) {
      console.error(`Error ${status} registration:`, error)
      toast({
        title: "Error",
        description: `Failed to ${status} registration. Please try again.`,
        variant: "destructive",
      })
    } finally {
      setProcessingId(null)
    }
  }

  const filteredRegistrations =
    activeTab === "all" ? registrations : registrations.filter((reg) => reg.status === activeTab)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-emerald-500 hover:bg-emerald-600">
            <CheckCircle className="mr-1 h-3 w-3" /> Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="mr-1 h-3 w-3" /> Rejected
          </Badge>
        )
      default:
        return (
          <Badge className="bg-amber-500 hover:bg-amber-600">
            <Clock className="mr-1 h-3 w-3" /> Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight web3-gradient-text">Summer Camp Registrations</h2>
        <p className="text-muted-foreground">Manage and review summer camp registration applications</p>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
        <TabsContent value={activeTab} className="mt-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredRegistrations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No registrations found</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredRegistrations.map((registration) => (
                <Card key={registration.id} className="web3-card-glow">
                  <CardHeader className="flex flex-row items-start justify-between space-y-0">
                    <div>
                      <CardTitle className="web3-gradient-text-vibrant">
                        {registration.first_name} {registration.last_name}
                      </CardTitle>
                      <CardDescription>
                        Applied as {registration.role === "trainer" ? "Trainer" : "Trainee"} •{" "}
                        {new Date(registration.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {getStatusBadge(registration.status)}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">{registration.email}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Phone</p>
                        <p className="text-sm text-muted-foreground">{registration.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Country</p>
                        <p className="text-sm text-muted-foreground">{registration.country}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Availability</p>
                        <p className="text-sm text-muted-foreground">{registration.availability}</p>
                      </div>
                      {registration.role === "trainer" && registration.expertise && (
                        <div>
                          <p className="text-sm font-medium">Expertise</p>
                          <p className="text-sm text-muted-foreground">{registration.expertise}</p>
                        </div>
                      )}
                      {registration.role === "trainee" && registration.experience && (
                        <div>
                          <p className="text-sm font-medium">Experience</p>
                          <p className="text-sm text-muted-foreground">{registration.experience}</p>
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-sm font-medium">Motivation</p>
                      <p className="text-sm text-muted-foreground">{registration.motivation}</p>
                    </div>

                    {registration.status === "pending" && (
                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateRegistrationStatus(registration.id, "rejected")}
                          disabled={!!processingId}
                          className="web3-button-outline-glow"
                        >
                          {processingId === registration.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reject"}
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => updateRegistrationStatus(registration.id, "approved")}
                          disabled={!!processingId}
                          className="web3-button-glow"
                        >
                          {processingId === registration.id ? <Loader2 className="h-4 w-4 animate-spin" /> : "Approve"}
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
