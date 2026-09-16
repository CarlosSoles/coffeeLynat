'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { CheckCircle, Loader2 } from 'lucide-react'

export function StampButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      size="lg" 
      disabled={pending}
      className="w-full h-14 text-lg bg-green-600 hover:bg-green-700 shadow-md transition-transform active:scale-95 disabled:opacity-70 disabled:active:scale-100 disabled:pointer-events-none"
    >
      {pending ? (
        <><Loader2 className="w-6 h-6 mr-2 animate-spin" /> Registrando...</>
      ) : (
        <><CheckCircle className="w-6 h-6 mr-2" /> Registrar Visita (Dar Sello)</>
      )}
    </Button>
  )
}
