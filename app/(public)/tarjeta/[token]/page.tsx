import React from 'react'
import { getCustomerByToken } from '@/services/customers/customer.service'
import { notFound } from 'next/navigation'
import { QRCodeDisplay } from '@/components/qr/QRCodeDisplay'
import { StampsCard } from '@/components/loyalty/StampsCard'
import { Card, CardContent } from '@/components/ui/card'
import { Gift, Sparkles, MapPin } from 'lucide-react'

export default async function LoyaltyCardPage(props: { params: Promise<{ token: string }> }) {
  const params = await props.params;
  const token = params.token;
  
  if (!token) {
    notFound()
  }

  const data = await getCustomerByToken(token)

  if (!data) {
    notFound()
  }

  const { customer, loyalty, earnedRewards } = data

  const currentStamps = loyalty?.current_stamps || 0
  const requiredStamps = loyalty?.loyalty_programs?.required_stamps || 7
  const rewardName = loyalty?.loyalty_programs?.reward_description || 'Recompensa'
  
  const qrValue = `https://cafeteria.com/admin/visitas/escanear?token=${customer.public_token}`

  return (
    <div className="flex flex-col items-center pb-8 pt-4">
      {/* Header Info */}
      <div className="w-full text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Hola, {customer.name.split(' ')[0]} 👋
        </h1>
        <p className="text-gray-500 mt-1 flex items-center justify-center text-sm">
          <MapPin className="w-4 h-4 mr-1" /> {customer.businesses.name}
        </p>
      </div>

      {/* QR Code Container */}
      <div className="mb-10 text-center flex flex-col items-center">
        <div className="p-2 bg-gradient-to-tr from-blue-100 to-blue-50 rounded-3xl shadow-sm mb-4">
          <QRCodeDisplay value={qrValue} size={220} />
        </div>
        <p className="text-sm font-medium text-gray-600 px-8">
          Muestra este código al barista para sumar tus visitas.
        </p>
      </div>

      {/* Progress Card */}
      <Card className="w-full border-0 shadow-lg bg-white rounded-3xl overflow-hidden mb-6">
        <div className="bg-blue-600 p-4 text-white flex justify-between items-center">
          <div className="font-semibold flex items-center">
            <Sparkles className="w-5 h-5 mr-2" /> 
            Tu Progreso
          </div>
          <div className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
            {currentStamps} / {requiredStamps}
          </div>
        </div>
        <CardContent className="p-6">
          <StampsCard currentStamps={currentStamps} requiredStamps={requiredStamps} />
          <div className="mt-6 text-center text-sm font-medium text-gray-600 bg-gray-50 py-3 rounded-xl border border-gray-100">
            Recompensa: <span className="text-blue-600 font-bold">{rewardName}</span>
          </div>
        </CardContent>
      </Card>

      {/* Rewards Section */}
      {earnedRewards.length > 0 && (
        <div className="w-full">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center text-lg">
            <Gift className="w-5 h-5 text-blue-600 mr-2" /> Tus Recompensas Listas
          </h3>
          <div className="space-y-3">
            {earnedRewards.map((reward: any) => (
              <div key={reward.id} className="bg-white p-4 rounded-2xl border border-yellow-200 shadow-sm flex items-center justify-between">
                <div className="font-semibold text-gray-900">{reward.rewards.name}</div>
                <div className="text-xs font-bold bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full uppercase tracking-wide">
                  Disponible
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
