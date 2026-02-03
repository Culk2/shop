// app/actions/removeFromCart.ts
'use server'

import { dataClient } from '@/lib/dataClient'
import { getCurrentUser } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function removeFromCart(itemKey: string) {
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
      .unset([`items[_key=="${itemKey}"]`])
      .commit({ returnDocuments: false })

    revalidatePath('/cart')
  } catch (error) {
    console.error('Napaka pri brisanju:', error)
  }
}


