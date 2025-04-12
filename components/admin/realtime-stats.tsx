"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { BookOpen, FileText, Users } from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface StatsData {
  courseCount: number
  resourceCount: number
  userCount: number
}

export function RealtimeStats({ initialData }: { initialData: StatsData }) {
  const [stats, setStats] = useState<StatsData>(initialData)
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Set up realtime subscriptions
    const profilesChannel = supabase
      .channel("public:profiles")
      .on("INSERT", () => fetchStats())
      .on("DELETE", () => fetchStats())
      .subscribe()

    const coursesChannel = supabase
      .channel("public:courses")
      .on("INSERT", () => fetchStats())
      .on("DELETE", () => fetchStats())
      .subscribe()

    const resourcesChannel = supabase
      .channel("public:resources")
      .on("INSERT", () => fetchStats())
      .on("DELETE", () => fetchStats())
      .subscribe()

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(profilesChannel)
      supabase.removeChannel(coursesChannel)
      supabase.removeChannel(resourcesChannel)
    }
  }, [supabase])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const [coursesRes, resourcesRes, usersRes] = await Promise.all([
        supabase.from("courses").select("*", { count: "exact", head: true }),
        supabase.from("resources").select("*", { count: "exact", head: true }),
        supabase.from("profiles").select("*", { count: "exact", head: true }),
      ])

      setStats({
        courseCount: coursesRes.count || 0,
        resourceCount: resourcesRes.count || 0,
        userCount: usersRes.count || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
      <Card className={`web3-card-purple ${loading ? "opacity-70" : ""}`}>
        <div className="p-4 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <h3 className="text-xs md:text-sm font-medium">Total Courses</h3>
            <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-purple-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold">{stats.courseCount}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {stats.courseCount > 0 ? `${stats.courseCount} courses available` : "Ready to add your first course"}
          </p>
        </div>
      </Card>
      <Card className={`web3-card-blue ${loading ? "opacity-70" : ""}`}>
        <div className="p-4 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <h3 className="text-xs md:text-sm font-medium">Resources</h3>
            <FileText className="h-3 w-3 md:h-4 md:w-4 text-blue-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold">{stats.resourceCount}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {stats.resourceCount > 0 ? `${stats.resourceCount} resources available` : "Ready for your first resource"}
          </p>
        </div>
      </Card>
      <Card className={`web3-card-teal col-span-2 md:col-span-1 ${loading ? "opacity-70" : ""}`}>
        <div className="p-4 md:p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-1 md:pb-2">
            <h3 className="text-xs md:text-sm font-medium">Active Users</h3>
            <Users className="h-3 w-3 md:h-4 md:w-4 text-teal-400" />
          </div>
          <div className="text-xl md:text-2xl font-bold">{stats.userCount}</div>
          <p className="text-[10px] md:text-xs text-muted-foreground">
            {stats.userCount > 0 ? `${stats.userCount} registered users` : "Waiting for first users"}
          </p>
        </div>
      </Card>
    </div>
  )
}
