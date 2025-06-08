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
          icon: <Code className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-purple-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent",
        }
      case "Finance & Accounting":
        return {
          gradient: "from-blue-900/90 to-purple-900/90",
          accent: "blue",
          icon: <CreditCard className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-blue-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent",
        }
      case "Coffee Cultivation":
        return {
          gradient: "from-emerald-900/90 to-green-900/90",
          accent: "green",
          icon: <Leaf className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-green-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent",
        }
      case "Supply Chain Management":
        return {
          gradient: "from-amber-900/90 to-emerald-900/90",
          accent: "amber",
          icon: <ShoppingCart className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-amber-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent",
        }
      case "Marketing & Sales":
        return {
          gradient: "from-purple-900/90 to-pink-900/90",
          accent: "purple",
          icon: <LineChart className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-pink-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500/10 via-transparent to-transparent",
        }
      case "Coffee Processing":
        return {
          gradient: "from-amber-900/90 to-red-900/90",
          accent: "amber",
          icon: <Coffee className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-amber-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/10 via-transparent to-transparent",
        }
      case "Sustainability & Ethics":
        return {
          gradient: "from-green-900/90 to-teal-900/90",
          accent: "green",
          icon: <Leaf className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-teal-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent",
        }
      default:
        return {
          gradient: "from-emerald-900/90 to-purple-900/90",
          accent: "emerald",
          icon: <BookOpen className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 text-emerald-300" />,
          pattern:
            "bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-500/10 via-transparent to-transparent",
        }
    }
  }

  const { gradient, accent, icon, pattern } = getCategoryStyles(category)

  return (
    <div className="relative h-[220px] xs:h-[260px] sm:h-[300px] md:h-[350px] lg:h-[400px] w-full rounded-xl overflow-hidden web3-card-glow-border">
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} z-0`} />

      {/* Pattern overlay */}
      <div className={`absolute inset-0 ${pattern} z-10`} />

      {/* Animated dots */}
      <div className="absolute inset-0 z-10 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 rounded-full bg-white/5 animate-float-slow"></div>
        <div className="absolute bottom-1/4 right-1/4 w-12 h-12 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full bg-white/5 animate-float animation-delay-2000"></div>
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pt-12 pb-6 px-4 sm:pt-16 sm:pb-5 sm:px-5 md:pt-20 md:pb-6 md:px-6">
        <div className="mb-3 sm:mb-4 md:mb-6">{icon}</div>
        <div className="text-center px-2 sm:px-4 mb-4 sm:mb-5 md:mb-6">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-white mb-2 sm:mb-2 text-shadow-sm line-clamp-2">
            {title}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-200 max-w-md line-clamp-2 sm:line-clamp-3">
            Comprehensive curriculum with expert-led instruction
          </p>
        </div>

        <Button
          size="sm"
          className={`bg-${accent}-600/90 text-white hover:bg-${accent}-600 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2 md:px-6 md:py-3 h-auto min-h-[32px] sm:min-h-[36px] md:min-h-[40px]`}
        >
          <BookOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span className="whitespace-nowrap">Course Details</span>
        </Button>
      </div>

      {/* Category badge */}
      <div className="absolute top-3 sm:top-4 md:top-5 left-2 sm:left-3 md:left-4 z-30">
        <span
          className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] xs:text-xs font-medium bg-${accent}-500/20 text-${accent}-300 border border-${accent}-500/30 truncate max-w-[120px] sm:max-w-[180px] md:max-w-none inline-block`}
        >
          {category}
        </span>
      </div>
    </div>
  )
}
