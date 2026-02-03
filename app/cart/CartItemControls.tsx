'use client'

import { useState, useTransition } from 'react'
import { updateCartQuantity } from '@/app/actions/cart'

type Props = {
  cartId: string | null
  itemKey: string
  quantity: number
}

export default function CartItemControls({ cartId, itemKey, quantity }: Props) {
  const [pending, startTransition] = useTransition()
  const [localQty, setLocalQty] = useState(quantity)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = localQty + delta
    if (newQuantity < 1) return
    if (!cartId) return

    setLocalQty(newQuantity)

    startTransition(async () => {
      await updateCartQuantity(cartId, itemKey, newQuantity)
    })
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <button
        onClick={() => handleQuantityChange(-1)}
        disabled={pending || localQty <= 1}
        style={pillBtn}
        aria-label="Zmanjšaj količino"
        title="Zmanjšaj"
      >
        −
      </button>

      <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>
        {localQty}
      </span>

      <button
        onClick={() => handleQuantityChange(1)}
        disabled={pending}
        style={pillBtn}
        aria-label="Povečaj količino"
        title="Povečaj"
      >
        +
      </button>
    </div>
  )
}

const pillBtn: React.CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 12,
  border: '1px solid #e8eaee',
  background: '#fff',
  fontWeight: 900,
  display: 'grid',
  placeItems: 'center',
  cursor: 'pointer',
  userSelect: 'none',
}
