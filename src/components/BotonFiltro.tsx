interface BotonFiltroProps {
  mostrarGestion: boolean
  alternarGestion: () => void
}

export default function BotonFiltro({
  mostrarGestion,
  alternarGestion,
}: BotonFiltroProps) {
  return (
    <button
      type="button"
      onClick={alternarGestion}
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition ${
        mostrarGestion
          ? "border-slate-900 bg-slate-900 text-white"
          : "border-slate-300 bg-white text-slate-900 hover:bg-slate-100"
      }`}
    >
      <span>⚙️</span>
      Gestión
    </button>
  )
}
