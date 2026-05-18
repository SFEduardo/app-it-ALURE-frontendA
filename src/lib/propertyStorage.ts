import {
  initialProperties,
  type Property,
  type Review,
} from "@/data/properties"

const REVIEW_STORAGE_KEY = "propertyReviews"
const getFavoritesKey = (userId?: string) =>
  `favoriteProperties_${userId || "anonymous"}`
const API_BASE_URL = "http://localhost:3000/api"

const mapApiProperty = (property: any): Property => ({
  id: property.id,
  title: property.name,
  style: property.style,
  area: property.price,
  imageLabel: "Imagen",
  type: property.category,
  colors: property.color ? property.color.split(", ") : [],
  finishes: property.finishes || [],
  distribution: property.distribution || "",
  imageUrls: property.images || [],
  reviews: property.reviews || [],
})

export const getSavedReviewMap = (): Record<number, Review[]> => {
  if (typeof window === "undefined") return {}
  try {
    const saved = localStorage.getItem(REVIEW_STORAGE_KEY)
    if (!saved) return {}
    const parsed = JSON.parse(saved) as Record<string, Review[]>
    return Object.fromEntries(
      Object.entries(parsed).map(([key, value]) => [Number(key), value])
    )
  } catch {
    return {}
  }
}

export const getSavedFavoriteIds = (userId?: string): number[] => {
  if (typeof window === "undefined") return []
  try {
    const key = getFavoritesKey(userId)
    const saved = localStorage.getItem(key)
    if (!saved) return []
    return JSON.parse(saved) as number[]
  } catch {
    return []
  }
}

export const saveFavoriteIds = (favoriteIds: number[], userId?: string) => {
  if (typeof window === "undefined") return
  try {
    const key = getFavoritesKey(userId)
    localStorage.setItem(key, JSON.stringify(favoriteIds))
  } catch {
    // ignore storage errors
  }
}

export const getSavedProperties = async (
  token?: string
): Promise<Property[]> => {
  try {
    const headers: Record<string, string> = {}
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
    const response = await fetch(`${API_BASE_URL}/properties`, {
      headers,
    })
    if (!response.ok) throw new Error("Failed to fetch properties")
    const properties = await response.json()
    return properties.map(mapApiProperty)
  } catch {
    return initialProperties
  }
}

export const getPropertyById = async (
  id: number,
  token?: string
): Promise<Property> => {
  const headers: Record<string, string> = {}
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    headers,
  })
  if (!response.ok) throw new Error("Failed to fetch property")
  const data = await response.json()
  return mapApiProperty(data)
}

export const createProperty = async (
  propertyData: FormData,
  token: string
): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/properties`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: propertyData,
  })
  if (!response.ok) throw new Error("Failed to create property")
  const data = await response.json()
  return mapApiProperty(data)
}

export const updateProperty = async (
  id: number,
  propertyData: FormData,
  token: string
): Promise<Property> => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: propertyData,
  })
  if (!response.ok) throw new Error("Failed to update property")
  const data = await response.json()
  return mapApiProperty(data)
}

export const deleteProperty = async (
  id: number,
  token: string
): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/properties/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (!response.ok) throw new Error("Failed to delete property")
}

export const addReview = async (
  propertyId: number,
  review: {
    author: string
    authorId?: string
    rating: number
    text: string
  },
  token: string
): Promise<Review> => {
  const response = await fetch(
    `${API_BASE_URL}/properties/${propertyId}/reviews`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    }
  )
  if (!response.ok) throw new Error("Failed to save review")
  return await response.json()
}

export const updateReview = async (
  propertyId: number,
  reviewId: number,
  review: {
    rating: number
    text: string
  },
  token: string
): Promise<Review> => {
  const response = await fetch(
    `${API_BASE_URL}/properties/${propertyId}/reviews/${reviewId}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(review),
    }
  )
  if (!response.ok) throw new Error("Failed to update review")
  return await response.json()
}

export const deleteReview = async (
  propertyId: number,
  reviewId: number,
  token: string
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/properties/${propertyId}/reviews/${reviewId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  )
  if (!response.ok) throw new Error("Failed to delete review")
}
