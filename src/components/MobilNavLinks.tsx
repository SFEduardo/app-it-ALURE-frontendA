import { Link } from "react-router"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"

export default function MobilNavLinks() {
  const { logout } = useAuth0()
  return (
    <>
      <Link
        to="/user-profile"
        className="mx-4 flex items-center px-3 font-bold hover:text-orange-500"
      >
        Perfil
      </Link>
      <Button
        onClick={() => logout()}
        className="mx-4 flex items-center px-3 font-bold hover:text-orange-500"
      >
        Salir
      </Button>
    </>
  )
}
