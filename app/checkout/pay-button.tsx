// app/checkout/pay-button.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { clearCart } from '../actions/clearcart'
import { createOrder } from '@/app/actions/createOrder'

type Props = {
  items: any[]
  totalPrice: number
}

export default function CheckoutPayButton({ items, totalPrice }: Props) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handlePay = async () => {
    setLoading(true)

    // 1️⃣ Shrani naročilo
    await createOrder(items, totalPrice)

    // 2️⃣ Počisti košarico
    await clearCart()

    // 3️⃣ Redirect na success page
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
