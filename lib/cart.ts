// app/lib/cart.ts
// lib/cart.ts
import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'
import { urlFor } from '@/sanity/lib/image'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!, // mora biti write token!
})

export async function addToCart(product: any, quantity = 1) {
  const user = await currentUser()
  if (!user) return false

  const cartItem = {
    _key: product._id + '-' + Date.now(), // edinstven key
    _type: 'object',
    productId: product._id,
    slug: typeof product.slug === 'string' ? product.slug : product.slug?.current,
    name: product.name,
    price: product.price,
    quantity,
    imageUrl: product.imageUrl || '/placeholder.jpg',
    size: product.size || null,
    color: product.color || null,
  }

  // GLAVNA SPREMEMBA: uporabi createIfNotExists + upsert
  try {
    await client
      .patch(user.id)
      .setIfMissing({ items: [] })
      .append('items', [cartItem])
      .commit()
  } catch (error: any) {
    if (error.message.includes('not found') || error.statusCode === 404) {
      await client.create({
        _id: user.id,
        _type: 'cart',
        userId: user.id,
        items: [cartItem],
      })
    } else {
      console.error('Napaka pri dodajanju v košarico:', error)
      throw error
    }
  }
}

// Pridobi košarico za trenutnega uporabnika
export async function getCart() {
  const user = await currentUser()
  if (!user) return null

  const cart = await client.getDocument(user.id)
  return cart || { items: [] }
}