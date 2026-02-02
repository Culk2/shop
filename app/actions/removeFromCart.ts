// app/actions/removeFromCart.ts
'use server'

import { createClient } from '@sanity/client'
import { currentUser } from '@clerk/nextjs/server'
import { getCart } from '@/lib/cart'
import { revalidatePath } from 'next/cache'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN!,
})

export async function removeFromCart(itemKey: string) {
  const user = await currentUser()
  if (!user) return

  try {
    const cart = await getCart()
    if (!cart?._id) return

    await client
      .patch(cart._id)
      .unset([`items[_key=="${itemKey}"]`])
      .commit()

    revalidatePath('/cart')
  } catch (error) {
    console.error('Napaka pri brisanju:', error)
  }
}
