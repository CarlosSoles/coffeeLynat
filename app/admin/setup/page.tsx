import React from 'react'
import { Coffee } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { SetupForm } from './SetupForm'

export default async function SetupPage() {
  const supabase = await createClient()
  
  // Si ya tiene un negocio configurado en public.users, no debería estar aquí
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: publicUser } = await supabase
    .from('users')
    .select('business_id')
    .eq('auth_user_id', user.id)
    .single()

  if (publicUser?.business_id) {
    redirect('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-2 pb-6">
          <div className="mx-auto bg-blue-600 p-3 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
            <Coffee className="text-white h-6 w-6" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Bienvenido a AdminPanel</CardTitle>
          <CardDescription>
            Para comenzar, necesitamos configurar los datos de tu cafetería. Solo podrás hacerlo una vez.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SetupForm />
        </CardContent>
      </Card>
    </div>
  )
}
