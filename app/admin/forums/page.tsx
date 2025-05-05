"use client";

import { useState, useEffect } from "react";
import { toast } from "@/components/ui/toast"; // Import toast for feedback
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Eye, MessageSquare, Plus, Search, Trash2, User, Clock, Tag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getForumTopics, deleteForumTopic } from "@/app/api/forums/actions";
import { DeleteButton } from "@/components/admin/delete-button";

export default function ForumsAdmin() {
  const router = useRouter();
  const [topics, setTopics] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch topics with pagination
  useEffect(() => {
    const fetchTopics = async () => {
      setIsLoading(true);
      try {
        const { data, meta, error } = await getForumTopics(currentPage, 10); // Fetch 10 topics per page
        if (error) {
          throw new Error(error);
        }
        setTopics(data || []); // Ensure topics is always an array
        setTotalPages(meta?.totalPages || 1); // Set total pages from meta
      } catch (error) {
        console.error("Error fetching topics:", error);
        toast({
          title: "Error fetching topics",
          description: "Unable to load topics. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopics();
  }, [currentPage]);

  // Filter topics based on search and category
  const filteredTopics = (Array.isArray(topics) ? topics : []).filter((topic) => {
    const matchesSearch = searchTerm === "" || topic.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      categoryFilter === "" || categoryFilter === "all" || topic.category?.name?.toLowerCase() === categoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Handle delete operation
  const handleDelete = async (id: string) => {
    try {
      const { error } = await deleteForumTopic(id);
      if (error) {
        toast({
          title: "Delete failed ❌",
          description: error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Delete successful 🍾",
          description: "The topic has been deleted successfully.",
        });
        setTopics(topics.filter((topic) => topic.id !== id)); // Remove the deleted topic from the list
      }
    } catch (err) {
      console.error("Error deleting topic:", err);
      toast({
        title: "Unexpected error ❌",
        description: "An unexpected error occurred. Please try again later.",
        variant: "destructive",
      });
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold web3-gradient-text">Forums Management</h1>
          <p className="text-muted-foreground mt-1 md:mt-2 text-sm md:text-base">
            Manage forum topics and discussions
          </p>
        </div>
        <Button className="web3-button-purple w-full sm:w-auto" asChild>
          <Link href="/admin/forums/new">
            <Plus className="mr-2 h-4 w-4" /> Create New Topic
          </Link>
        </Button>
      </div>

      <Card className="border border-purple-500/30 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
          <CardTitle>Filter Topics</CardTitle>
          <CardDescription>Search and filter forum topics</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          <div className="grid grid-cols-3 gap-3 md:grid-cols-3 md:gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-purple-500" />
              <Input
                placeholder="Search topics..."
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
                <SelectItem value="Blockchain">Blockchain</SelectItem>
                <SelectItem value="Farming">Farming</SelectItem>
                <SelectItem value="Web3">Web3</SelectItem>
                <SelectItem value="Quality">Quality</SelectItem>
                <SelectItem value="Events">Events</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <p>Loading topics...</p>
        ) : (
          filteredTopics.map((topic) => (
            <Card
              key={topic.id}
              className="overflow-hidden border-purple-600/30 hover:border-purple-600/60 transition-all shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col md:flex-row">
                <div className="bg-gradient-to-br from-purple-500/20 to-blue-500/10 p-3 md:p-4 flex items-center justify-center md:w-24">
                  <MessageSquare className="h-8 w-8 md:h-10 md:w-10 text-purple-500" />
                </div>
                <div className="flex-1 p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg">{topic.title || "Untitled Topic"}</h3>
                      <div className="flex items-center mt-1 space-x-2 md:space-x-4 flex-wrap">
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center">
                          <User className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1 text-blue-500" /> {topic.user?.first_name || "Unknown"}
                        </span>
                        <span className="text-xs md:text-sm text-muted-foreground flex items-center">
                          <Tag className="h-3 w-3 md:h-3.5 md:w-3.5 mr-1" /> {topic.category?.name || "Uncategorized"}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 self-end md:self-start mt-2 md:mt-0">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-purple-500/30 hover:bg-purple-500/10 h-8 px-2 md:px-3"
                        asChild
                      >
                        <Link href={`/admin/forums/${topic.id}`}>
                          <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 md:mr-2 text-purple-500" />
                          <span className="hidden md:inline">View</span>
                        </Link>
                      </Button>
                      <DeleteButton
                        entityId={topic.id}
                        entityName={topic.title}
                        onDelete={handleDelete}
                        entityType="Topic"
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
  );
}
