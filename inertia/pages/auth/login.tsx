import MinimalLayout from '~/layouts/minimal'
import { Form } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { Button } from '~/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle, CardPanel } from '~/components/ui/card'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Head } from '@inertiajs/react';

export default function Login() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="border-b">
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your details below to login to your account</CardDescription>
      </CardHeader>

      <CardPanel>
        <Form route="session.store">
          {({ processing }) => (
            <div className="flex flex-col gap-4">
              <Field name="email">
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input type="email" id="email" autoComplete="username" />
                <FieldError />
              </Field>

              <Field name="password">
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input type="password" id="password" autoComplete="current-password" />
                <FieldError />
              </Field>

              <Button className="w-full mt-4" disabled={processing} type="submit">
                Login
              </Button>
            </div>
          )}
        </Form>
      </CardPanel>
    </Card>
  )
}

Login.layout = (page: React.ReactElement) => <MinimalLayout><><Head title='Login' />{page}</></MinimalLayout>
