import { useEffect, useState } from "react"

interface FormularioPropiedadProps {
  form: {
    title: string
    style: string
    area: string
    imageLabel: string
    type: string
    colors: string[]
    finishes: string[]
    distribution: string
    imageUrls: string[]
    imageFiles: Array<File | null>
  }
  setForm: React.Dispatch<
    React.SetStateAction<FormularioPropiedadProps["form"]>
  >
  editingId: number | null
  showForm: boolean
  guardarFicha: () => void
  cancelarEdicion: () => void
  STYLE_CATEGORIES: string[]
  TYPE_CATEGORIES: string[]
  COLOR_SWATCHES: string[]
  FINISH_CATEGORIES: string[]
  imageSlotLabels: string[]
}

export default function FormularioPropiedad({
  form,
  setForm,
  editingId,
  showForm,
  guardarFicha,
  cancelarEdicion,
  STYLE_CATEGORIES,
  TYPE_CATEGORIES,
  COLOR_SWATCHES,
  FINISH_CATEGORIES,
  imageSlotLabels,
}: FormularioPropiedadProps) {
  const toggleColor = (color: string) => {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((item) => item !== color)
        : [...prev.colors, color],
    }))
  }

  const toggleFinish = (finish: string) => {
    setForm((prev) => ({
      ...prev,
      finishes: prev.finishes.includes(finish)
        ? prev.finishes.filter((item) => item !== finish)
        : [...prev.finishes, finish],
    }))
  }

  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    const urls = form.imageFiles.map((file, index) => {
      if (file) return URL.createObjectURL(file)
      return form.imageUrls[index] || ""
    })
    setPreviewUrls(urls)

    return () => {
      urls.forEach((url) => {
        if (url.startsWith("blob:")) {
          URL.revokeObjectURL(url)
        }
      })
    }
  }, [form.imageFiles, form.imageUrls])

  const handleImageChange =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0] || null
      setForm((prev) => {
        const imageFiles = prev.imageFiles
          ? [...prev.imageFiles]
          : [null, null, null, null]
        imageFiles[index] = file
        return { ...prev, imageFiles }
      })
    }

  return (
    <>
      {showForm && (
        <section className="mb-8 rounded-[2rem] border border-slate-300 bg-white p-8 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">
                {editingId ? "Editar Ficha Técnica" : "Nueva Ficha Técnica"}
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Completa toda la información del proyecto y agrega imágenes.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={guardarFicha}
                className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Guardar ficha técnica
              </button>
              <button
                type="button"
                onClick={cancelarEdicion}
                className="rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
              >
                Cancelar
              </button>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <label className="space-y-2 text-sm text-slate-700">
              <span>Título del Proyecto</span>
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                placeholder="Título"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Estilo</span>
              <select
                value={form.style}
                onChange={(event) =>
                  setForm({ ...form, style: event.target.value })
                }
                className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              >
                <option value="">Seleccionar estilo</option>
                {STYLE_CATEGORIES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>m²</span>
              <input
                value={form.area}
                onChange={(event) =>
                  setForm({ ...form, area: event.target.value })
                }
                className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                placeholder="Área en metros cuadrados"
              />
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Etiqueta / Imagen principal</span>
              <input
                value={
                  form.imageUrls[0]?.trim() !== ""
                    ? imageSlotLabels[0]
                    : form.imageLabel
                }
                onChange={(event) =>
                  setForm({ ...form, imageLabel: event.target.value })
                }
                className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                placeholder="Texto para la imagen principal"
                readOnly={form.imageUrls[0]?.trim() !== ""}
              />
              {form.imageUrls[0]?.trim() !== "" ? (
                <p className="text-xs text-slate-500">
                  La etiqueta se sincroniza con la imagen de fachada.
                </p>
              ) : null}
            </label>
            <label className="space-y-2 text-sm text-slate-700">
              <span>Tipo de propiedad</span>
              <select
                value={form.type}
                onChange={(event) =>
                  setForm({ ...form, type: event.target.value })
                }
                className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              >
                <option value="">Seleccionar tipo</option>
                {TYPE_CATEGORIES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </label>
            <label className="col-span-2 space-y-2 text-sm text-slate-700">
              <span>Colores</span>
              <div className="grid grid-cols-10 gap-1">
                {COLOR_SWATCHES.map((color) => {
                  const selected = form.colors.includes(color)
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => toggleColor(color)}
                      className={`h-8 w-8 rounded border-2 transition ${
                        selected
                          ? "border-slate-900"
                          : "border-slate-300 hover:border-slate-900"
                      }`}
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  )
                })}
              </div>
              {form.colors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.colors.map((color) => (
                    <span
                      key={color}
                      className="inline-block h-6 w-6 rounded border border-slate-300"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              )}
            </label>
            <label className="col-span-2 space-y-2 text-sm text-slate-700">
              <span>Acabados</span>
              <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5">
                {FINISH_CATEGORIES.map((finish) => {
                  const selected = form.finishes.includes(finish)
                  return (
                    <button
                      key={finish}
                      type="button"
                      onClick={() => toggleFinish(finish)}
                      className={`rounded-2xl border px-3 py-2 text-xs transition ${
                        selected
                          ? "border-slate-900 bg-slate-900 text-white"
                          : "border-slate-300 bg-white text-slate-900 hover:border-slate-900"
                      }`}
                    >
                      {finish}
                    </button>
                  )
                })}
              </div>
              {form.finishes.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {form.finishes.map((finish) => (
                    <span
                      key={finish}
                      className="inline-flex items-center rounded-full border border-slate-300 bg-slate-100 px-2 py-1 text-xs text-slate-700"
                    >
                      {finish}
                    </span>
                  ))}
                </div>
              )}
            </label>
            <label className="col-span-2 space-y-2 text-sm text-slate-700">
              <span>Distribución</span>
              <textarea
                value={form.distribution}
                onChange={(event) =>
                  setForm({
                    ...form,
                    distribution: event.target.value,
                  })
                }
                className="w-full rounded-3xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 outline-none focus:border-slate-900"
                placeholder="Describe la distribución"
                rows={3}
              />
            </label>

            <div className="col-span-2 space-y-4">
              <span className="text-sm text-slate-700">Imágenes</span>

              <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
                <div className="rounded-3xl border border-slate-300 bg-slate-50 p-3">
                  <label className="group block h-full cursor-pointer">
                    <span className="mb-2 block text-xs font-semibold text-slate-500 uppercase">
                      Fachada
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange(0)}
                      className="hidden"
                    />
                    <div className="relative flex min-h-[28rem] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white transition hover:border-slate-400">
                      {previewUrls[0] ? (
                        <img
                          src={previewUrls[0]}
                          alt={imageSlotLabels[0]}
                          className="h-full w-full object-contain"
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center px-6 text-center text-sm text-slate-400">
                          <span className="mb-2 font-semibold text-slate-700">
                            Plano
                          </span>
                          <span>Haz clic aquí para seleccionar la imagen</span>
                        </div>
                      )}
                      <div className="pointer-events-none absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/5" />
                    </div>
                  </label>
                </div>

                <div className="grid gap-4">
                  {[1, 2, 3].map((index) => (
                    <label
                      key={imageSlotLabels[index]}
                      className="group block cursor-pointer rounded-3xl border border-slate-300 bg-slate-50 p-3"
                    >
                      <span className="mb-2 block text-xs font-semibold text-slate-500 uppercase">
                        {imageSlotLabels[index]}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange(index)}
                        className="hidden"
                      />
                      <div className="relative flex h-24 items-center justify-center overflow-hidden rounded-3xl border border-dashed border-slate-300 bg-white transition hover:border-slate-400">
                        {previewUrls[index] ? (
                          <img
                            src={previewUrls[index]}
                            alt={imageSlotLabels[index]}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center px-4 text-center text-sm text-slate-400">
                            <span>Haz clic aquí para seleccionar</span>
                          </div>
                        )}
                        <div className="pointer-events-none absolute inset-0 bg-slate-900/0 transition group-hover:bg-slate-900/5" />
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  )
}
