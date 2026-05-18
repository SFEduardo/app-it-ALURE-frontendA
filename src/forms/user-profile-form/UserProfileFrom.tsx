"use client"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { type BackEndUser } from "@/api/types"

const formSchema = z.object({
  email: z.string().optional(),
  name: z
    .string("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres"),
  address: z.string("Direccion debe ser requerida"),
  city: z.string("Ciudad es requerida"),
  country: z.string("Pais es requerido"),
})

export type UserFormData = z.infer<typeof formSchema>

type Props = {
  onSave: (userProfileData: UserFormData) => void
  getUser: BackEndUser
}

// eslint-disable-next-line no-empty-pattern
export default function UserProfileForm({ onSave, getUser }: Props) {
  const form = useForm<UserFormData>({
    defaultValues: {
      email: "",
      name: "",
      address: "",
      city: "",
      country: "",
    },
    values: getUser
      ? {
          email: getUser.email,
          name: getUser.name,
          address: getUser.address,
          city: getUser.city,
          country: getUser.country,
        }
      : undefined,
    resolver: zodResolver(formSchema),
    mode: "onSubmit",
  })
  function onSubmit(data: UserFormData) {
    //console.log(JSON.stringify(data))
    onSave(data)
  } //Fin de onSubmit
  return (
    <Card className="border border-slate-200 bg-white shadow-sm">
      <form
        id="user-profile-form"
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:pd-10 space-y-4"
      >
        <CardHeader>
          <CardTitle>Perfil del usuario</CardTitle>
          <CardDescription>
            Consulta y cambia la informacion de tu perfil aqui
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Email</FieldLabel>
                  <Input
                    {...field}
                    disabled
                    id="email"
                    placeholder="Teclea tu email"
                    className="bg-white"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <FieldGroup>
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="mt-4">
                  <FieldLabel>Nombre</FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    placeholder="Teclea tu nombre"
                    className="bg-white"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-4 flex flex-col gap-4 md:flex-row">
            <FieldGroup>
              <Controller
                name="address"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="mt-4">
                    <FieldLabel>Direccion</FieldLabel>
                    <Input
                      {...field}
                      id="address"
                      placeholder="Teclea tu direccion"
                      className="bg-white"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="city"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="mt-4">
                    <FieldLabel>Ciudad</FieldLabel>
                    <Input
                      {...field}
                      id="city"
                      placeholder="Teclea tu ciudad"
                      className="bg-white"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup>
              <Controller
                name="country"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="mt-4">
                    <FieldLabel>Pais</FieldLabel>
                    <Input
                      {...field}
                      id="country"
                      placeholder="Teclea tu pais"
                      className="bg-white"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </div>
        </CardContent>
        <CardFooter className="mt-4">
          <Field orientation="horizontal">
            <Button
              type="submit"
              form="user-profile-form"
              className="bg-slate-900 text-white hover:bg-slate-700"
            >
              Actualizar
            </Button>
          </Field>
        </CardFooter>
      </form>
    </Card>
  )
}
