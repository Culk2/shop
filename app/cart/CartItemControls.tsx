'use client'

import { useState, useTransition } from 'react'
import { updateCartQuantity, removeFromCartAction } from '@/app/actions/cart'

type Props = {
  cartId: string | null
  itemKey: string
  quantity: number
}

type PendingAction = null | 'inc' | 'dec' | 'remove'

export default function CartItemControls({ cartId, itemKey, quantity }: Props) {
  const [pending, startTransition] = useTransition()
  const [pendingAction, setPendingAction] = useState<PendingAction>(null)

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity < 1) return
    if (!cartId) return

    setPendingAction(delta > 0 ? 'inc' : 'dec')

    startTransition(async () => {
      try {
        const result = await updateCartQuantity(cartId, itemKey, newQuantity)
        if (!result.success) {
          console.error('Napaka pri posodobitvi količine:', result.error)
        }
      } finally {
        setPendingAction(null)
      }
    })
  }

  const handleRemove = () => {
    if (!cartId) {
      console.error('Brisanje ni mogoče – cartId je null ali undefined!')
      alert('Napaka: košarica ni pravilno naložena. Poskusi osvežiti stran (F5).')
      return
    }

    setPendingAction('remove')

    startTransition(async () => {
      try {
        const result = await removeFromCartAction(cartId, itemKey)
        if (!result.success) {
          console.error('Brisanje ni uspelo:', result.error)
          alert('Napaka pri brisanju: ' + (result.error || 'Neznana napaka'))
        }
      } finally {
        setPendingAction(null)
      }
    })
  }

  const disabledAll = pending // globalno zaklene med requestom

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
      <button
        onClick={() => handleQuantityChange(-1)}
        disabled={disabledAll || quantity <= 1}
        style={pillBtn}
        aria-label="Zmanjšaj količino"
        title="Zmanjšaj"
      >
        {pendingAction === 'dec' ? '…' : '−'}
      </button>

      <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700 }}>
        {quantity}
      </span>

      <button
        onClick={() => handleQuantityChange(1)}
        disabled={disabledAll}
        style={pillBtn}
        aria-label="Povečaj količino"
        title="Povečaj"
      >
        {pendingAction === 'inc' ? '…' : '+'}
      </button>

      <button
        onClick={handleRemove}
        disabled={disabledAll}
        title={pendingAction === 'remove' ? 'Brišem…' : 'Odstrani iz košarice'}
        style={{
          ...iconBtn,
          color: pendingAction === 'remove' ? '#9ca3af' : '#ef4444',
          cursor: disabledAll ? 'not-allowed' : 'pointer',
        }}
        aria-label="Odstrani iz košarice"
      >
        {pendingAction === 'remove' ? 'Brišem…' : '🗑️'}
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

const iconBtn: React.CSSProperties = {
  marginLeft: 8,
  border: '1px solid #e8eaee',
  background: '#fff',
  borderRadius: 12,
  height: 34,
  padding: '0 10px',
  fontSize: '1rem',
  fontWeight: 700,
  display: 'grid',
  placeItems: 'center',
}
