"use client";
export const runtime = "edge"

import { useRouter } from "next/navigation"; // Use next/navigation instead of next/router
import { usePathname } from "next/navigation"; // Import usePathname to extract the ID
import { useState, useEffect } from "react"; // Re-import useState and useEffect
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ResourceDetails() {
  const pathname = usePathname(); // Use usePathname to get the current path
  const id = pathname.split("/").pop(); // Extract the ID from the path
  const [resource, setResource] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      // Fetch resource details using the ID
      const fetchResource = async () => {
        try {
          const response = await fetch(`/api/resources/${id}`);
          const data = await response.json();
          setResource(data);
        } catch (error) {
          console.error("Error fetching resource details:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchResource();
    }
  }, [id]);

  if (isLoading) {
    return <p>Loading resource details...</p>;
  }

  if (!resource) {
    return <p>Resource not found.</p>;
  }

  return (
    <div className="space-y-6">
      <Card className="border border-purple-500/30 shadow-md">
        <CardHeader className="bg-gradient-to-r from-purple-500/10 to-transparent">
          <CardTitle>{resource.title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 md:pt-6">
          <p className="text-muted-foreground">Category: {resource.category}</p>
          <p className="text-muted-foreground">Type: {resource.resource_type}</p>
          <p className="text-muted-foreground">Added: {resource.created_at}</p>
          <div className="mt-4">
            {resource.resource_type === "PDF" ? (
              <iframe
                src={resource.fileUrl}
                className="w-full h-96 border border-purple-500/30"
                title="Resource Preview"
              ></iframe>
            ) : resource.resource_type === "Video" ? (
              <video controls className="w-full h-96">
                <source src={resource.fileUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            ) : resource.resource_type === "Document" ? (
              <iframe
                src={resource.fileUrl}
                className="w-full h-96 border border-purple-500/30"
                title="Document Preview"
              ></iframe>
            ) : (
              <Button asChild>
                <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" /> Download Resource
                </a>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
