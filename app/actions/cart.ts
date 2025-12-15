'use server'

import { addToCart, getCart } from '@/lib/cart'
import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'
import { revalidatePath } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

// Dodaj ali posodobi izdelek v košarici
export async function addToCartAction(product: {
  _id: string
  name: string
  price: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
  quantity?: number
}) {
  if (!product) return

  const cart = await getCart() || { items: [] } // vedno zagotovimo items
  const items = cart.items || [] // dodatna varnost
  const qtyToAdd = product.quantity || 1

  // Poišči obstoječi izdelek (enak _id, size, color)
  const existingItem = items.find(
    (item: any) =>
      item.productId === product._id &&
      item.size === product.size &&
      item.color === product.color
  )

  if (existingItem) {
    // Povečaj količino obstoječega izdelka
    await addToCart({
      ...existingItem,
      quantity: existingItem.quantity + qtyToAdd
    })
  } else {
    // Dodaj nov izdelek
    await addToCart({
      ...product,
      quantity: qtyToAdd
    })
  }

  // Osveži poti
  revalidatePath('/cart')
  revalidatePath('/shop')
}

// Posodobi količino izdelka v košarici
export async function updateCartQuantity(itemKey: string, quantity: number) {
  if (quantity < 1) quantity = 1 // minimalna količina je 1

  const user = await currentUser()
  if (!user) return

  await client
    .patch(user.id)
    .set({ [`items[_key=="${itemKey}"].quantity`]: quantity })
    .commit()

  revalidatePath('/cart')
}
