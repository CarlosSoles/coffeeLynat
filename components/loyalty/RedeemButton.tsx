'use client'

import React from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export function RedeemButton() {
  const { pending } = useFormStatus()
  
  return (
    <Button 
      type="submit" 
      variant="outline" 
      disabled={pending}
      className="w-full border-yellow-500 text-yellow-700 hover:bg-yellow-50 transition-colors disabled:opacity-50 disabled:pointer-events-none"
    >
      {pending ? (
        <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Procesando...</>
      ) : (
        'Aprobar Canje'
      )}
    </Button>
  )
}
