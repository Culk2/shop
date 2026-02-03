// app/actions/createOrder.ts
'use server'

import { dataClient } from '@/lib/dataClient'
import { getCurrentUser } from '@/lib/auth'

type CartItem = {
  _key: string
  name: string
  price: number
  quantity: number
}

export async function createOrder(items: CartItem[], total: number) {
  const user = await getCurrentUser()
  if (!user) return

  await dataClient.create({
    _type: 'order',
    userId: user.id,
    items,
    total,
    createdAt: new Date().toISOString(),
    status: 'paid',
  })
}
