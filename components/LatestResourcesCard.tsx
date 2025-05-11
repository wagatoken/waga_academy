"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Coffee } from "lucide-react";

export default function LatestResourcesCard({ resources }) {
  return (
    <div className="space-y-4">
      {resources.length > 0 ? (
        resources.map((resource, index) => {
          // Assign different card styles based on index
          const bgClasses = ["bg-purple-500/10", "bg-blue-500/10", "bg-teal-500/10"];
          const bgClass = bgClasses[index % bgClasses.length];

          // Determine icon based on resource type
          let icon = <Globe className="h-8 w-8 text-purple-400" />;
          if (resource.resource_type === "Video") icon = <Coffee className="h-8 w-8 text-blue-400" />;
          if (resource.resource_type === "PDF") icon = <Coffee className="h-8 w-8 text-teal-400" />;

          // Use provided icon if available
          if (resource.icon) icon = resource.icon;

          return (
            <div
              key={resource.id}
              className="flex items-start gap-4 pb-4 border-b border-purple-500/20 cursor-pointer"
              onClick={() => window.location.href = `/community/resources/${resource.id}`}
            >
              <div className={`${bgClass} p-2 rounded-md`}>{icon}</div>
              <div className="space-y-1">
                <p className="text-sm font-medium">{resource.title}</p>
                <Badge variant="outline" className={`text-xs ${bgClass} border-purple-500/30 text-purple-300`}>
                  {resource.resource_type || "Resource"}
                </Badge>
                <div className="pt-1 z-10">
                  <Button
                    asChild
                    size="sm"
                    variant="outline"
                    className="border-purple-600/30 hover:border-purple-600/60"
                  >
                    <Link href={`/community/resources/${resource.id}`}>Access</Link>
                  </Button>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center text-sm text-muted-foreground">
          No Resources. Stay tuned for updates!
        </div>
      )}
    </div>
  );
}
