import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter as Router } from "react-router"
import AppRoutes from "./AppRoutes"
import "./index.css"
import Auth0ProviderWithNavigate from "./auth/Auth0ProviderWithNavigate"
import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "./api/queryClient"
import { Toaster } from "@/components/ui/sonner"
import { ReviewsProvider } from "./contexts/ReviewsContext"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router>
      <QueryClientProvider client={queryClient}>
        <Auth0ProviderWithNavigate>
          <ReviewsProvider>
            <AppRoutes />
            <Toaster visibleToasts={1} position="top-right" richColors />
          </ReviewsProvider>
        </Auth0ProviderWithNavigate>
      </QueryClientProvider>
    </Router>
  </StrictMode>
)
