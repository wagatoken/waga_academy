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
import { Upload } from "lucide-react"
import { createResource } from "@/app/api/resources/actions"

export default function NewResource() {
  const router = useRouter() // Initialize the router
  const [isUploading, setIsUploading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    type: "",
    access: "public",
    tags: "",
    file: null,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData({ ...formData, [id]: value })
  }

  const handleSelectChange = (id: string, value: string) => {
    setFormData({ ...formData, [id]: value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name) // Display the selected file name
      setFormData({ ...formData, file: e.target.files[0] }) // Store the file in the formData
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // Prevent default form submission behavior
    setIsUploading(true)

    try {
      const resourceFormData = new FormData()
      resourceFormData.append("title", formData.title)
      resourceFormData.append("category", formData.category)
      resourceFormData.append("description", formData.description)
      resourceFormData.append("type", formData.type)
      resourceFormData.append("access", formData.access)
      resourceFormData.append("tags", formData.tags)
      resourceFormData.append("file", "/fake/path/to/resource.pdf") // Mock file path

      const { error } = await createResource(resourceFormData)
      if (error) {
        toast({
          title: "Upload failed ❌",
          description: error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Upload successful 🙌",
          description: "The resource has been uploaded successfully.",
        })
        router.push("/admin/resources") // Redirect to the resources page
      }
    } catch (err) {
      console.error("Error uploading resource:", err)
      toast({
        title: "Unexpected error ❌",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold web3-gradient-text">Upload New Resource</h1>
        <p className="text-muted-foreground mt-2">Add educational materials to the WAGA Academy library</p>
      </div>

      <Card className="border border-purple-500/30 shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Resource Details</CardTitle>
            <CardDescription>Provide information about the resource you're uploading</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Resource Title</Label>
                <Input
                  id="title"
                  placeholder="Enter resource title"
                  required
                  className="border-purple-500/30 focus:ring-purple-500/30"
                  value={formData.title}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  required
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
                >
                  <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="farming">Farming</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="supply-chain">Supply Chain</SelectItem>
                    <SelectItem value="web3">Web3</SelectItem>
                    <SelectItem value="quality">Quality</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of this resource"
                rows={4}
                required
                className="border-purple-500/30 focus:ring-purple-500/30"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="type">Resource Type</Label>
                <Select
                  required
                  value={formData.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="spreadsheet">Spreadsheet</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access">Access Level</Label>
                <Select
                  value={formData.access}
                  onValueChange={(value) => handleSelectChange("access", value)}
                >
                  <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public (Everyone)</SelectItem>
                    <SelectItem value="registered">Registered Users Only</SelectItem>
                    <SelectItem value="premium">Premium Members Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Upload File</Label>
              <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 flex flex-col items-center justify-center hover:bg-purple-500/5 transition-colors">
                <p className="text-sm text-muted-foreground">Drag and drop your file here, or click to browse</p>
                <p className="text-xs text-muted-foreground">Supports PDF, DOCX, PPTX, MP4, JPG, PNG (max 50MB)</p>
                {fileName && <p className="text-sm font-medium">Selected: {fileName}</p>}
                <div>
                  <label className="cursor-pointer">
                    <Input type="file" className="hidden" onChange={handleFileChange} />
                    <Button type="button" variant="outline" size="sm">
                      Browse Files
                    </Button>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="coffee, blockchain, farming, etc."
                className="border-purple-500/30 focus:ring-purple-500/30"
                value={formData.tags}
                onChange={handleInputChange}
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.history.back()}
              className="border-purple-600/30 hover:border-purple-600/60"
              disabled={isUploading}
            >
              {isUploading ? "Loading..." : "Cancel"}
            </Button>
            <Button className="web3-button-purple" type="submit" disabled={isUploading}>
              {isUploading ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" /> Upload Resource
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
