// lib/cart.ts (ali kje koli je getCart)
'use server'

import { createClient } from '@sanity/client'
import { auth } from '@clerk/nextjs/server'
import groq from 'groq'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function getCart() {
  const { userId } = await auth()
  console.log('[getCart] User ID iz Clerk:', userId)

  if (!userId) {
    console.log('[getCart] Ni prijavljenega uporabnika → vračam prazen cart')
    return { items: [], cartId: null }
  }

  try {
    const cartDoc = await client.fetch(
      groq`*[_type == "cart" && userId == $userId][0] {
        _id,
        items[] {
          _key,
          productId,
          name,
          price,
          quantity,
          selectedSize,
          selectedColor,
          imageUrl
        }
      }`,
      { userId }
    )

    console.log('[getCart] Najden document:', cartDoc ? 'DA' : 'NE')
    if (cartDoc) {
      console.log('[getCart] Cart ID:', cartDoc._id)
      console.log('[getCart] Število itemov:', cartDoc.items?.length || 0)
      console.log('[getCart] Items vsebina:', JSON.stringify(cartDoc.items || [], null, 2))
      return { items: cartDoc.items || [], cartId: cartDoc._id }
    } else {
      console.log('[getCart] Cart document za userId', userId, 'ne obstaja')
      return { items: [], cartId: null }
    }
  } catch (err) {
    console.error('[getCart] NAPAKA pri fetchu:', err)
    return { items: [], cartId: null }
  }
}