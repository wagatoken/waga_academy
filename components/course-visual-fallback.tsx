import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

interface CourseVisualFallbackProps {
  title: string
  category: string
}

export function CourseVisualFallback({ title, category }: CourseVisualFallbackProps) {
  // Get a category-specific background
  const getCategoryBackground = (category: string) => {
    switch (category) {
      case "Web3 & IT Infrastructure":
        return "bg-gradient-to-br from-emerald-900 to-purple-900"
      case "Finance & Accounting":
        return "bg-gradient-to-br from-emerald-900 to-blue-900"
      case "Coffee Cultivation":
        return "bg-gradient-to-br from-emerald-900 to-green-900"
      case "Supply Chain Management":
        return "bg-gradient-to-br from-emerald-900 to-amber-900"
      case "Marketing & Sales":
        return "bg-gradient-to-br from-purple-900 to-pink-900"
      case "Coffee Processing":
        return "bg-gradient-to-br from-amber-900 to-red-900"
      case "Sustainability & Ethics":
        return "bg-gradient-to-br from-green-900 to-teal-900"
      default:
        return "bg-gradient-to-br from-emerald-900 to-purple-900"
    }
  }

  return (
    <div
      className={`relative h-[225px] sm:h-[400px] rounded-xl overflow-hidden web3-card-glow-border ${getCategoryBackground(category)}`}
    >
      <div className="absolute inset-0 bg-black/20 z-10" />
      <div className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center px-4 mb-6">
          <h3 className="text-xl font-bold text-white mb-2 text-shadow-sm">{title}</h3>
          <p className="text-sm text-emerald-200 max-w-md">Interactive course visualization</p>
        </div>
        <Button size="lg" className="absolute bottom-8 bg-emerald-600/90 text-white hover:bg-emerald-600 animate-pulse">
          <Play className="h-5 w-5 mr-2" />
          Explore Course
        </Button>
      </div>
    </div>
  )
}
