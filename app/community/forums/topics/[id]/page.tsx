"use client"

import React from "react"

export const runtime = "edge"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, Flag, Share2, MessageSquare } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"


// Simple markdown parser for bold, italic, and links
function simpleMarkdown(text: string) {
  if (!text) return "";
  return text
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>')
    .replace(/\n/g, "<br>");
}

// Add type for nested replies
type ReplyType = {
  id: string
  author: {
    id: string
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
  date: string
  content: string
  likes: number
  replies: ReplyType[]
  isNew?: boolean // Flag to track newly created replies
  parent_id: string
}

// --- Fix: Each reply gets its own reply box state ---
function Reply({
  reply,
  onReply,
  onLike,
  likedIds,
}: {
  reply: ReplyType
  onReply: (parentId: string, content: string) => void
  onLike: (id: string) => void
  likedIds: Set<string>
}) {
  const [showReplyBox, setShowReplyBox] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(!reply.isNew) // Don't collapse new replies
  

  // If this is a new reply, keep it expanded for a while then allow normal collapse behavior
  useEffect(() => {
    if (reply.isNew) {
      const timer = setTimeout(() => {
        reply.isNew = false // Clear the new flag after a delay
      }, 10000) // 10 seconds
      return () => clearTimeout(timer)
    }
  }, [reply])

  const handleReplyClick = () => {
    console.log(`Toggle reply box for ${reply.author}'s comment`)
    setShowReplyBox((v) => !v)
    setReplyContent("")
  }

  const handleSubmit = () => {
    if (!replyContent.trim()) {
      toast({ title: "Error", description: "Reply cannot be empty", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onReply(reply.id, replyContent)
      setReplyContent("")
      setShowReplyBox(false)
      // Auto-expand to show the new reply
      setIsCollapsed(false)
      toast({ title: "Reply posted", description: "Your reply has been posted successfully" })
    }, 500)
  }

  const isLiked = likedIds.has(reply.id)

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsCollapsed((prev) => !prev)
  }

  const hasReplies = reply.replies && reply.replies.length > 0
  const replyCount = hasReplies ? reply.replies.length : 0

  // Check if any replies are marked as new
  const hasNewReplies = hasReplies && reply.replies.some((r) => r.isNew)

  // Don't collapse if there are new replies
  useEffect(() => {
    if (hasNewReplies) {
      setIsCollapsed(false)
    }
  }, [hasNewReplies])
  

  return (
    <div className="space-y-2">
      <Card className="web3-card-glass hover-lift">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
                <AvatarImage
                  src={reply.author.avatar_url || `/placeholder.svg?height=40&width=40`}
                  alt={reply.author.first_name ? `${reply.author.first_name} ${reply.author.last_name ?? ""}` : "User"}
                />
                <AvatarFallback className="bg-emerald-900/50">
                  {reply.author.first_name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-grow space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">
                  {reply.author.first_name
                    ? `${reply.author.first_name} ${reply.author.last_name ?? ""}`
                    : "Unknown"}
                </span>
                <span className="text-xs text-muted-foreground">{reply.date}</span>
              </div>
              <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: simpleMarkdown(reply.content) }} />
              <div className="flex items-center gap-4 pt-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className={
                    `hover:text-emerald-400 hover:bg-emerald-500/10 ` +
                    (isLiked ? "text-emerald-400" : "text-muted-foreground")
                  }
                  onClick={() => onLike(reply.id)}
                >
                  <Heart className={`mr-1 h-4 w-4 ${isLiked ? "fill-emerald-400" : ""}`} /> {reply.likes}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                  onClick={handleReplyClick}
                >
                  Reply
                </Button>
                {hasReplies && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`hover:text-emerald-400 hover:bg-emerald-500/10 ${hasNewReplies ? "text-emerald-400" : "text-muted-foreground"}`}
                    onClick={toggleCollapse}
                  >
                    <MessageSquare className={`mr-1 h-4 w-4 ${hasNewReplies ? "text-emerald-400" : ""}`} />
                    {isCollapsed ? `Show ${replyCount} ${replyCount === 1 ? "reply" : "replies"}` : "Hide replies"}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Share2 className="mr-1 h-4 w-4" /> Share
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                >
                  <Flag className="mr-1 h-4 w-4" /> Report
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showReplyBox && (
        <Card className="ml-14 web3-card-glass border-l-2 border-emerald-500/30">
          <CardContent className="p-4">
            <p className="text-sm text-emerald-400 mb-2">Replying to {reply.author.first_name}</p>
            <Textarea
              placeholder={`Write your reply...`}
              className="min-h-[80px] web3-input-glow focus-emerald"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
            />
            <div className="flex gap-2 justify-end mt-2">
              <Button variant="outline" size="sm" onClick={() => setShowReplyBox(false)}>
                Cancel
              </Button>
              <Button className="web3-button-purple" size="sm" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? "Posting..." : "Post Reply"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Render child replies recursively */}
      {hasReplies && !isCollapsed && (
        <div className="ml-14 space-y-3 border-l-2 border-emerald-500/20 pl-4">
          {reply.replies.map((child) => (
            <Reply
              key={child.id + "-" + child.date}
              reply={child}
              onReply={onReply}
              onLike={onLike}
              likedIds={likedIds}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Add type for API reply
interface ApiReply {
  id: string
  topic_id: string
  author_id: string
  content: string
  parent_id: string | null
  created_at: string
  profiles?: {
    id: string
    first_name?: string
    last_name?: string
    avatar_url?: string
  }
  // Add more fields as needed
}

// Helper to build nested tree from flat array
function buildReplyTree(flatReplies: ApiReply[]): ReplyType[] {
  const map = new Map<string, ReplyType & { parent_id: string | null }>();
  const roots: ReplyType[] = [];
  flatReplies.forEach((r) => {
    map.set(r.id, {
      id: r.id,
      author: {
        id: r.profiles?.id || "",
        first_name: r.profiles?.first_name,
        last_name: r.profiles?.last_name,
        avatar_url: r.profiles?.avatar_url,
      },
      date: new Date(r.created_at).toLocaleDateString(),
      content: r.content,
      likes: 0, // You can fetch likes separately if needed
      replies: [],
      parent_id: r.parent_id,
    });
  });
  map.forEach((reply) => {
    if (reply.parent_id) {
      const parent = map.get(reply.parent_id);
      if (parent) parent.replies.push(reply);
    } else {
      roots.push(reply);
    }
  });
  return roots;
}


// Remove initialReplies and topicData references

// Add type for topic
interface TopicType {
  id: string
  title: string
  content: string
  author: string
  avatar: string
  category: string
  date: string
}

export default function TopicPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { id: topicId } = React.use(params)
  const [topic, setTopic] = useState<TopicType | null>(null)
  const [replyContent, setReplyContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [replies, setReplies] = useState<ReplyType[]>([])
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [mainPostLikes, setMainPostLikes] = useState(0)
  const [mainPostLiked, setMainPostLiked] = useState(false)

  // Fetch topic and replies from API (unified)
  useEffect(() => {
    async function fetchTopicAndReplies() {
      const res = await fetch(`/api/forums/${topicId}`)
      const json = await res.json()
      if (json.data) {
        if (json.data.topic) {
          setTopic({
            ...json.data.topic,
            date: new Date(json.data.topic.date).toLocaleDateString(),
          })
        }
        if (json.data.replies) {
          setReplies(buildReplyTree(json.data.replies))
        }
      }
      console.log(json.data)
    }
    fetchTopicAndReplies()
  }, [topicId])

  // Post a new top-level reply
  async function handlePostReply() {
    if (!replyContent.trim()) {
      toast({ title: "Error", description: "Reply cannot be empty", variant: "destructive" })
      return
    }
    setIsSubmitting(true)
    const formData = new FormData()
    formData.set("content", replyContent)
    // topic_id is set by the API route
    const res = await fetch(`/api/forums/${topicId}`, {
      method: "POST",
      body: formData,
    })
    setIsSubmitting(false)
    if (res.ok) {
      setReplyContent("")
      toast({ title: "Reply posted", description: "Your reply has been posted successfully" })
      // Refetch topic and replies from the unified endpoint
      const res2 = await fetch(`/api/forums/${topicId}`)
      const json2 = await res2.json()
      if (json2.data) {
        if (json2.data.topic) {
          setTopic({
            ...json2.data.topic,
            date: new Date(json2.data.topic.date).toLocaleDateString(),
          })
        }
        if (json2.data.replies) {
          setReplies(buildReplyTree(json2.data.replies))
        }
      }
    } else {
      const json = await res.json()
      toast({ title: "Error", description: json.error || "Failed to post reply", variant: "destructive" })
    }
  }

  // Post a nested reply
  async function handleReplyToReply(parentId: string, content: string) {
    if (!content.trim()) {
      toast({ title: "Error", description: "Reply cannot be empty", variant: "destructive" })
      return
    }
    const formData = new FormData()
    formData.set("content", content)
    formData.set("parent_id", String(parentId))
    const res = await fetch(`/api/forums/${topicId}`, {
      method: "POST",
      body: formData,
    })
    if (res.ok) {
      toast({ title: "Reply posted", description: "Your reply has been posted successfully" })
      // Refetch topic and replies from the unified endpoint
      const res2 = await fetch(`/api/forums/${topicId}`)
      const json2 = await res2.json()
      if (json2.data) {
        if (json2.data.topic) {
          setTopic({
            ...json2.data.topic,
            date: new Date(json2.data.topic.date).toLocaleDateString(),
          })
        }
        if (json2.data.replies) {
          setReplies(buildReplyTree(json2.data.replies))
        }
      }
    } else {
      const json = await res.json()
      toast({ title: "Error", description: json.error || "Failed to post reply", variant: "destructive" })
    }
  }

  // Like/unlike logic for replies
  const handleLike = (replyId: string) => {
    setReplies((prev) => prev.map((r) => likeReplyRecursive(r, replyId)))
    setLikedIds((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(replyId)) {
        newSet.delete(replyId)
        toast({ title: "Unliked", description: "You unliked this reply" })
      } else {
        newSet.add(replyId)
        toast({ title: "Liked", description: "You liked this reply" })
      }
      return newSet
    })
  }

  function likeReplyRecursive(reply: ReplyType, replyId: string): ReplyType {
    if (reply.id === replyId) {
      return { ...reply, likes: likedIds.has(replyId) ? reply.likes - 1 : reply.likes + 1 }
    } else if (reply.replies && reply.replies.length > 0) {
      return { ...reply, replies: reply.replies.map((child) => likeReplyRecursive(child, replyId)) }
    } else {
      return reply
    }
  }

  // Like/unlike logic for main post
  const handleMainPostLike = () => {
    setMainPostLikes((likes) => (mainPostLiked ? likes - 1 : likes + 1))
    setMainPostLiked((liked) => !liked)
    toast({
      title: mainPostLiked ? "Unliked" : "Liked",
      description: mainPostLiked ? "You unliked this post" : "You liked this post",
    })
  }
  
  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <Link href="/community/forums" className="link-emerald flex items-center mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Forums
          </Link>
          <h1 className="text-2xl font-bold tracking-tighter mt-2 web3-gradient-text-enhanced">
            {topic ? topic.title : <span className="text-muted-foreground">Loading...</span>}
          </h1>
          {topic && (
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline" className="badge-emerald">
                {topic.category}
              </Badge>
              <span className="text-sm text-muted-foreground">Started by {topic.author}</span>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{topic.date}</span>
            </div>
          )}
        </div>

        <Card className="web3-card-glow-border hover-lift">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30">
                  <AvatarImage src={topic && topic.avatar ? topic.avatar : "/placeholder.svg?height=40&width=40"} alt={topic?.author || ""} />
                  <AvatarFallback className="bg-emerald-900/50">{topic?.avatar || "U"}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-grow space-y-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">{topic?.author || <span className="text-muted-foreground">Loading...</span>}</span>
                    <span className="text-xs text-emerald-400 ml-2">Topic Starter</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{topic?.date || ""}</span>
                </div>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: simpleMarkdown(topic?.content || "") }}
                />
                <div className="flex items-center gap-4 pt-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className={
                      `hover:text-emerald-400 hover:bg-emerald-500/10 ` +
                      (mainPostLiked ? "text-emerald-400" : "text-muted-foreground")
                    }
                    onClick={handleMainPostLike}
                  >
                    <Heart className={`mr-1 h-4 w-4 ${mainPostLiked ? "fill-emerald-400" : ""}`} /> {mainPostLikes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Share2 className="mr-1 h-4 w-4" /> Share
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-500/10"
                  >
                    <Flag className="mr-1 h-4 w-4" /> Report
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-bold web3-gradient-text">Replies ({replies.length})</h2>
          {replies.map((reply) => (
            <Reply key={reply.id} reply={reply} onReply={handleReplyToReply} onLike={handleLike} likedIds={likedIds} />
          ))}
        </div>

        <Card className="web3-card-gradient">
          <CardHeader className="card-header-gradient">
            <h2 className="text-xl font-bold web3-gradient-text">Post a Reply</h2>
            <p className="text-sm text-muted-foreground">Share your thoughts on this topic</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Avatar className="h-10 w-10 ring-2 ring-emerald-500/30 flex-shrink-0">
                <AvatarFallback className="bg-emerald-900/50">U</AvatarFallback>
              </Avatar>
              <Textarea
                placeholder="Write your reply here..."
                className="min-h-[150px] web3-input-glow focus-emerald"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button
              className="web3-button-purple"
              onClick={handlePostReply}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Posting..." : "Post Reply"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
