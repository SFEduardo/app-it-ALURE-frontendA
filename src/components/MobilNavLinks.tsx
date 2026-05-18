import { Link } from "react-router"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"

export default function MobilNavLinks() {
  const { logout } = useAuth0()
  return (
    <>
      <Link
        to="/user-profile"
        className="mx-4 flex items-center px-3 font-bold text-slate-900 hover:text-slate-700"
      >
        Perfil
      </Link>
      <Button
        onClick={() => logout()}
        className="mx-4 flex items-center rounded-full bg-slate-900 px-3 py-2 font-bold text-white hover:bg-slate-700"
      >
        Salir
      </Button>
    </>
  )
}
