import React from 'react'
import Link from 'next/link'
import { Coffee, QrCode, Users, Gift, LayoutDashboard, Settings, LogOut } from 'lucide-react'
import { logout } from '@/app/login/actions'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let isSetupComplete = false
  if (user) {
    const { data: publicUser } = await supabase
      .from('users')
      .select('business_id')
      .eq('auth_user_id', user.id)
      .single()
      
    if (publicUser?.business_id) {
      isSetupComplete = true
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      {isSetupComplete && (
        <aside className="w-full md:w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
          <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Coffee className="text-white h-5 w-5" />
            </div>
            <span className="font-bold text-lg text-gray-900 tracking-tight">AdminPanel</span>
          </div>
          
          <nav className="p-4 space-y-1 flex-1">
            <Link href="/admin/dashboard" className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium rounded-lg transition-colors">
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link href="/admin/visitas" className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium rounded-lg transition-colors">
              <QrCode className="h-5 w-5" />
              <span>Escanear QR</span>
            </Link>
            <Link href="/admin/clientes" className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium rounded-lg transition-colors">
              <Users className="h-5 w-5" />
              <span>Clientes</span>
            </Link>
            <Link href="/admin/promociones" className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium rounded-lg transition-colors">
              <Gift className="h-5 w-5" />
              <span>Promociones</span>
            </Link>
            <Link href="/admin/configuracion" className="flex items-center space-x-3 px-3 py-2.5 text-gray-600 hover:bg-gray-50 hover:text-blue-600 font-medium rounded-lg transition-colors">
              <Settings className="h-5 w-5" />
              <span>Configuración</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-gray-100">
            <form action={logout}>
               <button type="submit" className="flex w-full items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors">
                 <LogOut className="h-5 w-5" />
                 <span>Cerrar Sesión</span>
               </button>
            </form>
          </div>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
