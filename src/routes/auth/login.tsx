import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { loginCommand } from '@/utils/auth-utils'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { toast } from 'sonner'

export const Route = createFileRoute('/auth/login')({
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter();
  const loginForm = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      const res = await loginCommand({
        email: value.email,
        password: value.password
      })

      // handle error message
      if (res?.error) {
        toast.error(res.error.error_message)
      }

      // handle success with data
      if (res.success?.message && res.success.data?.auth_token) {

        // show success message
        toast.success(res.success.message)

        // redirect to the main page
        // TODO: later on redirect to the dashboard
        router.navigate({
          to: "/",
          replace: true,
        })
      }
    }
  })


  return <div>

    <div className='container mx-auto'>
      <form onSubmit={(e) => {
        e.stopPropagation()
        e.preventDefault()

        loginForm.handleSubmit()

      }}>

        <loginForm.Field
          name='email'
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return "email required!"
              }

              if (value.length < 4) {
                return "Invalid email address!"
              }
            }
          }}
          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Email
                </FieldLabel>

                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  type='email'
                  placeholder='mou@example.com'
                />
                {!field.state.meta.isValid && (
                  <FieldError>
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  </FieldError>
                )}
              </Field>
            )
          }}

        />


        <loginForm.Field
          name='password'
          validators={{
            onChange: ({ value }) => {
              if (!value) {
                return "password required!"
              }

            }
          }}

          children={(field) => {
            return (
              <Field>
                <FieldLabel htmlFor={field.name}>
                  Password
                </FieldLabel>

                <Input
                  id={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) =>
                    field.handleChange(e.target.value)
                  }
                  type='password'
                  placeholder='Enter your password'
                />
                {!field.state.meta.isValid && (
                  <FieldError>
                    <em role="alert">{field.state.meta.errors.join(', ')}</em>
                  </FieldError>
                )}
              </Field>
            )
          }}

        />


        <loginForm.Subscribe
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
              {isSubmitting ? <Spinner /> : "Login Now"}
            </Button>
          )}
        />



      </form>


      <Link to='/auth/signup'>
        <Button variant="link" >Don't have an account?</Button>
      </Link>
    </div>

  </div>
}
