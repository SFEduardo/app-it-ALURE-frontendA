//variable con la direccion de backend
//API_BASE_URL = HTTP://localhost:3000 <-- DESPUES SE CAMBIARA EN LA NUBE
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import type { User, UpdateUser, BackendUser } from "./types"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "sonner"

//Funcion para crear un usuairo en el backend
export function useCreateUser() {
  const quearyClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()
  //Funcion para obtener todos los usuarios//Peticion dal backend
  const createUserRequest = async (user: User) => {
    const accessToken = await getAccessTokenSilently()
    const res = await fetch(API_BASE_URL + "/api/user", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
    if (!res.ok) {
      //El back end regresa un error 500
      console.log(res)
      throw new Error("Error al crear el usuario")
    }
    //si el back end regresa un res= 200 o 201 todo ok se pudieron recupera datos de usuario o al usuario
    return res.json()
  } //Fin de createuserrequest
  return useMutation({
    mutationFn: (user: User) => createUserRequest(user),
    onError: (err) => {
      console.log(err)
      throw new Error("Error al crear el usuario")
    },
    onSuccess: (user) => {
      console.log(user)
      quearyClient.invalidateQueries({ queryKey: ["user"] })
    },
  }) //fin del return de mutation
} //fin del createuser

//Funcion para actualizar un usuario
export function useUpdateUser() {
  const quearyClient = useQueryClient()
  const { getAccessTokenSilently } = useAuth0()

  //Funcion para obtener todos los usuarios//Peticion dal backend
  const updateUserRequest = async (formData: UpdateUser) => {
    const accessToken = await getAccessTokenSilently()
    const res = await fetch(API_BASE_URL + "/api/user", {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
    if (!res.ok) {
      //El back end regresa un error 500
      console.log(res)
      throw new Error("Error al actualizar el usuario")
    }
    //si el back end regresa un res= 200 o 201 todo ok se pudieron recupera datos de usuario o al usuario
    return res.json()
  } //Fin de updateuserrequest

  return useMutation({
    mutationFn: (formData: UpdateUser) => updateUserRequest(formData),
    onError: (err) => {
      toast.error("Error al actualizar el perfil del usuario")
      console.log(err)
      throw new Error("Error al actualizar el usuario")
    },
    onSuccess: (user) => {
      toast.success("Perfil del usuario actualizado")
      console.log(user)
      quearyClient.invalidateQueries({ queryKey: ["user"] })
    },
  }) //fin del return de mutation
} //Fin de update user

//Funcion para obtener todos los usuarios
export function useGetUser() {
  const { getAccessTokenSilently } = useAuth0()

  //Funcion para obtener todos los usuarios//Peticion dal backend
  const getUserRequest = async (): Promise<BackendUser> => {
    const accessToken = await getAccessTokenSilently()
    const res = await fetch(API_BASE_URL + "/api/user", {
      method: "GET",
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
    })
    if (!res.ok) {
      //El back end regresa un error 500
      throw new Error("Error al obtener los datos de los usuarios")
    }
    //si el back end regresa un res= 200 o 201 todo ok se pudieron recupera datos de usuario o al usuario
    return res.json()
  } //Fin de getusersrequest
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUserRequest(),
  })
} //Fin de getuser
