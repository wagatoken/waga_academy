"use client"

import React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, MessageSquare, Plus, Search, Users } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { Skeleton } from "@/components/ui/skeleton"

export default function CategoryDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = React.use(params)
  const [category, setCategory] = useState<any>(null)
  const [topics, setTopics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        // Fetch category and topics from API
        const res = await fetch(`/api/forums/categories/${slug}`)
        const { data, error } = await res.json()
        if (error) {
          setError(error.message || String(error))
          toast({
            title: "Error loading category or topics",
            description: "Could not load category details or topics. Please try again later.",
            variant: "destructive",
          })
          return
        }
        setCategory(data?.category || data)
        setTopics(Array.isArray(data) ? data : data?.topics || data?.data || [])
      } catch (e: any) {
        setError(e.message || String(e))
        toast({
          title: "Error loading forum data ❌",
          description: "Error loading forum data. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  // Get card class based on category slug
  const getCategoryCardClass = (slug: string) => {
    if (slug === "web3-blockchain") return "web3-card-purple"
    if (slug === "coffee-industry") return "web3-card-blue"
    if (slug === "education-training") return "web3-card-teal"
    if (slug === "summer-camp") return "web3-card-pink"
    return "web3-card-amber"
  }

  // Filter topics based on search
  const filteredTopics = topics.filter(
    (topic) =>
      search.trim() === "" ||
      topic.title.toLowerCase().includes(search.toLowerCase()) ||
      (topic.author?.first_name + " " + (topic.author?.last_name || "")).toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="container py-12">
      <div className="space-y-8">
        {/* Header with back button */}
        <div className="flex flex-col gap-4">
          <Button variant="ghost" className="w-fit flex items-center text-muted-foreground hover:text-primary" asChild>
            <Link href="/community/forums">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Forums
            </Link>
          </Button>

          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          ) : (
            <div>
              <h1 className="text-3xl font-bold tracking-tighter web3-dual-gradient-text-glow">
                {category?.name || "Category"}
              </h1>
              <p className="text-muted-foreground">{category?.description}</p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="flex items-center gap-2">
            {!loading && (
              <>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <MessageSquare className="mr-1 h-3 w-3" />
                  {category?.topics_count || 0} topics
                </Badge>
                <Badge variant="outline" className="bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  <Users className="mr-1 h-3 w-3" />
                  {category?.posts_count || 0} posts
                </Badge>
              </>
            )}
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-purple-600/30 hover:border-purple-600/60">
              <Link href="/community/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="web3-button-purple">
              <Link href={`/community/forums/new?category=${slug}`}>
                <Plus className="mr-2 h-4 w-4" /> New Topic
              </Link>
            </Button>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search topics in this category..."
              className="pl-10 web3-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Topics list */}
        <div className="space-y-4">
          {loading ? (
            // Loading skeletons
            Array(3)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="web3-card">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-5 w-60" />
                          <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-40" />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Skeleton className="h-5 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          ) : error ? (
            <Card className="web3-card">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">Failed to load topics. Please try again later.</p>
                <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </CardContent>
            </Card>
          ) : filteredTopics.length === 0 ? (
            <Card className="web3-card">
              <CardContent className="p-6 text-center">
                <p className="text-muted-foreground">
                  {search.trim() !== "" ? "No topics match your search criteria." : "No topics in this category yet."}
                </p>
                {search.trim() !== "" && (
                  <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>
                    Clear Search
                  </Button>
                )}
                <Button className="mt-4 ml-2 web3-button-purple" asChild>
                  <Link href={`/community/forums/new?category=${slug}`}>
                    <Plus className="mr-2 h-4 w-4" /> Create First Topic
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredTopics.map((topic) => {
              const cardClass = category?.slug ? getCategoryCardClass(category.slug) : "web3-card"

              return (
                <Card key={topic.id || topic.topic_id} className={`${cardClass} hover:border-purple-500/40 transition-colors`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10 ring-2 ring-purple-500/30">
                          <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={`${topic.user?.first_name || ""} ${topic.user?.last_name || ""}`} />
                          <AvatarFallback className="bg-purple-900/50">
                            {topic.user?.first_name?.[0]}
                            {topic.user?.last_name?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <Link
                            href={`/community/forums/topics/${topic.id || topic.topic_id}`}
                            className="font-medium hover:text-primary"
                          >
                            {topic.title}
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              By {topic.user?.first_name} {topic.user?.last_name}
                            </span>
                            <span className="text-xs text-muted-foreground">•</span>
                            <span className="text-xs text-muted-foreground">
                              {topic.lastActive ? " Last active " + topic.lastActive : " No activity yet"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <Badge
                          variant="secondary"
                          className="bg-purple-500/20 text-purple-300 border border-purple-500/30"
                        >
                          {topic.replies_count || 0} replies
                        </Badge>
                        <span className="text-xs text-muted-foreground">{topic.views_count || 0} views</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
