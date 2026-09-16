'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Scanner } from '@yudiel/react-qr-scanner'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QrCode, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function EscanerVisitasPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isScanning, setIsScanning] = useState(true)

  const handleScan = (text: string) => {
    if (text) {
      try {
        const url = new URL(text)
        const token = url.searchParams.get('token')
        
        if (token) {
          setIsScanning(false)
          router.push(`/admin/visitas/${token}`)
        } else {
          setError('El código QR escaneado no contiene un token válido.')
        }
      } catch (e) {
        setError('El formato del código QR escaneado no es una URL válida.')
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Escanear Tarjeta</h1>
        <p className="text-gray-500 mt-2">Usa la cámara para leer el código QR del cliente y registrar su visita.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-100 pb-4">
          <CardTitle className="flex items-center text-lg">
            <QrCode className="w-5 h-5 mr-2 text-blue-600" />
            Lector Activo
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {error && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 flex items-start rounded-lg border border-red-100">
              <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium">Error de lectura</p>
                <p className="text-sm mt-1">{error}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-3 bg-white" 
                  onClick={() => setError(null)}
                >
                  Intentar de nuevo
                </Button>
              </div>
            </div>
          )}

          <div className="relative aspect-square w-full max-w-sm mx-auto rounded-2xl overflow-hidden bg-black shadow-inner ring-4 ring-gray-100">
            {isScanning && !error ? (
              <Scanner
                onScan={(result) => handleScan(result[0]?.rawValue)}
                styles={{ container: { width: '100%', height: '100%' } }}
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-900">
                <p className="text-gray-400 font-medium">Cámara en pausa</p>
              </div>
            )}
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-4">¿No funciona la cámara? Ingresa el token manualmente.</p>
            <Button variant="outline" onClick={() => {
              const token = prompt('Ingresa el token (UUID) del cliente:')
              if (token) {
                router.push(`/admin/visitas/${token}`)
              }
            }}>
              Ingreso Manual
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
