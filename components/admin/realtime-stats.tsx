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

    // Subscribe to INSERT and DELETE on the admin_stats view
    const adminStatsChannel = supabase
      .channel('admin-stats-view')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'admin_stats' },
        (payload) => {
          console.log('INSERT on admin_stats', payload)
          fetchStats()
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'admin_stats' },
        (payload) => {
          console.log('DELETE on admin_stats', payload)
          fetchStats()
        }
      )
      .subscribe()

    // Clean up subscriptions
    return () => {
      supabase.removeChannel(adminStatsChannel)
    }
  }, [supabase])

  const fetchStats = async () => {
    try {
      setLoading(true)
      // Fetch from the admin_stats view
      const { data, error } = await supabase.from("admin_stats").select("*").single()
      if (error) throw error
      setStats({
        courseCount: data?.course_count || 0,
        resourceCount: data?.resource_count || 0,
        userCount: data?.user_count || 0,
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
