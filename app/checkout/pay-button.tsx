// app/checkout/pay-button.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearCart } from '../actions/clearcart'
import { createOrder } from '@/app/actions/createOrder'

type CartItem = {
  _key: string
  name: string
  price: number
  quantity: number
}

type Props = {
  items: CartItem[]
  totalPrice: number
}

export default function CheckoutPayButton({ items, totalPrice }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePay = async () => {
    setLoading(true)

    await createOrder(items, totalPrice)
    await clearCart()
    router.push('/checkout/success')
  }

  return (
    <button
      onClick={handlePay}
      disabled={loading}
      className={`w-full mt-8 py-4 rounded-xl text-lg font-bold text-white transition
        ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}
      `}
    >
      {loading ? 'Obdelava...' : 'Plačaj'}
    </button>
  )
}
