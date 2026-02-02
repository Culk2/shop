// app/actions/cart.ts
'use server'

import { createClient } from '@sanity/client'
import { auth } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function addToCartAction(product: {
  _id: string
  name: string
  price: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
  quantity?: number
}) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  try {
    const qty = product.quantity || 1
    const _key = crypto.randomUUID?.() ?? Date.now().toString(36)

    let cart = await client.fetch(
      `*[_type == "cart" && userId == $userId][0]{ _id, items }`,
      { userId }
    )

    if (!cart) {
      cart = await client.create({
        _type: 'cart',
        userId,
        items: [],
      })
    }

    const cartId = cart._id

    const existing = cart.items?.find(
      (i: any) =>
        i.productId === product._id &&
        i.size === product.size &&
        i.color === product.color
    )

    if (existing) {
      await client
        .patch(cartId)
        .set({ [`items[_key=="${existing._key}"].quantity`]: existing.quantity + qty })
        .commit()
    } else {
      await client
        .patch(cartId)
        .setIfMissing({ items: [] })
        .append('items', [{
          _key,
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          size: product.size,
          color: product.color,
          quantity: qty,
        }])
        .commit()
    }

    revalidatePath('/cart')
    revalidatePath('/shop')

    return { success: true, cartId }
  } catch (err) {
    console.error('addToCartAction error:', err)
    return { success: false, error: 'Napaka pri dodajanju' }
  }
}

export async function updateCartQuantity(cartId: string, itemKey: string, quantity: number) {
  if (quantity < 1) quantity = 1

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  if (!cartId) return { success: false, error: 'Manjka cartId' }

  try {
    await client
      .patch(cartId)
      .set({ [`items[_key=="${itemKey}"].quantity`]: quantity })
      .commit()

    revalidatePath('/cart')

    return { success: true }
  } catch (err) {
    console.error('updateCartQuantity error:', err)
    return { success: false, error: 'Napaka pri posodobitvi' }
  }
}

export async function removeFromCartAction(cartId: string, itemKey: string) {
  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  if (!cartId) return { success: false, error: 'Manjka cartId' }
  if (!itemKey) return { success: false, error: 'Manjka itemKey' }

  try {
    await client
      .patch(cartId)
      .unset([`items[_key=="${itemKey}"]`])
      .commit()

    revalidatePath('/cart')
    revalidatePath('/shop')

    return { success: true }
  } catch (err) {
    console.error('removeFromCartAction error:', err)
    return { success: false, error: (err as Error).message || 'Napaka pri brisanju' }
  }
}
