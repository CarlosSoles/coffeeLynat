import React from 'react'
import { getCustomerByToken } from '@/services/customers/customer.service'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StampsCard } from '@/components/loyalty/StampsCard'
import { StampButton } from '@/components/loyalty/StampButton'
import { RedeemButton } from '@/components/loyalty/RedeemButton'
import { User, Gift } from 'lucide-react'
import { addStampToCustomer, redeemReward } from '../actions'

export default async function CustomerOperationalPage(props: { params: Promise<{ token: string }> }) {
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

  // Server action binded to the customer ID
  const handleAddStamp = async () => {
    'use server'
    await addStampToCustomer(customer.id)
  }

  // Server action form handler
  const handleRedeem = async (formData: FormData) => {
    'use server'
    const rewardId = formData.get('rewardId') as string
    if (rewardId) {
      await redeemReward(rewardId)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Operación: {customer.name}</h1>
          <p className="text-gray-500 mt-2">Ficha del cliente escaneado</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Info & Stamp Button */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3 border-b border-gray-100 bg-gray-50">
              <CardTitle className="text-lg flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Progreso Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <StampsCard currentStamps={currentStamps} requiredStamps={requiredStamps} />
              
              <div className="mt-8">
                <form action={handleAddStamp}>
                  <StampButton />
                </form>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Rewards */}
        <div className="space-y-6">
          <Card className="h-full">
            <CardHeader className="pb-3 border-b border-gray-100 bg-yellow-50">
              <CardTitle className="text-lg flex items-center text-yellow-800">
                <Gift className="w-5 h-5 mr-2" />
                Recompensas
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 bg-gray-50/50 min-h-[300px]">
              {earnedRewards.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-400 py-10">
                  <Gift className="w-12 h-12 mb-3 opacity-20" />
                  <p className="text-sm px-4">No hay recompensas disponibles para canjear en este momento.</p>
                </div>
              ) : (
                <div className="space-y-3 mt-2">
                  {earnedRewards.map((reward: any) => (
                    <div key={reward.id} className="bg-white border border-yellow-200 rounded-xl p-4 shadow-sm">
                      <h4 className="font-bold text-gray-900 mb-1">{reward.rewards.name}</h4>
                      <p className="text-xs text-gray-500 mb-3">{reward.rewards.description || 'Premio de fidelidad'}</p>
                      
                      <form action={handleRedeem}>
                        <input type="hidden" name="rewardId" value={reward.id} />
                        <RedeemButton />
                      </form>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
