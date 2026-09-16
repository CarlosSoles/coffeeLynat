'use client'

import React, { useActionState } from 'react'
import { login } from './actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Coffee } from 'lucide-react'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => await login(formData),
    null
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg">
            <Coffee className="h-8 w-8 text-white" />
          </div>
        </div>
        
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Acceso a Empleados</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="email">Correo Electrónico</label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  required 
                  placeholder="admin@cafeteria.com"
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700" htmlFor="password">Contraseña</label>
                <Input 
                  id="password" 
                  name="password" 
                  type="password" 
                  required 
                  placeholder="••••••••"
                />
              </div>

              {state?.error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-100">
                  {state.error}
                </div>
              )}

              <Button type="submit" className="w-full h-11 text-base mt-2" disabled={isPending}>
                {isPending ? 'Iniciando sesión...' : 'Ingresar al sistema'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
