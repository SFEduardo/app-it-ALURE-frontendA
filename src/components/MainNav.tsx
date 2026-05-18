import { Button } from "./ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import UserNameMenu from "./UserNameMenu"

export default function MainNav() {
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  return (
    <span className="flex items-center space-x-2">
      {isAuthenticated ? (
        <UserNameMenu />
      ) : (
        <Button
          variant="ghost"
          className="font-bold text-slate-900 hover:text-slate-700"
          onClick={async () => await loginWithRedirect()}
        >
          LogIn
        </Button>
      )}
    </span>
  )
}
