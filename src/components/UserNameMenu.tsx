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
      <DropdownMenuTrigger className="flex items-center gap-2 bg-transparent px-3 font-bold text-slate-900 hover:text-slate-700">
        <CircleUserRound className="text-slate-900" />
        {user?.email}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="border-slate-900 bg-slate-50">
        <DropdownMenuItem>
          <Link to="/user-profile" className="font-bold hover:text-slate-900">
            Perfil
          </Link>
        </DropdownMenuItem>
        <Separator />
        <DropdownMenuItem>
          <Button
            className="flex flex-1 bg-slate-900 font-bold text-white hover:bg-slate-700"
            onClick={() => logout()}
          >
            Cerrar sesión
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
