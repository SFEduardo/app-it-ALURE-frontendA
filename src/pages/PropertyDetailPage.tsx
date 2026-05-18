import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useParams, useNavigate } from "react-router"
import Header from "@/components/Header"
import { type Property, type Review } from "@/data/properties"
import {
  getPropertyById,
  addReview,
  updateReview,
  deleteReview,
  getSavedFavoriteIds,
  saveFavoriteIds,
} from "@/lib/propertyStorage"

export default function PropertyDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const propertyId = Number(id)
  const { getAccessTokenSilently, user, isAuthenticated, loginWithRedirect } =
    useAuth0()

  const [property, setProperty] = useState<Property | null>(null)
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<number[]>([])

  useEffect(() => {
    const loadProperty = async () => {
      try {
        const token = user ? await getAccessTokenSilently() : undefined
        const loadedProperty = await getPropertyById(propertyId, token)
        setProperty(loadedProperty)
      } catch (error) {
        console.error("Error loading property:", error)
        setProperty(null)
      } finally {
        setLoading(false)
      }
    }

    if (!isNaN(propertyId)) {
      loadProperty()
    } else {
      setLoading(false)
    }
  }, [getAccessTokenSilently, user?.sub, propertyId])

  useEffect(() => {
    setFavorites(getSavedFavoriteIds(user?.sub))
  }, [user?.sub])

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
      saveFavoriteIds(updated, user?.sub)
      return updated
    })
  }
  const [newReview, setNewReview] = useState({ rating: 5, text: "" })
  const [editingReviewId, setEditingReviewId] = useState<number | null>(null)

  const getCurrentUserName = () =>
    user?.nickname || user?.name || "Usuario Actual"

  const canModifyReview = (review: Review) =>
    isAuthenticated &&
    (review.authorId
      ? review.authorId === user?.sub
      : review.author === getCurrentUserName())

  const handleSaveReview = async () => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }

    if (!newReview.text.trim() || !property) return

    const baseReview = {
      author: getCurrentUserName(),
      authorId: user?.sub,
      rating: newReview.rating,
      text: newReview.text,
    }

    try {
      if (editingReviewId) {
        const updatedReview = await updateReview(
          property.id,
          editingReviewId,
          {
            rating: baseReview.rating,
            text: baseReview.text,
          },
          await getAccessTokenSilently()
        )

        setProperty((prev) =>
          prev
            ? {
                ...prev,
                reviews: prev.reviews?.map((review) =>
                  review.id === editingReviewId ? updatedReview : review
                ),
              }
            : prev
        )
      } else {
        const newSavedReview = await addReview(
          property.id,
          baseReview,
          await getAccessTokenSilently()
        )

        setProperty((prev) =>
          prev
            ? {
                ...prev,
                reviews: [newSavedReview, ...(prev.reviews || [])],
              }
            : prev
        )
      }
      setNewReview({ rating: 5, text: "" })
      setEditingReviewId(null)
    } catch (error) {
      console.error("Error saving review:", error)
    }
  }

  const handleEditReview = (review: Review) => {
    if (!isAuthenticated) {
      loginWithRedirect()
      return
    }
    setEditingReviewId(review.id)
    setNewReview({ rating: review.rating, text: review.text })
  }

  const handleCancelEdit = () => {
    setEditingReviewId(null)
    setNewReview({ rating: 5, text: "" })
  }

  const handleDeleteReview = async (reviewId: number) => {
    if (!property || !isAuthenticated) {
      if (!isAuthenticated) loginWithRedirect()
      return
    }

    try {
      await deleteReview(property.id, reviewId, await getAccessTokenSilently())
      setProperty((prev) =>
        prev
          ? {
              ...prev,
              reviews: (prev.reviews || []).filter(
                (review) => review.id !== reviewId
              ),
            }
          : prev
      )
      if (editingReviewId === reviewId) {
        handleCancelEdit()
      }
    } catch (error) {
      console.error("Error deleting review:", error)
    }
  }

  const avgRating =
    property?.reviews && property.reviews.length > 0
      ? (
          property.reviews.reduce((sum, r) => sum + r.rating, 0) /
          property.reviews.length
        ).toFixed(1)
      : 0

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-slate-900"></div>
          <p className="mt-4 text-slate-600">Cargando ficha técnica...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <main className="container mx-auto px-4 py-10">
          <button
            onClick={() => navigate("/")}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ← Volver al Catálogo
          </button>
          <div className="rounded-[2rem] border border-slate-300 bg-white p-10 text-center text-slate-700 shadow-sm">
            <h1 className="text-3xl font-bold text-slate-950">
              Ficha no encontrada
            </h1>
            <p className="mt-4 text-sm text-slate-600">
              La ficha que intentas ver no existe o no se ha guardado
              correctamente.
            </p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="container mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          ← Volver al Catálogo
        </button>

        <div className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-slate-950">
              {property.title}
            </h1>
            <p className="mt-2 text-lg text-slate-600">
              Estilo: {property.style}
            </p>
          </div>
          <button
            className={`rounded-full border border-slate-900 px-6 py-3 font-semibold transition ${favorites.includes(property.id) ? "bg-slate-900 text-white" : "text-slate-900 hover:bg-slate-100"}`}
            onClick={() => toggleFavorite(property.id)}
          >
            {favorites.includes(property.id)
              ? "♥ Quitar de Favoritos"
              : "♡ Agregar a Favoritos"}
          </button>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <div className="col-span-2 overflow-hidden rounded-[2rem] border border-dashed border-slate-300 bg-slate-100 text-slate-500">
            {property.imageUrls && property.imageUrls[0] ? (
              <img
                src={property.imageUrls[0]}
                alt={property.imageLabel}
                className="h-96 w-full object-cover"
              />
            ) : (
              <div className="flex h-96 items-center justify-center">
                {property.imageLabel}
              </div>
            )}
          </div>
          <div className="grid auto-rows-max gap-4">
            {property.imageUrls?.slice(1, 4).map((url, index) => (
              <div
                key={index}
                className="flex h-28 items-center justify-center overflow-hidden rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-100 text-slate-500"
              >
                {url ? (
                  <img
                    src={url}
                    alt={`Imagen ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>
                    {index === 0
                      ? "Interior 1"
                      : index === 1
                        ? "Interior 2"
                        : "Plano"}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <section className="mb-8 rounded-[2rem] border border-slate-300 bg-white p-8">
          <h2 className="mb-6 border-b border-slate-300 pb-4 text-2xl font-bold text-slate-950">
            Especificaciones Técnicas
          </h2>
          <div className="space-y-4">
            <p>
              <span className="font-bold">Estilo:</span> {property.style} |{" "}
              <span className="font-bold">Dimensiones:</span> {property.area} m²
            </p>
            <p>
              <span className="font-bold">Tipo:</span> {property.type}
            </p>
            <p>
              <span className="font-bold">Colores:</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(property.colors) && property.colors.length > 0 ? (
                property.colors.map((color) => (
                  <span
                    key={color}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white"
                    title={color}
                    style={{ backgroundColor: color }}
                  />
                ))
              ) : (
                <span>
                  {Array.isArray(property.colors)
                    ? "Ninguno"
                    : property.colors || "Ninguno"}
                </span>
              )}
            </div>
            <p>
              <span className="font-bold">Acabados:</span>{" "}
              {Array.isArray(property.finishes)
                ? property.finishes.join(", ")
                : property.finishes}
            </p>
            <p>
              <span className="font-bold">Distribución:</span>{" "}
              {property.distribution}
            </p>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-300 bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold text-slate-950">
            Valoraciones y Reseñas
          </h2>

          <div className="mb-8 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 text-5xl leading-none">
              <span className="whitespace-nowrap">
                {"⭐".repeat(Math.round(Number(avgRating)))}
              </span>
              <span className="text-lg leading-none text-slate-500">
                {avgRating}/5
              </span>
            </div>
            <p className="text-slate-600">
              basado en {property.reviews?.length || 0} opiniones
            </p>
          </div>

          <div className="mb-8 space-y-6">
            <div className="rounded-lg border border-slate-300 bg-slate-50 p-4">
              <div className="mb-4 flex flex-col gap-4">
                <div>
                  <p className="mb-2 text-sm font-semibold text-slate-700">
                    Tu Opinión
                  </p>
                  {!isAuthenticated ? (
                    <div className="mb-4 rounded-xl border border-orange-300 bg-orange-50 p-4 text-sm text-orange-900">
                      Debes iniciar sesión para dejar una reseña.
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <button
                        type="button"
                        key={value}
                        onClick={() =>
                          isAuthenticated &&
                          setNewReview({ ...newReview, rating: value })
                        }
                        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                          newReview.rating >= value
                            ? "bg-slate-900 text-white"
                            : "bg-slate-100 text-slate-600"
                        } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
                        disabled={!isAuthenticated}
                      >
                        {value} ⭐
                      </button>
                    ))}
                  </div>
                </div>
                <textarea
                  value={newReview.text}
                  onChange={(e) =>
                    setNewReview({ ...newReview, text: e.target.value })
                  }
                  placeholder="Escribe tu opinión aquí..."
                  className="w-full rounded-lg border border-slate-300 bg-white p-3 text-slate-900 outline-none focus:border-slate-900 disabled:cursor-not-allowed disabled:bg-slate-100"
                  rows={4}
                  disabled={!isAuthenticated}
                />
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleSaveReview}
                  className="rounded-full border border-slate-900 px-6 py-3 font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  {editingReviewId
                    ? "Guardar cambios"
                    : isAuthenticated
                      ? "Publicar Reseña"
                      : "Iniciar sesión para publicar"}
                </button>
                {editingReviewId ? (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                  >
                    Cancelar edición
                  </button>
                ) : null}
              </div>
            </div>

            {property.reviews && property.reviews.length > 0 && (
              <div className="space-y-4">
                {property.reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-slate-200 pb-4 last:border-none"
                  >
                    <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {review.author}
                        </p>
                        <p className="text-sm text-slate-500">
                          {"⭐".repeat(review.rating)}
                        </p>
                      </div>
                      {canModifyReview(review) ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleEditReview(review)}
                            className="rounded-full border border-slate-900 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          >
                            Editar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteReview(review.id)}
                            className="rounded-full border border-red-500 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                          >
                            Eliminar
                          </button>
                        </div>
                      ) : null}
                    </div>
                    <p className="text-slate-700">{review.text}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
