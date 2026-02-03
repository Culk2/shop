// app/actions/clearCart.ts
'use server'

import { dataClient } from '@/lib/dataClient'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function clearCart() {
  const user = await getCurrentUser()
  if (!user) return

  try {
    const cart = await dataClient.fetch(
      `*[_type == "cart" && userId == $userId][0] { _id }`,
      { userId: user.id }
    )
    if (!cart?._id) return

    await dataClient
      .patch(cart._id)
      .set({ items: [] })
      .commit({ returnDocuments: false })

    revalidatePath('/cart')
    revalidatePath('/checkout')
  } catch (error) {
    console.error('Napaka pri brisanju kosarice:', error)
  }
}


