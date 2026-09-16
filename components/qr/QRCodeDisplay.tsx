'use client'

import React from 'react'
import { QRCodeSVG } from 'qrcode.react'

interface QRCodeDisplayProps {
  value: string
  size?: number
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm inline-block">
      <QRCodeSVG value={value} size={size} level="H" includeMargin={false} />
    </div>
  )
}
