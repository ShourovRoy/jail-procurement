import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { useForm } from "@tanstack/react-form"
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { signupCommand, SignupInput } from '@/utils/auth-utils'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/signup')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  const signupForm = useForm({
    defaultValues: {
      username: "",
      fullName: "",
      email: "",
      phoneNumber: "",
      password: "",
    },
    onSubmit: async ({ value, formApi }) => {
      console.log(value)
      const payload: SignupInput = {
        email: value.email,
        username: value.username,
        full_name: value.fullName,
        password: value.password,
        phone_number: value.phoneNumber
      }
      const res = await signupCommand(payload)

      if (res?.error?.error_message) {
        toast.error(res?.error?.error_message)

      }

      if (res?.success?.message) {
        toast.success(res?.success?.message)

        // reset the form
        formApi.reset()
        router.navigate({
          to: "/auth/login"
        })
      }
    }
  })


  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Sign Up</CardTitle>
            <CardDescription>
              Create an administrator account
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form
              className="space-y-5"
              onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                signupForm.handleSubmit()
              }}
            >
              {/* Fields */}

              <signupForm.Field
                name="fullName"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Full name can't be empty!"
                    }
                  }
                }}
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Full Name
                    </FieldLabel>

                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <signupForm.Field
                name="username"
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Username
                    </FieldLabel>

                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <signupForm.Field
                name="email"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Email can't be empty!"
                    }
                  }
                }}
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Email
                    </FieldLabel>

                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <signupForm.Field
                name="phoneNumber"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Phone number can't be empty!"
                    }
                  }
                }}
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Phone Number
                    </FieldLabel>

                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <signupForm.Field
                name="password"
                validators={{
                  onChange: ({ value }) => {
                    if (!value) {
                      return "Password can't be empty!"
                    }

                    if (value.length < 8) {
                      return "Password need to be at least 8 characters long!"
                    }
                  }
                }}
                children={(field) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Password
                    </FieldLabel>

                    <Input
                      id={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value)
                      }
                    />
                    {!field.state.meta.isValid && (
                      <FieldError>
                        <em role="alert">{field.state.meta.errors.join(', ')}</em>
                      </FieldError>
                    )}
                  </Field>
                )}
              />

              <signupForm.Subscribe
                selector={(state) => [
                  state.canSubmit,
                  state.isSubmitting,
                ]}
                children={([canSubmit, isSubmitting]) => (
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit}
                  >
                    {isSubmitting ? <Spinner /> : "Create Account"}
                  </Button>
                )}
              />
            </form>
            <Link to='/auth/login'>
              <Button variant="link" >Already have an account?</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
