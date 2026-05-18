import FormularioPropiedad from "@/components/FormularioPropiedad"
import TablaPropiedades from "@/components/TablaPropiedades"
import { type Property } from "@/data/properties"

interface SeccionGestionProps {
  mostrarGestion: boolean
  setMostrarGestion: (show: boolean) => void
  mostrarFormulario: boolean
  agregarProyecto: () => void
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
  setForm: React.Dispatch<React.SetStateAction<SeccionGestionProps["form"]>>
  editingId: number | null
  guardarFicha: () => void
  cancelarEdicion: () => void
  properties: Property[]
  editarProyecto: (property: Property) => void
  eliminarProyecto: (id: number) => void
  STYLE_CATEGORIES: string[]
  TYPE_CATEGORIES: string[]
  COLOR_SWATCHES: string[]
  FINISH_CATEGORIES: string[]
  imageSlotLabels: string[]
}

export default function SeccionGestion({
  mostrarGestion,
  setMostrarGestion,
  mostrarFormulario,
  agregarProyecto,
  form,
  setForm,
  editingId,
  guardarFicha,
  cancelarEdicion,
  properties,
  editarProyecto,
  eliminarProyecto,
  STYLE_CATEGORIES,
  TYPE_CATEGORIES,
  COLOR_SWATCHES,
  FINISH_CATEGORIES,
  imageSlotLabels,
}: SeccionGestionProps) {
  if (!mostrarGestion) return null

  return (
    <div className="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-black p-4">
      <div className="max-h-[90vh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 p-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-950">
              Gestión de Inventario (CRUD)
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Agrega proyectos y verás cómo aparecen directamente en el
              catálogo.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setMostrarGestion(false)}
            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-2xl font-bold text-slate-900 transition hover:bg-slate-100"
          >
            ✕
          </button>
        </div>

        <div
          className="overflow-y-auto p-8"
          style={{ maxHeight: "calc(90vh - 120px)" }}
        >
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">
                Agregar o Editar Proyecto
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Completa la información y agrega imágenes.
              </p>
            </div>
            <button
              type="button"
              onClick={agregarProyecto}
              className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              + Agregar proyecto
            </button>
          </div>

          <FormularioPropiedad
            form={form}
            setForm={setForm}
            editingId={editingId}
            showForm={mostrarFormulario}
            guardarFicha={guardarFicha}
            cancelarEdicion={cancelarEdicion}
            STYLE_CATEGORIES={STYLE_CATEGORIES}
            TYPE_CATEGORIES={TYPE_CATEGORIES}
            COLOR_SWATCHES={COLOR_SWATCHES}
            FINISH_CATEGORIES={FINISH_CATEGORIES}
            imageSlotLabels={imageSlotLabels}
          />

          <TablaPropiedades
            properties={properties}
            editarProyecto={editarProyecto}
            eliminarProyecto={eliminarProyecto}
          />
        </div>
      </div>
    </div>
  )
}
