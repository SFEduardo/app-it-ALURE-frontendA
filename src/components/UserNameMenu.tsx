"use client"
import { useAuth0 } from "@auth0/auth0-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu"
import { CircleUserRound } from "lucide-react"
import { Link } from "react-router"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"

export default function UserNameMenu() {
  const { user, logout } = useAuth0()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 bg-slate-50 px-3 font-bold hover:text-orange-500">
        <CircleUserRound className="text-orange-500" />
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-orange-500 bg-slate-50">
        <DropdownMenuItem>
          <Link to="/user-profile" className="font-bold hover:text-orange-500">
            Perfil
          </Link>
        </DropdownMenuItem>
        <Separator></Separator>
        <DropdownMenuItem>
          <Button
            className="flex flex-1 bg-orange-500 font-bold"
            onClick={() => logout()}
          >
            Cerrar sesión
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
