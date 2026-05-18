import { useUpdateUser, useGetUser } from "@/api/UserApi"
import LoadingButton from "@/components/LoadingButton"
import UserProfileForm from "@/forms/user-profile-form/UserProfileFrom"
import { toast } from "sonner"
import { useNavigate } from "react-router"

export default function UserProfilePage() {
  const { data: user, isLoading, isError } = useGetUser()
  const updateUserRequest = useUpdateUser()
  const navigate = useNavigate()

  if (isLoading) return <LoadingButton />
  if (isError || !user) {
    toast.error("Error al cargar los datos del usuario")
    return <span>No se pudieron obtener los datos del usuario</span>
  }
  return (
    <div className="min-h-screen bg-slate-50">
      <main className="container mx-auto px-4 py-10">
        <button
          onClick={() => navigate("/")}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
        >
          ← Volver al Catálogo
        </button>
        <UserProfileForm onSave={updateUserRequest.mutate} getUser={user} />
      </main>
    </div>
  )
}
