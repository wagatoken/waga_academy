"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/toast";

export default function NewTopicPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });

  // Fetch categories from API
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);
  const [categoryLocked, setCategoryLocked] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      setCategoriesError(null);
      try {
        const res = await fetch("/api/forums/categories");
        const { data, error } = await res.json();
        if (error) {
          setCategoriesError(error.message);
          setCategories([]);
        } else {
          setCategories(data || []);
        }
      } catch (err) {
        setCategoriesError("Failed to fetch categories.");
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const urlCategory = searchParams.get("category");
    if (urlCategory && categories.length > 0) {
      // Find the category by slug
      const found = categories.find((cat: any) => cat.slug === urlCategory);
      if (found) {
        setFormData((prev) => ({ ...prev, category: found.id }));
        setCategoryLocked(true);
      }
    }
  }, [searchParams, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({ ...prev, category: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title.trim() || !formData.category || !formData.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Call the API route to create a topic
      const res = await fetch("/api/forums/topics/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          content: formData.content,
        }),
      });
      const { data, error } = await res.json();

      if (error) {
        console.error("Error creating topic:", error);
        toast({
          title: "Error ❌",
          description: "Failed to create the topic. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Topic created 🎉",
        description: "Your topic has been posted successfully",
      });

      router.push("/community/dashboard");
    } catch (error) {
      console.error("Unexpected error:", error);
      toast({
        title: "Error ❌",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-12">
      <div className="space-y-6">
        <div>
          <Link href="/community/forums" className="text-primary hover:underline mb-2 inline-flex items-center">
            <ArrowLeft className="mr-1 h-4 w-4" /> Back to Forums
          </Link>
          <h1 className="text-3xl font-bold tracking-tighter mt-2 web3-gradient-text">Create New Topic</h1>
          <p className="text-muted-foreground">Start a new discussion in the community</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Topic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="title" className="text-sm font-medium">
                  Topic Title
                </label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter a descriptive title for your topic"
                  className="web3-input"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Category
                </label>
                <Select onValueChange={handleCategoryChange} value={formData.category} disabled={categoryLocked || categoriesLoading || !!categoriesError}>
                  <SelectTrigger className="web3-input">
                    <SelectValue placeholder={categoriesLoading ? "Loading..." : categoriesError ? "Failed to load categories" : "Select a category"} />
                  </SelectTrigger>
                  <SelectContent>
                    {categoriesLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : categoriesError ? (
                      <SelectItem value="error" disabled>Error loading categories</SelectItem>
                    ) : categories.length > 0 ? (
                      categories.map((category: any) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-categories" disabled>No categories available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="content" className="text-sm font-medium">
                  Content
                </label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Write your topic content here..."
                  className="min-h-[200px] web3-input"
                  value={formData.content}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  You can use basic formatting like **bold**, *italic*, and [links](url).
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => router.push("/community/forums")}>
                Cancel
              </Button>
              <Button type="submit" className="web3-button-purple" disabled={isSubmitting}>
                {isSubmitting ? "Creating Topic..." : "Create Topic"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
