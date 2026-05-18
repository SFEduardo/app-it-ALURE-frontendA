import Logo from "../Logo.png"

export default function Footer() {
  return (
    <div className="bg-slate-900 py-10 text-slate-100">
      <div className="container mx-auto flex flex-col items-center justify-between gap-4 md:flex-row">
        <span className="text-3xl font-semibold tracking-tight text-white">
          <span className="inline-flex h-30 w-30 items-center justify-center rounded-xl bg-white text-sm font-bold">
            <img src={Logo} alt="Logo" className="h-full w-full" />
          </span>{" "}
        </span>
        <span className="flex flex-col items-center gap-3 text-sm tracking-tight text-slate-300 md:flex-row md:gap-4">
          <span>Politica de privacidad</span>
          <span>Terminos del servicio</span>
        </span>
      </div>
    </div>
  )
}
