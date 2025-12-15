'use client'

import { useState, useTransition } from 'react'
import { updateCartQuantity } from '@/app/actions/cart'

export default function CartItemControls({ itemKey, initialQuantity }: { itemKey: string; initialQuantity: number }) {
  const [quantity, setQuantity] = useState(initialQuantity)
  const [isPending, startTransition] = useTransition()

  const changeQuantity = (delta: number) => {
    const newQty = quantity + delta
    if (newQty < 1) return
    setQuantity(newQty)
    startTransition(async () => {
      await updateCartQuantity(itemKey, newQty)
    })
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => changeQuantity(-1)}
        disabled={isPending}
        className="p-2 bg-gray-200 rounded text-black font-bold"
      >
        -
      </button>
      <span className="text-black font-medium">{quantity}</span>
      <button
        onClick={() => changeQuantity(1)}
        disabled={isPending}
        className="p-2 bg-gray-200 rounded text-black font-bold"
      >
        +
      </button>
    </div>
  )
}
