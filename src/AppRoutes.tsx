import { Navigate, Route, Routes } from "react-router"
import Layout from "./layouts/Layout"
import HomePage from "./pages/HomePage"
import AuthCallbackPage from "./pages/AuthCallbackPages"
import PropertyDetailPage from "./pages/PropertyDetailPage"
import { QueryClientProvider } from "@tanstack/react-query"
import queryClient from "./api/queryClient"
import UserProfilePage from "./pages/UserProfilePage"
import ProtectedRoute from "./auth/ProtectedRoute"

const AppRoutes = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<HomePage />} />
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route path="/property/:id" element={<PropertyDetailPage />} />
        {/* Rutas protegidas */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/user-profile"
            element={
              <Layout>
                <UserProfilePage />
              </Layout>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </QueryClientProvider>
  )
}

export default AppRoutes
