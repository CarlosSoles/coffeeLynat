'use client'

import React, { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { setupBusiness } from './actions'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className="w-full bg-blue-600 hover:bg-blue-700 mt-6">
      {pending ? 'Creando...' : 'Crear Cafetería y Continuar'}
    </Button>
  )
}

const initialState = { error: '' }

export function SetupForm() {
  const [state, formAction] = useActionState(setupBusiness, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm font-medium">
          {state.error}
        </div>
      )}
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre de la Cafetería
        </label>
        <Input
          id="name"
          name="name"
          placeholder="Ej. Café Lynat"
          required
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-gray-700">
          Descripción (Opcional)
        </label>
        <Input
          id="description"
          name="description"
          placeholder="Ej. El mejor café de la ciudad"
          className="w-full"
        />
      </div>

      <SubmitButton />
    </form>
  )
}
