// lib/cart.ts
'use server'

import { createClient } from '@sanity/client'
import { auth } from '@clerk/nextjs/server'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function getCart() {
  const { userId } = await auth()
  console.log('[getCart] User ID iz Clerk:', userId || 'ni prijavljen')

  if (!userId) {
    console.log('[getCart] Ni prijavljenega uporabnika -> vracam prazen cart')
    return { items: [], cartId: null }
  }

  try {
    const cart = await client.fetch(
      `*[_type == "cart" && userId == $userId][0] {
        _id,
        items[] {
          _key,
          productId,
          name,
          price,
          quantity,
          size,
          color,
          imageUrl
        }
      }`,
      { userId }
    )

    console.log('[getCart] Najden cart document:', cart ? 'DA' : 'NE')
    if (cart) {
      console.log('[getCart] Cart ID:', cart._id)
      console.log('[getCart] Stevilo itemov:', cart.items?.length || 0)
    }

    return {
      items: cart?.items || [],
      cartId: cart?._id || null,
    }
  } catch (err) {
    console.error('[getCart] NAPAKA pri fetchu:', err)
    return { items: [], cartId: null }
  }
}
