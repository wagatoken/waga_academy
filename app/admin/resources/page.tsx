"use client"

import { useState, useEffect } from "react"
import { toast } from "@/components/ui/toast" // Import toast
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Plus, Search, Upload, Download, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" // Import useRouter
import {DeleteButton} from "@/components/admin/delete-button" // Import DeleteButton component
import { getPaginatedResources, deleteResource } from "@/app/api/resources/actions"

export default function ResourcesAdmin() {
  const router = useRouter() // Initialize the router
  const [resources, setResources] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch resources with pagination
  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true)
      const { data, meta, error } = await getPaginatedResources(currentPage, 5) // Fetch 5 items per page
      if (error) {
        console.error("Error fetching resources:", error)
      } else {
        setResources(data)
        setTotalPages(meta.totalPages)
      }
      setIsLoading(false)
    }

    fetchResources()
  }, [currentPage])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      searchTerm === "" || resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      categoryFilter === "" ||
      categoryFilter === "all" ||
      resource.category?.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteResource(id)
      if (error) {
        toast({
          title: "Delete failed ❌",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Delete successful 🍾",
          description: "The resource has been deleted successfully.",
        })
        setResources(resources.filter((resource) => resource.id !== id)) // Remove the deleted resource from the list
      }
    } catch (err) {
      console.error("Error deleting resource:", err)
      toast({
        title: "Unexpected error ❌",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const handleUpdate = (id: string) => {
    try {
      router.push(`/admin/resources/update/${id}`) // Navigate to the update page with the resource ID
    } catch (err) {
      console.error("Error navigating to update page:", err)
      toast({
        title: "Navigation failed ❌",
        description: "Unable to navigate to the update page. Please try again later.",
        variant: "destructive",
      })
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "PDF":
        return <FileText className="h-10 w-10 text-rose-500" />
      case "Video":
        return <ExternalLink className="h-10 w-10 text-blue-500" />
      default:
        return <FileText className="h-10 w-10 text-primary" />
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
          <h1 className="text-2xl md:text-3xl font-bold web3-gradient-text">Resources Management</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Upload, edit, and manage educational resources
          </p>
        </div>
        <Button className="web3-button-purple w-full sm:w-auto" asChild>
          <Link href="/admin/resources/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Resource
          </Link>
        </Button>
      </div>

      <Card className="border border-purple-500/30 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
          <CardTitle>Filter Resources</CardTitle>
          <CardDescription>Search and filter the resource library</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-500" />
              <Input
                placeholder="Search resources..."
                className="pl-8 border-purple-500/30 focus-visible:ring-purple-500/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Farming">Farming</SelectItem>
                <SelectItem value="Blockchain">Blockchain</SelectItem>
                <SelectItem value="Supply Chain">Supply Chain</SelectItem>
                <SelectItem value="Web3">Web3</SelectItem>
                <SelectItem value="Quality">Quality</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="downloads">Most Downloads</SelectItem>
                <SelectItem value="title">Title (A-Z)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <p>Loading resources...</p>
        ) : (
          filteredResources.map((resource) => (
            <Card
              key={resource.id}
              className="overflow-hidden border-purple-600/30 hover:border-purple-600/60 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 p-3 md:p-4 flex items-center justify-center md:w-24">
                  {getResourceIcon(resource.type)}
                </div>
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg">{resource.title}</h3>
                      <div className="flex items-center mt-1 space-x-2 md:space-x-4 flex-wrap">
                        <span
                          className={`text-[10px] md:text-xs px-1.5 py-0.5 md:px-2 md:py-1 rounded-full ${
                            resource.type === "PDF"
                              ? "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          }`}
                        >
                          {resource.type}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground">Category: {resource.category}</span>
                      </div>
                      <div className="flex items-center mt-1 space-x-2 md:space-x-4 flex-wrap">
                        <span className="text-xs md:text-sm text-muted-foreground">Added: {resource.dateAdded}</span>
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center">
                          <Download className="h-3 w-3 mr-1" /> {resource.downloads} downloads
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end md:self-start mt-2 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 hover:bg-purple-500/10 h-8 px-2 md:px-3"
                        onClick={() => handleUpdate(resource.id)} // Handle update
                      >
                        <Upload className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2 text-purple-500" />
                        <span className="hidden md:inline">Update</span>
                      </Button>
                      <DeleteButton
                       entityId={resource.id}
                      entityName={resource.title}
                      onDelete={handleDelete} // Pass the delete handler
                      entityType="Resource" // Optional: Specify the entity type for better context
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
