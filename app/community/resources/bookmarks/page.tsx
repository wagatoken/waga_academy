"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch("/api/resources/bookmarks");
        const data = await response.json();

        if (!response.ok) {
          console.error("Error fetching bookmarks:", data.error);
          return;
        }

        setBookmarks(data);
      } catch (error) {
        console.error("Error fetching bookmarks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!bookmarks.length) {
    return <div>No bookmarks found.</div>;
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-6">Your Bookmarks</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookmarks.map((bookmark) => (
          <Card key={bookmark.id} className="hover-lift">
            <CardHeader>
              <CardTitle>{bookmark.resource.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{bookmark.resource.description}</p>
              <Link href={`/community/resources/${bookmark.resource.id}`}>
                <Button variant="outline" className="mt-4">
                  View Resource
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
