'use server'

import { addToCart } from '@/lib/cart'
import { revalidatePath } from 'next/cache'

// Sprejme navaden objekt, ne FormData
export async function addToCartAction(product: {
  _id: string
  name: string
  price: number
  imageUrl?: string | null
  size?: string | null
  color?: string | null
}) {
  if (!product) return

  await addToCart(product)

  // Osveži poti, kjer se prikazuje košarica
  revalidatePath('/cart')
  revalidatePath('/shop')
}
