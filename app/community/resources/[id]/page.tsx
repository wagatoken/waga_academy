"use client"
export const runtime = 'edge'

import { useState, useEffect, use } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, FileText, Bookmark, Share2, ThumbsUp, MessageSquare, Calendar, User } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { format } from "date-fns"

export default function ResourcePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const [resourceData, setResourceData] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await fetch(`/api/resources/${id}`);
        const data = await response.json();

        setResourceData(data);
        setIsLiked(data.isliked || false); // Initialize isLiked state from API response
        setLikeCount(data.likeCount || 0); // Initialize likeCount state from API response
        setIsBookmarked(data.isbookmarked || false); // Initialize isBookmarked state from API response
      } catch (error) {
        console.error("Error fetching resource details:", error);
      }
    };

    fetchResource();
  }, [id]);

  console.log("Resource Data:", resourceData);

  const handleBookmark = async () => {
    const previousIsBookmarked = isBookmarked;

    // Optimistically update the state
    setIsBookmarked(!isBookmarked);

    try {
      const response = await fetch(`/api/resources/${id}/bookmark`, {
        method: isBookmarked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resourceId: id }),
      });

      let responseData;
      try {
        const responseText = await response.text();
        console.log("Raw Response Text:", responseText);
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (jsonError) {
        console.error("Error parsing JSON response:", jsonError);
        throw new Error("Invalid JSON response from server");
      }

      console.log("API Response:", responseData);

      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to toggle bookmark");
      }

      toast({
        title: isBookmarked ? "Bookmark removed 🍾" : "Bookmark added 🥂",
        description: isBookmarked
          ? "Resource removed from your bookmarks"
          : "Resource added to your bookmarks",
      });
    } catch (error) {
      console.error("Error toggling bookmark:", error);

      // Revert state on error
      setIsBookmarked(previousIsBookmarked);
    }
  };

  const handleLike = async () => {
    const previousIsLiked = isLiked;

    // Optimistically update the state
    setIsLiked(!isLiked);

    try {
      const response = await fetch(`/api/resources/${id}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to toggle like");
      }

      const { isLiked: updatedIsLiked, likeCount: updatedLikeCount } = await response.json();

      // Update state with the response from the server
      setIsLiked(updatedIsLiked);
      setLikeCount(updatedLikeCount || likeCount);
    } catch (error) {
      console.error("Error toggling like:", error);

      // Revert state on error
      setIsLiked(previousIsLiked);
    }
  };

  const handleDownload = () => {
    toast({
      title: "Download started 🚀",
      description: "Your download should begin shortly",
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      toast({
        title: "Link copied to clipboard 📋",
        description: "Resource link copied to clipboard",
      })
    })
  }

  if (!resourceData) {
    return <div>Loading...</div>
  }

  const formattedDate = resourceData.created_at
    ? format(new Date(resourceData.created_at), "MMMM dd, yyyy")
    : "Unknown date";


  const creatorName = (resourceData.creator_first_name && resourceData.creator_last_name)
    ? `${resourceData.creator_first_name} ${resourceData.creator_last_name}`
    : "Unknown creator";

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <Link href="/community/resources" className="link-emerald flex items-center mb-2">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Resources
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4">
            <div className="lg:col-span-2 space-y-6">
              <div className="relative h-[300px] rounded-xl overflow-hidden web3-card-glow-border">
                <Image
                  src={resourceData?.image || "/placeholder.svg"}
                  alt={resourceData?.title || "Placeholder"}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4">
                  <Badge className="badge-emerald">{resourceData?.resource_type}</Badge>
                </div>
              </div>

              <div>
                <h1 className="text-3xl font-bold tracking-tighter web3-gradient-text-enhanced">
                  {resourceData.title}
                </h1>
                <div className="flex flex-wrap gap-4 mt-4">
                  <Badge variant="outline" className="badge-emerald">
                    {resourceData.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <FileText className="h-4 w-4 icon-emerald" />
                    <span>
                      {resourceData.resource_type} • {resourceData.fileSize ? resourceData.fileSize : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 icon-emerald" />
                    <span>Published: {formattedDate}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <User className="h-4 w-4 icon-emerald" />
                    <span>By: {creatorName}</span>
                  </div>
                </div>
              </div>

              <Card className="web3-card-gradient hover-lift">
                <CardHeader className="card-header-gradient">
                  <CardTitle>About This Resource</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: resourceData.longDescription }}
                  />
                </CardContent>
                <CardFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center px-4 py-3">
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleLike} // Attach the handleLike function to the onClick event
                      className={
                        isLiked
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10"
                      }
                    >
                      <ThumbsUp className="mr-1 h-4 w-4" /> {isLiked ? "Liked" : "Like"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!resourceData.downloadUrl}
                      className={
                        resourceData.downloadUrl
                          ? "border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10"
                          : "border-gray-300 text-gray-400 cursor-not-allowed"
                      }
                    >
                      <Download className="mr-1 h-4 w-4" /> Download
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleBookmark}
                      className={
                        isBookmarked
                          ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                          : "border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10"
                      }
                    >
                      <Bookmark className="mr-1 h-4 w-4" /> {isBookmarked ? "Bookmarked" : "Bookmark"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleShare}
                      className="border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10"
                    >
                      <Share2 className="mr-1 h-4 w-4" /> Share
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-6">
              {resourceData.downloadable && (
                <Card className="web3-card-glow-border hover-lift">
                  <CardHeader className="card-header-gradient">
                    <CardTitle>Download Resource</CardTitle>
                    <CardDescription>Access this resource offline</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-4">
                      <div className="bg-emerald-500/10 p-4 rounded-md inline-flex mx-auto">
                        <FileText className="h-8 w-8 icon-emerald" />
                      </div>
                      <div>
                        <p className="font-medium">
                          {resourceData.fileType} • {resourceData.fileSize}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">Downloaded {resourceData.downloads} times</p>
                      </div>
                      <Button className="w-full web3-button-purple" onClick={handleDownload} asChild>
                        <a href={resourceData.downloadUrl} target="_blank" rel="noopener noreferrer">
                          <Download className="mr-2 h-4 w-4" /> Download
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card className="web3-card-glass hover-lift">
                <CardHeader className="card-header-gradient">
                  <CardTitle>Resource Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-emerald-500/10 p-3 rounded-md">
                      <p className="text-lg font-bold text-emerald-400">{resourceData.views}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div className="bg-emerald-500/10 p-3 rounded-md">
                      <p className="text-lg font-bold text-emerald-400">{resourceData.downloads}</p>
                      <p className="text-xs text-muted-foreground">Downloads</p>
                    </div>
                    <div className="bg-emerald-500/10 p-3 rounded-md">
                      <p className="text-lg font-bold text-emerald-400">{resourceData.likes}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="web3-card-glass hover-lift">
                <CardHeader className="card-header-gradient">
                  <CardTitle>Related Resources</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resourceData.relatedResources?.length > 0 ? (
                    resourceData.relatedResources.map((resource) => {
                      let bgClass = "bg-emerald-500/10";
                      let textClass = "text-emerald-400";
                      if (resource.category === "Finance & Accounting") {
                        bgClass = "bg-emerald-500/10";
                        textClass = "text-emerald-400";
                      }

                      return (
                        <div key={resource.id} className="flex items-start gap-3">
                          <div className={`${bgClass} p-2 rounded-md`}>
                            <FileText className={`h-4 w-4 ${textClass}`} />
                          </div>
                          <div>
                            <Link
                              href={`/community/resources/${resource.id}`}
                              className="text-sm font-medium link-emerald"
                            >
                              {resource.title}
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs badge-emerald">
                                {resource.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{resource.type}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-sm text-muted-foreground">
                      No related resources available.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
