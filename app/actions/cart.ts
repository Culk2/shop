// app/actions/cart.ts
'use server'

import { dataClient } from '@/lib/dataClient'
import { getUserId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

type CartItem = {
  _key: string
  productId: string
  name: string
  price: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
  quantity: number
}

type CartDoc = {
  _id: string
  items?: CartItem[]
}

export async function addToCartAction(product: {
  _id: string
  name: string
  price: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
  quantity?: number
}) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  try {
    const qty = product.quantity || 1
    const _key = crypto.randomUUID?.() ?? Date.now().toString(36)

    let cart = (await dataClient.fetch(
      `*[_type == "cart" && userId == $userId][0]{ _id, items }`,
      { userId }
    )) as CartDoc | null

    if (!cart) {
      cart = (await dataClient.create({
        _type: 'cart',
        userId,
        items: [],
      })) as CartDoc
    }

    const cartId = cart._id

    const existing = cart.items?.find(
      (i) =>
        i.productId === product._id &&
        i.size === product.size &&
        i.color === product.color
    )

    if (existing) {
      await dataClient
        .patch(cartId)
        .set({ [`items[_key=="${existing._key}"].quantity`]: existing.quantity + qty })
        .commit({ returnDocuments: false })
    } else {
      await dataClient
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
        .commit({ returnDocuments: false })
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

  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  if (!cartId) return { success: false, error: 'Manjka cartId' }

  try {
    await dataClient
      .patch(cartId)
      .set({ [`items[_key=="${itemKey}"].quantity`]: quantity })
      .commit({ returnDocuments: false })

    revalidatePath('/cart')

    return { success: true }
  } catch (err) {
    console.error('updateCartQuantity error:', err)
    return { success: false, error: 'Napaka pri posodobitvi' }
  }
}

export async function removeFromCartAction(cartId: string, itemKey: string) {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  if (!cartId) return { success: false, error: 'Manjka cartId' }
  if (!itemKey) return { success: false, error: 'Manjka itemKey' }

  try {
    await dataClient
      .patch(cartId)
      .unset([`items[_key=="${itemKey}"]`])
      .commit({ returnDocuments: false })

    revalidatePath('/cart')
    revalidatePath('/shop')

    return { success: true }
  } catch (err) {
    console.error('removeFromCartAction error:', err)
    return { success: false, error: (err as Error).message || 'Napaka pri brisanju' }
  }
}
