import React from 'react'
import { Coffee } from 'lucide-react'

interface StampsCardProps {
  currentStamps: number
  requiredStamps: number
}

export function StampsCard({ currentStamps, requiredStamps }: StampsCardProps) {
  const stamps = Array.from({ length: requiredStamps }, (_, i) => i + 1)

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 gap-4">
      {stamps.map((stamp) => {
        const isEarned = stamp <= currentStamps
        return (
          <div
            key={stamp}
            className={`
              flex items-center justify-center rounded-full aspect-square transition-all
              ${
                isEarned
                  ? 'bg-blue-600 shadow-md transform scale-105'
                  : 'bg-gray-50 border-2 border-dashed border-gray-200'
              }
            `}
          >
            <Coffee
              className={`w-6 h-6 ${isEarned ? 'text-white' : 'text-gray-300'}`}
            />
          </div>
        )
      })}
    </div>
  )
}
