import landing from "../assets/landing.png"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-12">
      <div className="-mt-16 flex flex-col gap-5 rounded-lg bg-white py-8 text-center shadow-md">
        <h1 className="text-5xl font-bold tracking-tight text-orange-500">
          Disfruta tu comida para llevar
        </h1>
        <span className="text-xl">¡Tu comida está a un solo clic!</span>
        <div className="grid gap-5 md:grid-cols-2">
          <img src={landing} />
          <div className="text center flex flex-col items-center justify-center gap-4">
            <span className="text-3xl font-bold tracking-tighter">
              Pide comida para llevar aún más rápido
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
