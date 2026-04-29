import { Auth0Provider } from "@auth0/auth0-react"
import { useNavigate } from "react-router"

type Props = {
  children: React.ReactNode
}

function Auth0ProviderWithNavigate({ children }: Props) {
  const navigate = useNavigate()
  const domain = import.meta.env.VITE_AUTH0_DOMAIN
  const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID
  const redirectionUri = import.meta.env.VITE_AUTH0_CALLBACK_URL
  const audience = import.meta.env.VITE_AUTH0_AUDIENCE

  /*console.log("domain: " + domain)
  console.log("clientId: " + clientId)
  console.log("redirectionUri: " + redirectionUri)
  console.log("audience: " + audience)*/

  if (!domain || !clientId || !redirectionUri || !audience) {
    throw new Error("Error al inicializar Auth0")
  }

  const onRedirectCallback = () => {
    navigate("/auth-callback")
  }

  return (
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{ redirect_uri: redirectionUri, audience: audience }}
      onRedirectCallback={onRedirectCallback}
    >
      {children}
    </Auth0Provider>
  )
}

export default Auth0ProviderWithNavigate
