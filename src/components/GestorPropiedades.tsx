import { useEffect, useState } from "react"
import { Link } from "react-router"
import Header from "@/components/Header"
import BotonFiltro from "@/components/BotonFiltro"
import SeccionGestion from "@/components/SeccionGestion"
import {
  type Property,
  type Review,
  STYLE_CATEGORIES,
  TYPE_CATEGORIES,
  COLOR_SWATCHES,
  FINISH_CATEGORIES,
  initialProperties,
} from "@/data/properties"
import { useAuth0 } from "@auth0/auth0-react"
import {
  getSavedFavoriteIds,
  getSavedProperties,
  saveFavoriteIds,
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/propertyStorage"

const imageSlotLabels = ["Fachada", "Interior 1", "Interior 2", "Plano"]

export default function GestorPropiedades() {
  const { user, getAccessTokenSilently } = useAuth0()
  const isAdmin = user?.email === "l22450193@itz.edu.mx"
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({
    title: "",
    style: "",
    area: "",
    imageLabel: "",
    type: "",
    colors: [] as string[],
    finishes: [] as string[],
    distribution: "",
    imageUrls: ["", "", "", ""],
    imageFiles: [null, null, null, null] as Array<File | null>,
  })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false)
  const [mostrarGestion, setMostrarGestion] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStyle, setSelectedStyle] = useState("")
  const [selectedType, setSelectedType] = useState("")
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedFinishes, setSelectedFinishes] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const token = user ? await getAccessTokenSilently() : undefined
        const loadedProperties = await getSavedProperties(token)
        setProperties(loadedProperties)
      } catch (error) {
        console.error("Error loading properties:", error)
        setProperties(initialProperties)
      } finally {
        setLoading(false)
      }
    }
    loadProperties()
  }, [getAccessTokenSilently, user?.sub])

  const resetForm = () => {
    setForm({
      title: "",
      style: "",
      area: "",
      imageLabel: "",
      type: "",
      colors: [],
      finishes: [],
      distribution: "",
      imageUrls: ["", "", "", ""],
      imageFiles: [null, null, null, null],
    })
  }

  useEffect(() => {
    setFavorites(getSavedFavoriteIds(user?.sub))
  }, [user?.sub])

  const guardarFicha = async () => {
    console.log("guardarFicha called")
    const areaValue = parseFloat(form.area.replace(/[^\d.]/g, ""))
    console.log("form:", form)
    console.log("areaValue:", areaValue, "isNaN:", Number.isNaN(areaValue))
    if (
      !form.title ||
      !form.style ||
      !form.area ||
      Number.isNaN(areaValue) ||
      areaValue <= 0
    ) {
      console.log("Validation failed")
      alert(
        "Por favor, completa todos los campos requeridos: Título, Estilo y Área (debe ser un número positivo)."
      )
      return
    }

    try {
      console.log("Getting token...")
      const token = await getAccessTokenSilently()
      console.log("Token obtained")

      const nextId =
        editingId !== null
          ? editingId
          : properties.reduce((maxId, item) => Math.max(maxId, item.id), 0) + 1

      const formData = new FormData()
      formData.append("id", String(nextId))
      formData.append("name", form.title)
      formData.append("description", form.distribution || "")
      formData.append("category", form.type || "Sin categoría")
      formData.append("style", form.style)
      formData.append("color", form.colors.join(", "))
      formData.append("price", String(areaValue))
      formData.append("finishes", JSON.stringify(form.finishes))
      formData.append("distribution", form.distribution)

      // Agregar archivos de imágenes
      console.log("imageFiles:", form.imageFiles)
      if (form.imageFiles && Array.isArray(form.imageFiles)) {
        form.imageFiles.forEach((file) => {
          if (file) {
            formData.append("images", file)
          }
        })
      }

      if (editingId !== null) {
        console.log("Updating property")
        const updated = await updateProperty(editingId, formData, token)
        setProperties((prev) =>
          prev.map((p) => (p.id === editingId ? updated : p))
        )
        setEditingId(null)
      } else {
        console.log("Creating property")
        const newProp = await createProperty(formData, token)
        setProperties((prev) => [...prev, newProp])
      }

      resetForm()
      setMostrarFormulario(false)
      console.log("Property saved successfully")
    } catch (error) {
      console.error("Error saving property:", error)
      alert(
        "Error al guardar la ficha técnica. Revisa la consola para más detalles."
      )
    }
  }

  const editarProyecto = (property: Property) => {
    setEditingId(property.id)
    setForm({
      title: property.title,
      style: property.style,
      area: String(property.area),
      imageLabel: property.imageLabel,
      type: property.type || "",
      colors: Array.isArray(property.colors)
        ? property.colors
        : property.colors
          ? property.colors.split(",").map((item: string) => item.trim())
          : [],
      finishes: Array.isArray(property.finishes)
        ? property.finishes
        : property.finishes
          ? property.finishes.split(",").map((item: string) => item.trim())
          : [],
      distribution: property.distribution || "",
      imageUrls: property.imageUrls
        ? [...property.imageUrls, "", "", "", ""].slice(0, 4)
        : ["", "", "", ""],
      imageFiles: [null, null, null, null],
    })
    setMostrarGestion(true)
    setMostrarFormulario(true)
  }

  const eliminarProyecto = async (id: number) => {
    try {
      const token = await getAccessTokenSilently()
      await deleteProperty(id, token)
      setProperties((prev) => prev.filter((item) => item.id !== id))
      if (editingId === id) {
        setEditingId(null)
        resetForm()
        setMostrarFormulario(false)
      }
    } catch (error) {
      console.error("Error deleting property:", error)
    }
  }

  const agregarProyecto = () => {
    setEditingId(null)
    resetForm()
    setMostrarFormulario(true)
  }

  const cancelarEdicion = () => {
    setEditingId(null)
    resetForm()
    setMostrarFormulario(false)
  }

  const toggleFavorite = (propertyId: number) => {
    setFavorites((prev) => {
      const updated = prev.includes(propertyId)
        ? prev.filter((id) => id !== propertyId)
        : [...prev, propertyId]
      saveFavoriteIds(updated, user?.sub)
      return updated
    })
  }

  const favoriteProperties = properties.filter((property) =>
    favorites.includes(property.id)
  )

  const filteredProperties = (
    showOnlyFavorites ? favoriteProperties : properties
  ).filter((property) => {
    const matchesSearch = property.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
    const matchesStyle =
      selectedStyle === "" || property.style === selectedStyle
    const matchesType = selectedType === "" || property.type === selectedType

    const colorValues = Array.isArray(property.colors)
      ? property.colors
      : property.colors
        ? property.colors.split(",").map((item: string) => item.trim())
        : []
    const matchesColor =
      selectedColors.length === 0 ||
      colorValues.some((color) => selectedColors.includes(color))

    const finishValues = Array.isArray(property.finishes)
      ? property.finishes
      : property.finishes
        ? property.finishes.split(",").map((item: string) => item.trim())
        : []
    const matchesFinish =
      selectedFinishes.length === 0 ||
      finishValues.some((finish) => selectedFinishes.includes(finish))

    return (
      matchesSearch &&
      matchesStyle &&
      matchesType &&
      matchesColor &&
      matchesFinish
    )
  })

  const getAvgRating = (reviews?: Review[]) => {
    if (!reviews || reviews.length === 0) return 0
    return (
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    ).toFixed(1)
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleFilters={() => setShowFilters(!showFilters)}
        showFilters={showFilters}
      />
      <main className="container mx-auto px-4 py-10">
        {loading ? (
          <div className="text-center">Cargando propiedades...</div>
        ) : (
          <>
            <section className="mb-12">
              <div className="mb-4 flex items-center justify-between gap-4">
                <h1 className="text-3xl font-bold text-slate-950">
                  Catálogo de Propiedades
                </h1>
                <div className="flex gap-3">
                  {isAdmin && (
                    <BotonFiltro
                      mostrarGestion={mostrarGestion}
                      alternarGestion={() => setMostrarGestion(!mostrarGestion)}
                    />
                  )}
                  <button
                    type="button"
                    onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${showOnlyFavorites ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"}`}
                  >
                    <span className="text-red-500">♥</span>
                    Mis Favoritos ({favorites.length})
                  </button>
                </div>
              </div>

              {showFilters && (
                <div className="mb-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Filtrar por estilo</span>
                        <select
                          value={selectedStyle}
                          onChange={(e) => setSelectedStyle(e.target.value)}
                          className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                        >
                          <option value="">Todos los estilos</option>
                          {STYLE_CATEGORIES.map((style) => (
                            <option key={style} value={style}>
                              {style}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="space-y-2 text-sm text-slate-700">
                        <span>Filtrar por tipo</span>
                        <select
                          value={selectedType}
                          onChange={(e) => setSelectedType(e.target.value)}
                          className="w-full rounded-3xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                        >
                          <option value="">Todos los tipos</option>
                          {TYPE_CATEGORIES.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <label className="space-y-2 text-sm text-slate-700">
                      <span>Filtrar por colores</span>
                      <div className="grid grid-cols-10 gap-1">
                        {COLOR_SWATCHES.map((color) => {
                          const selected = selectedColors.includes(color)
                          return (
                            <button
                              key={color}
                              type="button"
                              onClick={() => {
                                setSelectedColors(
                                  selected
                                    ? selectedColors.filter((c) => c !== color)
                                    : [...selectedColors, color]
                                )
                              }}
                              className={`h-8 w-8 rounded border-2 transition ${selected ? "border-slate-900 ring-2 ring-slate-900" : "border-slate-300 hover:border-slate-900"}`}
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          )
                        })}
                      </div>
                    </label>
                    <label className="space-y-2 text-sm text-slate-700">
                      <span>Filtrar por acabados</span>
                      <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                        {FINISH_CATEGORIES.map((finish) => {
                          const selected = selectedFinishes.includes(finish)
                          return (
                            <button
                              key={finish}
                              type="button"
                              onClick={() => {
                                setSelectedFinishes(
                                  selected
                                    ? selectedFinishes.filter(
                                        (f) => f !== finish
                                      )
                                    : [...selectedFinishes, finish]
                                )
                              }}
                              className={`rounded-2xl border px-3 py-2 text-xs transition ${selected ? "border-slate-900 bg-slate-900 text-white" : "border-slate-300 bg-white text-slate-900 hover:border-slate-900"}`}
                            >
                              {finish}
                            </button>
                          )
                        })}
                      </div>
                    </label>
                  </div>
                </div>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-3">
                {filteredProperties.map((property) => {
                  const avgRating = getAvgRating(property.reviews)
                  const reviewCount = property.reviews?.length || 0
                  console.log(
                    `Property ${property.id}: reviews`,
                    property.reviews,
                    "avgRating",
                    avgRating,
                    "reviewCount",
                    reviewCount
                  )
                  const isFavorited = favorites.includes(property.id)
                  return (
                    <div
                      key={property.id}
                      className="relative rounded-[2rem] border border-slate-300 bg-white p-6 shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFavorite(property.id)}
                        className={`absolute top-4 right-4 rounded-full px-3 py-2 text-sm font-semibold transition ${isFavorited ? "bg-red-500 text-white" : "border border-slate-300 bg-white text-slate-900 hover:bg-slate-100"}`}
                      >
                        {isFavorited ? "♥" : "♡"}
                      </button>
                      <div className="mb-6 overflow-hidden rounded-[1.5rem] border border-slate-300 bg-slate-50 text-slate-500">
                        {property.imageUrls && property.imageUrls[0] ? (
                          <img
                            src={property.imageUrls[0]}
                            alt={property.imageLabel}
                            className="h-40 w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-40 items-center justify-center">
                            {property.imageLabel}
                          </div>
                        )}
                      </div>
                      <h2 className="mb-2 text-xl font-bold text-slate-950">
                        {property.title}
                      </h2>
                      <p className="mb-6 text-sm tracking-[0.25em] text-slate-500 uppercase">
                        {property.style}
                      </p>
                      <p className="mb-6 text-lg font-semibold text-slate-900">
                        {property.area} m²
                      </p>

                      <div className="mb-6 border-b border-slate-200 pb-4">
                        <span className="text-sm">
                          {"⭐".repeat(Math.round(Number(avgRating)))}
                        </span>
                        <div className="mt-2 text-sm text-slate-600">
                          {avgRating}/5 ({reviewCount}{" "}
                          {reviewCount === 1 ? "reseña" : "reseñas"})
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <Link
                          to={`/property/${property.id}`}
                          className="block w-full rounded-full border border-slate-900 px-4 py-3 text-center text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                        >
                          Ver Ficha Técnica
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => editarProyecto(property)}
                            className="block rounded-full border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                          >
                            Editar
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>

            <SeccionGestion
              mostrarGestion={mostrarGestion}
              setMostrarGestion={setMostrarGestion}
              mostrarFormulario={mostrarFormulario}
              agregarProyecto={agregarProyecto}
              form={form}
              setForm={setForm}
              editingId={editingId}
              guardarFicha={guardarFicha}
              cancelarEdicion={cancelarEdicion}
              properties={properties}
              editarProyecto={editarProyecto}
              eliminarProyecto={eliminarProyecto}
              STYLE_CATEGORIES={STYLE_CATEGORIES}
              TYPE_CATEGORIES={TYPE_CATEGORIES}
              COLOR_SWATCHES={COLOR_SWATCHES}
              FINISH_CATEGORIES={FINISH_CATEGORIES}
              imageSlotLabels={imageSlotLabels}
            />
          </>
        )}
      </main>
    </div>
  )
}
