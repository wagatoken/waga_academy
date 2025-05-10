"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { FileText, Download, Coffee, Globe, Lightbulb, Search, BookOpen, Leaf, Coins, Video, Music } from "lucide-react";

// Resource categories
const categories = {
  All: "All",
  Farming: "Farming",
  Blockchain: "Blockchain",
  "Supply Chain": "Supply Chain",
  Web3: "Web3 & Blockchain",
  Quality: "Quality Assurance",
};

// Define a mapping between file types and icons
const fileTypeIcons = {
  PDF: <FileText className="h-6 w-6 text-primary" />,
  Video: <Video className="h-6 w-6 text-primary" />,
  Image: <FileText className="h-6 w-6 text-primary" />, // Placeholder for Image type
  Audio: <Music className="h-6 w-6 text-primary" />,
  Document: <BookOpen className="h-6 w-6 text-primary" />,
  Article: <FileText className="h-6 w-6 text-primary" />,
};

export default function ResourcesPage() {
  const [resources, setResources] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Dynamically fetch resources from the API
  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch("/api/resources");
        const data = await response.json();

        // Update the resources state with the data array from the API response
        setResources(data.data);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    };

    fetchResources();
  }, []);

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tighter web3-dual-gradient-text-glow">Community Resources</h1>
            <p className="text-muted-foreground">Exclusive content for WAGA Early Access Community members</p>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" className="border-purple-600/30 hover:border-purple-600/60">
              <Link href="/community/dashboard">Dashboard</Link>
            </Button>
            <Button asChild className="web3-button-purple">
              <Link href="/community/resources/bookmarks">My Bookmarks</Link>
            </Button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="All" className="w-full">
          <TabsList className="flex flex-wrap h-auto">
            {Object.entries(categories).map(([key, label]) => (
              <TabsTrigger key={key} value={key} className="mb-1">
                {label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.entries(categories).map(([key]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(Array.isArray(resources) ? resources : [])
                  .filter(
                    (resource) =>
                      (key === "All" || resource.category === key) &&
                      (searchQuery === "" || resource.title.toLowerCase().includes(searchQuery.toLowerCase()))
                  )
                  .map((resource) => (
                    <Card key={resource.id} className="web3-card flex flex-col h-full hover:border-purple-500/40 transition-colors">
                      <div className="relative h-48 w-full">
                        <Image
                          src={resource.image || "/placeholder.svg"}
                          alt={resource.title}
                          fill
                          className="object-cover rounded-t-lg"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-primary text-white">{resource.resource_type}</Badge>
                        </div>
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-2">
                          <div className="bg-primary/10 p-2 rounded-md">
                            {fileTypeIcons[resource.resource_type] || <FileText className="h-6 w-6 text-primary" />}
                          </div>
                          <CardTitle className="text-xl">{resource.title}</CardTitle>
                        </div>
                        <CardDescription>
                          <Badge variant="outline" className="mt-2">
                            {resource.category}
                          </Badge>
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pb-2 flex-grow">
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full web3-button-purple">
                          <Link href={`/community/resources/${resource.id}`}>
                            {resource.downloadable ? (
                              <>
                                <Download className="mr-2 h-4 w-4" /> Download
                              </>
                            ) : (
                              <>
                                <FileText className="mr-2 h-4 w-4" /> View Resource
                              </>
                            )}
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
