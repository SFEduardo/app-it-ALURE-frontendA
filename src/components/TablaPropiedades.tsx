import { type Property } from "@/data/properties"

interface TablaPropiedadesProps {
  properties: Property[]
  editarProyecto: (property: Property) => void
  eliminarProyecto: (id: number) => void
}

export default function TablaPropiedades({
  properties,
  editarProyecto,
  eliminarProyecto,
}: TablaPropiedadesProps) {
  return (
    <div className="mb-8 overflow-hidden rounded-[2rem] border border-slate-300 bg-white shadow-sm">
      <table className="min-w-full border-collapse text-left">
        <thead className="bg-slate-100">
          <tr>
            <th className="border-b border-slate-300 px-4 py-4 text-sm font-semibold tracking-[0.2em] text-slate-700 uppercase">
              ID
            </th>
            <th className="border-b border-slate-300 px-4 py-4 text-sm font-semibold tracking-[0.2em] text-slate-700 uppercase">
              TÍTULO DEL PROYECTO
            </th>
            <th className="border-b border-slate-300 px-4 py-4 text-sm font-semibold tracking-[0.2em] text-slate-700 uppercase">
              ESTILO
            </th>
            <th className="border-b border-slate-300 px-4 py-4 text-sm font-semibold tracking-[0.2em] text-slate-700 uppercase">
              M²
            </th>
            <th className="border-b border-slate-300 px-4 py-4 text-sm font-semibold tracking-[0.2em] text-slate-700 uppercase">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody>
          {properties.map((property) => (
            <tr
              key={property.id}
              className="border-b border-slate-200 last:border-none"
            >
              <td className="px-4 py-4 text-sm text-slate-700">
                {property.id}
              </td>
              <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                {property.title}
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">
                {property.style}
              </td>
              <td className="px-4 py-4 text-sm text-slate-700">
                {property.area.toFixed(2)}
              </td>
              <td className="flex flex-wrap gap-2 px-4 py-4">
                <button
                  type="button"
                  onClick={() => editarProyecto(property)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  ✎ Editar
                </button>
                <button
                  type="button"
                  onClick={() => eliminarProyecto(property.id)}
                  className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
