import { CircleUserRound, Menu } from "lucide-react"
import {
  Sheet,
  SheetDescription,
  SheetTitle,
  SheetContent,
  SheetTrigger,
} from "./ui/sheet"
import { Separator } from "./ui/separator"
import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import MobilNavLinks from "./MobilNavLinks"

export default function MobilNav() {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0()

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="text-orange-500" />
      </SheetTrigger>
      <SheetContent className="space-y-3">
        {/* Agregamos h-10 para igualar la altura del botón X y flex para centrar contenido */}
        <SheetTitle className="flex h-16 items-center justify-center">
          {isAuthenticated ? (
            <span className="mx-4 flex items-center justify-center gap-2 font-bold">
              <CircleUserRound className="text-orange-500" />
              {user?.email}
            </span>
          ) : (
            <span className="flex justify-center font-bold">
              Bienvenidos a AppITZFood.com
            </span>
          )}
        </SheetTitle>
        <Separator />
        <SheetDescription className="flex flex-col gap-4">
          {isAuthenticated ? (
            <MobilNavLinks />
          ) : (
            <Button
              onClick={() => loginWithRedirect()}
              className="flex-1 bg-orange-500 font-bold"
            >
              LogIn
            </Button>
          )}
        </SheetDescription>
      </SheetContent>
    </Sheet>
  )
}
