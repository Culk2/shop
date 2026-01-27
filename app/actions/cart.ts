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
  console.log('[addToCartAction] Klicana z:', JSON.stringify(product, null, 2))

  const { userId } = await auth()
  if (!userId) {
    console.log('[addToCartAction] Ni prijavljenega uporabnika')
    return { success: false, error: 'Nisi prijavljen' }
  }

  try {
    const qty = product.quantity || 1
    const _key = crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36)

    // 1. Poišči obstoječi cart document po userId polju
    const existingCart = await client.fetch(
      `*[_type == "cart" && userId == $userId][0] {
        _id,
        items
      }`,
      { userId }
    )

    let cartId: string

    if (existingCart) {
      console.log('[addToCartAction] Obstojeci cart najden, ID:', existingCart._id)
      cartId = existingCart._id
    } else {
      console.log('[addToCartAction] Cart ne obstaja → ustvarjam novega za user:', userId)
      const newCart = await client.create({
        _type: 'cart',
        userId: userId,
        items: [],
      })
      cartId = newCart._id
      console.log('[addToCartAction] Nov cart ustvarjen, ID:', cartId)
    }

    // 2. Preveri, če item že obstaja v tem cartu
    const existingItem = await client.fetch(
      `*[_id == $cartId][0].items[productId == $productId && selectedSize == $size && selectedColor == $color][0]`,
      {
        cartId,
        productId: product._id,
        size: product.size,
        color: product.color,
      }
    )

    if (existingItem) {
      console.log('[addToCartAction] Posodabljam obstoječi item, nova količina:', existingItem.quantity + qty)
      await client
        .patch(cartId)
        .set({ [`items[_key=="${existingItem._key}"].quantity`]: existingItem.quantity + qty })
        .commit()
    } else {
      console.log('[addToCartAction] Dodajam nov item v cart')
      await client
        .patch(cartId)
        .setIfMissing({ items: [] })
        .append('items', [{
          _key,
          productId: product._id,
          name: product.name,
          price: product.price,
          imageUrl: product.imageUrl,
          selectedSize: product.size,
          selectedColor: product.color,
          quantity: qty,
          // če imaš slug v produktu, ga lahko dodaš: slug: product.slug
        }])
        .commit()
    }

    console.log('[addToCartAction] Uspešno dodano/posodobljeno')

    revalidatePath('/cart')
    revalidatePath('/shop')

    return { success: true }
  } catch (err) {
    console.error('[addToCartAction] NAPAKA:', err)
    return { success: false, error: (err as Error)?.message || 'Napaka pri dodajanju v košarico' }
  }
}

// Če uporabljaš updateCartQuantity v CartItemControls.tsx – tukaj je popravljena verzija
export async function updateCartQuantity(cartId: string, itemKey: string, quantity: number) {
  console.log('[updateCartQuantity] Klicana za cartId:', cartId, 'itemKey:', itemKey, 'nova količina:', quantity)

  const { userId } = await auth()
  if (!userId) return { success: false, error: 'Nisi prijavljen' }

  if (quantity < 1) quantity = 1

  try {
    await client
      .patch(cartId)
      .set({ [`items[_key=="${itemKey}"].quantity`]: quantity })
      .commit()

    console.log('[updateCartQuantity] Količina posodobljena')

    revalidatePath('/cart')

    return { success: true }
  } catch (err) {
    console.error('[updateCartQuantity] NAPAKA:', err)
    return { success: false, error: 'Napaka pri posodobitvi količine' }
  }
}