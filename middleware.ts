import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Refrescar el token si está expirado
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const url = request.nextUrl.clone()

  // Proteger las rutas bajo /(admin)/admin
  if (url.pathname.startsWith('/admin') && !user) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Si es una ruta de admin (y no es el setup), verificar que tenga su negocio configurado
  if (user && url.pathname.startsWith('/admin') && url.pathname !== '/admin/setup') {
    const { data: publicUser } = await supabase
      .from('users')
      .select('business_id')
      .eq('auth_user_id', user.id)
      .single()

    if (!publicUser?.business_id) {
      url.pathname = '/admin/setup'
      return NextResponse.redirect(url)
    }
  }

  // Redirigir de /login a /admin si ya tiene sesión
  if (url.pathname === '/login' && user) {
    url.pathname = '/admin/dashboard'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
