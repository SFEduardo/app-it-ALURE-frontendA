import React, { createContext, useContext, useState, useEffect } from "react"
import type { ReactNode } from "react"
import type { Review } from "@/data/properties"

interface ReviewsContextType {
  reviews: Record<number, Review[]>
  updateReviews: (propertyId: number, reviews: Review[]) => void
}

const ReviewsContext = createContext<ReviewsContextType | undefined>(undefined)

export const useReviews = () => {
  const context = useContext(ReviewsContext)
  if (!context) {
    throw new Error("useReviews must be used within a ReviewsProvider")
  }
  return context
}

interface ReviewsProviderProps {
  children: ReactNode
}

export const ReviewsProvider: React.FC<ReviewsProviderProps> = ({
  children,
}) => {
  const [reviews, setReviews] = useState<Record<number, Review[]>>({})

  useEffect(() => {
    // Load from localStorage on mount
    const saved = localStorage.getItem("propertyReviews")
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as Record<string, Review[]>
        const numeric: Record<number, Review[]> = {}
        Object.entries(parsed).forEach(([key, value]) => {
          numeric[Number(key)] = value
        })
        setReviews(numeric)
      } catch (error) {
        console.error("Error loading reviews from localStorage:", error)
      }
    }
  }, [])

  const updateReviews = (propertyId: number, newReviews: Review[]) => {
    setReviews((prev) => ({
      ...prev,
      [propertyId]: newReviews,
    }))
    // Save to localStorage
    const stringified: Record<string, Review[]> = {}
    Object.entries({ ...reviews, [propertyId]: newReviews }).forEach(
      ([key, value]) => {
        stringified[key] = value
      }
    )
    localStorage.setItem("propertyReviews", JSON.stringify(stringified))
  }

  return (
    <ReviewsContext.Provider value={{ reviews, updateReviews }}>
      {children}
    </ReviewsContext.Provider>
  )
}
