import { Link } from "react-router"
import MobileNav from "./MobilNav"
import MainNav from "./MainNav"
import Logo from "../Logo.png"

type HeaderProps = {
  searchQuery?: string
  onSearchChange?: (value: string) => void
  onToggleFilters?: () => void
  showFilters?: boolean
}

export default function Header({
  searchQuery,
  onSearchChange,
  onToggleFilters,
  showFilters,
}: HeaderProps) {
  const hasSearchProps =
    searchQuery !== undefined &&
    onSearchChange &&
    onToggleFilters !== undefined &&
    showFilters !== undefined

  return (
    <div className="border-b-2 border-b-slate-900 bg-slate-50 py-4">
      <div className="container mx-auto">
        <div className="hidden items-center justify-between gap-4 md:flex">
          <Link to="/" className="flex items-center text-slate-900">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold">
              <img src={Logo} alt="Logo" className="h-full w-full" />
            </span>
          </Link>

          {hasSearchProps ? (
            <>
              <div className="flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Buscar por estilo o m²..."
                  className="w-full rounded-full border border-slate-300 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-slate-900"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onToggleFilters}
                  className={`rounded-full px-5 py-3 text-sm font-semibold transition ${showFilters ? "bg-slate-900 text-white hover:bg-slate-700" : "border border-slate-900 bg-white text-slate-900 hover:bg-slate-100"}`}
                >
                  Filtrar
                </button>
                <MainNav />
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <MainNav />
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 md:hidden">
          <Link
            to="/"
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-900"
          >
            <img src={Logo} alt="Logo" className="h-full w-full" />
          </Link>
          <MobileNav />
        </div>
      </div>
    </div>
  )
}
