import { BookOpen, Code, Coffee, CreditCard, LineChart, Leaf, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

// Course category types
type CourseCategory =
  | "Web3 & IT Infrastructure"
  | "Finance & Accounting"
  | "Coffee Cultivation"
  | "Supply Chain Management"
  | "Marketing & Sales"
  | "Coffee Processing"
  | "Sustainability & Ethics"

interface CourseIllustrationProps {
  category: CourseCategory
  title: string
}

export function CourseIllustration({ category, title }: CourseIllustrationProps) {
  // Get illustration and colors based on category
  const getCategoryStyles = (category: CourseCategory) => {
    switch (category) {
      case "Web3 & IT Infrastructure":
        return {
          gradient: "from-emerald-900/90 to-purple-900/90",
          accent: "emerald",
          icon: <Code className="h-16 w-16 text-purple-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent",
        }
      case "Finance & Accounting":
        return {
          gradient: "from-blue-900/90 to-purple-900/90",
          accent: "blue",
          icon: <CreditCard className="h-16 w-16 text-blue-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent",
        }
      case "Coffee Cultivation":
        return {
          gradient: "from-emerald-900/90 to-green-900/90",
          accent: "green",
          icon: <Leaf className="h-16 w-16 text-green-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent",
        }
      case "Supply Chain Management":
        return {
          gradient: "from-amber-900/90 to-emerald-900/90",
          accent: "amber",
          icon: <ShoppingCart className="h-16 w-16 text-amber-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent",
        }
      case "Marketing & Sales":
        return {
          gradient: "from-purple-900/90 to-pink-900/90",
          accent: "purple",
          icon: <LineChart className="h-16 w-16 text-pink-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent",
        }
      case "Coffee Processing":
        return {
          gradient: "from-amber-900/90 to-red-900/90",
          accent: "amber",
          icon: <Coffee className="h-16 w-16 text-amber-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent",
        }
      case "Sustainability & Ethics":
        return {
          gradient: "from-green-900/90 to-teal-900/90",
          accent: "green",
          icon: <Leaf className="h-16 w-16 text-teal-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent",
        }
      default:
        return {
          gradient: "from-emerald-900/90 to-purple-900/90",
          accent: "emerald",
          icon: <BookOpen className="h-16 w-16 text-emerald-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent",
        }
    }
  }

  const { gradient, accent, icon, pattern } = getCategoryStyles(category)

  return (
    <div className="relative h-[225px] sm:h-[400px] rounded-xl overflow-hidden web3-card-glow-border">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} z-0`} />

      {/* Pattern overlay */}
      <div className={`absolute inset-0 ${pattern} z-10`} />

      {/* Animated dots */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full bg-white/5 animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 rounded-full bg-white/5 animate-float animation-delay-2000"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <div className="mb-6">{icon}</div>
        <div className="text-center px-4 mb-6">
          <h3 className="text-xl font-bold text-white mb-2 text-shadow-sm">{title}</h3>
          <p className="text-sm text-emerald-200 max-w-md">Comprehensive curriculum with expert-led instruction</p>
        </div>

        <Button size="lg" className={`bg-${accent}-600/90 text-white hover:bg-${accent}-600`}>
          <BookOpen className="h-5 w-5 mr-2" />
          Course Details
        </Button>
      </div>

      {/* Category badge */}
      <div className="absolute top-4 left-4 z-30">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium bg-${accent}-500/20 text-${accent}-300 border border-${accent}-500/30`}
        >
          {category}
        </span>
      </div>
    </div>
  )
}
