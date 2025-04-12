"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/context/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

export default function ProfilePage() {
  const { user, profile, updateProfile, isLoading } = useAuth()
  const [isUpdating, setIsUpdating] = useState(false)
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    bio: profile?.bio || "",
    website: profile?.website || "",
    twitter: profile?.twitter || "",
    github: profile?.github || "",
  })

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!user || !profile) {
    return (
      <div className="container mx-auto mt-10 max-w-4xl p-4">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>You need to be logged in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const { error } = await updateProfile(formData)

      if (error) {
        toast({
          title: "Error updating profile",
          description: error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Profile update error:", error)
      toast({
        title: "Error updating profile",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  // Helper function to format interest
  const formatInterest = (interest: string | null) => {
    if (!interest) return "Not specified"

    const interestMap: Record<string, string> = {
      blockchain: "Blockchain Technology",
      cryptocurrency: "Cryptocurrency",
      defi: "Decentralized Finance (DeFi)",
      nft: "NFTs & Digital Assets",
      web3: "Web3 Development",
      other: "Other",
    }

    return interestMap[interest] || interest
  }

  // Helper function to format background
  const formatBackground = (background: string | null) => {
    if (!background) return "Not specified"

    const backgroundMap: Record<string, string> = {
      beginner: "Beginner - New to blockchain",
      intermediate: "Intermediate - Some knowledge",
      advanced: "Advanced - Experienced in the field",
      professional: "Professional - Working in the industry",
      educator: "Educator - Teaching others",
    }

    return backgroundMap[background] || background
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  return (
    <div className="container mx-auto mt-10 max-w-4xl p-4">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-start sm:space-x-4 sm:space-y-0">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={profile.avatar_url} alt={profile.first_name} />
                  <AvatarFallback className="text-lg">
                    {getInitials(profile.first_name, profile.last_name)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1 text-center sm:text-left">
                  <CardTitle className="text-2xl">
                    {profile.first_name} {profile.last_name}
                  </CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                      {profile.role || "Member"}
                    </span>
                    {profile.badges?.map((badge: string, index: number) => (
                      <span key={index} className="rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary">
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h3 className="font-medium">Primary Interest</h3>
                  <p className="text-muted-foreground">{formatInterest(profile.interest)}</p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium">Background</h3>
                  <p className="text-muted-foreground">{formatBackground(profile.background)}</p>
                </div>
              </div>

              {profile.bio && (
                <div className="space-y-2">
                  <h3 className="font-medium">Bio</h3>
                  <p className="text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-3">
                {profile.website && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Website</h3>
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </a>
                  </div>
                )}
                {profile.twitter && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Twitter</h3>
                    <a
                      href={`https://twitter.com/${profile.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      @{profile.twitter}
                    </a>
                  </div>
                )}
                {profile.github && (
                  <div className="space-y-2">
                    <h3 className="font-medium">GitHub</h3>
                    <a
                      href={`https://github.com/${profile.github}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline"
                    >
                      {profile.github}
                    </a>
                  </div>
                )}
              </div>

              {profile.courses?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Enrolled Courses</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {profile.courses.map((course: any, index: number) => (
                      <div key={index} className="rounded-lg border p-3">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground">Progress: {course.progress || 0}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {profile.certificates?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Certificates</h3>
                  <div className="grid gap-2 md:grid-cols-2">
                    {profile.certificates.map((cert: any, index: number) => (
                      <div key={index} className="rounded-lg border p-3">
                        <h4 className="font-medium">{cert.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          Issued: {new Date(cert.issued_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      placeholder="https://example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter</Label>
                    <Input
                      id="twitter"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      placeholder="username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="github">GitHub</Label>
                    <Input
                      id="github"
                      name="github"
                      value={formData.github}
                      onChange={handleChange}
                      placeholder="username"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button disabled={isUpdating} type="submit">
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
