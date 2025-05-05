"use client";

import type React from "react";
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { createForumTopic, getForumCategories } from "@/app/api/forums/actions";
import { toast } from "@/components/ui/toast"; // Import toast for feedback

export default function NewForumTopic() {
  const router = useRouter() 
  const [isSaving, setIsSaving] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(""); // Store selected category ID
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [categories, setCategories] = useState([]); // Store fetched categories
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const { data, error } = await getForumCategories();
        if (error) {
          throw new Error(error);
        }
        setCategories(data || []); // Ensure categories is always an array
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast({
          title: "Error fetching categories",
          description: "Unable to load categories. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      
        // Create a FormData object
      const formData = new FormData();
      formData.append("category_id", category);
      formData.append("title", title);
      formData.append("content", content);
      formData.append("is_pinned", isPinned ? "true" : "false");

      const { error } = await createForumTopic(formData);

      if (error) {
        throw new Error(error);
      }

      toast({
        title: "Success 🎉",
        description: "Forum topic created successfully!",
        variant: "default",
      });
      router.push("/admin/forums"); // Redirect to the forums page after success

      // Reset form after success
      setTitle("");
      setCategory("");
      setContent("");
      setTags("");
      setIsPinned(false);
    } catch (error) {
      console.error("Error creating forum topic:", error);
      toast({
        title: "Error ❌",
        description: "Failed to create forum topic. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold web3-gradient-text">Create New Forum Topic</h1>
        <p className="text-muted-foreground mt-2">Start a new discussion in the community forums</p>
      </div>

      <Card className="border border-purple-500/30 shadow-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Topic Details</CardTitle>
            <CardDescription>Provide information about the topic you're creating</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Topic Title</Label>
              <Input
                id="title"
                placeholder="Enter topic title"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-purple-500/30 focus:ring-purple-500/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              {isLoadingCategories ? (
                <p>Loading categories...</p>
              ) : (
                <Select
                  required
                  value={category}
                  onValueChange={(value) => setCategory(value)} // Set the selected category ID
                >
                  <SelectTrigger className="border-purple-500/30 focus:ring-purple-500/30">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Topic Content</Label>
              <Textarea
                id="content"
                placeholder="Write your topic content here..."
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="border-purple-500/30 focus:ring-purple-500/30"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma separated)</Label>
              <Input
                id="tags"
                placeholder="coffee, blockchain, farming, etc."
                value={tags}
                onChange={(e) => setTags(e.target.value)}
              />
            </div>

            <div className="flex items-center space-x-2 py-2">
              <Checkbox
                id="is-pinned"
                checked={isPinned}
                onCheckedChange={(checked) => setIsPinned(checked as boolean)}
                className="border-purple-500/30 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
              />
              <Label htmlFor="is-pinned" className="cursor-pointer">
                Pin this topic to the top of the forum
              </Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              type="button"
              onClick={() => window.history.back()}
              className="border-purple-600/30 hover:border-purple-600/60"
            >
              Cancel
            </Button>
            <Button className="web3-button-purple" type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Create Topic
                </>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
